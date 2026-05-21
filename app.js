// ── Config ──
// Set this to your deployed proxy server URL, or 'http://localhost:3001' for local dev
const PROXY_URL = window.PROXY_URL || 'https://everise-humana-poc.onrender.com';
// ── Module Data ──
const MODULES = {
 'medical-basic': {
   label: 'Medical Basic Benefits',
   lessons: [
     { id: 'mb1', name: 'Coverage Essentials' },
     { id: 'mb2', name: 'Plan Design Basics' },
     { id: 'mb3', name: 'Cost Sharing: Deductibles' },
     { id: 'mb4', name: 'Copay & Coinsurance' },
     { id: 'mb5', name: 'Out-of-Pocket Maximum' },
     { id: 'mb6', name: 'In-Network vs Out-of-Network' },
     { id: 'mb7', name: 'Preventive Care Coverage' },
     { id: 'mb8', name: 'Handling Benefit Calls' },
   ],
   systemContext: `You are a training assistant for Humana Tier 1 Advocates covering the "Medical Basic Benefits" module.
Topics: basic coverage rules, types of covered services, cost-sharing (deductible, copay, coinsurance, out-of-pocket maximum), in-network vs out-of-network, preventive care, handling member benefit calls.
Key call driver: ~80% of tier-1 calls are about "is this covered?", "how much will I pay?", and "where can I go?" — make these scenarios feel real.`
 },
 'medical-additional': {
   label: 'Medical Additional Benefits',
   lessons: [
     { id: 'ma1', name: 'Therapy & Rehabilitation' },
     { id: 'ma2', name: 'Durable Medical Equipment (DME)' },
     { id: 'ma3', name: 'Specialist Referrals' },
     { id: 'ma4', name: 'Emergency vs Urgent Care' },
     { id: 'ma5', name: 'Skilled Nursing Facility' },
     { id: 'ma6', name: 'Vision, Dental & Hearing' },
     { id: 'ma7', name: 'Weight Management & HRA' },
     { id: 'ma8', name: 'Coordination of Benefits (COB)' },
   ],
   systemContext: `You are a training assistant for Humana Tier 1 Advocates covering the "Medical Additional Benefits" module.
Topics: therapy and rehabilitation (physical, occupational, speech), durable medical equipment (DME) like wheelchairs and scooters, specialist referrals, emergency room vs urgent care, skilled nursing facilities, vision/dental/hearing coverage, weight management, Health Risk Assessments (HRA), and Coordination of Benefits when members have multiple insurance plans.
Use real-sounding call scenarios since advocates encounter DME and specialist calls frequently.`
 },
 'auth-appeals': {
   label: 'Authorisations & Appeals',
   lessons: [
     { id: 'aa1', name: 'What is Prior Authorisation?' },
     { id: 'aa2', name: 'Services Requiring Auth' },
     { id: 'aa3', name: 'The Auth Excel Reference File' },
     { id: 'aa4', name: 'Working with Multiple Tools' },
     { id: 'aa5', name: 'Appeals Process Overview' },
     { id: 'aa6', name: 'Grievances vs Appeals' },
     { id: 'aa7', name: 'Timelines & Member Rights' },
     { id: 'aa8', name: 'Scenario-Based Practice' },
   ],
   systemContext: `You are a training assistant for Humana Tier 1 Advocates covering the "Authorisations & Appeals" module.
Topics: prior authorisation (what it is, why it's needed, how to verify), DME authorisation using the Excel reference file + provider search + DaVita/system tools, the appeals process (disputes of original coverage decisions), the difference between grievances and appeals, member rights and timelines.
This is a complex module — advocates often struggle because they must coordinate multiple tools in one call (benefits system, provider search, auth file). Make scenarios that reflect this complexity.`
 }
};
// ── State ──
let state = {
 currentModule: 'medical-basic',
 difficulty: 'beginner', // tracked internally, never shown to learner
 mode: 'chat', // 'chat' | 'quiz' | 'scenario'
 conversationHistory: [],
 lessonProgress: {}, // lessonId -> 'complete' | 'in-progress' | undefined
 moduleProgress: { 'medical-basic': 0, 'medical-additional': 0, 'auth-appeals': 0 },
 isLoading: false,
 quizActive: false,
 correctAnswers: 0,
 totalAnswers: 0,
};
// ── Init ──
document.addEventListener('DOMContentLoaded', () => {
 renderLessons();
 renderWelcome();
 updateProgressBars();
});
// ── Module Switch ──
function switchModule(moduleId) {
 state.currentModule = moduleId;
 state.conversationHistory = [];
 // Update nav active state
 document.querySelectorAll('.module-item').forEach(el => {
   el.classList.toggle('active', el.dataset.module === moduleId);
 });
 // Update topbar label
 document.getElementById('current-module-label').textContent = MODULES[moduleId].label;
 document.getElementById('mpd-title').textContent = MODULES[moduleId].label;
 // Render lessons for this module
 renderLessons();
 // Clear messages and show welcome
 document.getElementById('messages').innerHTML = '';
 renderWelcome();
 updateChips();
}
// ── Mode ──
function setMode(mode) {
 state.mode = mode;
 document.querySelectorAll('.mode-btn').forEach(btn => {
btn.id === `mode-${mode}` ? btn.classList.add('active') : btn.classList.remove('active');
 });
 if (mode === 'quiz') {
   triggerQuiz();
 } else if (mode === 'scenario') {
   triggerScenario();
 }
}
// ── Render Helpers ──
function renderLessons() {
 const module = MODULES[state.currentModule];
 const list = document.getElementById('lessons-list');
 list.innerHTML = '';
 module.lessons.forEach(lesson => {
   const status = state.lessonProgress[lesson.id] || '';
   const row = document.createElement('div');
   row.className = 'lesson-row';
   row.onclick = () => askAboutLesson(lesson.name);
   row.innerHTML = `
<div class="lesson-check ${status}"></div>
<span class="lesson-name">${lesson.name}</span>
   `;
   list.appendChild(row);
 });
}
function renderWelcome() {
 const msgs = document.getElementById('messages');
 const module = MODULES[state.currentModule];
 msgs.innerHTML = `
<div class="welcome-msg">
<div class="welcome-icon">
<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="1.8"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
</div>
<h2>Hi Jordan 👋</h2>
<p>You're on <strong>${module.label}</strong>. I can explain concepts, test your knowledge with quizzes, or run realistic member call scenarios. Pick a difficulty level and let's go.</p>
</div>
 `;
 updateChips();
}
function updateChips() {
 const m = state.currentModule;
 const chipSets = {
   'medical-basic': ['What is a deductible?', 'Explain copay vs coinsurance', 'What is the out-of-pocket max?', 'Quiz me on cost sharing'],
   'medical-additional': ['What is DME?', 'When is a referral needed?', 'Explain therapy coverage', 'Give me a real call scenario'],
   'auth-appeals': ['What is prior authorisation?', 'When is auth required?', 'Explain the appeals process', 'Run a scenario with DME auth'],
 };
 const wrap = document.getElementById('chips-wrap');
 wrap.innerHTML = (chipSets[m] || []).map(c =>
   `<button class="chip" onclick="sendChip(this)">${c}</button>`
 ).join('');
}
// ── Update Progress ──
function updateProgressBars() {
 let total = 0, done = 0;
 Object.keys(MODULES).forEach(modId => {
   const lessons = MODULES[modId].lessons;
   lessons.forEach(l => {
     total++;
     if (state.lessonProgress[l.id] === 'complete') done++;
   });
   const pct = Math.round((lessons.filter(l => state.lessonProgress[l.id] === 'complete').length / lessons.length) * 100);
   state.moduleProgress[modId] = pct;
   const badge = document.getElementById(`badge-${modId}`);
   if (badge) badge.textContent = pct + '%';
 });
 const overall = Math.round((done / total) * 100);
 document.getElementById('overall-bar').style.width = overall + '%';
 document.getElementById('overall-pct').textContent = overall + '%';
}
function markLessonProgress(lessonName, status) {
 const module = MODULES[state.currentModule];
 const lesson = module.lessons.find(l => l.name.toLowerCase().includes(lessonName.toLowerCase()));
 if (lesson) {
   state.lessonProgress[lesson.id] = status;
   renderLessons();
   updateProgressBars();
 }
}
// ── Send Message ──
async function sendMessage() {
 const input = document.getElementById('user-input');
 const text = input.value.trim();
 if (!text || state.isLoading) return;
 input.value = '';
 autoResize(input);
 document.getElementById('chips-wrap').style.display = 'none';
 appendMessage('user', text);
 state.conversationHistory.push({ role: 'user', content: text });
 await fetchAI();
}
function sendChip(btn) {
 document.getElementById('user-input').value = btn.textContent;
 sendMessage();
}
function handleKey(e) {
 if (e.key === 'Enter' && !e.shiftKey) {
   e.preventDefault();
   sendMessage();
 }
}
function autoResize(el) {
 el.style.height = 'auto';
 el.style.height = Math.min(el.scrollHeight, 120) + 'px';
}
// ── AI Fetch ──
async function fetchAI() {
 state.isLoading = true;
 document.getElementById('send-btn').disabled = true;
 document.getElementById('typing-indicator').classList.remove('hidden');
 const systemPrompt = buildSystemPrompt();
 try {
   const res = await fetch(`https://humana-proxy.onrender.com/api/chat`, {
     method: 'POST',
     headers: { 'Content-Type': 'application/json' },
     body: JSON.stringify({
      model: 'claude-sonnet-4-5',
      system: systemPrompt,
      messages: state.conversationHistory,
      max_tokens: 1000,
     }),
   });
   if (!res.ok) throw new Error(`Server error: ${res.status}`);
   const data = await res.json();
   const aiText = data.content?.find(b => b.type === 'text')?.text || '(no response)';
   state.conversationHistory.push({ role: 'assistant', content: aiText });
   document.getElementById('typing-indicator').classList.add('hidden');
   // Check if it's a quiz/scenario response
   if (aiText.includes('QUIZ_START')) {
     renderQuizFromText(aiText);
   } else {
     appendMessage('ai', aiText);
     autoMarkProgress(aiText);
   }
   document.getElementById('chips-wrap').style.display = 'flex';
 } catch (err) {
   document.getElementById('typing-indicator').classList.add('hidden');
   appendMessage('ai', `⚠️ Could not connect to the proxy server. Make sure it's running at \`${PROXY_URL}\`.\n\nError: ${err.message}`);
   document.getElementById('chips-wrap').style.display = 'flex';
 } finally {
   state.isLoading = false;
   document.getElementById('send-btn').disabled = false;
 }
}
// ── Auto-adapt difficulty based on quiz performance ──
function getAdaptiveDifficulty() {
 if (state.totalAnswers < 2) return 'beginner';
 const score = state.correctAnswers / state.totalAnswers;
 if (score >= 0.8) return 'advanced';
 if (score >= 0.5) return 'intermediate';
 return 'beginner';
}
// ── System Prompt Builder ──
function buildSystemPrompt() {
 const mod = MODULES[state.currentModule];
 const level = getAdaptiveDifficulty();
 const diffGuide = {
   beginner: 'Use very simple language, analogies and real-world examples. Avoid jargon. Define every technical term. Be warm and encouraging.',
   intermediate: 'Use standard healthcare terminology with brief explanations. Reference how things work in the real call centre context.',
   advanced: 'Use full healthcare/insurance terminology. Challenge with edge cases, ambiguous scenarios, and complex multi-tool workflows.',
 };
 const modeGuide = {
   chat: `Answer questions conversationally. Be concise but thorough. After explaining a concept, offer to quiz the learner or give a real call scenario.
When you explain a lesson topic fully, note it naturally.`,
   quiz: `Generate a quiz question in this EXACT format wrapped in QUIZ_START and QUIZ_END markers:
QUIZ_START
Q: [question text]
A: [option A]
B: [option B]
C: [option C]
D: [option D]
CORRECT: [A/B/C/D]
EXPLANATION: [brief explanation of why the answer is correct]
QUIZ_END
Only output the quiz block, nothing else.`,
   scenario: `Create a realistic member call scenario. Format:
**SCENARIO: [title]**
*Context:* [member situation]
[dialogue or situation description]
Ask the learner to respond or decide what to do next. Be interactive.`,
 };
 return `${mod.systemContext}
DIFFICULTY: ${level}
Instruction: ${diffGuide[level]}
MODE: ${state.mode}
${modeGuide[state.mode]}
Always be encouraging and supportive. If the learner seems confused, offer a simpler analogy. Keep responses focused and practical for real call handling.`;
}
// ── Append Message ──
function appendMessage(role, text) {
 const msgs = document.getElementById('messages');
 // Remove welcome if present
 const welcome = msgs.querySelector('.welcome-msg');
 if (welcome) welcome.remove();
 const div = document.createElement('div');
 div.className = `message ${role}`;
 const avatarLabel = role === 'ai' ? 'AI' : 'JC';
 const avatarClass = role === 'ai' ? 'ai' : 'user-av';
 div.innerHTML = `
<div class="msg-avatar ${avatarClass}">${avatarLabel}</div>
<div class="msg-content">
<div class="msg-bubble">${formatMessage(text)}</div>
</div>
 `;
 msgs.appendChild(div);
 msgs.scrollTop = msgs.scrollHeight;
}
function formatMessage(text) {
 // Convert markdown-ish formatting to HTML
 return text
   .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
   .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
   .replace(/\*(.+?)\*/g, '<em>$1</em>')
   .replace(/`([^`]+)`/g, '<code>$1</code>')
   .replace(/\n\n/g, '</p><p>')
   .replace(/\n/g, '<br>')
   .replace(/^/, '<p>').replace(/$/, '</p>')
   .replace(/<p><\/p>/g, '');
}
// ── Quiz Rendering ──
function renderQuizFromText(text) {
 const match = text.match(/QUIZ_START([\s\S]*?)QUIZ_END/);
 if (!match) { appendMessage('ai', text); return; }
 const body = match[1].trim();
 const lines = body.split('\n').map(l => l.trim()).filter(Boolean);
 let question = '', options = {}, correct = '', explanation = '';
 lines.forEach(line => {
   if (line.startsWith('Q:')) question = line.slice(2).trim();
   else if (line.startsWith('A:')) options.A = line.slice(2).trim();
   else if (line.startsWith('B:')) options.B = line.slice(2).trim();
   else if (line.startsWith('C:')) options.C = line.slice(2).trim();
   else if (line.startsWith('D:')) options.D = line.slice(2).trim();
   else if (line.startsWith('CORRECT:')) correct = line.slice(8).trim();
   else if (line.startsWith('EXPLANATION:')) explanation = line.slice(12).trim();
 });
 const msgs = document.getElementById('messages');
 const welcome = msgs.querySelector('.welcome-msg');
 if (welcome) welcome.remove();
 const cardId = 'quiz-' + Date.now();
 const card = document.createElement('div');
 card.className = 'message ai';
 card.innerHTML = `
<div class="msg-avatar ai">AI</div>
<div class="msg-content">
<div class="quiz-card" id="${cardId}">
<div class="quiz-card-header quiz-h">
<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
         Knowledge Check
</div>
<div class="quiz-card-body">
<div class="quiz-question">${question}</div>
<div class="quiz-options">
           ${Object.entries(options).map(([k, v]) => `
<button class="quiz-option" data-key="${k}" onclick="handleQuizAnswer(this, '${correct}', '${cardId}', \`${explanation.replace(/`/g, "'")}\`)">
<strong>${k}.</strong> ${v}
</button>`).join('')}
</div>
<div class="quiz-feedback" id="fb-${cardId}" style="display:none;"></div>
</div>
</div>
</div>
 `;
 msgs.appendChild(card);
 msgs.scrollTop = msgs.scrollHeight;
}
function handleQuizAnswer(btn, correct, cardId, explanation) {
 const card = document.getElementById(cardId);
 const allBtns = card.querySelectorAll('.quiz-option');
 allBtns.forEach(b => { b.disabled = true; });
 const chosen = btn.dataset.key;
 const isCorrect = chosen === correct;
 state.totalAnswers++;
 if (isCorrect) state.correctAnswers++;
 btn.classList.add(isCorrect ? 'correct' : 'wrong');
 if (!isCorrect) {
   card.querySelector(`[data-key="${correct}"]`).classList.add('correct');
 }
 const fb = document.getElementById(`fb-${cardId}`);
 fb.style.display = 'block';
 fb.className = `quiz-feedback ${isCorrect ? 'correct-fb' : 'wrong-fb'}`;
 fb.innerHTML = isCorrect
   ? `✓ Correct! ${explanation}`
   : `✗ Not quite. ${explanation}`;
 // Track progress
 if (isCorrect) {
   const mod = MODULES[state.currentModule];
   const incomplete = mod.lessons.find(l => !state.lessonProgress[l.id] || state.lessonProgress[l.id] === 'in-progress');
   if (incomplete) {
     state.lessonProgress[incomplete.id] = 'complete';
     renderLessons();
     updateProgressBars();
   }
 }
 // Auto continue in quiz mode after delay
 if (state.mode === 'quiz') {
   setTimeout(() => {
     state.conversationHistory.push({ role: 'assistant', content: `[Quiz question answered ${isCorrect ? 'correctly' : 'incorrectly'}]` });
     state.conversationHistory.push({ role: 'user', content: 'Next question please.' });
     fetchAI();
   }, 2200);
 }
}
// ── Trigger Quiz/Scenario ──
function triggerQuiz() {
 const mod = MODULES[state.currentModule];
 state.conversationHistory.push({ role: 'user', content: `Quiz me on ${mod.label}. Generate a multiple-choice question.` });
 fetchAI();
}
function triggerScenario() {
 const mod = MODULES[state.currentModule];
 state.conversationHistory.push({ role: 'user', content: `Give me a realistic member call scenario for ${mod.label}.` });
 fetchAI();
}
function askAboutLesson(lessonName) {
 state.mode = 'chat';
 document.querySelectorAll('.mode-btn').forEach(b => b.classList.toggle('active', b.id === 'mode-chat'));
 const input = document.getElementById('user-input');
 input.value = `Teach me about: ${lessonName}`;
 // Mark as in-progress
 const lesson = MODULES[state.currentModule].lessons.find(l => l.name === lessonName);
 if (lesson && !state.lessonProgress[lesson.id]) {
   state.lessonProgress[lesson.id] = 'in-progress';
   renderLessons();
   updateProgressBars();
 }
 sendMessage();
}
// ── Auto-mark progress based on AI conversation ──
function autoMarkProgress(aiText) {
 const lower = aiText.toLowerCase();
 const mod = MODULES[state.currentModule];
 mod.lessons.forEach(lesson => {
   const keywords = lesson.name.toLowerCase().split(' ');
   const matches = keywords.filter(w => w.length > 3 && lower.includes(w));
   if (matches.length >= 2 && state.lessonProgress[lesson.id] !== 'complete') {
     if (!state.lessonProgress[lesson.id]) {
       state.lessonProgress[lesson.id] = 'in-progress';
       renderLessons();
       updateProgressBars();
     }
   }
 });
}
