import {phoneMarkup, adminView, bindProductUI, detailView} from './product-ui.js';
document.querySelector('#phone-mount').outerHTML=phoneMarkup();
document.querySelectorAll('[data-live-card]').forEach(el=>el.innerHTML=adminView(el.dataset.liveCard));
const world = document.querySelector('.al-world');
const quiet = matchMedia('(prefers-reduced-motion: reduce)');
const desktopStory = matchMedia('(min-width: 701px)');
world.classList.add('al-motion');
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => { if(entry.isIntersecting) {entry.target.classList.add('is-visible'); revealObserver.unobserve(entry.target);} });
}, {threshold: .12});
world.querySelectorAll('[data-enter]').forEach(element => revealObserver.observe(element));

const places = {
 presence: ['Учёт присутствия сотрудников','Учёт входов<br>и выходов','Сотрудник отмечает приход и уход через NFC-метку. Руководитель видит время на объекте и текущие смены.'],
 service: ['Отчёты об обслуживании','Отчёты<br>об обслуживании','После обслуживания сотрудник отправляет отчёт с фото и замечаниями. Руководитель просматривает его в веб-панели.'],
 cleaning: ['Отчёты об уборке','Отчёты<br>об уборке','Сотрудник отправляет отчёт об уборке из приложения. Руководитель может найти его по объекту и дате.']
};
document.querySelectorAll('[data-place]').forEach(button => button.addEventListener('click', () => {
 const data=places[button.dataset.place];
 document.querySelectorAll('[data-place]').forEach(other=>other.setAttribute('aria-pressed',String(other===button)));
 const detail=document.querySelector('#place-detail');
 detail.innerHTML=`<h3>${data[1]}</h3><p>${data[2]}</p>`;
 if(!quiet.matches) detail.animate([{opacity:.3,transform:'translateY(7px)'},{opacity:1,transform:'translateY(0)'}],{duration:280,easing:'ease-out'});
}));

const journey=document.querySelector('.al-journey');
const scene=document.querySelector('.al-phone-scene');
const steps=[...document.querySelectorAll('[data-step]')];
const pages=[...document.querySelectorAll('.al-phone-page')];
let currentStep=0, previousScrollStep=-1;
function setStep(index) {
 document.querySelector('.ios-aux')?.setAttribute('hidden','');
 if(index===currentStep) return;
 currentStep=index;
 scene.dataset.stepView=String(index);
 document.querySelector('#phone-receipt').textContent=['Отметка сохранена','Отчёт сохранён','Запись добавлена в историю'][index];
 document.querySelectorAll('[data-ios-nav]').forEach(b=>b.setAttribute('aria-current',String(b.dataset.iosNav===String(index))));
 steps.forEach((button,i)=>{button.setAttribute('aria-selected',String(i===index));button.tabIndex=i===index?0:-1;pages[i].hidden=i!==index;});
}
steps.forEach((button,index)=>{
 button.addEventListener('click',()=>setStep(index));
 button.addEventListener('keydown',event=>{
  let next;
  if(event.key==='ArrowDown'||event.key==='ArrowRight')next=(index+1)%3;
  else if(event.key==='ArrowUp'||event.key==='ArrowLeft')next=(index+2)%3;
  else if(event.key==='Home')next=0;
  else if(event.key==='End')next=2;
  else return;
  event.preventDefault();setStep(next);steps[next].focus();
 });
});

const parallaxes=[...world.querySelectorAll('[data-parallax]')];
const dashboard=world.querySelector('[data-dashboard]');
let pendingFrame=0;
const clamp=value=>Math.max(0,Math.min(1,value));
function draw() {
 pendingFrame=0;
 if(quiet.matches)return;
 const viewport=innerHeight;
 const rect=journey.getBoundingClientRect();
 if(desktopStory.matches&&rect.bottom>0&&rect.top<viewport){
  const progress=clamp(-rect.top/Math.max(1,journey.offsetHeight-viewport));
  const step=Math.min(2,Math.floor(progress*3));
  if(step!==previousScrollStep){previousScrollStep=step;setStep(step);}
  scene.style.setProperty('--receipt-y',`${(progress-.5)*-22}px`);
 }
 parallaxes.forEach(element=>{
  const bounds=element.getBoundingClientRect();
  if(bounds.bottom>0&&bounds.top<viewport){const progress=clamp((viewport-bounds.top)/(viewport+bounds.height));element.style.setProperty('--scene-y',`${(progress-.5)*48}px`);}
 });
 const bounds=dashboard.getBoundingClientRect();
 if(bounds.bottom>0&&bounds.top<viewport){const progress=clamp((viewport-bounds.top)/(viewport*.85));dashboard.style.setProperty('--dashboard-angle',`${(1-progress)*7}deg`);}
}
function schedule(){if(!pendingFrame)pendingFrame=requestAnimationFrame(draw);}
addEventListener('scroll',schedule,{passive:true});addEventListener('resize',schedule);quiet.addEventListener('change',schedule);schedule();

const demos={
 presence:{heading:'Кто сейчас<br>на объекте',description:'Смотрите, кто сейчас работает на объекте, когда сотрудники пришли и ушли. Проверяйте время за нужный период.',points:['Отметки через NFC','Присутствие сейчас и за период','Учёт рабочего времени'],screen:'presence'},
 reports:{heading:'Отчёты<br>о выполненной работе',description:'Откройте отчёт по объекту, чтобы прочитать комментарий сотрудника и посмотреть фото или файлы.',points:['Фото и файлы в отчёте','Журналы по объектам','История работ'],screen:'report'},
 tasks:{heading:'Задачи<br>для сотрудников',description:'Назначайте задачи сотрудникам, указывайте сроки и проверяйте статус выполнения.',points:['Ответственные и сроки','Статусы выполнения','Задачи и монтажные работы'],screen:'tasks'}
};
const tabs=[...document.querySelectorAll('[data-tab]')];
function setTab(key){
 const data=demos[key];
 document.querySelector('#demo-heading').innerHTML=data.heading;
 document.querySelector('#demo-description').textContent=data.description;
 document.querySelector('#demo-points').innerHTML=data.points.map(point=>`<li>${point}</li>`).join('');
 document.querySelector('#app-content').innerHTML=adminView(data.screen);
 document.querySelector('#demo-panel').setAttribute('aria-labelledby',`tab-${key}`);
 tabs.forEach(tab=>{const active=tab.dataset.tab===key;tab.setAttribute('aria-selected',String(active));tab.tabIndex=active?0:-1;});
}
tabs.forEach((button,index)=>{
 button.addEventListener('click',()=>setTab(button.dataset.tab));
 button.addEventListener('keydown',event=>{let next;if(event.key==='ArrowRight')next=(index+1)%tabs.length;else if(event.key==='ArrowLeft')next=(index+tabs.length-1)%tabs.length;else if(event.key==='Home')next=0;else if(event.key==='End')next=tabs.length-1;else return;event.preventDefault();setTab(tabs[next].dataset.tab);tabs[next].focus();});
});
setTab('presence');
const preview=document.querySelector('#interface-preview');
let previousFocus;
function openUI(key,value){
 if(!preview.open)previousFocus=document.activeElement;
 document.querySelector('#preview-title').textContent=({presence:'Присутствие',report:'Отчёт',journal:'Журнал',service:'Обслуживание',tasks:'Задачи',session:'Присутствие',profile:'Профиль',photo:'Вложение'})[key]||'Anyloc';
 document.querySelector('#preview-content').innerHTML=detailView(key,value);
 if(!preview.open)preview.showModal();
}
bindProductUI(world,{open:openUI,step:setStep});
preview.querySelector('[data-close-preview]').addEventListener('click',()=>preview.close());
preview.addEventListener('click',event=>{if(event.target===preview)preview.close();});
preview.addEventListener('close',()=>previousFocus?.focus({preventScroll:true}));

// Swap the front card with the selected slot, keeping all three slots occupied.
const paperStack=document.querySelector('.al-paper-stack');
function updatePaperAccess(){
 paperStack.querySelectorAll('.al-paper').forEach(card=>{
  const front=card.classList.contains('al-paper-front');
  card.querySelector('.al-paper-viewport').inert=!front;
  const button=card.querySelector('.al-paper-label');
  const title=button.childNodes[0].textContent.trim();
  button.setAttribute('aria-label',front?'Открыть: '+title:'Показать карточку: '+title);
 });
}
paperStack.addEventListener('click',event=>{
 const card=event.target.closest('.al-paper');
 if(!card||card.classList.contains('al-paper-front'))return;
 event.preventDefault();event.stopPropagation();
 const front=paperStack.querySelector('.al-paper-front');
 const slot=card.classList.contains('al-paper-back')?'al-paper-back':'al-paper-middle';
 front.classList.replace('al-paper-front',slot);
 card.classList.replace(slot,'al-paper-front');
 updatePaperAccess();
 card.querySelector('.al-paper-label').focus({preventScroll:true});
},true);
updatePaperAccess();
