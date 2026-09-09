import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';

async function initDb(db: any) {
  await db.prepare(`
    CREATE TABLE IF NOT EXISTS channels (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        channel_id TEXT UNIQUE,
        channel_name TEXT,
        total_posts INTEGER DEFAULT 0,
        last_updated DATETIME
    )
  `).run();

  await db.prepare(`
    CREATE TABLE IF NOT EXISTS videos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        video_id TEXT,
        title TEXT,
        channel_name TEXT,
        channel_id TEXT,
        is_deleted INTEGER DEFAULT 0,
        created_at DATETIME
    )
  `).run();

  await db.prepare(`
    CREATE TABLE IF NOT EXISTS oembed_cache (
        video_id TEXT PRIMARY KEY,
        title TEXT,
        author TEXT,
        author_url TEXT,
        updated_at DATETIME
    )
  `).run();

  await db.prepare(`
    CREATE INDEX IF NOT EXISTS idx_videos_is_deleted_created ON videos(is_deleted, created_at DESC)
  `).run();

  await db.prepare(`
    CREATE INDEX IF NOT EXISTS idx_channels_channel_id ON channels(channel_id)
  `).run();

  await db.prepare(`
    CREATE INDEX IF NOT EXISTS idx_videos_channel_id ON videos(channel_id)
  `).run();
}

export const GET: APIRoute = async ({ request }) => {
  const url = new URL(request.url);
  const action = url.searchParams.get('action') || '';
  
  const headers = { 'Content-Type': 'application/json; charset=utf-8' };

  try {
    const db = (env as any).DB;
    if (!db) {
      return new Response(JSON.stringify({ ok: false, error: 'D1 database binding (DB) not found' }), { headers });
    }

    await initDb(db);

    if (action === 'list') {
      const { results: rows } = await db.prepare(`
        SELECT v.*, c.channel_name, c.total_posts
        FROM videos v
        JOIN channels c ON c.channel_id = v.channel_id
        WHERE v.is_deleted = 0
        ORDER BY v.created_at DESC
        LIMIT 20
      `).all();

      const entries = (rows || []).map((r: any) => ({
        videoUrl: `https://www.youtube.com/watch?v=${r.video_id}`,
        title: r.title,
        thumbnailUrl: `https://i.ytimg.com/vi/${r.video_id}/hqdefault.jpg`,
        channelName: r.channel_name,
        channelId: r.channel_id,
        channelCount: r.total_posts,
        createdAt: r.created_at
      }));

      return new Response(JSON.stringify({ ok: true, entries }), { headers });
    }

    if (action === 'add') {
      const videoUrl = url.searchParams.get('videoUrl') || '';
      if (!videoUrl) {
        return new Response(JSON.stringify({ ok: false, error: 'URLがありません' }), { headers });
      }

      if (/youtube\.com\/(channel\/|@[^/]+$)/.test(videoUrl)) {
        return new Response(JSON.stringify({ ok: false, error: 'これは動画URLではありません（チャンネルURL）' }), { headers });
      }

      const patterns = [
        /youtu\.be\/([a-zA-Z0-9_-]{11})/,
        /youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})/,
        /youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/,
        /youtube\.com\/live\/([a-zA-Z0-9_-]{11})/,
        /youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/
      ];

      let videoId: string | null = null;
      for (const p of patterns) {
        const m = videoUrl.match(p);
        if (m) {
          videoId = m[1];
          break;
        }
      }

      if (!videoId) {
        return new Response(JSON.stringify({ ok: false, error: 'YouTube動画URLではありません' }), { headers });
      }

      const cache = await db.prepare('SELECT * FROM oembed_cache WHERE video_id = ?').bind(videoId).first() as any;

      let clientTitle = url.searchParams.get('title') || '';
      let clientAuthor = url.searchParams.get('author') || '';
      let clientAuthorUrl = url.searchParams.get('authorUrl') || '';

      let title = '';
      let author = '';
      let authorUrl = '';

      const cacheUpdatedTime = cache ? new Date(cache.updated_at).getTime() : 0;
      if (cache && cacheUpdatedTime > Date.now() - 86400000 && !clientTitle) {
        title = cache.title;
        author = cache.author;
        authorUrl = cache.author_url;
      } else {
        title = clientTitle || (cache ? cache.title : '');
        author = clientAuthor || (cache ? cache.author : '');
        authorUrl = clientAuthorUrl || (cache ? cache.author_url : '');

        if (!title || !author || !authorUrl) {
          try {
            const ytUrl = `https://www.youtube.com/watch?v=${encodeURIComponent(videoId)}`;
            const res = await fetch(`https://www.youtube.com/oembed?url=${encodeURIComponent(ytUrl)}&format=json`, {
              headers: { 'User-Agent': 'Mozilla/5.0' }
            });
            if (res.ok) {
              const oembed = await res.json() as any;
              title = oembed.title || title;
              author = oembed.author_name || author;
              authorUrl = oembed.author_url || authorUrl;
            }
          } catch (e) {
            // ignore fetch error
          }
        }

        title = title || `YouTube Video ${videoId}`;
        author = author || 'Unknown Channel';
        authorUrl = authorUrl || `https://www.youtube.com/@${author.replace(/[^a-zA-Z0-9_-]/g, '')}`;

        await db.prepare(`
          INSERT OR REPLACE INTO oembed_cache (video_id, title, author, author_url, updated_at)
          VALUES (?, ?, ?, ?, datetime('now'))
        `).bind(videoId, title, author, authorUrl).run();
      }

      let channelId = '';
      const mAuthor = authorUrl.match(/@([^/]+)/);
      if (mAuthor) {
        channelId = '@' + mAuthor[1];
      } else {
        channelId = '@' + author.replace(/[^a-zA-Z0-9_-]/g, '');
      }

      try {
        const chCheck = await db.prepare('SELECT id FROM channels WHERE channel_id = ?').bind(channelId).first();
        if (!chCheck) {
          await db.prepare(`
            INSERT INTO channels (channel_id, channel_name, total_posts, last_updated)
            VALUES (?, ?, 0, datetime('now'))
          `).bind(channelId, author).run();
        } else {
          await db.prepare('UPDATE channels SET last_updated = datetime(\'now\') WHERE channel_id = ?').bind(channelId).run();
        }

        const recentCountRow = await db.prepare(`
          SELECT COUNT(*) as cnt FROM videos
          WHERE channel_id = ?
          AND created_at >= datetime('now', '-24 hours')
        `).bind(channelId).first() as any;

        if (recentCountRow && recentCountRow.cnt > 0) {
          return new Response(JSON.stringify({ ok: false, error: '同じチャンネルは24時間以内に再投稿できません' }), { headers });
        }

        const existingVideo = await db.prepare('SELECT id FROM videos WHERE video_id = ?').bind(videoId).first() as any;

        if (existingVideo) {
          await db.batch([
            db.prepare(`
              UPDATE videos
              SET created_at = datetime('now'),
                  title = ?,
                  channel_name = ?,
                  channel_id = ?
              WHERE video_id = ?
            `).bind(title, author, channelId, videoId),
            db.prepare('UPDATE channels SET total_posts = total_posts + 1 WHERE channel_id = ?').bind(channelId)
          ]);
        } else {
          await db.batch([
            db.prepare(`
              INSERT INTO videos (video_id, title, channel_name, channel_id, created_at)
              VALUES (?, ?, ?, ?, datetime('now'))
            `).bind(videoId, title, author, channelId),
            db.prepare('UPDATE channels SET total_posts = total_posts + 1 WHERE channel_id = ?').bind(channelId)
          ]);
        }

        return new Response(JSON.stringify({ ok: true, inserted: !existingVideo, updated: !!existingVideo }), { headers });
      } catch (err: any) {
        return new Response(JSON.stringify({ ok: false, error: 'DBエラー: ' + err.message }), { headers });
      }
    }

    return new Response(JSON.stringify({ ok: false, error: 'Unknown action' }), { headers });

  } catch (e: any) {
    return new Response(JSON.stringify({ ok: false, error: 'DB接続エラー: ' + e.message }), { headers });
  }
};
