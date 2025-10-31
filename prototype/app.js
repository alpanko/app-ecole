// Minimal prototype logic for app-ecole MVP (T1.1 - T1.6)
const pages = {
  home: document.getElementById('home'),
  math: document.getElementById('math')
};

const show = (name)=>{
  Object.values(pages).forEach(p=>p.classList.add('hidden'));
  pages[name].classList.remove('hidden');
}

// Home buttons
document.getElementById('btn-math').addEventListener('click',()=> show('math'));
document.getElementById('btn-german').addEventListener('click',()=> alert('Section Allemand prototype à venir'));

// Math - back
document.getElementById('math-back').addEventListener('click',()=> show('home'));

// digits grid
const digitsEl = document.getElementById('digits');
for(let d=2;d<=9;d++){
  const b = document.createElement('button');
  b.textContent = d;
  b.addEventListener('click',()=> selectDigit(d,b));
  digitsEl.appendChild(b);
}

let selectedDigit = null;
function selectDigit(n,btn){
  selectedDigit = n;
  document.getElementById('selected').textContent = `Chiffre sélectionné: ${n}`;
  Array.from(digitsEl.children).forEach(c=>c.classList.remove('active'));
  btn.classList.add('active');
}

// View table
document.getElementById('btn-view-table').addEventListener('click',()=>{
  if(!selectedDigit) return alert('Sélectionnez un chiffre d\'abord');
  const list = document.getElementById('table-list');
  list.innerHTML='';
  for(let i=1;i<=10;i++){
    const li = document.createElement('li');
    li.textContent = `${selectedDigit} × ${i} = ${selectedDigit*i}`;
    list.appendChild(li);
  }
  document.getElementById('table-n').textContent = selectedDigit;
  document.getElementById('table-view').classList.remove('hidden');
});
document.getElementById('table-close').addEventListener('click',()=>{
  document.getElementById('table-view').classList.add('hidden');
});

// QCM training/test
const qcmEl = document.getElementById('qcm');
const questionArea = document.getElementById('question-area');
let qIndex=0, qTotal=10, qSet=[];

function genMulQuestion(n){
  const a = n;
  const b = Math.floor(Math.random()*10)+1;
  const answer = a*b;
  // generate 3 wrong choices
  const choices = new Set([answer]);
  while(choices.size<4){
    const delta = Math.floor(Math.random()*10)+1;
    choices.add(answer + (Math.random()<0.5 ? delta : -delta));
  }
  const shuffled = Array.from(choices).sort(()=>Math.random()-0.5);
  return {prompt:`${a} × ${b} = ?`, answer:answer, choices:shuffled};
}

function startQCM(isTest=false){
  if(!selectedDigit) return alert('Sélectionnez un chiffre d\'abord');
  qIndex=0; qTotal=10; qSet=[];
  for(let i=0;i<qTotal;i++) qSet.push(genMulQuestion(selectedDigit));
  qcmEl.classList.remove('hidden');
  document.getElementById('qcm-title').textContent = isTest ? 'Test (10 questions)': 'Entraînement (10 questions)';
  showQuestion();
}

function showQuestion(){
  const q = qSet[qIndex];
  questionArea.innerHTML = `<div class="prompt">${q.prompt}</div>`;
  q.choices.forEach(c=>{
    const btn = document.createElement('button');
    btn.className='choice';
    btn.textContent = c;
    btn.addEventListener('click',()=> onAnswer(btn,c===q.answer));
    questionArea.appendChild(btn);
  });
}

function onAnswer(btn,correct){
  Array.from(questionArea.querySelectorAll('.choice')).forEach(b=>b.disabled=true);
  if(correct) btn.classList.add('correct'); else btn.classList.add('wrong');
  setTimeout(()=>{
    qIndex++;
    if(qIndex<qTotal) showQuestion(); else finishQCM();
  },600);
}

function finishQCM(){
  // simple recap: count correct
  const correct = Array.from(document.querySelectorAll('.choice.correct')).length;
  questionArea.innerHTML = `<div>Terminé — score approximatif: ${correct} / ${qTotal}</div>`;
}

document.getElementById('btn-training').addEventListener('click',()=>startQCM(false));
document.getElementById('btn-test').addEventListener('click',()=>startQCM(true));

// initial view
show('home');
