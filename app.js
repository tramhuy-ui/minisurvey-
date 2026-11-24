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

const LK = 'ms_lang';
const lang = () => (localStorage.getItem(LK) === 'en' ? 'en' : 'vi');
let uc = 0;
const L = {
vi: {
  login: 'Đăng nhập', logout: 'Đăng xuất', start: 'Bắt đầu miễn phí', need: 'Nhập tên để tiếp tục.',
  loginSub: 'Bản demo: chỉ cần nhập tên, dữ liệu lưu trong trình duyệt của bạn.', namePh: 'Tên của bạn', enter: 'Vào Home',
  menu: [['uc', 'Giải pháp'], ['ins', 'Tài nguyên'], ['tst', 'Đánh giá']],
  h1: 'Hỏi đúng câu hỏi. Nghe đúng điều mọi người nghĩ.',
  sub: 'Tạo khảo sát trong vài phút, gửi bằng một đường link và xem kết quả ngay. Dành cho đội nhóm, lớp học, cửa hàng và dự án của bạn.',
  demoT: 'Chương trình gắn kết nhân viên', demoM: [['Điểm gắn kết', '47'], ['Hài lòng', '82%'], ['Thuộc về', '73%']],
  demoC: 'Gắn kết theo quý', demoTip: 'Ghi nhận tốt giúp gắn kết tăng',
  statT: 'Một công cụ khảo sát đơn giản, nhiều nhóm tin dùng',
  stats: [['10 triệu+', 'câu hỏi đã gửi'], ['500 nghìn+', 'người dùng'], ['20 nghìn+', 'lượt đánh giá']],
  ucT: 'Một nền tảng cho nhiều nhu cầu',
  ucs: [
    ['Phản hồi nhân viên', 'Hiểu đội ngũ của bạn', 'Đo mức gắn kết, hài lòng và cảm giác thuộc về để giữ chân người giỏi.', ['Khảo sát gắn kết theo quý', 'Phát hiện quá tải sớm', 'Theo dõi xu hướng theo thời gian']],
    ['Phản hồi khách hàng', 'Nghe khách nói thật', 'Biết khách hài lòng ở đâu và chưa hài lòng ở đâu sau mỗi lần mua hàng.', ['Mẫu khảo sát hài lòng', 'Hỏi mức độ giới thiệu', 'Gom góp ý bằng câu trả lời mở']],
    ['Nghiên cứu thị trường', 'Kiểm chứng ý tưởng', 'Thu thập ý kiến của nhóm đối tượng trước khi bạn đầu tư thời gian và tiền bạc.', ['Câu hỏi chọn một, chọn nhiều', 'So sánh các lựa chọn', 'Xuất CSV để phân tích sâu']],
    ['Phát triển sản phẩm', 'Làm đúng thứ người dùng cần', 'Hỏi người dùng tính năng nào quan trọng nhất và điều gì đang gây khó chịu.', ['Xếp thứ tự ưu tiên tính năng', 'Thu thập lỗi gặp phải', 'Lặp lại khảo sát sau mỗi bản cập nhật']],
    ['Quản lý sự kiện', 'Biết người tham dự nghĩ gì', 'Gửi một đường link cho người đến dự và nhận phản hồi ngay khi sự kiện kết thúc.', ['Mẫu đăng ký tham dự', 'Đánh giá sau sự kiện', 'Xem kết quả theo thời gian thực']],
    ['Biểu mẫu trực tuyến', 'Thu thập thông tin gọn gàng', 'Dùng như biểu mẫu đăng ký, bình chọn hoặc bài kiểm tra nhanh trong lớp.', ['Tạo trong vài phút', 'Chia sẻ bằng một link', 'Mỗi phản hồi được ghi lại tự động']]
  ],
  insT: 'Những bài viết giúp bạn hỏi tốt hơn',
  ins: [['Viết câu hỏi để nhận câu trả lời thật', 'Mẹo tránh câu hỏi dẫn dắt và câu hỏi quá dài.'], ['Đọc kết quả trong 5 phút', 'Cách nhìn biểu đồ và rút ra việc cần làm.'], ['Mẫu cho khảo sát đầu tiên', 'Chọn mẫu phù hợp rồi chỉnh theo ý bạn.'], ['Làm sao để nhiều người trả lời hơn', 'Độ dài, thời điểm gửi và lời mời ngắn gọn.']],
  tstT: 'Người dùng nói gì',
  tst: [['Chúng tôi thu được phản hồi của cả đội chỉ trong một buổi chiều. Biểu đồ rõ ràng nên cuộc họp sau đó rất ngắn.', 'Trưởng nhóm vận hành'], ['Học sinh trả lời nhanh hơn hẳn so với phiếu giấy, và tôi xuất bảng điểm khảo sát ngay trong giờ nghỉ.', 'Giáo viên chủ nhiệm'], ['Khách để lại góp ý nhiều hơn vì chỉ cần mở một đường link và bấm vài lần.', 'Chủ cửa hàng nhỏ']],
  trustT: 'Dữ liệu của bạn là của bạn', trust: 'Bản học tập này lưu mọi thứ ngay trong trình duyệt của bạn, không gửi đi đâu khác. Phần gợi ý câu hỏi chỉ là mô phỏng, không gọi AI thật.',
  finT: 'Sẵn sàng hỏi câu hỏi đầu tiên?', finS: 'Tạo khảo sát miễn phí, không cần thẻ.',
  foot: [['Sản phẩm', ['Tạo khảo sát', 'Mẫu có sẵn', 'Phân tích kết quả', 'Xuất CSV']], ['Mẫu phổ biến', ['Gắn kết nhân viên', 'Hài lòng khách hàng', 'Đăng ký sự kiện']], ['Tài nguyên', ['Hướng dẫn', 'Bài viết', 'Câu hỏi thường gặp']], ['Giới thiệu', ['Về dự án', 'Liên hệ', 'Quyền riêng tư']]],
  note: 'Nội dung, số liệu và đánh giá trên trang này là hư cấu, chỉ để minh họa.'
},
en: {
  login: 'Log in', logout: 'Log out', start: 'Start for free', need: 'Enter your name to continue.',
  loginSub: 'Demo only: just enter a name. Data stays in your own browser.', namePh: 'Your name', enter: 'Go to Home',
  menu: [['uc', 'Solutions'], ['ins', 'Resources'], ['tst', 'Reviews']],
  h1: 'Ask better questions. Hear what people really think.',
  sub: 'Build a survey in minutes, share it with one link and see results right away. Made for teams, classrooms, shops and side projects.',
  demoT: 'Employee engagement program', demoM: [['Engagement score', '47'], ['Satisfaction', '82%'], ['Belonging', '73%']],
  demoC: 'Engagement by quarter', demoTip: 'Better recognition lifted engagement',
  statT: 'A simple survey tool that many teams rely on',
  stats: [['10M+', 'questions sent'], ['500K+', 'users'], ['20K+', 'reviews']],
  ucT: 'One platform, many needs',
  ucs: [
    ['Employee feedback', 'Understand your team', 'Measure engagement, satisfaction and belonging so you can keep your best people.', ['Quarterly engagement surveys', 'Spot overload early', 'Track trends over time']],
    ['Customer feedback', 'Hear the honest truth', 'Learn where customers are happy and where they are not after every purchase.', ['Satisfaction templates', 'Ask how likely they are to recommend', 'Collect comments with open questions']],
    ['Market research', 'Test your ideas', 'Gather opinions from your target group before you spend time and money.', ['Single and multiple choice questions', 'Compare options side by side', 'Export CSV for deeper analysis']],
    ['Product development', 'Build what users need', 'Ask which features matter most and what is getting in the way.', ['Rank feature priorities', 'Collect problems people hit', 'Repeat the survey after each update']],
    ['Event planning', 'Know what guests think', 'Send one link to attendees and get feedback the moment the event ends.', ['Registration templates', 'Post-event ratings', 'Live results']],
    ['Online forms', 'Collect info neatly', 'Use it as a sign-up form, a poll or a quick classroom quiz.', ['Build in minutes', 'Share with one link', 'Every response is saved automatically']]
  ],
  insT: 'Reads that help you ask better',
  ins: [['Write questions that get honest answers', 'Tips to avoid leading and overly long questions.'], ['Read your results in 5 minutes', 'How to scan the charts and decide what to do next.'], ['Templates for your first survey', 'Pick a template, then make it your own.'], ['How to get more people to respond', 'Length, timing and a short invitation.']],
  tstT: 'What people say',
  tst: [['We got feedback from the whole team in one afternoon. The charts were clear, so the follow-up meeting was short.', 'Operations lead'], ['Students answer much faster than on paper, and I export the results during the break.', 'Homeroom teacher'], ['Customers leave more comments because it only takes one link and a few taps.', 'Small shop owner']],
  trustT: 'Your data is yours', trust: 'This learning project keeps everything in your own browser and sends nothing elsewhere. The idea-to-survey feature is a simulation, not a real AI call.',
  finT: 'Ready to ask your first question?', finS: 'Create a survey for free, no card needed.',
  foot: [['Product', ['Create a survey', 'Templates', 'Analyze results', 'Export CSV']], ['Popular templates', ['Employee engagement', 'Customer satisfaction', 'Event sign-up']], ['Resources', ['Guides', 'Articles', 'FAQ']], ['About', ['About the project', 'Contact', 'Privacy']]],
  note: 'Content, numbers and reviews on this page are fictional and for illustration only.'
}};

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

const nav = () => { const t = L[lang()]; return `<nav><b data-a="home">MiniSurvey</b><select id="lang" aria-label="Language"><option value="vi"${lang() === 'vi' ? ' selected' : ''}>Tiếng Việt</option><option value="en"${lang() === 'en' ? ' selected' : ''}>English</option></select>${user() ? `<span class="m">${esc(user())}</span><button class="g" data-a="logout">${t.logout}</button>` : `<button data-a="loginpage">${t.login}</button>`}</nav>`; };
const steps = (n, id) => `<div class="steps">${['Thiết kế', 'Đăng khảo sát', 'Phân tích kết quả'].map((t, i) =>
  `<span class="${i === n ? 'on' : ''}">${i + 1}. ${t}</span>`).join('')}</div>`;

function landing() {
  const t = L[lang()], u = t.ucs[uc], go1 = user() ? 'home' : 'loginpage';
  const cta = `<button class="y" data-a="${go1}">${t.start}</button>`;
  return nav() + `<header class="lh"><div class="lm">${t.menu.map(([k, n]) => `<a href="javascript:void(0)" data-a="sc" data-t="${k}">${n}</a>`).join('')}</div>
  <h1>${t.h1}</h1><p class="m">${t.sub}</p>${cta}
  <div class="demo" aria-hidden="true"><div class="dh">${t.demoT}</div>
  <div class="dm">${t.demoM.map(([n, v]) => `<div><small>${n}</small><b>${v}</b></div>`).join('')}</div>
  <div class="dc"><small>${t.demoC}</small><svg viewBox="0 0 300 90"><polyline fill="none" stroke="#0e6b4d" stroke-width="3" points="10,60 100,35 190,50 290,18"/><circle cx="290" cy="18" r="5" fill="#0e6b4d"/></svg><span class="tip">${t.demoTip}</span></div></div></header>
  <section class="ls"><h2>${t.statT}</h2><div class="st">${t.stats.map(([n, l]) => `<div><b>${n}</b><span>${l}</span></div>`).join('')}</div></section>
  <section class="ls dark" id="uc"><h2>${t.ucT}</h2><div class="tabs">${t.ucs.map((x, i) => `<button class="${i === uc ? 'y' : 'g'}" data-a="uc" data-i="${i}">${x[0]}</button>`).join('')}</div>
  <div class="ucc"><h3>${u[1]}</h3><p>${u[2]}</p><ul>${u[3].map(p => `<li>${p}</li>`).join('')}</ul></div></section>
  <section class="ls" id="ins"><h2>${t.insT}</h2><div class="g4">${t.ins.map(([h, p]) => `<div class="card"><h3>${h}</h3><p class="m">${p}</p></div>`).join('')}</div></section>
  <section class="ls" id="tst"><h2>${t.tstT}</h2><div class="g3">${t.tst.map(([q, r]) => `<figure class="card"><blockquote>“${q}”</blockquote><figcaption class="m">${r}</figcaption></figure>`).join('')}</div></section>
  <section class="ls"><div class="card"><h2>${t.trustT}</h2><p class="m">${t.trust}</p></div></section>
  <section class="ls dark fin" id="fin"><h2>${t.finT}</h2><p>${t.finS}</p>${cta}</section>
  <footer class="ft"><div class="fc">${t.foot.map(([h, ls]) => `<div><b>${h}</b>${ls.map(l => `<span>${l}</span>`).join('')}</div>`).join('')}</div><p class="m">${t.note}</p></footer>`;
}
function login() {
  const t = L[lang()];
  return nav() + `<main class="w"><div class="card" style="max-width:420px;margin:2rem auto"><h2>${t.login}</h2>
  <p class="m">${t.loginSub}</p>
  <div class="row"><input type="text" id="nm" placeholder="${t.namePh}"></div><div id="e" class="err"></div>
  <button data-a="login">${t.enter}</button></div></main>`;
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
  document.documentElement.lang = lang();
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
app.addEventListener('change', e => { if (e.target.id === 'lang') { localStorage.setItem(LK, e.target.value); render(); } });
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
  if (a === 'login') { const v = document.getElementById('nm').value.trim(); if (!v) return document.getElementById('e').textContent = L[lang()].need; localStorage.setItem('ms_user', v); go('/home'); render(); }
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
  if (a === 'uc') { const y = scrollY; uc = +b.dataset.i; render(); scrollTo(0, y); }
  if (a === 'sc') document.getElementById(b.dataset.t)?.scrollIntoView({ behavior: 'smooth' });
  if (a === 'tab') { tab = b.dataset.t; render(); }
  if (a === 'csv') {
    const s = find(id), q = x => '"' + String(x).replace(/"/g, '""') + '"';
    const rows = [['Thời gian', ...s.questions.map(x => x.text)].map(q).join(',')].concat(s.responses.map(r => [new Date(r.t).toISOString(), ...s.questions.map(x => [].concat(r.a[x.id] || '').join('; '))].map(q).join(',')));
    const u = URL.createObjectURL(new Blob(['\ufeff' + rows.join('\n')], { type: 'text/csv' }));
    Object.assign(document.createElement('a'), { href: u, download: s.title + '.csv' }).click();
  }
});
render();
