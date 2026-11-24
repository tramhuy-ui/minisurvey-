const app = document.getElementById('app');
const load = () => { try { return JSON.parse(localStorage.getItem('ms') || '{"surveys":[]}'); } catch { return { surveys: [] }; } };
const save = d => localStorage.setItem('ms', JSON.stringify(d));
const uid = () => Math.random().toString(36).slice(2, 8);
const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const user = () => localStorage.getItem('ms_user');
const find = id => load().surveys.find(s => s.id === id);
const update = (id, fn) => { const d = load(); const s = d.surveys.find(x => x.id === id); if (s) { fn(s); s.upd = Date.now(); } save(d); };
const go = h => { location.hash = h; };
const link = id => location.origin + location.pathname + '#/s/' + id;

// Dán Client ID của bạn vào giữa hai dấu nháy để bật đăng nhập Google thật (xem README).
// Để trống thì Google sẽ chạy bằng màn hình chọn tài khoản mô phỏng.
const GOOGLE_CLIENT_ID = '';
const pic = () => localStorage.getItem('ms_pic');
function loadGsi() {
  if (!GOOGLE_CLIENT_ID || document.getElementById('gsi')) return;
  const sc = document.createElement('script'); sc.id = 'gsi'; sc.src = 'https://accounts.google.com/gsi/client'; sc.async = true; document.head.appendChild(sc);
}
function googleSignIn(onDone) {
  const t = L[lang()], err = m => { const e = document.getElementById('e'); if (e) e.textContent = m; };
  if (!window.google || !google.accounts || !google.accounts.oauth2) return err(t.gLoad);
  const client = google.accounts.oauth2.initTokenClient({
    client_id: GOOGLE_CLIENT_ID, scope: 'openid email profile',
    callback: async r => {
      if (r.error || !r.access_token) return err(t.gFail);
      try {
        const u = await (await fetch('https://www.googleapis.com/oauth2/v3/userinfo', { headers: { Authorization: 'Bearer ' + r.access_token } })).json();
        localStorage.setItem('ms_user', u.name || u.email); localStorage.setItem('ms_email', u.email || '');
        if (u.picture) localStorage.setItem('ms_pic', u.picture); else localStorage.removeItem('ms_pic');
        onDone();
      } catch { err(t.gFail); }
    },
    error_callback: () => err(t.gFail)
  });
  client.requestAccessToken();
}
const LK = 'ms_lang';
const lang = () => (localStorage.getItem(LK) === 'en' ? 'en' : 'vi');
let uc = 0;
const L = {
vi: {
  gLoad: 'Chưa tải được Google. Hãy kiểm tra mạng hoặc tắt trình chặn quảng cáo rồi thử lại.', gFail: 'Đăng nhập Google chưa thành công. Hãy thử lại.',
  tabHome: 'Trang chủ', tabMulti: 'Phân tích đa khảo sát', upg: 'Nâng cấp', mk: 'Tạo khảo sát', upgNote: 'Bản demo: chưa có gói trả phí.',
  sdFor: 'Được tạo cho bạn', sdSur: 'Khảo sát', sdFold: 'Thư mục', sdHint: 'Tạo một thư mục để sắp xếp các khảo sát của bạn.', folderQ: 'Tên thư mục mới',
  hFor: 'Các cuộc khảo sát được thiết kế dành riêng cho bạn', hH: 'Bắt đầu chỉ trong vài phút với các khảo sát về mức độ gắn kết của nhân viên.',
  hc: [['Đánh giá tâm trạng và mức căng thẳng của đội nhóm', 'Cho bạn cái nhìn tổng quan về tinh thần làm việc hiện tại và những yếu tố đang gây căng thẳng.'], ['Đo cảm giác thuộc về và hòa nhập', 'Cho thấy nỗ lực hòa nhập có hiệu quả không, và nhóm nào đang cảm thấy ít được hòa nhập hơn.'], ['Tìm hiểu điều gì giữ chân nhân viên', 'Biết điều gì khiến mọi người ở lại và điều gì khiến họ tìm cơ hội khác, trước khi họ nghỉ việc.']],
  review: 'Xem xét và xuất bản', mine: 'Tạo khảo sát của riêng tôi',
  linkT: 'Hãy liên kết các khảo sát của bạn lại với nhau.', linkP: 'Chương trình nối các khảo sát liên quan để bạn thấy xu hướng theo thời gian thay vì so sánh từng kết quả một. Có sẵn trên gói nâng cao.',
  progL: 'Chương trình phản hồi sự kiện', progH: 'Đo mức hài lòng của người tham dự và thấy hiệu quả đầu tư cho sự kiện tốt dần theo thời gian.', progN: 'Gồm 2 khảo sát', more: 'Tìm hiểu thêm',
  progD: 'Gộp khảo sát đăng ký và khảo sát sau sự kiện vào một chương trình để so sánh qua nhiều lần tổ chức. Phần này chỉ để minh họa, chưa dùng được trong bản demo.',
  sH: 'Hãy biến câu hỏi của bạn thành hiểu biết sâu sắc.', mIdea: 'Bắt đầu từ một ý tưởng', mTpl: 'Bắt đầu với một mẫu', mScr: 'Bắt đầu từ đầu',
  ideaPh: 'Mô tả điều bạn muốn tìm hiểu để bắt đầu.', paste: 'Hoặc dán bản nháp khảo sát của bạn vào đây', aiNote: 'Phần gợi ý chỉ là mô phỏng theo từ khóa, hãy xem lại trước khi dùng.',
  tag1: 'Mọi thứ bắt đầu bằng một phỏng đoán.', tag2: 'Điều khác biệt nằm ở hành động tiếp theo của bạn.',
  myS: 'Khảo sát của tôi', emptyS: 'Chưa có khảo sát nào. Hãy tạo khảo sát đầu tiên ở phía trên.', open: 'Mở', draft: 'Nháp', resp: 'phản hồi', edit: 'Sửa', analyze: 'Phân tích kết quả', del: 'Xóa',
  multiT: 'Phân tích đa khảo sát', multiP: 'So sánh nhanh số phản hồi giữa các khảo sát của bạn.', total: 'Tổng', colS: 'Khảo sát', colSt: 'Trạng thái', colR: 'Phản hồi', logoutB: 'Đăng xuất',
  oLogin: 'Đăng nhập bằng', oSignup: 'Đăng ký bằng', oChoose: 'Chọn tài khoản', oCont: 'Tiếp tục tới', oOther: 'Sử dụng một tài khoản khác',
  oNote: 'Đây là màn hình mô phỏng của bản demo: các tài khoản ở trên là tài khoản mẫu, không cần mật khẩu và không có dữ liệu nào được gửi đi.', oEmail: 'Email của bạn', oGo: 'Tiếp tục', oBack: 'Quay lại',
  regB: 'Đăng ký', aTitleS: 'Tạo tài khoản', aTitleL: 'Đăng nhập', aHaveQ: 'Bạn đã có tài khoản chưa?', aNoQ: 'Chưa có tài khoản?',
  aEmailS: 'Đăng ký bằng email', aEmailL: 'Đăng nhập bằng email', next: 'Tiếp theo', emailBad: 'Nhập địa chỉ email hợp lệ.',
  terms: 'Bằng cách đăng ký, bạn đồng ý với các điều khoản sau:', tos: 'Điều khoản sử dụng', and: 'và', priv: 'Thông báo về quyền riêng tư',
  newsT: 'Bạn cũng đồng ý nhận tin tức sản phẩm và chương trình khuyến mãi qua email, và có thể hủy bất cứ lúc nào.', or: 'HOẶC',
  gS: 'Đăng ký bằng Google', aS: 'Đăng ký bằng Apple', gL: 'Đăng nhập bằng Google', aL: 'Đăng nhập bằng Apple',
  demoNote: 'Bản demo: không kết nối thật tới Google hay Apple và không cần mật khẩu.',
  cTitle: 'Đăng ký bằng', cSub: 'Vui lòng xem lại điều khoản của chúng tôi để tiếp tục.', c1: 'Bạn đồng ý với',
  c2: 'Bạn đồng ý nhận tin tức sản phẩm và các chương trình khuyến mãi đặc biệt qua email. Bạn có thể hủy bất cứ lúc nào.',
  ob1T: 'Hãy cá nhân hóa trải nghiệm của bạn', ob1Q: 'Hôm nay bạn đến đây vì lý do gì?', ob1: ['Công việc', 'Giáo dục', 'Cá nhân'],
  ob2Q: 'Bạn muốn làm gì tiếp theo?', ob2: ['Tôi đang tìm hiểu những điều khả thi.', 'Tôi đã sẵn sàng xây dựng một cuộc khảo sát.'], back: 'Trở lại',
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
  gLoad: 'Google could not be loaded. Check your connection or turn off your ad blocker and try again.', gFail: 'Google sign-in did not complete. Please try again.',
  tabHome: 'Home', tabMulti: 'Multi-survey analysis', upg: 'Upgrade', mk: 'Create survey', upgNote: 'Demo only: there are no paid plans yet.',
  sdFor: 'Made for you', sdSur: 'Surveys', sdFold: 'Folders', sdHint: 'Create a folder to organize your surveys.', folderQ: 'New folder name',
  hFor: 'Surveys designed just for you', hH: 'Get started in minutes with employee engagement surveys.',
  hc: [['Gauge team mood and stress levels', 'Get an overview of current morale and the specific things causing stress right now.'], ['Measure belonging and inclusion', 'See whether inclusion efforts are working, and which groups feel less included than others.'], ['Learn what keeps employees here', 'Find out what makes people stay and what pushes them to look elsewhere, before they leave.']],
  review: 'Review and publish', mine: 'Create my own survey',
  linkT: 'Connect the dots across your surveys.', linkP: 'Programs link related surveys so you can see trends over time instead of comparing results one by one. Available on advanced plans.',
  progL: 'Event feedback program', progH: 'Measure attendee satisfaction and see event investment pay off more and more over time.', progN: 'Includes 2 surveys', more: 'Learn more',
  progD: 'Combine a sign-up survey and a post-event survey into one program to compare across editions. This section is illustration only and not available in the demo.',
  sH: 'Turn your questions into insights.', mIdea: 'Start from an idea', mTpl: 'Start with a template', mScr: 'Start from scratch',
  ideaPh: 'Describe what you want to learn to get started.', paste: 'Or paste your survey draft here', aiNote: 'Suggestions are a keyword-based simulation. Please review before using.',
  tag1: 'Everything starts with a guess.', tag2: 'What makes the difference is what you do next.',
  myS: 'My surveys', emptyS: 'No surveys yet. Create your first one above.', open: 'Open', draft: 'Draft', resp: 'responses', edit: 'Edit', analyze: 'Analyze results', del: 'Delete',
  multiT: 'Multi-survey analysis', multiP: 'Quickly compare response counts across your surveys.', total: 'Total', colS: 'Survey', colSt: 'Status', colR: 'Responses', logoutB: 'Log out',
  oLogin: 'Log in with', oSignup: 'Sign up with', oChoose: 'Choose an account', oCont: 'Continue to', oOther: 'Use another account',
  oNote: 'This is a simulated screen for the demo: the accounts above are samples, no password is needed and no data is sent anywhere.', oEmail: 'Your email', oGo: 'Continue', oBack: 'Back',
  regB: 'Sign up', aTitleS: 'Create your account', aTitleL: 'Log in', aHaveQ: 'Already have an account?', aNoQ: 'New here?',
  aEmailS: 'Sign up with email', aEmailL: 'Log in with email', next: 'Next', emailBad: 'Enter a valid email address.',
  terms: 'By signing up, you agree to the following:', tos: 'Terms of use', and: 'and', priv: 'Privacy notice',
  newsT: 'You also agree to receive product news and special offers by email, and you can unsubscribe at any time.', or: 'OR',
  gS: 'Sign up with Google', aS: 'Sign up with Apple', gL: 'Log in with Google', aL: 'Log in with Apple',
  demoNote: 'Demo only: no real connection to Google or Apple, and no password is needed.',
  cTitle: 'Sign up with', cSub: 'Please review our terms to continue.', c1: 'You agree to the',
  c2: 'You agree to receive product news and special offers by email. You can unsubscribe at any time.',
  ob1T: 'Let’s personalize your experience', ob1Q: 'What brings you here today?', ob1: ['Work', 'Education', 'Personal'],
  ob2Q: 'What would you like to do next?', ob2: ['I’m exploring what’s possible.', 'I’m ready to build a survey.'], back: 'Back',
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
  stress: ['Khảo sát tâm trạng và mức căng thẳng', [
    ['single', 'Mức căng thẳng của bạn trong tuần qua?', ['Rất thấp', 'Thấp', 'Trung bình', 'Cao']],
    ['multi', 'Điều gì gây căng thẳng nhiều nhất?', ['Khối lượng công việc', 'Thời hạn gấp', 'Giao tiếp trong nhóm', 'Áp lực cá nhân']],
    ['text', 'Chúng tôi có thể giúp gì để bạn bớt căng thẳng?', []]]],
  incl: ['Khảo sát cảm giác thuộc về và hòa nhập', [
    ['single', 'Bạn thấy mình được chào đón trong nhóm ở mức nào?', ['Rất chào đón', 'Khá chào đón', 'Trung lập', 'Chưa chào đón']],
    ['single', 'Bạn có cảm thấy được tôn trọng khác biệt của mình không?', ['Luôn luôn', 'Thường xuyên', 'Thỉnh thoảng', 'Hiếm khi']],
    ['text', 'Điều gì giúp nhóm hòa nhập hơn?', []]]],
  ret: ['Khảo sát điều gì giữ chân nhân viên', [
    ['single', 'Bạn có dự định gắn bó thêm 12 tháng nữa không?', ['Chắc chắn', 'Có thể', 'Chưa chắc', 'Không']],
    ['multi', 'Điều gì khiến bạn muốn ở lại?', ['Lương thưởng', 'Đồng nghiệp', 'Cơ hội phát triển', 'Cân bằng công việc']],
    ['text', 'Điều gì có thể khiến bạn tìm cơ hội khác?', []]]],
  trong: ['Khảo sát mới', [['single', 'Câu hỏi 1', ['Lựa chọn A', 'Lựa chọn B']]]]
};
function make(key, title, desc) {
  const [t, qs] = TPL[key];
  return { id: uid(), title: title || t, desc: desc || '', upd: Date.now(), status: 'draft', responses: [],
    questions: qs.map(([type, text, options]) => ({ id: uid(), type, text, options: [...options] })) };
}
function add(s) { const d = load(); d.surveys.unshift(s); save(d); go('/edit/' + s.id); }

const globe = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18"/></svg>';
const langSel = () => `<label class="gl">${globe}<select id="lang" aria-label="Language"><option value="vi"${lang() === 'vi' ? ' selected' : ''}>Tiếng Việt</option><option value="en"${lang() === 'en' ? ' selected' : ''}>English</option></select></label>`;
const ini = () => (user() || '?').trim().split(/[\s@.]+/).filter(Boolean).slice(0, 2).map(w => w[0]).join('').toUpperCase();
const bell = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M6 17V11a6 6 0 0112 0v6l1.5 2h-15zM10 21h4"/></svg>';
const help = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M9.5 9.5a2.5 2.5 0 114 2c-1 .7-1.5 1.2-1.5 2.5M12 17v.5"/></svg>';
const nav = (act) => { const t = L[lang()]; return `<header class="ab"><b class="logo" data-a="home"><i></i>MiniSurvey</b>
  <a class="tn ${act === 'home' || act === 'surveys' ? 'on' : ''}" href="javascript:void(0)" data-a="home">${t.tabHome}</a><a class="tn ${act === 'multi' ? 'on' : ''}" href="javascript:void(0)" data-a="multi">${t.tabMulti}</a>
  <div class="ar">${langSel()}<button class="gold" data-a="upgrade">${t.upg}</button><button class="ol2" data-a="surveys">${t.mk}</button><span class="ib2">${bell}</span><span class="ib2">${help}</span>
  <div class="dd r"><span class="avt" tabindex="0">${pic() ? `<img src="${esc(pic())}" alt="" referrerpolicy="no-referrer">` : esc(ini())}</span><div class="dm2">${localStorage.getItem('ms_email') ? `<div class="m" style="margin:.3rem .8rem">${esc(localStorage.getItem('ms_email'))}</div>` : ''}<button data-a="logout">${t.logoutB}</button></div></div></div></header>`; };
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
const ic = {
  work: '<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M9 7V5h6v2M3 13h18"/>',
  edu: '<path d="M2 9l10-5 10 5-10 5z"/><path d="M6 11v5c3 2 9 2 12 0v-5"/>',
  me: '<path d="M12 20s-8-5-8-11a4.5 4.5 0 018-2.5A4.5 4.5 0 0120 9c0 6-8 11-8 11z"/>',
  pen: '<path d="M4 20l4-1 11-11-3-3L5 16z"/>',
  globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18"/>'
};
const svgI = k => `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ic[k]}</svg>`;
const ill1 = `<svg viewBox="0 0 420 340" aria-hidden="true"><circle cx="190" cy="205" r="125" fill="#E8F1FB"/><g transform="rotate(-4 240 160)"><rect x="120" y="60" width="240" height="200" rx="14" fill="#0A2A57"/><rect x="136" y="170" width="40" height="40" rx="8" fill="#005BAA"/><rect x="186" y="170" width="40" height="40" rx="8" fill="#F36F21"/><rect x="236" y="160" width="60" height="60" rx="10" fill="#fff"/><rect x="250" y="178" width="32" height="24" rx="4" fill="none" stroke="#F36F21" stroke-width="3"/><rect x="306" y="170" width="40" height="40" rx="8" fill="#005BAA"/></g><path d="M250 100l-6-24M276 104l12-20M300 116l20-8" stroke="#F36F21" stroke-width="5" stroke-linecap="round"/></svg>`;
const ill2 = `<svg viewBox="0 0 420 340" aria-hidden="true"><rect x="150" y="30" width="140" height="90" rx="24" fill="#DCEBFA"/><rect x="230" y="130" width="160" height="90" rx="24" fill="#F36F21"/><circle cx="310" cy="172" r="22" fill="#fff"/><rect x="302" y="192" width="16" height="12" rx="3" fill="#fff"/><path d="M342 138l10-14M360 150l16-8" stroke="#FFD9BF" stroke-width="5" stroke-linecap="round"/><rect x="130" y="120" width="42" height="180" rx="21" fill="#005BAA"/><rect x="190" y="170" width="42" height="130" rx="21" fill="#FFD9BF"/><rect x="100" y="290" width="200" height="22" rx="8" fill="#0A2A57"/></svg>`;
const shell = (right, body) => `<div class="au"><div class="ah"><b class="logo" data-a="landing"><i></i>MiniSurvey</b><div class="tr">${right}</div></div>${body}</div>`;
function authPage(mode) {
  const t = L[lang()], S = mode === 'signup';
  const right = `${langSel()}<span class="hq">${S ? t.aHaveQ : t.aNoQ}</span><button class="ol2" data-a="${S ? 'loginpage' : 'signuppage'}">${S ? t.login : t.regB}</button>`;
  return shell(right, `<main class="ac"><h1>${S ? t.aTitleS : t.aTitleL}</h1>
  <label for="em" class="lb">${S ? t.aEmailS : t.aEmailL}</label><input type="email" id="em" placeholder="name@company.com" autocomplete="email"><div id="e" class="err" role="alert"></div>
  <button class="bt" id="nx" data-a="next" data-m="${mode}" disabled>${t.next}</button>
  ${S ? `<p class="tm">${t.terms} <span class="ln">${t.tos}</span> ${t.and} <span class="ln">${t.priv}</span>. ${t.newsT}</p>` : ''}
  <div class="or"><span>${t.or}</span></div>
  <button class="sb" data-a="social" data-k="google" data-m="${mode}"><i class="si">G</i>${S ? t.gS : t.gL}</button>
  <button class="sb" data-a="social" data-k="apple" data-m="${mode}"><i class="si">A</i>${S ? t.aS : t.aL}</button>
  <p class="tm">${t.demoNote}</p></main>`);
}
function login() { return authPage('login'); }
function consent(k) {
  const t = L[lang()];
  return shell(langSel(), `<main class="ac cs"><h1>${t.cTitle} ${k === 'apple' ? 'Apple' : 'Google'}</h1><p>${t.cSub}</p>
  <label class="cb"><input type="checkbox" id="c1"><span>${t.c1} <span class="ln">${t.tos}</span> ${t.and} <span class="ln">${t.priv}</span>.</span></label>
  <label class="cb"><input type="checkbox"><span>${t.c2}</span></label>
  <div id="e" class="err" role="alert"></div><button class="bt" id="cn" data-a="consent" data-k="${k}" disabled>${t.next}</button></main>`);
}
function onboard(step) {
  const t = L[lang()];
  if (!user()) return authPage('login');
  if (step === '2') return shell(langSel(), `<div class="ob"><section class="oc"><small class="pg">2/2</small><h2>${t.ob2Q}</h2>
  <button class="op" data-a="explore">${svgI('globe')}${t.ob2[0]}</button><button class="op" data-a="build">${svgI('pen')}${t.ob2[1]}</button>
  <button class="bk" data-a="back">‹ ${t.back}</button></section><div class="il">${ill2}</div></div>`);
  return shell(langSel(), `<div class="ob"><section class="oc"><small class="pg">1/2</small><h1>${t.ob1T}</h1><h2>${t.ob1Q}</h2>
  ${['work', 'edu', 'me'].map((k, i) => `<button class="op" data-a="pick" data-p="${k}">${svgI(k)}${t.ob1[i]}</button>`).join('')}</section><div class="il">${ill1}</div></div>`);
}
const folders = () => { try { return JSON.parse(localStorage.getItem('ms_folders') || '[]'); } catch { return []; } };
const side = (act) => { const t = L[lang()], f = folders(); return `<aside class="sd"><a class="si2 ${act === 'home' ? 'on' : ''}" href="javascript:void(0)" data-a="home">${svgI('me')}${t.sdFor}</a><a class="si2 ${act === 'surveys' ? 'on' : ''}" href="javascript:void(0)" data-a="surveys"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><rect x="5" y="3" width="14" height="18" rx="2"/><path d="M9 8h6M9 12h6M9 16h6"/></svg>${t.sdSur}</a>
  <div class="fh"><b>${t.sdFold}</b><button class="pl" data-a="folder" aria-label="${t.sdFold}">+</button></div>${f.length ? f.map(x => `<div class="fd">${esc(x)}</div>`).join('') : `<p class="m">${t.sdHint}</p>`}</aside>`; };
const cardIcons = [
  '<svg width="72" height="60" viewBox="0 0 72 60" aria-hidden="true"><rect x="2" y="16" width="52" height="24" rx="3" fill="#005BAA"/><path d="M8 10h56M8 50h56" stroke="#9aa7b5" stroke-width="3" stroke-linecap="round"/><circle cx="8" cy="28" r="4" fill="#fff"/></svg>',
  '<svg width="72" height="60" viewBox="0 0 72 60" aria-hidden="true"><rect x="22" y="6" width="9" height="46" fill="#005BAA"/><rect x="8" y="34" width="9" height="18" fill="#c9d2dc"/><rect x="36" y="26" width="9" height="26" fill="#c9d2dc"/><rect x="50" y="22" width="9" height="30" fill="#F36F21"/><path d="M4 52h60" stroke="#1C2A3A" stroke-width="2"/></svg>',
  '<svg width="72" height="60" viewBox="0 0 72 60" aria-hidden="true"><path d="M8 46l14-14 12 10 20-26" fill="none" stroke="#1C2A3A" stroke-width="2.5"/><circle cx="8" cy="46" r="5" fill="#fff" stroke="#1C2A3A" stroke-width="2"/><circle cx="22" cy="32" r="5" fill="#fff" stroke="#1C2A3A" stroke-width="2"/><circle cx="54" cy="16" r="7" fill="#F36F21"/></svg>'
];
function home() {
  if (!user()) return login();
  const t = L[lang()];
  return nav('home') + `<div class="app">${side('home')}<main class="mc"><small class="eyb2">${svgI('me')} ${t.hFor}</small><h1 class="big">${t.hH}</h1>
  <div class="g3c">${t.hc.map(([h, p], i) => `<div class="mcard">${cardIcons[i]}<h3>${h}</h3><p>${p}</p><button class="ol3" data-a="tpl" data-k="${['stress', 'incl', 'ret'][i]}">${t.review}</button></div>`).join('')}</div>
  <div class="ctr"><button class="ol3" data-a="surveys">${t.mine} →</button></div>
  <h2 class="h2b">${t.linkT}</h2><p>${t.linkP}</p>
  <details class="pc"><summary><div><small>${t.progL}</small><h3>${t.progH}</h3><p class="m">${t.progN}</p><span class="mr">${t.more} ▾</span></div><div class="tiles"><i></i><i></i></div></summary><p class="m">${t.progD}</p></details></main></div>`;
}
let sm = 'idea';
function surveys() {
  if (!user()) return login();
  const t = L[lang()], list = load().surveys;
  const mb = (k, ic, l, a = 'mode') => `<button class="mb ${sm === k && a === 'mode' ? 'on' : ''}" data-a="${a}" data-m="${k}" ${a === 'tpl' ? 'data-k="trong"' : ''}>${svgI(ic)}${l}</button>`;
  const body = sm === 'tpl'
    ? `<div class="tpls">${['nv', 'kh', 'stress', 'incl', 'ret'].map(k => `<button class="op" data-a="tpl" data-k="${k}">${svgI('edu')}${TPL[k][0]}</button>`).join('')}</div>`
    : `<div class="ibox"><textarea id="idea" placeholder="${t.ideaPh}"></textarea><div class="ifoot"><span class="chip" data-a="focus">💡 ${t.paste}</span><button class="go" data-a="idea" aria-label="${t.start}">→</button></div></div>${sugHtml()}<p class="m ctr">${t.aiNote}</p>`;
  return nav('surveys') + `<div class="app">${side('surveys')}<main class="mc"><h1 class="big c">${t.sH}</h1>
  <div class="modes">${mb('idea', 'pen', t.mIdea)}${mb('tpl', 'edu', t.mTpl)}${mb('scr', 'work', t.mScr, 'tpl')}</div>${body}
  <div class="ill3"><svg viewBox="0 0 220 170" aria-hidden="true"><rect x="20" y="10" width="100" height="100" rx="6" fill="none" stroke="#9aa7b5" stroke-width="3" stroke-dasharray="7 6"/><circle cx="92" cy="64" r="28" fill="#fff" stroke="#1C2A3A" stroke-width="4"/><path d="M104 88l30 40 18-10-22-40z" fill="#DCEBFA" stroke="#1C2A3A" stroke-width="2"/><path d="M118 130h70l-12 24h-52z" fill="#1C2A3A"/></svg><h2>${t.tag1}</h2><p class="m">${t.tag2}</p></div>
  <h2 class="h2b">${t.myS}</h2><div class="row sf"><input type="text" data-flt=".lrow" placeholder="Tìm kiếm" aria-label="Tìm kiếm"><select id="fs" aria-label="Trạng thái"><option value="">Trạng thái: Tất cả</option><option value="open">Trạng thái: Mở</option><option value="draft">Trạng thái: Nháp</option></select><select aria-label="Chủ sở hữu"><option>Chủ sở hữu: Tất cả</option></select><select aria-label="Sắp xếp"><option>Sắp xếp theo: Cập nhật lần cuối</option></select></div>
  <div class="card">${list.length ? list.map(s => { const o = s.status === 'open'; return `<div class="item lrow" data-st="${s.status}"><div><span class="tag ${o ? '' : 'd'}">${o ? t.open : t.draft}</span> <a class="tt" href="javascript:void(0)" data-a="nav" data-h="/edit/${s.id}">${esc(s.title)}</a>${o ? `<div class="url"><span>${esc(link(s.id))}</span><button class="g" data-a="copylink" data-id="${s.id}">Sao chép URL</button></div>` : ''}<div class="m">Cập nhật: ${dt(s.upd)}</div></div>
  <div class="row">${o ? `<span class="rbadge">${s.responses.length} ${t.resp}</span><button class="ol3" style="width:auto" data-a="nav" data-h="/results/${s.id}">${t.analyze}</button>` : `<button class="ol3" style="width:auto" data-a="nav" data-h="/publish/${s.id}">Gửi khảo sát</button>`}<details class="mn2"><summary>⋯</summary><div><button data-a="nav" data-h="/classic/${s.id}">${t.edit}</button><button class="x" data-a="del" data-id="${s.id}">${t.del}</button></div></details></div></div>`; }).join('') : `<p class="m">${t.emptyS}</p>`}<p class="m">Hiển thị ${list.length ? '1 - ' + list.length : 0} trong tổng số ${list.length}</p></div></main></div>`;
}
function multi() {
  if (!user()) return login();
  const t = L[lang()], list = load().surveys, tot = list.reduce((n, s) => n + s.responses.length, 0);
  return nav('multi') + `<main class="w wide"><div class="ready"><div><h1>Kết hợp, so sánh và khám phá các mối liên hệ bằng phân tích đa khảo sát.</h1><p class="m">${t.multiP}</p><ul><li>Phân tích một hoặc nhiều khảo sát cùng lúc.</li><li>Theo dõi số phản hồi của từng khảo sát.</li><li>So sánh nhanh trong một bảng.</li></ul><button data-a="upgrade">Nâng cấp ngay</button></div><div class="card"><table><tr><th>${t.colS}</th><th>${t.colSt}</th><th>${t.colR}</th></tr>
  ${list.map(s => `<tr><td>${esc(s.title)}</td><td>${s.status === 'open' ? t.open : t.draft}</td><td>${s.responses.length}</td></tr>`).join('')}<tr><th>${t.total}</th><th></th><th>${tot}</th></tr></table></div></div></main>`;
}
function oauth(id) {
  const [k, m] = (id || 'google-signup').split('-'), t = L[lang()], nm = k === 'apple' ? 'Apple' : 'Google';
  const acc = [['Minh Anh', 'minhanh@example.com'], ['Quốc Bảo', 'quocbao@example.com']];
  return `<div class="gw"><div class="gc"><div class="gh"><i class="si">${nm[0]}</i>${m === 'login' ? t.oLogin : t.oSignup} ${nm}<span class="dmb">DEMO</span></div>
  <div class="gb"><div><i class="lg2"></i><h1>${t.oChoose}</h1><p>${t.oCont} <b>MiniSurvey</b></p></div>
  <div class="gr">${acc.map(([n, e]) => `<button class="ac2" data-a="pickacct" data-n="${n}" data-k="${k}" data-m="${m}"><span class="av2">${n[0]}</span><span><b>${n}</b><small>${e}</small></span></button>`).join('')}
  <button class="ac2" data-a="other"><span class="av2">+</span><b>${t.oOther}</b></button>
  <div id="oth" hidden><input type="email" id="oe" placeholder="${t.oEmail}"><div id="e" class="err"></div><button class="bt" data-a="otherGo" data-k="${k}" data-m="${m}">${t.oGo}</button></div>
  <p class="tm" style="text-align:left">${t.oNote}</p></div></div></div>
  <div class="gf">${langSel()}<button class="bk" data-a="${m === 'login' ? 'loginpage' : 'signuppage'}">‹ ${t.oBack}</button></div></div>`;
}
const dt = t => new Date(t || Date.now()).toLocaleDateString('vi-VN'), dtm = t => new Date(t).toLocaleString('vi-VN');
const mmss = n => String(Math.floor((n || 0) / 60)).padStart(2, '0') + ':' + String((n || 0) % 60).padStart(2, '0');
const PAL = ['#1fc16b', '#4a7fd0', '#f2c230', '#f08a4b', '#3bb4c1', '#9b6fd0'];
const INTRO = 'Bản khảo sát của bạn đã được soạn thảo xong và sẵn sàng để đăng tải 🎉 Hãy xem lại nội dung, thêm câu hỏi hoặc đăng khảo sát khi bạn thấy ổn.';
const SUGS = ['Tôi muốn đánh giá tâm trạng chung của công ty hiện tại và tìm hiểu điều gì đang gây căng thẳng cho nhân viên.', 'Tôi cần hiểu lý do nhân viên chọn ở lại với công ty và những yếu tố có thể khiến họ cân nhắc rời đi.', 'Tôi muốn tìm hiểu xem mọi người có cảm thấy mình thuộc về, được tôn trọng và hòa nhập trong công ty hay không.', 'Tôi cần biết nhân viên có thực sự tin tưởng vào lãnh đạo và các giá trị mà công ty tuyên bố hay không.', 'Tôi muốn hỏi về khối lượng công việc để biết nhóm nào đang quá tải trước khi người giỏi nghỉ việc.'];
const APPS = [['Google Sheets', 'Gửi phản hồi trực tiếp tới Google Sheets.', 'Tạo trang tính mới'], ['Microsoft Excel', 'Gửi phản hồi vào bảng tính Excel.', 'Tạo trang tính mới'], ['Microsoft Teams', 'Nhận thông báo khi có phản hồi mới.', 'Đăng lên kênh'], ['Slack', 'Đăng phản hồi mới vào kênh của bạn.', 'Chi tiết'], ['Zapier', 'Kết nối với hàng nghìn ứng dụng khác.', 'Chi tiết'], ['Mailchimp', 'Thêm người trả lời vào danh sách email.', 'Chi tiết'], ['Tableau', 'Tạo biểu đồ trực quan chi tiết. (Doanh nghiệp)', 'Chi tiết']];
let gen = '', dr = -1, ai = false, ctab = 'd', vw = 'tbl', ct = {}, rt0 = 0;

const sbar = (s, n, extra = '') => `<header class="sb2"><div class="sbt"><b class="logo" data-a="surveys"><i></i></b><span>›</span><b>${esc(s.title)}</b><span class="tag ${s.status === 'open' ? '' : 'd'}">${s.status === 'open' ? 'Mở' : 'Bản nháp'}</span><div class="ar">${extra}<span class="avt">${esc(ini())}</span></div></div>
  <div class="st4">${[['Khảo sát thiết kế', '/edit/'], ['Đăng khảo sát', '/publish/'], ['Kết nối ứng dụng', '/connect/'], ['Phân tích kết quả', '/results/']].map(([l, h], i) => `<a class="${i === n ? 'on' : ''}" href="javascript:void(0)" data-a="nav" data-h="${h}${s.id}">${i + 1}. ${l}</a>`).join('')}</div></header>`;

function editor(id) {
  const s = find(id); if (!s) return home();
  if (gen === id) { setTimeout(() => { gen = ''; render(); }, 1500); return `<div class="gen"><h1>Đang biến ý tưởng của bạn thành khảo sát...</h1><p class="m">Có thể mất vài giây. Sau đó bạn vẫn chỉnh sửa được.</p><div class="sk"><i></i><i></i><i></i><i></i><i></i></div></div>`; }
  const chat = s.chat || [{ r: 'ai', t: INTRO }];
  const tools = `<button class="g" data-a="nav" data-h="/classic/${s.id}">Trình soạn thảo cổ điển</button><button class="g" data-a="nav" data-h="/s/${s.id}?preview=1">Xem trước</button>${s.status === 'open' ? `<button data-a="copylink">Sao chép link khảo sát</button>` : `<button data-a="publish">Đăng khảo sát</button>`}`;
  return sbar(s, 0, tools) + `<div class="qe"><aside class="cp"><div class="cmsg">${chat.map(m => `<div class="bub ${m.r}">${esc(m.t)}</div>`).join('')}
  <div class="chips"><button class="g" data-a="publish">Đăng khảo sát</button><button class="g" data-a="addq2">Thêm câu hỏi</button><button class="g" data-a="nav" data-h="/classic/${s.id}">Khảo sát phong cách</button></div></div>
  <div class="cin"><input type="text" id="ci" placeholder="Hãy cho MiniSurvey biết bạn muốn đổi gì" aria-label="Trò chuyện"><button class="go" data-a="chat" aria-label="Gửi">→</button></div><p class="m">Trợ lý mô phỏng: gõ “Thêm câu hỏi: …” hoặc “Đăng khảo sát”.</p></aside>
  <section class="pv"><div class="pvc"><h2 class="pt">${esc(s.title)}</h2><p class="ph">Thêm tiêu đề trang (tùy chọn)</p>${s.desc ? `<p class="pd">${esc(s.desc)}</p>` : '<p class="ph2">Thêm mô tả (tùy chọn)</p>'}
  ${s.questions.map((q, i) => `<div class="pq"><b>${i + 1}. ${esc(q.text)}</b>${q.type === 'text' ? '<div class="pin"></div>' : q.options.map(o => `<label class="opt"><input type="${q.type === 'single' ? 'radio' : 'checkbox'}" disabled> ${esc(o)}</label>`).join('')}</div>`).join('')}
  <div class="pdone"><span>Xong</span></div><p class="pw">Được cung cấp bởi <b>MiniSurvey</b></p></div></section></div>`;
}
function classic(id) {
  const s = find(id); if (!s) return home();
  const modal = s.seen ? '' : `<div class="mdl"><div class="mbx"><h2>Đã tạo khảo sát!</h2><p class="m">Một vài việc bạn có thể làm tiếp theo:</p><p>✔ Xem lại độ chính xác<br>✔ Tùy chỉnh phong cách<br>✔ Điều chỉnh loại câu hỏi<br>✔ Thêm logic</p><button class="bt" data-a="seen">Tiếp tục tới khảo sát</button></div></div>`;
  return sbar(s, 0, `<button class="g" data-a="nav" data-h="/edit/${s.id}">Xong chỉnh sửa</button><button class="g" data-a="nav" data-h="/s/${s.id}?preview=1">Xem trước</button><button data-a="publish">Đăng khảo sát</button>`) + modal + `<main class="w"><div class="card"><input type="text" data-f="title" value="${esc(s.title)}" aria-label="Tên khảo sát" style="font-size:1.2rem;font-weight:700"></div>
  ${s.questions.map((q, i) => `<div class="card"><div class="row"><b>${i + 1}.</b>
  <select data-f="type" data-q="${q.id}"><option value="single" ${q.type === 'single' ? 'selected' : ''}>Chọn một</option><option value="multi" ${q.type === 'multi' ? 'selected' : ''}>Chọn nhiều</option><option value="text" ${q.type === 'text' ? 'selected' : ''}>Câu trả lời mở</option></select>
  <button class="x" data-a="delq" data-q="${q.id}">Xóa câu</button></div>
  <input type="text" data-f="text" data-q="${q.id}" value="${esc(q.text)}" aria-label="Nội dung câu hỏi">
  ${q.type === 'text' ? '' : `<p class="m">Mỗi dòng là một lựa chọn</p><textarea data-f="options" data-q="${q.id}">${esc(q.options.join('\n'))}</textarea>`}</div>`).join('')}
  <div class="row"><button class="g" data-a="addq">+ Thêm câu hỏi</button></div></main>`;
}
function collect(id) {
  const s = find(id); if (!s) return home();
  const n = s.responses.length, L = link(s.id), url = `<div class="urlr"><span>${esc(L)}</span><button class="g" data-a="copylink">Sao chép URL</button></div>`;
  if (s.status !== 'open') return sbar(s, 1) + `<main class="w"><div class="card"><h2>Khảo sát chưa được đăng</h2><p class="m">Đăng khảo sát để nhận link gửi cho người trả lời.</p><button data-a="publish">Đăng khảo sát</button></div></main>`;
  const ways = [['Mua phản hồi mục tiêu', 'Chọn đối tượng và thu thập phản hồi.'], ['Trang web', 'Nhúng khảo sát vào trang web của bạn.'], ['Chia sẻ liên kết', 'Gửi đường dẫn qua mạng xã hội hoặc tin nhắn.'], ['Gửi tin nhắn văn bản', 'Gửi khảo sát qua SMS. (Doanh nghiệp)'], ['Nhập dữ liệu thủ công', 'Nhập câu trả lời giấy vào hệ thống.']];
  const body = n ? `<div class="rowb"><h1>Người thu thập khảo sát<small>${n} phản hồi</small></h1><div class="row"><button class="g" data-a="demo">Quản lý thông báo</button><button class="gold" data-a="demo">Chọn đối tượng</button><button data-a="demo">Thêm bộ sưu tập mới +</button></div></div>
    <div class="card"><table><tr><th>Tên bộ sưu tập</th><th>Trạng thái</th><th>Phản hồi</th><th>Ngày sửa đổi</th></tr><tr><td><b>Liên kết web 1</b>${url}<small class="m">Được tạo ngày ${dt(s.upd)}</small></td><td><span class="tag">Mở</span></td><td><span class="tag o">${n}</span></td><td>${dt(s.upd)}</td></tr></table></div>`
    : `<div class="ready"><div class="card"><h2>Bạn đã sẵn sàng công bố khảo sát của mình chưa?</h2>${url}<div class="row">${['f', 'in', '𝕏', '💬'].map(x => `<i class="shi">${x}</i>`).join('')}</div></div><div class="card"><h3>Gửi qua Email</h3><p class="m">Thu thập phản hồi qua email, nhắc người chưa trả lời và theo dõi kết quả.</p><button class="g" data-a="demo">Thử qua email</button></div></div>
    <h2 class="h2b">Nhiều cách gửi hơn</h2><div class="g5">${ways.map(([h, p]) => `<div class="card"><b>${h}</b><p class="m">${p}</p></div>`).join('')}</div>`;
  return sbar(s, 1) + `<main class="w wide">${body}</main>`;
}
function connect(id) {
  const s = find(id); if (!s) return home();
  const list = ctab === 'd' ? `<h3>Nổi bật</h3>${APPS.map(([n, d, b]) => `<div class="apr"><i class="aic">${n[0]}</i><div><b>${n}</b><p class="m">${d}</p></div><button class="g" data-a="demo">${b}</button></div>`).join('')}<p class="m">Không thấy ứng dụng bạn cần? <a href="javascript:void(0)" data-a="demo">Yêu cầu thêm</a></p>` : '<div class="card"><p class="m">Bạn chưa kết nối ứng dụng nào.</p></div>';
  return sbar(s, 2) + `<main class="w wide"><h1>Tự động hóa dữ liệu của bạn mà không cần tốn sức.</h1><p class="m">Kết nối MiniSurvey với các công cụ để dữ liệu tự chuyển đến nơi bạn cần.</p>
  <div class="stab"><a class="${ctab === 'd' ? 'on' : ''}" href="javascript:void(0)" data-a="ctab" data-t="d">Khám phá</a><a class="${ctab === 'm' ? 'on' : ''}" href="javascript:void(0)" data-a="ctab" data-t="m">Quản lý</a></div>
  <input type="text" data-flt=".apr" placeholder="Tìm theo tên ứng dụng hoặc công cụ" aria-label="Tìm ứng dụng">${list}</main>`;
}
const sugHtml = () => `<div class="sug" id="sug"><div class="drh">💡 Gợi ý cho gắn kết của nhân viên<button class="x" data-a="sugx" aria-label="Đóng">✕</button></div>${SUGS.map((x, i) => `<button data-a="sug" data-i="${i}">${x}</button>`).join('')}</div>`;
function applyFlt() { const i = document.querySelector('[data-flt]'); if (!i) return; const q = i.value.trim().toLowerCase(), st = document.getElementById('fs')?.value || ''; document.querySelectorAll(i.dataset.flt).forEach(r => { r.hidden = !!((q && !r.textContent.toLowerCase().includes(q)) || (st && r.dataset.st && r.dataset.st !== st)); }); }
function respond(id, preview) {
  const s = find(id);
  if (!s) return `<main class="w"><div class="card"><h2>Không tìm thấy khảo sát</h2><p class="m">Link này chỉ mở được trên trình duyệt đã tạo khảo sát.</p></div></main>`;
  rt0 = Date.now();
  return `<main class="w"><form class="card" id="f"><h1>${esc(s.title)}</h1>${preview ? '<p class="note">Chế độ xem trước: phản hồi sẽ không được lưu.</p>' : ''}
  ${s.questions.map((q, i) => `<fieldset style="border:0;padding:0;margin:1rem 0"><legend><b>${i + 1}. ${esc(q.text)}</b></legend>
  ${q.type === 'text' ? `<textarea name="${q.id}"></textarea>` : q.options.map(o => `<label class="opt"><input type="${q.type === 'single' ? 'radio' : 'checkbox'}" name="${q.id}" value="${esc(o)}"> ${esc(o)}</label>`).join('')}</fieldset>`).join('')}
  <button>Xong</button></form></main>`;
}
const aiTxt = s => { const o = s.questions.filter(q => q.type !== 'text').map(q => { const v = s.responses.map(r => r.a[q.id]).filter(x => x && x.length); if (!v.length) return ''; const b = q.options.map(o => [o, v.filter(x => [].concat(x).includes(o)).length]).sort((a, c) => c[1] - a[1])[0]; return `Câu ${s.questions.indexOf(q) + 1}: “${esc(b[0])}” được chọn nhiều nhất (${Math.round(b[1] / v.length * 100)}%).`; }).filter(Boolean); return o.length ? o : ['Chưa có phản hồi để phân tích.']; };
const drawer = (s, i) => { const r = s.responses[i]; if (!r) return ''; return `<aside class="dr"><div class="drh"><b>Câu trả lời đầy đủ</b><button class="x" data-a="drx" aria-label="Đóng">✕</button></div><div class="drc"><span class="tag">Hoàn thành</span><p class="m">Bộ sưu tập: Liên kết web 1 (Weblink)<br>Bắt đầu: ${dtm(r.t - (r.dur || 0) * 1000)}<br>Lần sửa đổi cuối cùng: ${dtm(r.t)}</p><b>Trang 1</b>${s.questions.map((q, k) => `<p><b>${k + 1}. ${esc(q.text)}</b><br>${esc([].concat(r.a[q.id] || '').join('; ') || '—')}</p>`).join('')}</div></aside>`; };
function qcard(s, q, i) {
  const vals = s.responses.map(r => r.a[q.id]).filter(v => v && v.length), n = vals.length;
  const head = `<div class="qh"><small>Câu ${i + 1} · ${n} phản hồi</small>${q.type === 'text' ? '' : `<select data-ct="${q.id}" aria-label="Kiểu biểu đồ"><option value="h" ${ct[q.id] !== 'v' ? 'selected' : ''}>Thanh ngang</option><option value="v" ${ct[q.id] === 'v' ? 'selected' : ''}>Cột dọc</option></select>`}</div><h3>${esc(q.text)}</h3>`;
  if (q.type === 'text') return `<div class="qc">${head}<div class="stab"><a class="on">PHẢN HỒI (${n})</a><a>ĐÁM MÂY TỪ</a><a>THẺ (0)</a></div><p class="m">Hiển thị ${n} phản hồi</p>${s.responses.map((r, k) => r.a[q.id] ? `<div class="item"><span>${esc(r.a[q.id])}</span><a href="javascript:void(0)" data-a="dr" data-i="${k}">Xem toàn bộ phản hồi</a></div>` : '').join('')}</div>`;
  const rows = q.options.map((o, k) => { const c = vals.filter(v => [].concat(v).includes(o)).length, p = n ? Math.round(c / n * 10000) / 100 : 0, col = PAL[k % PAL.length], tip = `${esc(o)}: ${String(p).replace('.', ',')}% (${c} phản hồi) trong tổng số ${n} câu trả lời`; return [o, p, col, tip]; });
  const chart = ct[q.id] === 'v' ? `<div class="vch">${rows.map(([o, p, col, tip]) => `<div title="${tip}"><i style="height:${p}%;background:${col}"></i><span>${esc(o)}</span><b>${p}%</b></div>`).join('')}</div>`
    : rows.map(([o, p, col, tip]) => `<div class="hr" title="${tip}"><span>${esc(o)}</span><div class="hb"><i style="width:${p}%;background:${col}"></i></div><b>${p}%</b></div>`).join('');
  return `<div class="qc">${head}${chart}</div>`;
}
function results(id, tab = 'sum') {
  const s = find(id); if (!s) return home();
  const n = s.responses.length, tb = (t, l) => `<a class="${tab === t ? 'on' : ''}" href="javascript:void(0)" data-a="tab" data-t="${t}">${l}</a>`;
  const empty = `<div class="empty"><div class="warn">!</div><p>Những hiểu biết bắt đầu từ những câu hỏi. Mở link khảo sát và gửi thử một bài.</p><button data-a="nav" data-h="/publish/${s.id}">Lấy link khảo sát</button></div>`;
  let body;
  if (tab === 'dash') {
    const d = s.dash || [];
    body = `<div class="dash"><div class="rowb"><h2>Bảng điều khiển</h2><button class="g" data-a="newdash">+ Bảng điều khiển mới</button></div><p class="m">Dữ liệu của bạn kể một câu chuyện. Hãy xây dựng bảng điều khiển với các biểu đồ và kết quả, sau đó chia sẻ với người khác.</p><input type="text" data-flt=".dcard" placeholder="Tìm báo cáo" aria-label="Tìm báo cáo">
    ${d.map(x => `<div class="dcard"><div><b>${esc(x.name)}</b><small class="m">Ngày tạo: ${dt(x.t)}</small></div><div class="row"><button class="g" data-a="tab" data-t="sum">Xem trước</button><button class="g" data-a="ren" data-i="${x.id}">Chỉnh sửa</button><button class="x" data-a="deld" data-i="${x.id}">Xóa</button></div></div>`).join('') || '<p class="m">Chưa có bảng điều khiển nào.</p>'}</div>`;
  } else if (!n) body = empty;
  else if (tab === 'ind') {
    const i0 = dr >= 0 ? dr : n - 1;
    body = `<div class="rowb"><span class="m">NGƯỜI TRẢ LỜI: ${n} trên ${n}</span><div class="seg"><a class="${vw === 'tbl' ? 'on' : ''}" href="javascript:void(0)" data-a="vw" data-v="tbl">BẢNG</a><a class="${vw === 'one' ? 'on' : ''}" href="javascript:void(0)" data-a="vw" data-v="one">ĐƠN</a></div></div>` + (vw === 'one' ? `<div class="qc">${drawer(s, i0).replace('class="dr"', 'class="dr inl"')}</div>` :
      `<div class="card"><table><tr><th>#</th><th>Trạng thái</th><th>Lần sửa đổi cuối cùng</th><th>Thời gian đã dành</th><th>Bộ sưu tập</th>${s.questions.map((q, k) => `<th>Câu ${k + 1}</th>`).join('')}<th></th></tr>${s.responses.map((r, k) => `<tr><td>${k + 1}</td><td><span class="tag">Hoàn thành</span></td><td>${dtm(r.t)}</td><td>${mmss(r.dur)}</td><td>Liên kết web 1 (Weblink)</td>${s.questions.map(q => `<td>${esc([].concat(r.a[q.id] || '').join('; '))}</td>`).join('')}<td><a href="javascript:void(0)" data-a="dr" data-i="${k}" aria-label="Xem phản hồi">→</a></td></tr>`).reverse().join('')}</table></div>`);
  } else body = `<span class="m">NGƯỜI TRẢ LỜI: ${n} trên ${n}</span><h3 class="pg1">Trang 1</h3>${s.questions.map((q, i) => qcard(s, q, i)).join('')}`;
  const tools = `<div class="tb"><div><a data-a="demo">⚙ Quy tắc</a><a data-a="demo">👁 Lượt xem</a><a data-a="demo">🔗 Dữ liệu được chia sẻ</a></div><div><a data-a="demo">Tùy chọn</a><a class="${ai ? 'on' : ''}" data-a="ai">✨ Phân tích bằng AI</a><a data-a="multi">Phân tích khảo sát đa dạng</a><a data-a="csv">⤓ Xuất</a><a data-a="demo">Thêm vào</a><button data-a="nav" data-h="/publish/${s.id}">Chia sẻ</button></div></div>`;
  const side = ai ? `<aside class="aip"><div class="drh"><b>Phân tích bằng AI</b><button class="x" data-a="ai" aria-label="Đóng">✕</button></div><div class="bub me">Nhân viên mong muốn những gì để tăng sự hài lòng?</div><div class="bub ai">${aiTxt(s).map(x => `<p>${x}</p>`).join('')}<small class="m">Tóm tắt mô phỏng từ số liệu thật của khảo sát, chưa gọi AI.</small></div></aside>` : '';
  return sbar(s, 3) + `<div class="stab top3">${tb('sum', 'Tóm tắt câu hỏi')}${tb('ind', 'Phản hồi cá nhân')}${tb('dash', 'Bảng điều khiển')}</div>${tools}
  <div class="rs"><aside class="pnl"><div class="drh"><b>Xuất dữ liệu</b><button class="x" data-a="prx" aria-label="Đóng">✕</button></div><p>Dữ liệu tốt cần có cách để xuất ra. Bản demo xuất được CSV.</p><div class="row"><button class="g" data-a="demo">Tìm hiểu thêm</button><button class="gold" data-a="upgrade">Nâng cấp</button></div></aside><main class="rm">${body}</main>${side}${dr >= 0 && !(tab === 'ind' && vw === 'one') ? drawer(s, dr) : ''}</div>`;
}

let tab = 'sum';
function render() {
  document.documentElement.lang = lang();
  const [, r, id] = (location.hash.slice(1).split('?')[0] || '/').split('/');
  const prev = location.hash.includes('preview=1');
  app.innerHTML = !r ? landing() : r === 'home' ? home() : r === 'login' ? login() : r === 'signup' ? authPage('signup') : r === 'consent' ? consent(id) : r === 'onboard' ? onboard(id) : r === 'surveys' ? surveys() : r === 'multi' ? multi() : r === 'oauth' ? oauth(id) : r === 'edit' ? (user() ? editor(id) : login()) :
    r === 'classic' ? (user() ? classic(id) : login()) : r === 'connect' ? (user() ? connect(id) : login()) : r === 'publish' ? (user() ? collect(id) : login()) : r === 'results' ? (user() ? results(id, tab) : login()) : r === 's' ? respond(id, prev) : landing();
}
addEventListener('hashchange', () => { tab = 'sum'; dr = -1; ai = false; render(); });

app.addEventListener('input', e => {
  const t = e.target, f = t.dataset.f;
  if (t.dataset.flt) return applyFlt();
  if (t.id === 'idea') document.getElementById('sug')?.classList.remove('on');
  if (t.id === 'em') { document.getElementById('nx').disabled = !/^\S+@\S+\.\S+$/.test(t.value.trim()); document.getElementById('e').textContent = ''; return; }
  if (!f) return;
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
app.addEventListener('keydown', e => { if (e.key === 'Enter' && e.target.id === 'em') document.getElementById('nx').click(); if (e.key === 'Enter' && e.target.id === 'ci') document.querySelector('[data-a=chat]').click(); });
app.addEventListener('change', e => { if (e.target.dataset.ct) { ct[e.target.dataset.ct] = e.target.value; render(); } if (e.target.id === 'fs') applyFlt(); });
app.addEventListener('focusin', e => { if (e.target.id === 'idea') document.getElementById('sug')?.classList.add('on'); });
app.addEventListener('change', e => {
  if (e.target.id === 'c1') document.getElementById('cn').disabled = !e.target.checked; if (e.target.id === 'lang') { localStorage.setItem(LK, e.target.value); render(); } });
app.addEventListener('submit', e => {
  e.preventDefault();
  const id = location.hash.split('/')[2].split('?')[0];
  if (location.hash.includes('preview=1')) return go('/edit/' + id);
  const fd = new FormData(e.target), a = {};
  find(id).questions.forEach(q => { a[q.id] = q.type === 'multi' ? fd.getAll(q.id) : (fd.get(q.id) || ''); });
  update(id, s => s.responses.push({ t: Date.now(), a, dur: Math.round((Date.now() - rt0) / 1000) }));
  app.innerHTML = `<main class="w"><div class="card"><h2>Cảm ơn bạn đã trả lời</h2><p class="m">Phản hồi của bạn đã được ghi nhận.</p></div></main>`;
});
app.addEventListener('click', e => {
  const b = e.target.closest('[data-a]'); if (!b) return;
  const a = b.dataset.a, id = location.hash.split('/')[2]?.split('?')[0];
  if (a === 'home') go('/home');
  if (a === 'copylink') { navigator.clipboard?.writeText(link(b.dataset.id || id)); b.textContent = 'Đã sao chép'; }
  if (a === 'seen') { update(id, s => s.seen = 1); render(); }
  if (a === 'addq2') { update(id, s => s.questions.push({ id: uid(), type: 'single', text: 'Câu hỏi mới', options: ['Lựa chọn A', 'Lựa chọn B'] })); render(); }
  if (a === 'chat') {
    const v = document.getElementById('ci').value.trim(); if (!v) return;
    update(id, s => { s.chat = s.chat || [{ r: 'ai', t: INTRO }]; s.chat.push({ r: 'me', t: v }); const m = v.match(/^(?:thêm|add)(?: câu hỏi| question)?[:\s]+(.+)/i);
      if (m) { s.questions.push({ id: uid(), type: 'single', text: m[1], options: ['Lựa chọn A', 'Lựa chọn B'] }); s.chat.push({ r: 'ai', t: 'Đã thêm câu hỏi “' + m[1] + '”. Chỉnh lựa chọn trong Trình soạn thảo cổ điển.' }); }
      else if (/đăng|publish/i.test(v)) { s.status = 'open'; s.chat.push({ r: 'ai', t: 'Khảo sát đã được đăng. Mở bước “Đăng khảo sát” để lấy link.' }); }
      else s.chat.push({ r: 'ai', t: 'Bản demo chưa gọi AI thật. Hãy gõ “Thêm câu hỏi: …” hoặc “Đăng khảo sát”.' }); });
    render(); document.querySelector('.cmsg')?.scrollTo(0, 1e6);
  }
  if (a === 'demo') alert('Bản demo: tính năng này chỉ để minh họa, chưa hoạt động.');
  if (a === 'ctab') { ctab = b.dataset.t; render(); }
  if (a === 'ai') { ai = !ai; render(); }
  if (a === 'vw') { vw = b.dataset.v; render(); }
  if (a === 'dr') { dr = +b.dataset.i; render(); }
  if (a === 'drx') { dr = -1; render(); }
  if (a === 'prx') b.closest('.pnl').remove();
  if (a === 'sug') { document.getElementById('idea').value = SUGS[+b.dataset.i]; document.getElementById('sug').classList.remove('on'); }
  if (a === 'sugx') document.getElementById('sug').classList.remove('on');
  if (a === 'newdash') { update(id, s => (s.dash = s.dash || []).push({ id: uid(), name: 'Bảng điều khiển ' + s.title, t: Date.now() })); render(); }
  if (a === 'ren') { const n = prompt('Tên bảng điều khiển'); if (n && n.trim()) { update(id, s => { const d = s.dash.find(x => x.id === b.dataset.i); if (d) d.name = n.trim(); }); render(); } }
  if (a === 'deld') { update(id, s => s.dash = s.dash.filter(x => x.id !== b.dataset.i)); render(); }
  if (a === 'loginpage') go('/login');
  if (a === 'nav') go(b.dataset.h);
  if (a === 'logout') { ['ms_user', 'ms_pic', 'ms_email'].forEach(k => localStorage.removeItem(k)); go('/'); render(); }
  if (a === 'tpl') add(make(b.dataset.k));
  if (a === 'idea') {
    const v = document.getElementById('idea').value.trim(), l = v.toLowerCase();
    const ns = make(/nhân viên|employee|công ty/.test(l) ? 'nv' : /khách|customer|dịch vụ/.test(l) ? 'kh' : 'trong', v ? ('Khảo sát: ' + v).slice(0, 60) : '', v); gen = ns.id; add(ns);
  }
  if (a === 'del' && confirm('Xóa khảo sát này?')) { const d = load(); d.surveys = d.surveys.filter(s => s.id !== b.dataset.id); save(d); render(); }
  if (a === 'addq') { update(id, s => s.questions.push({ id: uid(), type: 'single', text: 'Câu hỏi mới', options: ['Lựa chọn A', 'Lựa chọn B'] })); render(); }
  if (a === 'delq') { update(id, s => s.questions = s.questions.filter(q => q.id !== b.dataset.q)); render(); }
  if (a === 'publish') { update(id, s => s.status = 'open'); go('/publish/' + id); }
  if (a === 'copy') { const i = document.getElementById('lk'); i.select(); navigator.clipboard?.writeText(i.value); b.textContent = 'Đã sao chép'; }
  if (a === 'uc') { const y = scrollY; uc = +b.dataset.i; render(); scrollTo(0, y); }
  if (a === 'begin') go(user() ? '/home' : '/signup');
  if (a === 'ucgo') { uc = +b.dataset.i; render(); document.getElementById('uc')?.scrollIntoView({ behavior: 'smooth' }); }
  if (a === 'landing') go('/');
  if (a === 'signuppage') go('/signup');
  if (a === 'next') {
    const v = document.getElementById('em').value.trim();
    if (!/^\S+@\S+\.\S+$/.test(v)) return document.getElementById('e').textContent = L[lang()].emailBad;
    localStorage.setItem('ms_user', v); go(b.dataset.m === 'signup' ? '/onboard/1' : '/home'); render();
  }
  if (a === 'social') {
    const real = b.dataset.k === 'google' && GOOGLE_CLIENT_ID;
    if (real && b.dataset.m === 'signup') go('/consent/google');
    else if (real) googleSignIn(() => { go('/home'); render(); });
    else go('/oauth/' + b.dataset.k + '-' + b.dataset.m);
  }
  if (a === 'consent') { if (b.dataset.k === 'google' && GOOGLE_CLIENT_ID) googleSignIn(() => { go('/onboard/1'); render(); }); else go('/onboard/1'); }
  if (a === 'pick') { localStorage.setItem('ms_purpose', b.dataset.p); go('/onboard/2'); }
  if (a === 'back') go('/onboard/1');
  if (a === 'explore') go('/home');
  if (a === 'build') add(make('trong'));
  if (a === 'surveys') go('/surveys');
  if (a === 'multi') go('/multi');
  if (a === 'upgrade') alert(L[lang()].upgNote);
  if (a === 'focus') document.getElementById('idea')?.focus();
  if (a === 'mode') { sm = b.dataset.m; render(); }
  if (a === 'folder') { const n = prompt(L[lang()].folderQ); if (n && n.trim()) { localStorage.setItem('ms_folders', JSON.stringify([...folders(), n.trim()])); render(); } }
  if (a === 'other') { const o = document.getElementById('oth'); o.hidden = !o.hidden; if (!o.hidden) document.getElementById('oe').focus(); }
  if (a === 'pickacct' || a === 'otherGo') {
    let name = b.dataset.n;
    if (a === 'otherGo') { const v = document.getElementById('oe').value.trim(); if (!/^\S+@\S+\.\S+$/.test(v)) return document.getElementById('e').textContent = L[lang()].emailBad; name = v; }
    localStorage.removeItem('ms_pic'); localStorage.removeItem('ms_email'); localStorage.setItem('ms_user', name); go(b.dataset.m === 'signup' ? '/consent/' + b.dataset.k : '/home'); render();
  }
  if (a === 'sc') document.getElementById(b.dataset.t)?.scrollIntoView({ behavior: 'smooth' });
  if (a === 'tab') { tab = b.dataset.t; dr = -1; render(); }
  if (a === 'csv') {
    const s = find(id), q = x => '"' + String(x).replace(/"/g, '""') + '"';
    const rows = [['Thời gian', ...s.questions.map(x => x.text)].map(q).join(',')].concat(s.responses.map(r => [new Date(r.t).toISOString(), ...s.questions.map(x => [].concat(r.a[x.id] || '').join('; '))].map(q).join(',')));
    const u = URL.createObjectURL(new Blob(['\ufeff' + rows.join('\n')], { type: 'text/csv' }));
    Object.assign(document.createElement('a'), { href: u, download: s.title + '.csv' }).click();
  }
});
loadGsi();
render();
