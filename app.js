// ── Config ──
// Set this to your deployed proxy server URL, or 'http://localhost:3001' for local dev
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
   systemContext: `You are an AI training assistant helping Humana Tier 1 Advocate Jordan Craft learn the "Medical Basic Benefits" module (Module 206739, Days 12-13 of Wave 1 training).
FULL CURRICULUM FOR THIS MODULE:
1. COVERAGE ESSENTIALS
- What services are included under a Humana health plan: medical services, preventive care, specialised treatments
- Coverage is determined by: plan design, service type, provider network
- Agents must evaluate ALL three factors before confirming coverage
- Service categories: Hospital services (facility charges, room & board, imaging), Physician services (office visits, procedures), Surgical services, Miscellaneous services (cast, crutches, DME, medical supplies)
- Inpatient vs Outpatient: inpatient = admitted overnight, outpatient = same-day procedures, office visits, diagnostic testing
- The location of service affects how it is billed, how benefits apply, and the member's cost responsibility
2. TOOLS AND RESOURCES
- DaVita/Debut: the primary tool used to look up how much a member pays for a service or procedure
- Agents use Debut to: check coverage, confirm eligibility, verify benefits, find cost-sharing amounts
- Process: open CRM Lightning → select coverage section → Medicare Individual → current year → open member account
- Agents must navigate Debut to find cost-sharing for doctor visits, specialist visits, procedures
- Provider search tool: used to find in-network providers and specialists near the member
3. BASIC PLAN BENEFITS
- Plans outline which services are covered, what limitations/restrictions apply, and cost-sharing requirements
- ~80% of Tier 1 calls are: "Is this covered?", "How much will I pay?", "Where can I go?"
- Agents must verify: whether the service is covered, what conditions apply, what the member must pay
- First Call Resolution: one call may involve multiple services (e.g. broken leg = hospital services + physician + miscellaneous supplies)
- Non-covered items: hair transplants, wigs, certain non-medically necessary implants, tattoo-related procedures
4. COST SHARING: DEDUCTIBLE, COPAY, COINSURANCE
- Deductible: amount member must pay BEFORE the health plan starts paying. Until met, member pays full cost
- Copay: fixed amount paid at time of service (e.g. $20 for a GP visit). Defined by the plan
- Coinsurance: percentage of cost member pays AFTER deductible is met (e.g. member pays 20%, plan pays 80%)
- Sequential logic agents must apply: (1) Has deductible been met? (2) Does copay apply? (3) Does coinsurance apply? (4) Progress toward out-of-pocket max?
- Example: service costs $200, deductible not met → member pays full $200. If deductible met and coinsurance is 20% → member pays $40
5. OUT-OF-POCKET MAXIMUM
- The most a member will pay in a plan year. Once reached, the plan covers 100% of covered services
- Includes: deductibles, copays, coinsurance
- Does NOT include: premiums, non-covered services, out-of-network charges (in some plans)
6. PREVENTIVE vs DIAGNOSTIC SERVICES
- Preventive: no symptoms present, goal is early detection or routine care (flu shots, mammograms, colonoscopy screening, annual wellness visit). Typically no copay
- Diagnostic: symptoms are present or condition is suspected (blood tests, imaging, follow-up after abnormal screening). Cost-sharing applies
- Key rule: the SAME procedure can be preventive OR diagnostic depending on WHY it's being done
- Example: colonoscopy for routine screening = preventive. Colonoscopy to investigate symptoms = diagnostic
- Annual Wellness Visit (preventive) vs Annual Physical Exam (more comprehensive, may have cost-sharing)
- If purpose is unclear, agents may quote BOTH preventive and diagnostic benefit amounts
7. THERAPY AND REHABILITATION SERVICES
- Coverage for physical therapy, occupational therapy, speech therapy, rehabilitation
- Coverage depends on: medical necessity, plan-specific rules, visit limits
- Agents must verify conditions before confirming coverage
8. HEALTH RISK ASSESSMENT (HRA)
- Members complete HRA to provide health information and support care planning
- Agents may guide members on how to complete the HRA process
REAL CALL SCENARIOS TO USE:
- Scenario 1: Member calls about a broken leg treated at ER — multiple services involved (hospital facility + physician + cast/crutches)
- Scenario 2: Member calls about a suspicious mole removed at dermatologist — physician visit + surgical removal + diagnostic testing
- Scenario 3: Member asks if their physical therapy is covered after knee surgery
- Scenario 4: Member asks why their colonoscopy bill is different from what they expected (preventive vs diagnostic distinction)
Always teach advocates to think about: What is covered? How much does the member pay? Where should they go?`
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
   systemContext: `You are an AI training assistant helping Humana Tier 1 Advocate Jordan Craft learn the "Medical Additional Benefits" module (Module 206740, Day 13 of Wave 1 training).
FULL CURRICULUM FOR THIS MODULE:
1. ADDITIONAL BENEFITS OPTIONS OVERVIEW
- Additional benefits beyond basic medical coverage that members may have under their plan
- Includes: vision exams and eyewear, dental, hearing, weight management, chiropractic care, skilled nursing care, immunisations
- Agents must check the member's specific plan — not all plans include all additional benefits
- Benefit categories agents handle calls about: Emergency Room services, DME (wheelchairs), Chiropractic care, Skilled Nursing Care, Vision services, Immunisations, Weight management
- Non-covered services: tattoo-related procedures, certain cosmetic procedures
2. DURABLE MEDICAL EQUIPMENT (DME)
- DME = equipment prescribed for medical use, designed for repeated use, suitable for home use
- Examples: wheelchairs, hospital beds, walkers, CPAP machines, scooters
- Medical supplies (disposable/one-time use) are NOT DME
- Orthotic devices (braces, supports) ARE considered DME
- Rental vs Purchase: equipment is typically RENTED first; rental payments may contribute toward purchase
- Some items cannot be rented — must be purchased (crutches, braces, canes)
- Coverage rule: if renting is more cost-effective, that is the preferred option
- DME requires: (1) check Debut for coverage and cost, (2) use provider search to find DME supplier, (3) check if prior authorisation is required using the auth reference file
- Agents need to use THREE tools for a complete DME call: Debut + provider search + auth file
3. PROSTHETIC AND ORTHOTIC DEVICES
- Prosthetic: artificial substitute for a missing body part (arm, leg, eye) — must be medically necessary
- Coverage criteria: least costly option for daily use, usable in daily activities, provides basic function
- Non-covered: hair transplants, wigs, implants that are not medically necessary
4. PART B MEDICATIONS
- Part B medications are drugs administered in a clinical setting (e.g. chemotherapy, injections given by a provider)
- Different from Part D pharmacy benefits (self-administered medications at home)
- Agents must distinguish between Part B and Part D when answering medication coverage questions
5. NURSE ADVICE LINE AND EVA BOT CALLS
- Nurse Advice Line: clinical professionals help members decide level of care, answer questions about procedures, support recovery and chronic condition management
- Functions: clinical decision-making guidance, case management support, identifying serious conditions
- If serious condition suspected: immediate guidance provided, member directed to appropriate care level
- EVA Bot calls: AI-based assistant calling on behalf of member or provider — treat exactly the same as human calls, respond professionally, provide full information, do not disconnect
- Agents must: respond professionally, provide accurate benefit information, not dismiss these calls
6. PREVENTIVE SERVICES AND SCREENINGS
- Preventive screenings: mammograms, prostate screenings, colon cancer screening — based on age, guidelines, risk factors
- Agents must quote only RELEVANT services based on member characteristics (e.g. do not quote mammogram to a male member)
- Annual Wellness Visit vs Annual Physical Exam: wellness visit is preventive-focused, physical exam is more comprehensive
- Immunisations: flu shots and other vaccines typically covered as preventive with no copay
- Cost rules: preventive services may have NO copay, but lab services and imaging may still have cost-sharing
7. COORDINATION OF BENEFITS (COB)
- When a member has TWO insurance plans — COB determines which is primary, which is secondary, and how payments are coordinated
- Purpose: prevent duplicate payments, ensure claims processed correctly
- Agent steps: (1) Confirm other insurance exists — default assumption is it does, (2) Collect pharmacy coverage info (BIN, PCN), (3) Collect medical coverage info (carrier name, policy holder, relationship, policy number, DOB, plan type), (4) Review and validate, (5) Submit and route case
- Exception handling: if coverage has a future effective date, document manually and follow exception process
- Members with COB: primary plan pays first, secondary plan may cover remaining costs
8. SMART SUMMARY STATEMENTS
- Smart Summary: consolidated statement showing member's healthcare activity over a time period
- Combines medical and pharmacy information in one document
- Shows: claims data, billed amounts, allowed amounts, what plan paid, member responsibility, year-to-date totals
- Allowed amount: maximum the plan will pay for a service (may be less than billed)
- Member may request a reprint — reprinted document is EXACT copy of original, errors are NOT corrected
- Statement includes: support and appeals information, member rights, assistance programs for medications
- Pharmacy sections show payment stages: Deductible stage (member pays full cost) → Initial Coverage stage (cost shared) → Catastrophic Coverage stage (member pays little/nothing)
REAL CALL SCENARIOS TO USE:
- Member calls asking why their wheelchair is not being covered for purchase (rental-first rule)
- Member asks if their CPAP machine requires authorisation
- Member with two insurance plans asks which one pays first
- Member calls about an injection they received at a doctor's office (Part B medication)
- Member asks why their screening mammogram had no charge but follow-up imaging did (preventive vs diagnostic)
- Member asks about their Smart Summary statement — confused about why plan paid less than the billed amount`
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
   systemContext: `You are an AI training assistant helping Humana Tier 1 Advocate Jordan Craft learn the "Medical Authorisations and Appeals" module (Module 206741, Days 13-14 of Wave 1 training).
FULL CURRICULUM FOR THIS MODULE:
1. PREAPPROVALS AND PRIOR AUTHORISATION BASICS
- Prior Authorisation (auth/preapproval): approval required from the health plan BEFORE certain services or procedures are performed
- Why it exists: ensures the service is medically necessary and appropriate for the member's plan
- NOT all services require auth — agents must verify using the auth reference file
- Key question on every relevant call: "Does this service/procedure require prior authorisation?"
- Auth is typically requested by the PROVIDER (doctor/facility), not the member
- Agents explain the process to members but the provider submits the auth request
2. AUTHORISATION REQUIREMENTS BY SERVICE
- Agents use an Excel reference file to identify which procedures require auth
- Common services that may require auth: Durable Medical Equipment (especially scooters, power wheelchairs), certain specialist visits, specific surgeries, inpatient admissions, certain imaging procedures
- DME example: member needs a scooter → check Debut for coverage and cost → check provider search for DME supplier → check auth file to see if prior auth is required for Medicare → if yes, the provider/DME company must obtain auth from Humana before delivering equipment
- The auth file tells agents: whether auth is required, who determines approval (the provider/clinical team), what the process is
- Three checkmarks for a complete DME call: (1) Is it covered and what does member pay? (2) Which provider/supplier to use? (3) Is prior auth required?
3. CHECKING AUTHORISATION STATUS IN THE SYSTEM
- Agents can look up existing authorisations in the system
- Auth status shows: whether auth was approved, denied, or pending
- Agents are LIMITED in what they can see — they can confirm status but cannot overturn decisions
- If auth is denied: inform the member, explain they have appeal rights
- Agents must communicate clearly: "Your authorisation is currently [status]. Here is what that means..."
4. USING MULTIPLE TOOLS FOR AUTH CALLS
- Auth calls are among the most complex — require coordinating multiple tools simultaneously
- Typical workflow: CRM Lightning → Debut (coverage + cost) → Provider Search (find supplier/specialist) → Auth Reference Excel File (auth required?)
- Advocates commonly struggle with this multi-tool coordination — this is a top reason for extended call times and negative NPS scores
- Agents must complete ALL steps for first call resolution so the member does not have to call back
5. MEDICAL APPEALS OVERVIEW
- Appeal: a formal dispute of an original coverage decision or authorisation denial
- Members have the RIGHT to appeal any denial
- Types of decisions that can be appealed: prior auth denials, claim denials, coverage decisions
- Appeals process: member (or provider on behalf of member) submits appeal → Humana reviews → decision issued within required timeframe
- Agents role: explain the appeals process to members, provide information on how to file, note timelines
6. GRIEVANCES VS APPEALS
- Appeal: disputing a COVERAGE DECISION or denial (e.g. "my auth was denied, I disagree")
- Grievance: a complaint about SERVICE, QUALITY, or EXPERIENCE (e.g. "I was treated poorly", "my call was handled badly")
- These are TWO DIFFERENT processes — agents must correctly identify which applies
- Agents commonly confuse these — key distinction: appeals = about a decision, grievances = about an experience
7. TIMELINES AND MEMBER RIGHTS
- Members have defined rights and timeframes for filing appeals and grievances
- Standard appeal: decision typically within 30 days for pre-service, 60 days for post-service
- Expedited/urgent appeal: decision within 72 hours when delay would seriously harm the member's health
- Members must be informed of their rights when a denial is issued
- Agents must: never discourage a member from filing an appeal, explain the process clearly, provide correct contact information
8. COMPLEX CALL SCENARIOS
- Scenario: Member calls about a scooter — needs coverage info, supplier, AND auth check (3-tool call)
- Scenario: Member received a denial letter for a procedure and wants to know what to do
- Scenario: Member is confused whether to file an appeal or a grievance
- Scenario: Member asks why their authorisation is still pending after 2 weeks
- Scenario: Member's doctor says auth is approved but the system shows pending — how to handle
- These calls require: calm communication, accurate system navigation, clear explanation of next steps, ensuring member feels heard and supported
CRITICAL TEACHING POINTS:
- Authorisations and Appeals is rated as the MOST COMPLEX section of Wave 1 training
- Advocates struggle most with: multi-tool coordination, understanding auth vs no-auth services, explaining denials sensitively
- Always teach the THREE-STEP CHECK for DME and complex service calls: coverage → supplier → auth
- First Call Resolution is the goal — member should NOT need to call back`
 }
};
// ── State ──
let state = {
 currentModule: 'medical-basic',
 currentLessonIndex: 0,
 lessonPhase: 'teaching',
 conversationHistory: [],
 lessonProgress: {},
 moduleProgress: { 'medical-basic': 0, 'medical-additional': 0, 'auth-appeals': 0 },
 isLoading: false,
 correctAnswers: 0,
 totalAnswers: 0,
};
// ── Init ──
document.addEventListener('DOMContentLoaded', () => {
 renderLessons();
 updateProgressBars();
 startLesson();
});
function currentLesson() {
 return MODULES[state.currentModule].lessons[state.currentLessonIndex];
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
 document.getElementById('current-module-label').textContent = MODULES[moduleId].label;
 document.getElementById('mpd-title').textContent = MODULES[moduleId].label;
 renderLessons();
 updateProgressBars();
 document.getElementById('messages').innerHTML = '';
 startLesson();
}
// ── Mode buttons ──
function setMode(mode) {
 document.querySelectorAll('.mode-btn').forEach(btn => {
   btn.classList.toggle('active', btn.id === 'mode-' + mode);
 });
 if (mode === 'quiz') triggerQuiz();
 else if (mode === 'scenario') triggerScenario();
}
// ── Start lesson: AI introduces it ──
function startLesson() {
 const lesson = currentLesson();
 const mod = MODULES[state.currentModule];
 state.lessonProgress[lesson.id] = 'in-progress';
 state.lessonPhase = 'teaching';
 renderLessons();
 updateProgressBars();
 showLessonBanner(lesson.name, state.currentLessonIndex + 1, mod.lessons.length);
 document.getElementById('chips-wrap').innerHTML = '';
 const prompt = 'You are now teaching Lesson ' + (state.currentLessonIndex + 1) + ' of ' + mod.lessons.length + ': "' + lesson.name + '".\n\nIntroduce and teach this lesson clearly. Cover all key concepts from the curriculum for this lesson. Use simple language, real-world examples, and keep it engaging. End by telling Jordan you will now check their understanding with a quick question.';
 state.conversationHistory = [];
 state.conversationHistory.push({ role: 'user', content: prompt });
 fetchAI();
}
function showLessonBanner(lessonName, current, total) {
 const msgs = document.getElementById('messages');
 msgs.innerHTML = '';
 const banner = document.createElement('div');
 banner.className = 'lesson-banner';
 banner.innerHTML = '<div class="lesson-banner-inner"><span class="lesson-counter">Lesson ' + current + ' of ' + total + '</span><span class="lesson-banner-title">' + lessonName + '</span></div>';
 msgs.appendChild(banner);
}
// ── Quiz ──
function triggerQuiz() {
 state.lessonPhase = 'quiz';
 const lesson = currentLesson();
 const prompt = 'Now generate a knowledge check question about "' + lesson.name + '" in EXACTLY this format:\nQUIZ_START\nQ: [question]\nA: [option]\nB: [option]\nC: [option]\nD: [option]\nCORRECT: [letter]\nEXPLANATION: [explanation]\nQUIZ_END';
 state.conversationHistory.push({ role: 'user', content: prompt });
 fetchAI();
}
// ── Scenario ──
function triggerScenario() {
 state.lessonPhase = 'scenario';
 const lesson = currentLesson();
 const prompt = 'Create a realistic Humana member call scenario that tests knowledge of "' + lesson.name + '".\nFormat:\n**SCENARIO: [title]**\n*Member says:* "[opening question]"\n\nThen ask Jordan: "How would you handle this call? What do you need to verify and what would you tell the member?"';
 state.conversationHistory.push({ role: 'user', content: prompt });
 fetchAI();
 document.querySelectorAll('.mode-btn').forEach(b => b.classList.toggle('active', b.id === 'mode-scenario'));
}
// ── Next lesson ──
function nextLesson() {
 const mod = MODULES[state.currentModule];
 const lesson = currentLesson();
 state.lessonProgress[lesson.id] = 'complete';
 renderLessons();
 updateProgressBars();
 if (state.currentLessonIndex < mod.lessons.length - 1) {
   state.currentLessonIndex++;
   state.conversationHistory = [];
   startLesson();
 } else {
   showModuleComplete();
 }
}
function showModuleComplete() {
 const mod = MODULES[state.currentModule];
 document.getElementById('messages').innerHTML = '<div class="welcome-msg"><div class="welcome-icon" style="background:linear-gradient(135deg,#00A651,#007A33);"><svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg></div><h2>Module Complete!</h2><p>Great work, Jordan. You have completed <strong>' + mod.label + '</strong>. Select the next module from the left panel to continue.</p></div>';
 document.getElementById('chips-wrap').innerHTML = '';
}
// ── Render lessons list ──
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
   row.innerHTML = '<div class="lesson-check ' + status + '"></div><span class="lesson-name">' + lesson.name + '</span>' + (isCurrent ? '<span class="lesson-active-dot"></span>' : '');
   list.appendChild(row);
 });
}
// ── Progress bars ──
function updateProgressBars() {
 let total = 0, done = 0;
 Object.keys(MODULES).forEach(function(modId) {
   const lessons = MODULES[modId].lessons;
   lessons.forEach(function(l) {
     total++;
     if (state.lessonProgress[l.id] === 'complete') done++;
   });
   const pct = Math.round((lessons.filter(function(l) { return state.lessonProgress[l.id] === 'complete'; }).length / lessons.length) * 100);
   state.moduleProgress[modId] = pct;
   const badge = document.getElementById('badge-' + modId);
   if (badge) badge.textContent = pct + '%';
 });
 const overall = Math.round((done / total) * 100);
 document.getElementById('overall-bar').style.width = overall + '%';
 document.getElementById('overall-pct').textContent = overall + '%';
}
// ── Send message ──
async function sendMessage() {
 const input = document.getElementById('user-input');
 const text = input.value.trim();
 if (!text || state.isLoading) return;
 input.value = '';
 autoResize(input);
 document.getElementById('chips-wrap').innerHTML = '';
 appendMessage('user', text);
 state.conversationHistory.push({ role: 'user', content: text });
 await fetchAI();
}
function handleKey(e) {
 if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
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
     headers: { 'Content-Type': 'application/json' },
     body: JSON.stringify({
       model: 'claude-sonnet-4-5',
       system: buildSystemPrompt(),
       messages: state.conversationHistory,
       max_tokens: 1000,
     }),
   });
   if (!res.ok) throw new Error('Server error: ' + res.status);
   const data = await res.json();
   const aiText = data.content && data.content.find(function(b) { return b.type === 'text'; });
   const text = aiText ? aiText.text : '(no response)';
   state.conversationHistory.push({ role: 'assistant', content: text });
   document.getElementById('typing-indicator').classList.add('hidden');
   if (text.includes('QUIZ_START')) {
     renderQuizFromText(text);
   } else {
     appendMessage('ai', text);
     if (state.lessonPhase === 'teaching') showPostTeachActions();
     else if (state.lessonPhase === 'scenario') showNextLessonButton();
   }
 } catch (err) {
   document.getElementById('typing-indicator').classList.add('hidden');
   appendMessage('ai', 'Could not connect. Error: ' + err.message);
 } finally {
   state.isLoading = false;
   document.getElementById('send-btn').disabled = false;
 }
}
function showPostTeachActions() {
 document.getElementById('chips-wrap').innerHTML =
   '<button class="chip chip-primary" onclick="triggerQuiz();this.parentElement.innerHTML=\'\';">Check my understanding ✓</button>' +
   '<button class="chip" onclick="triggerScenario();this.parentElement.innerHTML=\'\';">Give me a call scenario</button>';
}
function showNextLessonButton() {
 const mod = MODULES[state.currentModule];
 const isLast = state.currentLessonIndex >= mod.lessons.length - 1;
 document.getElementById('chips-wrap').innerHTML =
   '<button class="chip chip-primary" onclick="nextLesson();this.parentElement.innerHTML=\'\';">' + (isLast ? 'Complete Module →' : 'Next Lesson →') + '</button>';
}
// ── Adaptive difficulty ──
function getAdaptiveDifficulty() {
 if (state.totalAnswers < 2) return 'beginner';
 const score = state.correctAnswers / state.totalAnswers;
 if (score >= 0.8) return 'advanced';
 if (score >= 0.5) return 'intermediate';
 return 'beginner';
}
// ── System prompt ──
function buildSystemPrompt() {
 const mod = MODULES[state.currentModule];
 const level = getAdaptiveDifficulty();
 const lesson = currentLesson();
 const diffGuide = {
   beginner: 'Use very simple language and real-world analogies. Define every technical term. Be warm and encouraging.',
   intermediate: 'Use standard healthcare terminology with brief explanations. Reference the real call centre context.',
   advanced: 'Use full healthcare/insurance terminology. Include edge cases and complex multi-tool workflows.',
 };
 return mod.systemContext + '\n\nYou are currently on Lesson ' + (state.currentLessonIndex + 1) + ': "' + lesson.name + '".\nDIFFICULTY: ' + level + ' — ' + diffGuide[level] + '\nAlways be encouraging. Keep responses practical for real call handling.';
}
// ── Append message ──
function appendMessage(role, text) {
 const msgs = document.getElementById('messages');
 const div = document.createElement('div');
 div.className = 'message ' + role;
 div.innerHTML = '<div class="msg-avatar ' + (role === 'ai' ? 'ai' : 'user-av') + '">' + (role === 'ai' ? 'AI' : 'JC') + '</div><div class="msg-content"><div class="msg-bubble">' + formatMessage(text) + '</div></div>';
 msgs.appendChild(div);
 msgs.scrollTop = msgs.scrollHeight;
}
function formatMessage(text) {
 return text
   .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
   .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
   .replace(/\*(.+?)\*/g, '<em>$1</em>')
   .replace(/`([^`]+)`/g, '<code>$1</code>')
   .replace(/\n\n/g, '</p><p>').replace(/\n/g, '<br>')
   .replace(/^/, '<p>').replace(/$/, '</p>').replace(/<p><\/p>/g, '');
}
// ── Quiz rendering ──
function renderQuizFromText(text) {
 const match = text.match(/QUIZ_START([\s\S]*?)QUIZ_END/);
 if (!match) { appendMessage('ai', text); return; }
 const lines = match[1].trim().split('\n').map(function(l) { return l.trim(); }).filter(Boolean);
 let question = '', options = {}, correct = '', explanation = '';
 lines.forEach(function(line) {
   if (line.startsWith('Q:')) question = line.slice(2).trim();
   else if (line.startsWith('A:')) options.A = line.slice(2).trim();
   else if (line.startsWith('B:')) options.B = line.slice(2).trim();
   else if (line.startsWith('C:')) options.C = line.slice(2).trim();
   else if (line.startsWith('D:')) options.D = line.slice(2).trim();
   else if (line.startsWith('CORRECT:')) correct = line.slice(8).trim();
   else if (line.startsWith('EXPLANATION:')) explanation = line.slice(12).trim();
 });
 const msgs = document.getElementById('messages');
 const cardId = 'quiz-' + Date.now();
 const card = document.createElement('div');
 card.className = 'message ai';
 const optionsHtml = Object.entries(options).map(function(entry) {
   return '<button class="quiz-option" data-key="' + entry[0] + '" onclick="handleQuizAnswer(this,\'' + correct + '\',\'' + cardId + '\',`' + explanation.replace(/`/g, "'") + '`)"><strong>' + entry[0] + '.</strong> ' + entry[1] + '</button>';
 }).join('');
 card.innerHTML = '<div class="msg-avatar ai">AI</div><div class="msg-content"><div class="quiz-card" id="' + cardId + '"><div class="quiz-card-header quiz-h"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg> Knowledge Check</div><div class="quiz-card-body"><div class="quiz-question">' + question + '</div><div class="quiz-options">' + optionsHtml + '</div><div class="quiz-feedback" id="fb-' + cardId + '" style="display:none;"></div></div></div></div>';
 msgs.appendChild(card);
 msgs.scrollTop = msgs.scrollHeight;
}
function handleQuizAnswer(btn, correct, cardId, explanation) {
 const card = document.getElementById(cardId);
 card.querySelectorAll('.quiz-option').forEach(function(b) { b.disabled = true; });
 const isCorrect = btn.dataset.key === correct;
 state.totalAnswers++;
 if (isCorrect) state.correctAnswers++;
 btn.classList.add(isCorrect ? 'correct' : 'wrong');
 if (!isCorrect) card.querySelector('[data-key="' + correct + '"]').classList.add('correct');
 const fb = document.getElementById('fb-' + cardId);
 fb.style.display = 'block';
 fb.className = 'quiz-feedback ' + (isCorrect ? 'correct-fb' : 'wrong-fb');
 fb.innerHTML = isCorrect ? '✓ Correct! ' + explanation : '✗ Not quite. ' + explanation;
 setTimeout(function() {
   const mod = MODULES[state.currentModule];
   const isLast = state.currentLessonIndex >= mod.lessons.length - 1;
   const nextLabel = isLast ? 'Complete Module →' : 'Next Lesson →';
   if (isCorrect) {
     document.getElementById('chips-wrap').innerHTML =
       '<button class="chip" onclick="triggerScenario();this.parentElement.innerHTML=\'\';">Try a call scenario</button>' +
       '<button class="chip chip-primary" onclick="nextLesson();this.parentElement.innerHTML=\'\';">' + nextLabel + '</button>';
   } else {
     document.getElementById('chips-wrap').innerHTML =
       '<button class="chip" onclick="triggerScenario();this.parentElement.innerHTML=\'\';">Reinforce with a scenario</button>' +
       '<button class="chip chip-primary" onclick="nextLesson();this.parentElement.innerHTML=\'\';">' + nextLabel + '</button>';
   }
 }, 1500);
}
