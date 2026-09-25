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
  let badge = 'leaf_1';
  if (count == 7)
    badge = 'lucky_green';
  else if (count == 77)
    badge = 'lucky';
  else if (count == 777)
    badge = 'lucky_red';
  else if (count == 7777)
    badge = 'lucky_galaxy';
  else if (count == 22 || count == 222)
    badge = 'cat';
  else if (count == 35)
    badge = 'coral';
  else if (count == 69)
    badge = 'marugame';
  else if (count == 76)
    badge = 'geodetail';
  else if (count == 101)
    badge = 'saikousai';
  else if (count == 128)
    badge = 'motchiy_badge';
  else if (count == 131)
    badge = 'blue_moon';
  else if (count == 308)
    badge = 'takutan';
  else if (count == 527)
    badge = 'wilburd';
  else if (count == 629)
    badge = 'bonfire';
  else if (count == 819)
    badge = 'faigeo';
  else if (count == 33550336)
    badge = 'phainon';
  
  else if (count >= 1000)
    badge = 'blackmedal';
  else if (count >= 300)
    badge = 'goldmedal';
  else if (count >= 100)
    badge = 'silvermedal';
  else if (count >= 50)
    badge = 'bronzemedal';
  else if (count >= 10)
    badge = 'twinkle';
  else if (count >= 5)
    badge = 'leaf_3';
  else if (count >= 3)
    badge = 'leaf_2';
  else if (count >= 1)
    badge = 'leaf_1';
  return '<img src="imgs/' + badge + '.png" class="medal-icon" width="48" height="48">';
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
