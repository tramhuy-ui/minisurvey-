const app = document.getElementById('app');
const load = () => { try { return JSON.parse(localStorage.getItem('ms') || '{"surveys":[]}'); } catch { return { surveys: [] }; } };
const save = d => localStorage.setItem('ms', JSON.stringify(d));
const uid = () => Math.random().toString(36).slice(2, 8);
const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const user = () => localStorage.getItem('ms_user');
const find = id => load().surveys.find(s => s.id === id);
const update = (id, fn) => { const d = load(); const s = d.surveys.find(x => x.id === id); if (s) fn(s); save(d); };
const go = h => { location.hash = h; };
const link = id => location.origin + location.pathname + '#/s/' + id;

const TPL = {
  nv: ['Khảo sát gắn kết nhân viên', [
    ['single', 'Bạn hài lòng với công việc hiện tại ở mức nào?', ['Rất hài lòng', 'Hài lòng', 'Bình thường', 'Không hài lòng']],
    ['multi', 'Điều gì giữ chân bạn ở lại công ty?', ['Lương thưởng', 'Đồng nghiệp', 'Cơ hội phát triển', 'Cân bằng công việc']],
    ['text', 'Công ty nên cải thiện điều gì?', []]]],
  kh: ['Khảo sát hài lòng khách hàng', [
    ['single', 'Bạn đánh giá dịch vụ của chúng tôi thế nào?', ['Rất tốt', 'Tốt', 'Tạm được', 'Chưa tốt']],
    ['single', 'Bạn có giới thiệu chúng tôi cho người khác không?', ['Chắc chắn', 'Có thể', 'Không']],
    ['text', 'Góp ý thêm của bạn?', []]]],
  trong: ['Khảo sát mới', [['single', 'Câu hỏi 1', ['Lựa chọn A', 'Lựa chọn B']]]]
};
function make(key, title) {
  const [t, qs] = TPL[key];
  return { id: uid(), title: title || t, status: 'draft', responses: [],
    questions: qs.map(([type, text, options]) => ({ id: uid(), type, text, options: [...options] })) };
}
function add(s) { const d = load(); d.surveys.unshift(s); save(d); go('/edit/' + s.id); }

const nav = () => `<nav><b data-a="home">MiniSurvey</b>${user() ? `<span class="m">${esc(user())}</span><button class="g" data-a="logout">Đăng xuất</button>` : `<button data-a="loginpage">Đăng nhập</button>`}</nav>`;
const steps = (n, id) => `<div class="steps">${['Thiết kế', 'Đăng khảo sát', 'Phân tích kết quả'].map((t, i) =>
  `<span class="${i === n ? 'on' : ''}">${i + 1}. ${t}</span>`).join('')}</div>`;

function landing() {
  return nav() + `<section class="hero"><h1>Hỏi đúng người, nghe đúng điều họ nói.</h1>
  <p class="m">Tạo khảo sát, gửi một đường link và xem kết quả ngay trên trình duyệt. Bản học tập mô phỏng luồng của một nền tảng khảo sát.</p>
  <button class="y" data-a="${user() ? 'home' : 'loginpage'}">Bắt đầu miễn phí</button></section>`;
}
function login() {
  return nav() + `<main class="w"><div class="card" style="max-width:420px;margin:2rem auto"><h2>Đăng nhập</h2>
  <p class="m">Bản demo: chỉ cần nhập tên, dữ liệu lưu trong trình duyệt của bạn.</p>
  <div class="row"><input type="text" id="nm" placeholder="Tên của bạn"></div><div id="e" class="err"></div>
  <button data-a="login">Vào Home</button></div></main>`;
}
function home() {
  if (!user()) return login();
  const list = load().surveys;
  return nav() + `<main class="w"><h1>Xin chào, ${esc(user())}</h1>
  <section class="card"><h2>Bắt đầu từ ý tưởng</h2><p class="m">Mô tả điều bạn muốn tìm hiểu. Đây là bản mô phỏng bằng từ khóa, chưa gọi AI thật.</p>
  <div class="row"><input type="text" id="idea" placeholder="Ví dụ: mức gắn kết của nhân viên"><button data-a="idea">Tạo bản nháp</button></div>
  <div class="row"><button class="g" data-a="tpl" data-k="nv">Dùng mẫu nhân viên</button><button class="g" data-a="tpl" data-k="kh">Dùng mẫu khách hàng</button><button class="g" data-a="tpl" data-k="trong">Tạo từ đầu</button></div></section>
  <h2>Khảo sát của tôi</h2><div class="card">${list.length ? list.map(s => `<div class="item"><div><b>${esc(s.title)}</b> <span class="tag ${s.status === 'open' ? '' : 'd'}">${s.status === 'open' ? 'Mở' : 'Nháp'}</span><div class="m">${s.responses.length} phản hồi</div></div>
  <div class="row"><button class="g" data-a="nav" data-h="/edit/${s.id}">Sửa</button><button class="g" data-a="nav" data-h="/results/${s.id}">Phân tích kết quả</button><button class="x" data-a="del" data-id="${s.id}">Xóa</button></div></div>`).join('') : '<p class="m">Chưa có khảo sát nào. Hãy tạo khảo sát đầu tiên ở phía trên.</p>'}</div></main>`;
}
function editor(id) {
  const s = find(id); if (!s) return home();
  return nav() + `<main class="w">${steps(0)}<div class="card"><input type="text" data-f="title" value="${esc(s.title)}" aria-label="Tên khảo sát" style="font-size:1.2rem;font-weight:700"></div>
  ${s.questions.map((q, i) => `<div class="card"><div class="row"><b>${i + 1}.</b>
  <select data-f="type" data-q="${q.id}"><option value="single" ${q.type === 'single' ? 'selected' : ''}>Chọn một</option><option value="multi" ${q.type === 'multi' ? 'selected' : ''}>Chọn nhiều</option><option value="text" ${q.type === 'text' ? 'selected' : ''}>Câu trả lời mở</option></select>
  <button class="x" data-a="delq" data-q="${q.id}">Xóa câu</button></div>
  <input type="text" data-f="text" data-q="${q.id}" value="${esc(q.text)}" aria-label="Nội dung câu hỏi">
  ${q.type === 'text' ? '' : `<p class="m">Mỗi dòng là một lựa chọn</p><textarea data-f="options" data-q="${q.id}">${esc(q.options.join('\n'))}</textarea>`}</div>`).join('')}
  <div class="row"><button class="g" data-a="addq">+ Thêm câu hỏi</button><button class="g" data-a="nav" data-h="/s/${s.id}?preview=1">Xem trước</button><button data-a="publish">Đăng khảo sát</button></div></main>`;
}
function collect(id) {
  const s = find(id); if (!s) return home();
  return nav() + `<main class="w">${steps(1)}<div class="card"><h2>${esc(s.title)}</h2><span class="tag">Mở</span>
  <p class="m">Gửi đường link này cho người trả lời:</p><div class="row"><input type="text" id="lk" readonly value="${esc(link(s.id))}"><button data-a="copy">Sao chép URL</button></div>
  <div class="note">Dữ liệu lưu trong trình duyệt (localStorage). Link chỉ nhận phản hồi trên cùng trình duyệt và thiết bị này. Muốn nhận từ nhiều người, xem phần nâng cấp trong README.</div></div>
  <button data-a="nav" data-h="/results/${s.id}">Phân tích kết quả</button></main>`;
}
function respond(id, preview) {
  const s = find(id);
  if (!s) return `<main class="w"><div class="card"><h2>Không tìm thấy khảo sát</h2><p class="m">Link này chỉ mở được trên trình duyệt đã tạo khảo sát.</p></div></main>`;
  return `<main class="w"><form class="card" id="f"><h1>${esc(s.title)}</h1>${preview ? '<p class="note">Chế độ xem trước: phản hồi sẽ không được lưu.</p>' : ''}
  ${s.questions.map((q, i) => `<fieldset style="border:0;padding:0;margin:1rem 0"><legend><b>${i + 1}. ${esc(q.text)}</b></legend>
  ${q.type === 'text' ? `<textarea name="${q.id}"></textarea>` : q.options.map(o => `<label class="opt"><input type="${q.type === 'single' ? 'radio' : 'checkbox'}" name="${q.id}" value="${esc(o)}"> ${esc(o)}</label>`).join('')}</fieldset>`).join('')}
  <button>Xong</button></form></main>`;
}
function results(id, tab = 'sum') {
  const s = find(id); if (!s) return home();
  const n = s.responses.length;
  const sum = s.questions.map((q, i) => {
    const vals = s.responses.map(r => r.a[q.id]).filter(v => v && v.length);
    if (q.type === 'text') return `<div class="card"><b>${i + 1}. ${esc(q.text)}</b><p class="m">${vals.length} phản hồi</p>${vals.map(v => `<div class="item">${esc(v)}</div>`).join('')}</div>`;
    return `<div class="card"><b>${i + 1}. ${esc(q.text)}</b><p class="m">${vals.length} phản hồi</p>${q.options.map(o => {
      const c = vals.filter(v => [].concat(v).includes(o)).length, p = vals.length ? Math.round(c / vals.length * 100) : 0;
      return `<div>${esc(o)}: ${p}% (${c})</div><div class="bar"><i style="width:${p}%"></i></div>`; }).join('')}</div>`;
  }).join('');
  const tbl = `<div class="card"><table><tr><th>#</th><th>Thời gian</th>${s.questions.map((q, i) => `<th>Câu ${i + 1}</th>`).join('')}</tr>${s.responses.map((r, k) => `<tr><td>${k + 1}</td><td>${new Date(r.t).toLocaleString('vi-VN')}</td>${s.questions.map(q => `<td>${esc([].concat(r.a[q.id] || '').join('; '))}</td>`).join('')}</tr>`).join('')}</table></div>`;
  return nav() + `<main class="w">${steps(2)}<h2>${esc(s.title)}</h2><p class="m">Người trả lời: ${n}</p>
  <div class="row"><button class="${tab === 'sum' ? '' : 'g'}" data-a="tab" data-t="sum">Tóm tắt câu hỏi</button><button class="${tab === 'ind' ? '' : 'g'}" data-a="tab" data-t="ind">Phản hồi cá nhân</button><button class="y" data-a="csv">Xuất CSV</button><button class="g" data-a="nav" data-h="/publish/${s.id}">Lấy link</button></div>
  ${n ? (tab === 'sum' ? sum : tbl) : '<div class="card"><p class="m">Chưa có phản hồi. Mở link khảo sát và gửi thử một bài.</p></div>'}</main>`;
}

let tab = 'sum';
function render() {
  const [, r, id] = (location.hash.slice(1).split('?')[0] || '/').split('/');
  const prev = location.hash.includes('preview=1');
  app.innerHTML = !r ? landing() : r === 'home' ? home() : r === 'login' ? login() : r === 'edit' ? (user() ? editor(id) : login()) :
    r === 'publish' ? (user() ? collect(id) : login()) : r === 'results' ? (user() ? results(id, tab) : login()) : r === 's' ? respond(id, prev) : landing();
}
addEventListener('hashchange', () => { tab = 'sum'; render(); });

app.addEventListener('input', e => {
  const t = e.target, f = t.dataset.f; if (!f) return;
  const id = location.hash.split('/')[2];
  update(id, s => {
    if (f === 'title') return s.title = t.value;
    const q = s.questions.find(x => x.id === t.dataset.q);
    if (f === 'text') q.text = t.value;
    if (f === 'options') q.options = t.value.split('\n').map(x => x.trim()).filter(Boolean);
    if (f === 'type') { q.type = t.value; if (t.value !== 'text' && !q.options.length) q.options = ['Lựa chọn A', 'Lựa chọn B']; }
  });
  if (f === 'type') render();
});
app.addEventListener('submit', e => {
  e.preventDefault();
  const id = location.hash.split('/')[2].split('?')[0];
  if (location.hash.includes('preview=1')) return go('/edit/' + id);
  const fd = new FormData(e.target), a = {};
  find(id).questions.forEach(q => { a[q.id] = q.type === 'multi' ? fd.getAll(q.id) : (fd.get(q.id) || ''); });
  update(id, s => s.responses.push({ t: Date.now(), a }));
  app.innerHTML = `<main class="w"><div class="card"><h2>Cảm ơn bạn đã trả lời</h2><p class="m">Phản hồi của bạn đã được ghi nhận.</p></div></main>`;
});
app.addEventListener('click', e => {
  const b = e.target.closest('[data-a]'); if (!b) return;
  const a = b.dataset.a, id = location.hash.split('/')[2]?.split('?')[0];
  if (a === 'home') go('/home');
  if (a === 'loginpage') go('/login');
  if (a === 'nav') go(b.dataset.h);
  if (a === 'logout') { localStorage.removeItem('ms_user'); go('/'); render(); }
  if (a === 'login') { const v = document.getElementById('nm').value.trim(); if (!v) return document.getElementById('e').textContent = 'Nhập tên để tiếp tục.'; localStorage.setItem('ms_user', v); go('/home'); render(); }
  if (a === 'tpl') add(make(b.dataset.k));
  if (a === 'idea') {
    const v = document.getElementById('idea').value.trim(), l = v.toLowerCase();
    add(make(/nhân viên|employee|công ty/.test(l) ? 'nv' : /khách|customer|dịch vụ/.test(l) ? 'kh' : 'trong', v ? 'Khảo sát: ' + v : ''));
  }
  if (a === 'del' && confirm('Xóa khảo sát này?')) { const d = load(); d.surveys = d.surveys.filter(s => s.id !== b.dataset.id); save(d); render(); }
  if (a === 'addq') { update(id, s => s.questions.push({ id: uid(), type: 'single', text: 'Câu hỏi mới', options: ['Lựa chọn A', 'Lựa chọn B'] })); render(); }
  if (a === 'delq') { update(id, s => s.questions = s.questions.filter(q => q.id !== b.dataset.q)); render(); }
  if (a === 'publish') { update(id, s => s.status = 'open'); go('/publish/' + id); }
  if (a === 'copy') { const i = document.getElementById('lk'); i.select(); navigator.clipboard?.writeText(i.value); b.textContent = 'Đã sao chép'; }
  if (a === 'tab') { tab = b.dataset.t; render(); }
  if (a === 'csv') {
    const s = find(id), q = x => '"' + String(x).replace(/"/g, '""') + '"';
    const rows = [['Thời gian', ...s.questions.map(x => x.text)].map(q).join(',')].concat(s.responses.map(r => [new Date(r.t).toISOString(), ...s.questions.map(x => [].concat(r.a[x.id] || '').join('; '))].map(q).join(',')));
    const u = URL.createObjectURL(new Blob(['\ufeff' + rows.join('\n')], { type: 'text/csv' }));
    Object.assign(document.createElement('a'), { href: u, download: s.title + '.csv' }).click();
  }
});
render();
