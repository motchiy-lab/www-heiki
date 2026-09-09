const API = "./api.php";

async function api(action, params = {}) {
  const url = new URL(API, location.origin);
  url.searchParams.set("action", action);
  for (const [k, v] of Object.entries(params)) {
    url.searchParams.set(k, v);
  }
  const r = await fetch(url);
  return await r.json();
}


function makeCard(entry) {
  const count = entry.channelCount || 0;
  const medal = medalImage(count);

  const a = document.createElement('a');
  a.className = 'card';
  a.href = entry.videoUrl;
  a.target = '_blank';

  a.innerHTML = `
    <div class="thumb" style="background-image:url('${entry.thumbnailUrl || ''}')"></div>
    <div class="meta">

      <div class="title">
        ${escapeHtml(entry.title || '(No title)')}
      </div>

      <div class="channel ${channelClass(count)}">
        <span class="channel-info">
          ${escapeHtml(entry.channelName || entry.channelUrl)}
        </span>
        <span class="badge">
          ${count}
        </span>
        ${medal}
      </div>

    </div>
  `;
  return a;
}

function medalImage(count) {
  if (count == 7 || count == 77 || count == 777)
    return `<img src="imgs/lucky.png" class="medal-icon" width="36" height="36">`;
  if (count == 22 || count == 222)
    return `<img src="imgs/cat.png" class="medal-icon" width="36" height="36">`;
  if (count == 308)
    return `<img src="imgs/takutan.png" class="medal-icon" width="36" height="36">`;
  if (count == 128)
    return `<img src="imgs/motchiypng" class="medal-icon" width="36" height="36">`;
  if (count == 33550336)
    return `<img src="imgs/phainon.png" class="medal-icon" width="36" height="36">`;
  if (count >= 1000)
    return `<img src="imgs/blackmedal.png" class="medal-icon" width="36" height="36">`;
  if (count >= 300)
    return `<img src="imgs/goldmedal.png" class="medal-icon" width="36" height="36">`;
  if (count >= 100)
    return `<img src="imgs/silvermedal.png" class="medal-icon" width="36" height="36">`;
  if (count >= 50)
    return `<img src="imgs/bronzemedal.png" class="medal-icon" width="36" height="36">`;
  if (count >= 10)
    return `<img src="imgs/twinkle.png" class="medal-icon" width="36" height="36">`;
  if (count >= 5)
    return `<img src="imgs/leaf_3.png" class="medal-icon" width="36" height="36">`;
  if (count >= 3)
    return `<img src="imgs/leaf_2.png" class="medal-icon" width="36" height="36">`;
  if (count >= 1)
    return `<img src="imgs/leaf_1.png" class="medal-icon" width="36" height="36">`;
  return '';
}

function channelClass(count) {
  count = Number(count||0);
  if (count >= 1000) return 'ch-1000';
  if (count >= 300) return 'ch-300';
  if (count >= 100) return 'ch-100';
  if (count >= 50) return 'ch-50';
  if (count >= 10) return 'ch-10';
  return '';
}

function escapeHtml(s){ return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[c]); }

async function load() {
  const res = await api('list');
  const grid = document.getElementById('grid');
  grid.innerHTML = '';
  if (!res.ok) { grid.innerHTML = '<div style="color:#b00">読み込みエラー</div>'; return; }
  const entries = res.entries || [];
  const fragment = document.createDocumentFragment();
  entries.forEach(en => fragment.appendChild(makeCard(en)));
  grid.appendChild(fragment);
}

async function addVideo() {
  const input = document.getElementById('videoUrl');
  const url = input.value.trim();
  clearStatus();
  if (!url) return showErr('URLを入力してね');
  setStatus('送信中...', 'ok');
  try {
    let title = '';
    let author = '';
    let authorUrl = '';

    try {
      const oembedRes = await fetch(`https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`);
      if (oembedRes.ok) {
        const oembed = await oembedRes.json();
        title = oembed.title || '';
        author = oembed.author_name || '';
        authorUrl = oembed.author_url || '';
      }
    } catch (err) {
      // client-side oembed fetch error, fall back to server-side
    }

    const params = { videoUrl: url };
    if (title) params.title = title;
    if (author) params.author = author;
    if (authorUrl) params.authorUrl = authorUrl;

    const r = await api('add', params);
    if (!r.ok) {
      showErr(r.error || '追加に失敗しました');
      return;
    }
    showOk('追加しました');
    input.value = '';
    await load();
  } catch (e) {
    showErr(e.message || '通信エラー');
  }
}

function setStatus(msg, kind) {
  const s = document.getElementById('status');
  s.innerHTML = `<span class="msg ${kind === 'ok' ? 'ok' : 'err'}">${msg}</span>`;
}
function showOk(msg){ setStatus(msg, 'ok'); setTimeout(clearStatus, 4000); }
function showErr(msg){ setStatus(msg, 'err'); setTimeout(clearStatus, 6000); }
function clearStatus(){ document.getElementById('status').innerHTML = ''; }

document.getElementById('addBtn').addEventListener('click', addVideo);
document.getElementById('videoUrl').addEventListener('keydown', (e)=>{ if (e.key === 'Enter') addVideo(); });

load();

const pageUrl = encodeURIComponent(location.href);
const text = encodeURIComponent("Heiki's Board");

document.querySelector('.twitter')
  .href = `https://twitter.com/intent/tweet?url=${pageUrl}&text=${text}`;

document.querySelector('.facebook')
  .href = `https://www.facebook.com/sharer/sharer.php?u=${pageUrl}`;

document.querySelector('.line')
  .href = `https://social-plugins.line.me/lineit/share?url=${pageUrl}`;
