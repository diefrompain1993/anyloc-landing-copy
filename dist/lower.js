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

const storyIcon=(type)=>`<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">${({check:'<path d="m5 12 4 4L19 6"/>',nfc:'<path d="M7 8a6 6 0 0 1 0 8M11 5a10 10 0 0 1 0 14M15 2a14 14 0 0 1 0 20"/>',file:'<path d="M14 3H5v18h14V8Zm0 0v5h5M8 12h8M8 16h6"/>',camera:'<path d="M3 7h4l2-3h6l2 3h4v14H3Z"/><circle cx="12" cy="13" r="4"/>'})[type]}</svg>`;
const stories={
 presence:{number:'01 / ПРИСУТСТВИЕ',heading:'Начало смены.<br>Одно касание.',text:'Телефон касается NFC-метки — приход отмечен. Руководителю не нужно уточнять, кто уже на месте: всё видно в Anyloc.',tags:['Вход и выход','Рабочее время'],link:'Посмотреть учёт присутствия',screen:'presence',title:'Вы на месте',subtitle:'Начало смены · 09:41',icon:'nfc',event:'Вход подтверждён',detail:'БЦ Орион · Алексей Воронов'},
 service:{number:'02 / ОБСЛУЖИВАНИЕ',heading:'Работа сделана.<br>Детали сохранены.',text:'Проверили оборудование? Добавьте фото и комментарий к отчёту. В журнале объекта останется вся история обслуживания.',tags:['Фото и комментарии','Журнал объекта'],link:'Посмотреть пример отчёта',screen:'reports',title:'Всё в порядке',subtitle:'Проверка оборудования',icon:'file',event:'Отчёт в журнале',detail:'Осмотр завершён · 2 фотографии'},
 cleaning:{number:'03 / КЛИНИНГ',heading:'Чистый результат.<br>Понятный отчёт.',text:'Команда завершает уборку и отправляет фотографии из приложения. Руководитель видит результат по каждому объекту.',tags:['Отчёты с объекта','История работ'],link:'Посмотреть отчёт о работе',screen:'reports',title:'Готово к новому дню',subtitle:'Уборка общих зон',icon:'camera',event:'Результат сохранён',detail:'БЦ Орион · Отчёт об уборке'}
};
function setStory(key,animate=true){
 const d=stories[key],panel=document.querySelector('#story-panel');
 document.querySelectorAll('[data-place]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.place===key)));
 panel.dataset.story=key;
 document.querySelector('#place-detail').innerHTML=`<span class="story-index">${d.number}</span><h3>${d.heading}</h3><p>${d.text}</p><div class="story-tags">${d.tags.map(t=>`<span>${storyIcon('check')}${t}</span>`).join('')}</div><a class="story-link" href="#demo" data-story-demo="${d.screen}">${d.link} <span>→</span></a>`;
 const middle=key==='presence'?`<div class="tap-scene"><div class="tap-mark">${storyIcon('nfc')}<small>ANYLOC / NFC</small></div><div class="tap-rings"></div><div class="tap-phone"><div class="tap-island"></div><span class="tap-time">9:41</span><div class="tap-success">${storyIcon('check')}</div><b>Вы на объекте</b><small>БЦ Орион</small><span class="tap-phone-line"></span></div></div>`:key==='service'?`<div class="report-scene"><div class="report-sheet"><span class="sheet-overline">ANYLOC / ЖУРНАЛ ОБЪЕКТА</span><h4>Проверка оборудования</h4><div class="sheet-rule"></div><p>Осмотр завершён.<br>Отклонений не выявлено.</p><div class="sheet-photos"><img src="assets/technical-room.png" alt="Пример фотографии оборудования"><img src="assets/utility-inspection.png" alt="Пример фотографии осмотра"></div><span class="sheet-status">${storyIcon('check')} Отчёт сохранён</span></div><div class="floating-symbol">${storyIcon('file')}</div></div>`:`<div class="clean-scene"><div class="clean-tile"><div class="clean-window"><i></i><i></i><i></i><i></i></div><div class="clean-floor"></div><span class="sparkle spark-one">✦</span><span class="sparkle spark-two">✧</span></div><div class="clean-note"><span class="sheet-overline">ОТЧЁТ ОБ УБОРКЕ</span><b>Общие зоны готовы</b><span>${storyIcon('check')} Фото приложены</span><span>${storyIcon('check')} Комментарий добавлен</span></div><div class="floating-symbol">${storyIcon('camera')}</div></div>`;
 document.querySelector('#story-visual').innerHTML=`<div class="visual-orbit"></div><div class="visual-orbit orbit-inner"></div><span class="visual-caption">${d.subtitle}</span>${middle}<div class="story-receipt"><span class="receipt-icon">${storyIcon('check')}</span><div><b>${d.event}</b><small>${d.detail}</small></div><span class="receipt-dot"></span></div>`;
 if(animate&&!quiet.matches){panel.querySelectorAll('.story-copy,.story-visual').forEach(el=>el.animate([{opacity:0,transform:'translateY(10px)'},{opacity:1,transform:'translateY(0)'}],{duration:450,easing:'cubic-bezier(.22,1,.36,1)'}));}
}
document.querySelectorAll('[data-place]').forEach(b=>b.addEventListener('click',()=>setStory(b.dataset.place)));
document.querySelector('.work-stories').addEventListener('click',e=>{const a=e.target.closest('[data-story-demo]');if(a)setTab(a.dataset.storyDemo);});
setStory('presence',false);

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
 if(journey.dataset.scrollStory==='true'&&desktopStory.matches&&rect.bottom>0&&rect.top<viewport){
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

// Feature explorer: one shared canvas, four distinct stories.
const featureViews={
 journal:()=>`<div class="space-canvas-title"><span>ЖУРНАЛ ОБЪЕКТА</span><span>БЦ Орион ↗</span></div><div class="history-orbit"></div><div class="history-card"><div class="history-head"><span class="space-icon">${storyIcon('file')}</span><div><b>Всё складывается в историю</b><small>Сегодня · БЦ Орион</small></div></div><div class="history-event"><time>09:41</time><i class="event-green"></i><div><b>Алексей на объекте</b><span>Отметка через NFC</span></div>${storyIcon('check')}</div><div class="history-event"><time>10:24</time><i class="event-blue"></i><div><b>Оборудование проверено</b><span>Отчёт и две фотографии</span></div>${storyIcon('file')}</div><div class="history-preview"><img src="assets/technical-room.png" alt="Техническое помещение"><span>«Осмотр завершён.<br>Отклонений не выявлено»</span></div><button class="space-action" data-open-ui="journal">Открыть журнал <span>→</span></button></div><div class="space-float float-comment"><span>↳</span> Детали не теряются</div><div class="space-float float-photo">${storyIcon('camera')} Фото приложены</div>`,
 access:()=>`<div class="space-canvas-title"><span>ВАША КОМАНДА</span><span>Доступ по ролям</span></div><div class="access-map"><div class="access-root"><img src="assets/anyloc-logo.png" alt="Anyloc"><span>Общее пространство</span></div><div class="access-connectors"></div><div class="access-roles"><button data-role-view="lead" aria-pressed="true"><span class="role-face">АК</span><b>Руководитель</b></button><button data-role-view="partner" aria-pressed="false"><span class="role-face">МВ</span><b>Подрядчик</b></button><button data-role-view="worker" aria-pressed="false"><span class="role-face">ДС</span><b>Сотрудник</b></button></div><div class="access-scope" id="access-scope"><span class="scope-label">РУКОВОДИТЕЛЬ</span><h3>Общая картина работы</h3><p>Просматривает объекты, отчёты и работу команды в пределах выданных прав.</p><span class="scope-pill">Объекты</span><span class="scope-pill">Команда</span><span class="scope-pill">Отчёты</span></div></div><span class="canvas-hint">Выберите роль и посмотрите её возможности</span>`,
 tags:()=>`<div class="space-canvas-title"><span>NFC-МЕТКИ</span><span>Одно касание</span></div><div class="tag-config"><div class="new-nfc-tag"><span class="tag-dot"></span>${storyIcon('nfc')}<b>Anyloc</b><small id="tag-purpose">ПРИСУТСТВИЕ</small></div><div class="tag-config-card"><span class="scope-label">ЧТО ПРОИЗОЙДЁТ ПРИ КАСАНИИ?</span><div class="tag-options"><button data-tag-view="presence" aria-pressed="true">${storyIcon('check')} Отметить приход</button><button data-tag-view="journal" aria-pressed="false">${storyIcon('file')} Открыть журнал</button></div><p id="tag-explanation">Метка помогает сотруднику отметить начало или окончание работы на объекте.</p></div></div><span class="canvas-hint">Одна метка — выбранный рабочий сценарий</span>`,
 export:()=>`<div class="space-canvas-title"><span>ЭКСПОРТ ДАННЫХ</span><span>За нужный период</span></div><div class="export-scene"><div class="export-source"><span class="space-icon">${storyIcon('file')}</span><b>История работы</b><small>Отметки · объекты · сотрудники</small><div class="export-lines"><i></i><i></i><i></i></div></div><div class="export-flow">↓</div><div class="format-options" role="group" aria-label="Пример формата данных"><button data-format-view="Excel" aria-pressed="true"><span>X</span>Excel</button><button data-format-view="CSV" aria-pressed="false"><span>≡</span>CSV</button><button data-format-view="JSON" aria-pressed="false"><span>{ }</span>JSON</button></div><p id="format-description">Таблица для расчётов и сверок в Excel.</p><span class="export-note">Формат выбирается при выгрузке в Anyloc</span></div>`
};
const featureStage=document.querySelector('#space-stage');
function setFeature(key){
 document.querySelectorAll('[data-feature]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.feature===key)));
 featureStage.dataset.featureView=key;featureStage.innerHTML=featureViews[key]();
 if(!quiet.matches)featureStage.animate([{opacity:.15,transform:'translateY(9px)'},{opacity:1,transform:'translateY(0)'}],{duration:420,easing:'cubic-bezier(.22,1,.36,1)'});
}
document.querySelectorAll('[data-feature]').forEach(b=>b.addEventListener('click',()=>setFeature(b.dataset.feature)));
featureStage.addEventListener('click',e=>{
 const b=e.target.closest('button');if(!b)return;
 if(b.dataset.roleView){
  const roles={lead:['РУКОВОДИТЕЛЬ','Общая картина работы','Просматривает объекты, отчёты и работу команды в пределах выданных прав.',['Объекты','Команда','Отчёты']],partner:['ПОДРЯДЧИК','Своя команда и объекты','Работает с назначенными объектами и сотрудниками своей организации.',['Свои объекты','Сотрудники','Работы']],worker:['СОТРУДНИК','Всё для работы на месте','Отмечает присутствие, выполняет назначенные задачи и отправляет отчёты.',['Отметки','Мои задачи','Мои отчёты']]};
  const r=roles[b.dataset.roleView];featureStage.querySelectorAll('[data-role-view]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));document.querySelector('#access-scope').innerHTML=`<span class="scope-label">${r[0]}</span><h3>${r[1]}</h3><p>${r[2]}</p>${r[3].map(t=>`<span class="scope-pill">${t}</span>`).join('')}`;
 }
 if(b.dataset.tagView){const journal=b.dataset.tagView==='journal';featureStage.querySelectorAll('[data-tag-view]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));document.querySelector('#tag-purpose').textContent=journal?'ЖУРНАЛ':'ПРИСУТСТВИЕ';document.querySelector('#tag-explanation').textContent=journal?'Метка открывает журнал объекта для отправки отчёта о выполненной работе.':'Метка помогает сотруднику отметить начало или окончание работы на объекте.';}
 if(b.dataset.formatView){featureStage.querySelectorAll('[data-format-view]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));document.querySelector('#format-description').textContent=({Excel:'Таблица для расчётов и сверок в Excel.',CSV:'Строки данных для импорта в таблицы и другие системы.',JSON:'Структурированные данные для дальнейшей обработки.'})[b.dataset.formatView];}
});
setFeature('journal');
