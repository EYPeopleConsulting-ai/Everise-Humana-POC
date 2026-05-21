// ── Config ──
const PROXY_URL = window.PROXY_URL || 'http://localhost:3001';
// ── Module Data ──
const MODULES = {
'medical-basic': {
  label: 'Medical Basic Benefits',
  lessons: [
    { id: 'mb1', name: 'Coverage Essentials' },
    { id: 'mb2', name: 'Tools and Resources (DaVita/Debut)' },
    { id: 'mb3', name: 'Basic Plan Benefits' },
    { id: 'mb4', name: 'Cost Sharing: Deductible, Copay, Coinsurance' },
    { id: 'mb5', name: 'Out-of-Pocket Maximum' },
    { id: 'mb6', name: 'Preventive vs Diagnostic Services' },
    { id: 'mb7', name: 'Therapy and Rehabilitation Services' },
    { id: 'mb8', name: 'Completing a Health Risk Assessment (HRA)' },
  ],
  systemContext: `You are an AI training assistant helping Humana Tier 1 Advocate Jordan Craft learn the Medical Basic Benefits module.`
},
'medical-additional': {
  label: 'Medical Additional Benefits',
  lessons: [
    { id: 'ma1', name: 'Additional Benefits Options Overview' },
    { id: 'ma2', name: 'Durable Medical Equipment (DME)' },
    { id: 'ma3', name: 'Prosthetic & Orthotic Devices' },
    { id: 'ma4', name: 'Part B Medications' },
    { id: 'ma5', name: 'Nurse Advice Line & EVA Bot Calls' },
    { id: 'ma6', name: 'Preventive Services & Screenings' },
    { id: 'ma7', name: 'Coordination of Benefits (COB)' },
    { id: 'ma8', name: 'Smart Summary Statements' },
  ],
  systemContext: `You are an AI training assistant helping Humana Tier 1 Advocate Jordan Craft learn the Medical Additional Benefits module.`
},
'auth-appeals': {
  label: 'Authorisations & Appeals',
  lessons: [
    { id: 'aa1', name: 'Preapprovals & Prior Authorisation Basics' },
    { id: 'aa2', name: 'Authorisation Requirements by Service' },
    { id: 'aa3', name: 'Checking Auth Status in the System' },
    { id: 'aa4', name: 'Using Multiple Tools for Auth Calls' },
    { id: 'aa5', name: 'Medical Appeals Overview' },
    { id: 'aa6', name: 'Grievances vs Appeals' },
    { id: 'aa7', name: 'Timelines & Member Rights' },
    { id: 'aa8', name: 'Complex Call Scenarios' },
  ],
  systemContext: `You are an AI training assistant helping Humana Tier 1 Advocate Jordan Craft learn the Authorisations and Appeals module.`
}
};
// ── State ──
let state = {
currentModule: 'medical-basic',
currentLessonIndex: 0,
lessonPhase: 'teaching',
conversationHistory: [],
lessonProgress: {},
moduleProgress: {
  'medical-basic': 0,
  'medical-additional': 0,
  'auth-appeals': 0,
},
isLoading: false,
correctAnswers: 0,
totalAnswers: 0,
};
// ── Init ──
document.addEventListener('DOMContentLoaded', () => {
renderLessons();
updateProgressBars();
showWelcomeScreen();
});
function currentLesson() {
return MODULES[state.currentModule].lessons[state.currentLessonIndex];
}
// ── Welcome Screen ──
function showWelcomeScreen() {
const lesson = currentLesson();
const mod = MODULES[state.currentModule];
const msgs = document.getElementById('messages');
msgs.innerHTML = `
<div class="welcome-screen">
<div class="welcome-copy">
<h1>Welcome back, Jordan.</h1>
<p>
        Ready to continue your Humana Tier 1 Advocate training?
</p>
<br>
<div class="session-preview">
<div>
<strong>Today's Module</strong>
</div>
<div>
          ${mod.label}
</div>
<br>
<div>
<strong>Next Lesson</strong>
</div>
<div>
          Lesson ${state.currentLessonIndex + 1}: ${lesson.name}
</div>
</div>
<br>
<button onclick="beginLearningSession()">
        Begin Session
</button>
</div>
</div>
`;
document.getElementById('chips-wrap').innerHTML = '';
}
// ── Begin Session ──
function beginLearningSession() {
const lesson = currentLesson();
const mod = MODULES[state.currentModule];
const msgs = document.getElementById('messages');
msgs.innerHTML = `
<div class="session-transition">
<div>
<strong>${mod.label}</strong>
</div>
<br>
<h2>
      Lesson ${state.currentLessonIndex + 1}: ${lesson.name}
</h2>
<p>
      In this lesson, you’ll learn how to confidently handle real member calls related to ${lesson.name.toLowerCase()}.
</p>
<br>
<button onclick="startLesson()">
      Start Lesson
</button>
</div>
`;
document.getElementById('chips-wrap').innerHTML = '';
}
// ── Module Switch ──
function switchModule(moduleId) {
state.currentModule = moduleId;
state.currentLessonIndex = 0;
state.lessonPhase = 'teaching';
state.conversationHistory = [];
document.querySelectorAll('.module-item').forEach(el => {
  el.classList.toggle('active', el.dataset.module === moduleId);
});
document.getElementById('current-module-label').textContent =
  MODULES[moduleId].label;
document.getElementById('mpd-title').textContent =
  MODULES[moduleId].label;
renderLessons();
updateProgressBars();
document.getElementById('messages').innerHTML = '';
showWelcomeScreen();
}
// ── Mode Buttons ──
function setMode(mode) {
document.querySelectorAll('.mode-btn').forEach(btn => {
  btn.classList.toggle('active', btn.id === 'mode-' + mode);
});
if (mode === 'quiz') triggerQuiz();
else if (mode === 'scenario') triggerScenario();
}
// ── Start Lesson ──
function startLesson() {
const lesson = currentLesson();
const mod = MODULES[state.currentModule];
state.lessonProgress[lesson.id] = 'in-progress';
state.lessonPhase = 'teaching';
renderLessons();
updateProgressBars();
showLessonBanner(
  lesson.name,
  state.currentLessonIndex + 1,
  mod.lessons.length
);
document.getElementById('chips-wrap').innerHTML = '';
const prompt =
  'Teach Lesson "' + lesson.name + '" to Jordan Craft.\n\n' +
  'IMPORTANT INSTRUCTIONS:\n' +
  '- Do NOT teach the entire curriculum at once\n' +
  '- Teach only the FIRST key concept right now\n' +
  '- Keep the response under 250 words\n' +
  '- Use a conversational trainer tone\n' +
  '- Use one realistic member call example\n' +
  '- End naturally without summarising the whole lesson\n' +
  '- Do NOT say "here is everything we will cover"\n' +
  '- Do NOT overwhelm the learner\n\n' +
  'This is live advocate training for a call centre environment.';
state.conversationHistory = [];
state.conversationHistory.push({
  role: 'user',
  content: prompt
});
fetchAI();
}
// ── Lesson Banner ──
function showLessonBanner(lessonName, current, total) {
const msgs = document.getElementById('messages');
msgs.innerHTML = '';
const banner = document.createElement('div');
banner.className = 'lesson-banner';
banner.innerHTML =
  '<div class="lesson-banner-inner">' +
  '<span class="lesson-counter">Lesson ' + current + ' of ' + total + '</span>' +
  '<span class="lesson-banner-title">' + lessonName + '</span>' +
  '</div>';
msgs.appendChild(banner);
}
// ── Quiz ──
function triggerQuiz() {
state.lessonPhase = 'quiz';
const lesson = currentLesson();
const prompt =
  'Now generate a knowledge check question about "' +
  lesson.name +
  '" in EXACTLY this format:\n' +
  'QUIZ_START\n' +
  'Q: [question]\n' +
  'A: [option]\n' +
  'B: [option]\n' +
  'C: [option]\n' +
  'D: [option]\n' +
  'CORRECT: [letter]\n' +
  'EXPLANATION: [explanation]\n' +
  'QUIZ_END';
state.conversationHistory.push({
  role: 'user',
  content: prompt
});
fetchAI();
}
// ── Scenario ──
function triggerScenario() {
state.lessonPhase = 'scenario';
const lesson = currentLesson();
const prompt =
  'Create a realistic Humana member call scenario that tests knowledge of "' +
  lesson.name +
  '".\n\n' +
  'Format:\n' +
  '**SCENARIO: [title]**\n' +
  '*Member says:* "[opening question]"\n\n' +
  'Then ask Jordan:\n' +
  '"How would you handle this call? What do you need to verify and what would you tell the member?"';
state.conversationHistory.push({
  role: 'user',
  content: prompt
});
fetchAI();
document.querySelectorAll('.mode-btn').forEach(b =>
  b.classList.toggle('active', b.id === 'mode-scenario')
);
}
// ── Next Lesson ──
function nextLesson() {
const mod = MODULES[state.currentModule];
const lesson = currentLesson();
state.lessonProgress[lesson.id] = 'complete';
renderLessons();
updateProgressBars();
if (state.currentLessonIndex < mod.lessons.length - 1) {
  state.currentLessonIndex++;
  state.conversationHistory = [];
  showWelcomeScreen();
} else {
  showModuleComplete();
}
}
// ── Module Complete ──
function showModuleComplete() {
const mod = MODULES[state.currentModule];
document.getElementById('messages').innerHTML =
  '<div class="welcome-msg">' +
  '<h2>Module Complete!</h2>' +
  '<p>' +
  'Great work, Jordan. You have completed <strong>' +
  mod.label +
  '</strong>. Select the next module from the left panel to continue.' +
  '</p>' +
  '</div>';
document.getElementById('chips-wrap').innerHTML = '';
}
// ── Render Lessons ──
function renderLessons() {
const module = MODULES[state.currentModule];
const list = document.getElementById('lessons-list');
list.innerHTML = '';
document.getElementById('mpd-title').textContent = module.label;
module.lessons.forEach(function(lesson, idx) {
  const status = state.lessonProgress[lesson.id] || '';
  const isCurrent = idx === state.currentLessonIndex;
  const row = document.createElement('div');
  row.className = 'lesson-row' + (isCurrent ? ' current' : '');
  row.innerHTML =
    '<div class="lesson-check ' + status + '"></div>' +
    '<span class="lesson-name">' + lesson.name + '</span>' +
    (isCurrent ? '<span class="lesson-active-dot"></span>' : '');
  list.appendChild(row);
});
}
// ── Progress Bars ──
function updateProgressBars() {
let total = 0;
let done = 0;
Object.keys(MODULES).forEach(function(modId) {
  const lessons = MODULES[modId].lessons;
  lessons.forEach(function(l) {
    total++;
    if (state.lessonProgress[l.id] === 'complete') {
      done++;
    }
  });
  const pct = Math.round(
    (
      lessons.filter(function(l) {
        return state.lessonProgress[l.id] === 'complete';
      }).length / lessons.length
    ) * 100
  );
  state.moduleProgress[modId] = pct;
  const badge = document.getElementById('badge-' + modId);
  if (badge) badge.textContent = pct + '%';
});
const overall = Math.round((done / total) * 100);
document.getElementById('overall-bar').style.width = overall + '%';
document.getElementById('overall-pct').textContent = overall + '%';
}
// ── Send Message ──
async function sendMessage() {
const input = document.getElementById('user-input');
const text = input.value.trim();
if (!text || state.isLoading) return;
input.value = '';
autoResize(input);
document.getElementById('chips-wrap').innerHTML = '';
appendMessage('user', text);
state.conversationHistory.push({
  role: 'user',
  content: text
});
await fetchAI();
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
try {
  const res = await fetch('https://humana-proxy.onrender.com/api/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-5',
      system: buildSystemPrompt(),
      messages: state.conversationHistory,
      max_tokens: 1000,
    }),
  });
  if (!res.ok) {
    throw new Error('Server error: ' + res.status);
  }
  const data = await res.json();
  const aiText = data.content &&
    data.content.find(function(b) {
      return b.type === 'text';
    });
  const text = aiText ? aiText.text : '(no response)';
  state.conversationHistory.push({
    role: 'assistant',
    content: text
  });
  document.getElementById('typing-indicator').classList.add('hidden');
  if (text.includes('QUIZ_START')) {
    renderQuizFromText(text);
  } else {
    appendMessage('ai', text);
    if (state.lessonPhase === 'teaching') {
      showPostTeachActions();
    } else if (state.lessonPhase === 'scenario') {
      showNextLessonButton();
    }
  }
} catch (err) {
  document.getElementById('typing-indicator').classList.add('hidden');
  appendMessage('ai', 'Could not connect. Error: ' + err.message);
} finally {
  state.isLoading = false;
  document.getElementById('send-btn').disabled = false;
}
}
// ── Adaptive Difficulty ──
function getAdaptiveDifficulty() {
if (state.totalAnswers < 2) return 'beginner';
const score = state.correctAnswers / state.totalAnswers;
if (score >= 0.8) return 'advanced';
if (score >= 0.5) return 'intermediate';
return 'beginner';
}
// ── System Prompt ──
function buildSystemPrompt() {
const mod = MODULES[state.currentModule];
const level = getAdaptiveDifficulty();
const lesson = currentLesson();
const diffGuide = {
  beginner: 'Use simple language.',
  intermediate: 'Use healthcare terminology with explanations.',
  advanced: 'Use advanced healthcare terminology and edge cases.',
};
return (
  mod.systemContext +
  '\n\nLesson: "' +
  lesson.name +
  '".\n' +
  'Difficulty: ' +
  level +
  '. ' +
  diffGuide[level]
);
}
// ── Append Message ──
function appendMessage(role, text) {
const msgs = document.getElementById('messages');
const div = document.createElement('div');
div.className = 'message ' + role;
div.innerHTML =
  '<div class="msg-avatar ' +
  (role === 'ai' ? 'ai' : 'user-av') +
  '">' +
  (role === 'ai' ? 'AI' : 'JC') +
  '</div>' +
  '<div class="msg-content">' +
  '<div class="msg-bubble">' +
  formatMessage(text) +
  '</div>' +
  '</div>';
msgs.appendChild(div);
msgs.scrollTop = msgs.scrollHeight;
}
function formatMessage(text) {
return text
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
  .replace(/\*(.+?)\*/g, '<em>$1</em>')
  .replace(/`([^`]+)`/g, '<code>$1</code>')
  .replace(/\n\n/g, '</p><p>')
  .replace(/\n/g, '<br>')
  .replace(/^/, '<p>')
  .replace(/$/, '</p>')
  .replace(/<p><\/p>/g, '');
}
