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
  login: 'Đăng nhập', logout: 'Đăng xuất', signup: 'Đăng ký miễn phí', start: 'Bắt đầu miễn phí', toHome: 'Vào Home', demoBtn: 'Xem demo',
  need: 'Nhập tên để tiếp tục.', loginSub: 'Bản demo: chỉ cần nhập tên, dữ liệu lưu trong trình duyệt của bạn.', namePh: 'Tên của bạn', enter: 'Vào Home',
  mProd: 'Sản phẩm', mSol: 'Giải pháp', mRes: 'Tài nguyên',
  pm: [['Tạo khảo sát', 'fin'], ['Mẫu có sẵn', 'uc'], ['Phân tích kết quả', 'hero']],
  rm: [['Bài viết mới', 'ins'], ['Câu chuyện khách hàng', 'sto'], ['Cam kết dùng AI', 'ai']],
  h1: 'Con người vẫn quan trọng. Hãy lắng nghe họ.',
  sub: 'Hiểu nhu cầu luôn thay đổi của nhân viên, khách hàng, người tham dự và người mua bằng phản hồi liên tục.',
  addT: 'Thêm khảo sát', addS: 'Chọn khảo sát để thêm vào chương trình, hoặc tạo mới từ đầu.', addPh: 'Chọn hoặc tìm khảo sát...',
  addL: ['Khảo sát trải nghiệm khách hàng', 'Khảo sát mức độ giới thiệu', 'Khảo sát nhịp đập văn hóa'],
  demoT: 'Chương trình gắn kết nhân viên', demoM: [['Điểm gắn kết', '47'], ['Hài lòng', '82%'], ['Thuộc về', '73%']],
  demoC: 'Gắn kết theo quý', demoTip: 'Ghi nhận tốt giúp gắn kết tăng', rep: 'Sổ tay khảo sát 2027', repB: 'Đọc báo cáo',
  statT: 'Một công cụ khảo sát đơn giản, nhiều nhóm tin dùng',
  stats: [['10 triệu+', 'câu hỏi đã gửi'], ['500 nghìn+', 'người dùng'], ['20 nghìn+', 'lượt đánh giá']],
  ucT: 'Hỗ trợ quyết định thông minh hơn cho mọi bộ phận',
  ucs: [
    ['Phản hồi nhân viên', 'Xây dựng đội ngũ hiệu suất cao', 'Thường xuyên hỏi thăm để hiểu đội nhóm cần gì, giúp họ gắn bó và làm việc tốt hơn.', ['Giữ nhân viên có động lực và gắn bó', 'Thiết kế chương trình đào tạo có giá trị', 'Xây dựng văn hóa nơi ai cũng thuộc về'], ['Gắn kết', '83%']],
    ['Phản hồi khách hàng', 'Nghe khách nói thật', 'Biết khách hài lòng ở đâu và chưa hài lòng ở đâu sau mỗi lần mua hàng.', ['Mẫu khảo sát hài lòng', 'Hỏi mức độ sẵn sàng giới thiệu', 'Gom góp ý bằng câu trả lời mở'], ['Hài lòng', '91%']],
    ['Nghiên cứu thị trường', 'Kiểm chứng ý tưởng sớm', 'Thu thập ý kiến của nhóm đối tượng trước khi bạn đầu tư thời gian và tiền bạc.', ['Câu hỏi chọn một, chọn nhiều', 'So sánh các lựa chọn cạnh nhau', 'Xuất CSV để phân tích sâu'], ['Chọn phương án A', '64%']],
    ['Phát triển sản phẩm', 'Làm đúng thứ người dùng cần', 'Hỏi người dùng tính năng nào quan trọng nhất và điều gì đang gây khó chịu.', ['Xếp thứ tự ưu tiên tính năng', 'Thu thập lỗi người dùng gặp', 'Lặp lại khảo sát sau mỗi bản cập nhật'], ['Cần tính năng mới', '72%']],
    ['Quản lý sự kiện', 'Biết người tham dự nghĩ gì', 'Gửi một đường link cho người đến dự và nhận phản hồi ngay khi sự kiện kết thúc.', ['Mẫu đăng ký tham dự', 'Đánh giá sau sự kiện', 'Xem kết quả theo thời gian thực'], ['Điểm sự kiện', '4,6/5']],
    ['Biểu mẫu trực tuyến', 'Thu thập thông tin gọn gàng', 'Dùng như biểu mẫu đăng ký, bình chọn hoặc bài kiểm tra nhanh trong lớp.', ['Tạo trong vài phút', 'Chia sẻ bằng một link', 'Mỗi phản hồi được ghi lại tự động'], ['Hoàn thành', '88%']]
  ],
  solMore: 'Xem tất cả giải pháp', solSub: 'Biến phản hồi thành hành động',
  insL: 'Mới', insT: 'Những bài viết giúp bạn hỏi tốt hơn', insB: 'Khám phá',
  ins: [['Viết câu hỏi để nhận câu trả lời thật', 'Mẹo tránh câu hỏi dẫn dắt và câu hỏi quá dài.'], ['Đọc kết quả trong 5 phút', 'Cách nhìn biểu đồ và rút ra việc cần làm.'], ['Mẫu cho khảo sát đầu tiên', 'Chọn mẫu phù hợp rồi chỉnh theo ý bạn.'], ['Làm sao để nhiều người trả lời hơn', 'Độ dài, thời điểm gửi và lời mời ngắn gọn.']],
  stoT: 'Câu chuyện khách hàng', read: 'Đọc câu chuyện',
  sto: [['Đội chăm sóc khách hàng tăng điểm giới thiệu thêm 15 điểm chỉ sau vài tháng', 'Khảo sát cho chúng tôi thấy nhận thức của khách quan trọng thế nào, và chỉ ra chính xác chỗ cần cải thiện để dịch vụ tốt hơn.', 'Quản lý phân tích khách hàng'], ['Nhóm nghiên cứu biến khảo sát thị trường thành sản phẩm thắng thế', 'Khi làm nghiên cứu ở quy mô lớn, vấn đề không chỉ là cỡ mẫu mà là kiểm soát độ phức tạp mà vẫn giữ được chất lượng. Công cụ này giúp chúng tôi làm được cả hai.', 'Quản lý sản phẩm']],
  aiT: 'Cam kết của chúng tôi về việc dùng AI có trách nhiệm',
  ai: ['AI rất giỏi giúp người ta tìm ra quy luật và làm việc nhanh hơn. Nhưng AI không thể cho biết vì sao khách hàng hay nhân viên thất vọng, hào hứng hay sẵn sàng thay đổi. Những câu trả lời đó đến từ con người.', 'Chúng tôi dùng AI để quá trình thu thập phản hồi nhanh và dễ hiểu hơn, đồng thời giữ vững sự tin cậy, quyền riêng tư và góc nhìn thực tế của con người.'],
  aiRole: 'Giám đốc sản phẩm', aiB: 'Xem trung tâm tin cậy', aiV: 'Chủ đề cần cải thiện nhiều nhất',
  rewT: 'Chia sẻ ý kiến. Nhận quà.', rewS: 'Giúp định hình sản phẩm và dịch vụ bằng cách làm khảo sát. Nhận tiền mặt hoặc quyên góp phần thưởng cho từ thiện.', rewB1: 'Bắt đầu nhận quà', rewB2: 'Hoặc tạo khảo sát miễn phí',
  foot: [['Sản phẩm', ['Tạo khảo sát', 'Mẫu có sẵn', 'Phân tích kết quả', 'Xuất CSV']], ['Mẫu phổ biến', ['Gắn kết nhân viên', 'Hài lòng khách hàng', 'Đăng ký sự kiện']], ['Tài nguyên', ['Hướng dẫn', 'Bài viết', 'Câu hỏi thường gặp']], ['Giới thiệu', ['Về dự án', 'Liên hệ', 'Quyền riêng tư']]],
  note: 'Nội dung, số liệu, đánh giá và nhân vật trên trang này là hư cấu, chỉ để minh họa.'
},
en: {
  login: 'Log in', logout: 'Log out', signup: 'Sign up free', start: 'Get started free', toHome: 'Go to Home', demoBtn: 'Watch the demo',
  need: 'Enter your name to continue.', loginSub: 'Demo only: just enter a name. Data stays in your own browser.', namePh: 'Your name', enter: 'Go to Home',
  mProd: 'Products', mSol: 'Solutions', mRes: 'Resources',
  pm: [['Create a survey', 'fin'], ['Templates', 'uc'], ['Analyze results', 'hero']],
  rm: [['Latest reads', 'ins'], ['Customer stories', 'sto'], ['Our approach to AI', 'ai']],
  h1: 'Humans still matter. Listen to them.',
  sub: 'Understand the changing needs of your employees, customers, attendees and buyers with continuous feedback.',
  addT: 'Add surveys', addS: 'Select surveys to add to this program, or create a new one from scratch.', addPh: 'Select or search for surveys...',
  addL: ['Customer experience survey', 'Likelihood-to-recommend survey', 'Culture pulse survey'],
  demoT: 'Employee engagement program', demoM: [['Engagement score', '47'], ['Satisfaction', '82%'], ['Belonging', '73%']],
  demoC: 'Engagement by quarter', demoTip: 'Better recognition lifted engagement', rep: 'The 2027 survey handbook', repB: 'Read the report',
  statT: 'A simple survey tool that many teams rely on',
  stats: [['10M+', 'questions sent'], ['500K+', 'users'], ['20K+', 'reviews']],
  ucT: 'Powering smarter decisions across your business',
  ucs: [
    ['Employee feedback', 'Build a high performing team', 'Check in regularly to understand what your team needs to stay engaged, perform at their best and stick around longer.', ['Keep employees motivated and engaged', 'Create learning programs people value', 'Foster a culture where everyone belongs'], ['Engagement', '83%']],
    ['Customer feedback', 'Hear the honest truth', 'Learn where customers are happy and where they are not after every purchase.', ['Satisfaction templates', 'Ask how likely they are to recommend', 'Collect comments with open questions'], ['Satisfaction', '91%']],
    ['Market research', 'Test your ideas early', 'Gather opinions from your target group before you spend time and money.', ['Single and multiple choice questions', 'Compare options side by side', 'Export CSV for deeper analysis'], ['Chose option A', '64%']],
    ['Product development', 'Build what users need', 'Ask which features matter most and what is getting in the way.', ['Rank feature priorities', 'Collect problems people hit', 'Repeat the survey after each update'], ['Want new feature', '72%']],
    ['Event management', 'Know what guests think', 'Send one link to attendees and get feedback the moment the event ends.', ['Registration templates', 'Post-event ratings', 'Live results'], ['Event score', '4.6/5']],
    ['Online forms', 'Collect info neatly', 'Use it as a sign-up form, a poll or a quick classroom quiz.', ['Build in minutes', 'Share with one link', 'Every response is saved automatically'], ['Completed', '88%']]
  ],
  solMore: 'See all solutions', solSub: 'Turn feedback into action',
  insL: 'What’s new', insT: 'Insights to fuel your curiosity', insB: 'Explore',
  ins: [['Write questions that get honest answers', 'Tips to avoid leading and overly long questions.'], ['Read your results in 5 minutes', 'How to scan the charts and decide what to do next.'], ['Templates for your first survey', 'Pick a template, then make it your own.'], ['How to get more people to respond', 'Length, timing and a short invitation.']],
  stoT: 'Customer stories', read: 'Read the story',
  sto: [['A support team raised its recommend score by 15 points within months', 'The survey showed us how much customer perception matters, and pinpointed exactly where we could improve our service.', 'Customer analytics manager'], ['A research team turned market research into a winning product', 'At this scale, it is not only about sample size. It is about managing complexity without sacrificing quality. This tool let us do both.', 'Product manager']],
  aiT: 'Our commitment to using AI responsibly',
  ai: ['AI is great at helping people find patterns and move faster. But it cannot tell you why customers or employees are frustrated, excited or ready for change. Those answers come from people.', 'We use AI to make collecting feedback faster and easier to understand, while keeping trust, privacy and real human perspectives at the center.'],
  aiRole: 'Chief product officer', aiB: 'Visit our trust center', aiV: 'Top improvement themes',
  rewT: 'Share your opinion. Earn rewards.', rewS: 'Help shape products and services by taking surveys. Earn cash or donate your rewards to charity.', rewB1: 'Start earning rewards', rewB2: 'Or, create a survey for free',
  foot: [['Product', ['Create a survey', 'Templates', 'Analyze results', 'Export CSV']], ['Popular templates', ['Employee engagement', 'Customer satisfaction', 'Event sign-up']], ['Resources', ['Guides', 'Articles', 'FAQ']], ['About', ['About the project', 'Contact', 'Privacy']]],
  note: 'Content, numbers, reviews and people on this page are fictional and for illustration only.'
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

const globe = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18"/></svg>';
const langSel = () => `<label class="gl">${globe}<select id="lang" aria-label="Language"><option value="vi"${lang() === 'vi' ? ' selected' : ''}>Tiếng Việt</option><option value="en"${lang() === 'en' ? ' selected' : ''}>English</option></select></label>`;
const nav = () => { const t = L[lang()]; return `<nav><b class="logo" data-a="home"><i></i>MiniSurvey</b>${langSel()}${user() ? `<span class="m">${esc(user())}</span><button class="g" data-a="logout">${t.logout}</button>` : `<button data-a="loginpage">${t.login}</button>`}</nav>`; };
const steps = (n, id) => `<div class="steps">${['Thiết kế', 'Đăng khảo sát', 'Phân tích kết quả'].map((t, i) =>
  `<span class="${i === n ? 'on' : ''}">${i + 1}. ${t}</span>`).join('')}</div>`;

function landing() {
  const t = L[lang()], u = t.ucs[uc], btn = (k, c = '') => `<button class="${c}" data-a="begin">${k}</button>`;
  const dd = (l, items) => `<div class="dd"><span tabindex="0">${l} ▾</span><div class="dm2">${items}</div></div>`;
  const top = `<header class="top"><div class="tw"><b class="logo" data-a="home"><i></i>MiniSurvey</b><div class="mn">
  ${dd(t.mProd, t.pm.map(([n, g]) => `<button data-a="sc" data-t="${g}">${n}</button>`).join(''))}
  ${dd(t.mSol, t.ucs.map((x, i) => `<button data-a="ucgo" data-i="${i}">${x[0]}</button>`).join(''))}
  ${dd(t.mRes, t.rm.map(([n, g]) => `<button data-a="sc" data-t="${g}">${n}</button>`).join(''))}</div>
  <div class="tr">${langSel()}${user() ? `<button class="g" data-a="logout">${t.logout}</button>${btn(t.toHome)}` : `<a class="lk" href="javascript:void(0)" data-a="loginpage">${t.login}</a>${btn(t.signup)}`}</div></div></header>`;
  const chart = `<svg viewBox="0 0 300 90"><polyline fill="none" stroke="#005BAA" stroke-width="3" points="10,62 100,36 190,50 290,18"/><circle cx="290" cy="18" r="5" fill="#F36F21"/></svg>`;
  return top + `<section class="hero2" id="hero"><div class="hw"><div class="ht"><h1>${t.h1}</h1><p>${t.sub}</p><div class="row">${btn(t.start)}<button class="g" data-a="sc" data-t="demo">${t.demoBtn}</button></div></div>
  <div class="demo" id="demo" aria-hidden="true"><div class="dh"><span class="dot"></span><b>${t.demoT}</b></div>
  <div class="dbody"><div class="pane p1"><b>${t.addT}</b><p>${t.addS}</p><div class="sel">${t.addPh}</div>${t.addL.map(x => `<div class="ck"><i></i>${x}</div>`).join('')}</div>
  <div class="pane p2"><div class="dm">${t.demoM.map(([n, v]) => `<div><small>${n}</small><b>${v}</b></div>`).join('')}</div><div class="dc"><small>${t.demoC}</small>${chart}<span class="tip">${t.demoTip}</span></div></div></div></div></div>
  <div class="rep"><span class="ri"></span><div><b>${t.rep}</b><a href="javascript:void(0)">${t.repB} →</a></div></div></section>
  <section class="stat"><div class="st">${t.stats.map(([n, l]) => `<div><b>${n}</b><span>${l}</span></div>`).join('')}</div></section>
  <section class="ls dark" id="uc"><h2>${t.ucT}</h2><div class="tabs">${t.ucs.map((x, i) => `<button class="${i === uc ? '' : 'g'}" data-a="uc" data-i="${i}">${x[0]}</button>`).join('')}</div>
  <div class="ucg"><div><h3>${u[1]}</h3><p>${u[2]}</p><a class="more" href="javascript:void(0)">${t.solMore} →</a></div><div class="mock"><small>${u[4][0]}</small><b>${u[4][1]}</b>${chart}</div></div>
  <h3 class="sub">${t.solSub}</h3><div class="g3">${u[3].map(x => `<div class="lc"><b>${x}</b></div>`).join('')}</div></section>
  <section class="ls" id="ins"><small class="eb">${t.insL}</small><h2>${t.insT}</h2><div class="g4">${t.ins.map(([h, p], i) => `<div class="ic"><div class="ih c${i}"></div><div class="ib"><h3>${h}</h3><p class="m">${p}</p><button class="g" data-a="sc" data-t="uc">${t.insB}</button></div></div>`).join('')}</div></section>
  <section class="ls" id="sto"><h2>${t.stoT}</h2><div class="g2">${t.sto.map(([h, q, r]) => `<figure class="story"><h3>${h}</h3><blockquote>“${q}”</blockquote><figcaption class="m">${r}</figcaption><button class="g" data-a="sc" data-t="fin">${t.read}</button></figure>`).join('')}</div></section>
  <section class="ls" id="ai"><h2>${t.aiT}</h2><div class="aig"><div class="at">${t.ai.map(x => `<p>${x}</p>`).join('')}<div class="who"><span class="av"></span><b>${t.aiRole}</b></div><button class="g" data-a="sc" data-t="fin">${t.aiB}</button></div>
  <div class="vid"><div class="vc"><small>${t.aiV}</small><i style="width:90%"></i><i style="width:62%"></i><i style="width:36%"></i></div><span class="play"></span></div></div></section>
  <section class="rew" id="fin"><h2>${t.rewT}</h2><p>${t.rewS}</p><div class="row" style="justify-content:center">${btn(t.rewB1)}<button class="ol" data-a="begin">${t.rewB2}</button></div></section>
  <footer class="ft"><div class="fc">${t.foot.map(([h, ls]) => `<div><b>${h}</b>${ls.map(l => `<span>${l}</span>`).join('')}</div>`).join('')}</div><p>${t.note}</p></footer>`;
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
  if (a === 'begin') go(user() ? '/home' : '/login');
  if (a === 'ucgo') { uc = +b.dataset.i; render(); document.getElementById('uc')?.scrollIntoView({ behavior: 'smooth' }); }
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
