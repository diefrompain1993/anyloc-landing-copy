import {bindProductUI, detailView} from './product-ui.js';
const world = document.querySelector('.al-world');
const quiet = matchMedia('(prefers-reduced-motion: reduce)');
world.classList.add('al-motion');
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => { if(entry.isIntersecting) {entry.target.classList.add('is-visible'); revealObserver.unobserve(entry.target);} });
}, {threshold: 0, rootMargin:'300px'});
world.querySelectorAll('[data-enter]').forEach(element => revealObserver.observe(element));

const storyIcon=(type)=>`<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">${({check:'<path d="m5 12 4 4L19 6"/>',nfc:'<path d="M7 8a6 6 0 0 1 0 8M11 5a10 10 0 0 1 0 14M15 2a14 14 0 0 1 0 20"/>',file:'<path d="M14 3H5v18h14V8Zm0 0v5h5M8 12h8M8 16h6"/>',camera:'<path d="M3 7h4l2-3h6l2 3h4v14H3Z"/><circle cx="12" cy="13" r="4"/>'})[type]}</svg>`;
const stories={
 presence:{number:'01 / ПРИСУТСТВИЕ',heading:'Учёт присутствия<br>с защищёнными NFC-метками',text:'Сотрудник прикладывает телефон к защищённой NFC-метке на объекте. Anyloc сохраняет время отметки, а руководитель видит текущие смены и отработанные часы.',tags:['Вход и выход','Рабочее время'],link:'Посмотреть учёт присутствия',screen:'presence',title:'Вы на месте',subtitle:'Начало смены · 09:41',icon:'nfc',event:'Вход подтверждён',detail:'БЦ Орион · Алексей Воронов'},
 service:{number:'02 / ОБСЛУЖИВАНИЕ',heading:'Сохраняйте отчёты<br>об обслуживании',text:'После проверки оборудования сотрудник отправляет отчёт с фотографиями и комментарием. Руководитель может открыть отчёт в карточке объекта.',tags:['Фото и комментарии','Отчёты объекта'],link:'Посмотреть пример отчёта',screen:'reports',title:'Проверка завершена',subtitle:'Проверка оборудования',icon:'file',event:'Отчёт в журнале',detail:'Осмотр завершён · 2 фотографии'},
 cleaning:{number:'03 / КЛИНИНГ',heading:'Проверяйте уборку<br>по фотоотчётам',text:'После уборки сотрудник прикладывает фотографии и описывает выполненную работу. Отчёт сохраняется в журнале выбранного объекта.',tags:['Отчёты с объекта','История работ'],link:'Посмотреть отчёт о работе',screen:'reports',title:'Уборка завершена',subtitle:'Уборка общих зон',icon:'camera',event:'Отчёт об уборке сохранён',detail:'БЦ Орион · Отчёт об уборке'}
};
function setStory(key,animate=true){
 const d=stories[key],panel=document.querySelector('#story-panel');
 document.querySelectorAll('[data-place]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.place===key)));
 panel.dataset.story=key;
 document.querySelector('#place-detail').innerHTML=`<div class="exhibit-copy-icon" aria-hidden="true">${storyIcon(d.icon)}</div><h3>${d.heading}</h3><p>${d.text}</p>`;
 const sceneDetails={
 presence:{pin:'Вход',icon:'nfc',name:'Алексей Воронов',status:'На объекте',time:'09:41',detail:'NFC-отметка сохранена'},
 service:{pin:'Оборудование',icon:'file',name:'Проверка вентиляции',status:'Отчёт отправлен',time:'10:24',detail:'Фильтры и решётки в норме'},
 cleaning:{pin:'Общие зоны',icon:'camera',name:'Уборка этажа',status:'Фотоотчёт отправлен',time:'11:15',detail:'Полы и поверхности очищены'}
 };
 const v=sceneDetails[key];
 const extra=key==='presence'?`<div class="exhibit-token">${storyIcon('nfc')}<span>NFC</span></div>`:key==='service'?`<div class="exhibit-mini"><span>Вентиляция</span><div class="inspection-bars"><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div><b>${storyIcon('check')} Проверено</b></div>`:`<div class="exhibit-photo"><img src="assets/atrium.jpg" alt="Чистый холл после уборки"><span>${storyIcon('camera')} Фото приложено</span></div>`;
 document.querySelector('#story-visual').innerHTML=`<div class="exhibit-light"></div><img class="exhibit-building" src="assets/scenario-building.webp" alt="Объёмный макет офисного здания с входом и рабочими помещениями"><div class="exhibit-pin">${storyIcon(v.icon)}<span>${v.pin}</span></div>${extra}<div class="exhibit-event"><div class="exhibit-event-top"><span>${storyIcon(v.icon)}</span><b>${v.name}</b><time>${v.time}</time></div><p>${v.detail}</p><div class="exhibit-event-status">${storyIcon('check')}${v.status}<span></span></div></div>`;
 if(animate&&!quiet.matches){panel.querySelectorAll('.story-copy,.exhibit-event,.exhibit-pin,.exhibit-token,.exhibit-mini,.exhibit-photo').forEach(el=>el.animate([{opacity:0,translate:'0 10px'},{opacity:1,translate:'0 0'}],{duration:450,easing:'cubic-bezier(.22,1,.36,1)'}));}
}
document.querySelectorAll('[data-place]').forEach(b=>b.addEventListener('click',()=>setStory(b.dataset.place)));
setStory('presence',false);

// Static fragments from the supplied iOS screenshots. Only the section switcher is interactive.
const mobileViews={
 objects:{title:'Объекты',heading:'Информация об объекте<br>в мобильном приложении',text:'Откройте нужный объект, посмотрите адрес, контакты и последние отчёты. Отсюда можно перейти к отправке нового отчёта.',chips:['Список объектов','Контакты','Журнал'],color:'#2768df',bg:'#eaf1ff',first:['objects',100,630,'Список объектов в приложении Anyloc'],second:['object',236,390,'Карточка объекта с адресом, контактами и кнопкой отчёта'],label:'Карточка объекта',stamp:'В приложении',icon:'file'},
 scan:{title:'NFC-отметки',heading:'Отмечайте вход и выход<br>с помощью телефона',text:'Поднесите телефон к защищённой NFC-метке на объекте. Сохранённую отметку можно проверить в истории вместе с временем входа или выхода.',chips:['Сканирование NFC','Вход и выход'],color:'#7550d8',bg:'#f0eaff',first:['scan',430,450,'Поиск NFC-метки в приложении'],second:['history',430,305,'Записи о входе и выходе в истории'],label:'Отметка в истории',stamp:'NFC',icon:'nfc'},
 report:{title:'Отчёты',heading:'Отправляйте отчёты<br>с места работы',text:'Опишите выполненную работу и приложите фотографии или файлы. Отправленные отчёты доступны в карточке объекта.',chips:['Описание работы','Фото и файлы'],color:'#2768df',bg:'#eaf1ff',first:['report',237,820,'Форма отчёта с полем описания, вложениями и кнопкой отправки'],second:['object',660,385,'Последние отчёты в карточке объекта'],label:'Отчёты объекта',stamp:'Отчёт',icon:'file'},
 tasks:{title:'Задачи',heading:'Проверяйте задачи<br>и сроки выполнения',text:'В приложении видны назначенные работы и сроки. Выполненные задачи остаются в списке с отметкой о завершении.',chips:['Назначенные работы','Сроки','Статусы'],color:'#bc7a00',bg:'#fff1cd',first:['tasks',100,375,'Открытые задачи с датами выполнения'],second:['tasks',475,290,'Выполненные задачи с отметками'],label:'Выполненные работы',stamp:'Задачи',icon:'check'},
 history:{title:'История',heading:'Просматривайте отметки<br>и рабочее время',text:'Проверьте рабочие часы за неделю, время входа и выхода, а также отправленные отчёты. Записи в истории сгруппированы по дням.',chips:['Рабочие часы','Отметки','Отчёты'],color:'#348269',bg:'#e4f2eb',first:['history',100,310,'Рабочие часы за неделю в приложении'],second:['history',430,620,'История входов, выходов и отправленных отчётов'],label:'Записи по дням',stamp:'История',icon:'file'}
};
const mobileTabs=[...document.querySelectorAll('[data-mobile]')];
const mobileArt=new Map();
function prepareMobileArt(key){
 if(!mobileArt.has(key)){
  const img=new Image();img.className='unified-ios-art';img.width=680;img.height=520;img.draggable=false;
  img.alt=mobileViews[key].first[3]+'. '+mobileViews[key].second[3]+'.';
  img.src='assets/ios/showcase-'+key+'.svg?v=12';
  const ready=img.decode().then(()=>img);
  ready.catch(()=>{});mobileArt.set(key,ready);
 }
 return mobileArt.get(key);
}
Object.keys(mobileViews).forEach(prepareMobileArt);
let activeMobile,mobileRequest=0;
async function setMobile(key,animate=true){
 const request=++mobileRequest;
 if(activeMobile===key){document.querySelector('#mobile-panel').removeAttribute('aria-busy');return;}
 const target=document.querySelector('#mobile-panel');target.setAttribute('aria-busy','true');
 let decoded;
 try{decoded=await prepareMobileArt(key);}catch{
  if(request===mobileRequest){target.removeAttribute('aria-busy');mobileArt.delete(key);}
  return;
 }
 if(request!==mobileRequest)return;
 activeMobile=key;target.removeAttribute('aria-busy');
 const d=mobileViews[key],panel=document.querySelector('#mobile-panel'),art=document.querySelector('#mobile-collage');
 mobileTabs.forEach(b=>{const selected=b.dataset.mobile===key;b.setAttribute('aria-selected',String(selected));b.tabIndex=selected?0:-1;});
 if(animate){const tab=mobileTabs.find(b=>b.dataset.mobile===key),strip=tab.parentElement;strip.scrollTo({left:tab.offsetLeft-strip.offsetLeft-(strip.clientWidth-tab.clientWidth)/2,behavior:quiet.matches?'instant':'smooth'});}
 panel.setAttribute('aria-labelledby',`mobile-tab-${key}`);panel.dataset.mobileView=key;
 panel.style.setProperty('--mobile-accent',d.color);panel.style.setProperty('--mobile-tint',d.bg);
 document.querySelector('#mobile-copy').innerHTML=`<div class="mobile-product"><img src="assets/favicon.png" width="32" height="32" alt=""><strong>Anyloc</strong><span>${d.title}</span></div><h2>${d.heading.replaceAll('<br>','<br> ')}</h2><p>${d.text}</p>`;
 art.replaceChildren(decoded);
 if(animate&&!quiet.matches){panel.getAnimations().forEach(a=>a.cancel());panel.animate([{opacity:0,transform:'translateY(8px)'},{opacity:1,transform:'translateY(0)'}],{duration:380,easing:'cubic-bezier(.22,1,.36,1)'});}
}
mobileTabs.forEach((button,index)=>{
 button.addEventListener('click',()=>setMobile(button.dataset.mobile));
 button.addEventListener('keydown',e=>{let next;if(e.key==='ArrowRight')next=(index+1)%mobileTabs.length;else if(e.key==='ArrowLeft')next=(index+mobileTabs.length-1)%mobileTabs.length;else if(e.key==='Home')next=0;else if(e.key==='End')next=mobileTabs.length-1;else return;e.preventDefault();setMobile(mobileTabs[next].dataset.mobile);mobileTabs[next].focus();});
});
setMobile('objects',false);

const preview=document.querySelector('#interface-preview');
let previousFocus;
function openUI(key,value){
 if(!preview.open)previousFocus=document.activeElement;
 document.querySelector('#preview-title').textContent=({presence:'Присутствие',report:'Отчёт',journal:'Журнал',service:'Обслуживание',tasks:'Задачи',session:'Присутствие',profile:'Профиль',photo:'Вложение'})[key]||'Anyloc';
 document.querySelector('#preview-content').innerHTML=detailView(key,value);
 if(!preview.open)preview.showModal();
}
bindProductUI(world,{open:openUI,step:()=>{}});
preview.querySelector('[data-close-preview]').addEventListener('click',()=>preview.close());
preview.addEventListener('click',event=>{if(event.target===preview)preview.close();});
preview.addEventListener('close',()=>previousFocus?.focus({preventScroll:true}));


// Feature explorer: one shared canvas, four distinct stories.
// Animate both directions while retaining native details/summary keyboard behavior.
const faqControllers=[];
document.querySelectorAll('.faq-list details').forEach(details=>{
 const summary=details.querySelector('summary');
 const answer=details.querySelector('p');
 let motion=null,fade=null,expanded=details.open;
 const setExpanded=next=>{
  if(expanded===next)return;
  const startHeight=details.getBoundingClientRect().height;
  const startOpacity=details.open?getComputedStyle(answer).opacity:'0';
  expanded=next;
  motion?.cancel();fade?.cancel();
  summary.setAttribute('aria-expanded',String(expanded));
  if(quiet.matches){details.open=expanded;details.style.height='';details.style.overflow='';return;}
  // Measure the natural destination before locking the current visual height.
  details.style.height='';
  details.open=expanded;
  const endHeight=details.getBoundingClientRect().height;
  details.open=true;
  details.style.height=`${startHeight}px`;details.style.overflow='hidden';
  const timing={duration:380,easing:'cubic-bezier(.22,1,.36,1)'};
  const current=details.animate({height:[`${startHeight}px`,`${endHeight}px`]},timing);
  motion=current;
  fade=answer.animate({opacity:[startOpacity,expanded?'1':'0']},timing);
  current.onfinish=()=>{
   if(motion!==current)return;
   details.open=expanded;details.style.height='';details.style.overflow='';
   motion=null;fade=null;
  };
 };
 faqControllers.push({details,setExpanded});
 summary.setAttribute('aria-expanded',String(expanded));
 summary.addEventListener('click',event=>{
  event.preventDefault();
  const next=!expanded;
  if(next)faqControllers.forEach(controller=>{if(controller.details!==details)controller.setExpanded(false);});
  setExpanded(next);
 });
});
// Management analytics: synthetic examples follow the product's actual metrics.
const analyticsBoard=document.querySelector('#analytics-demo');
let analyticsMode='object',analyticsMetric='visits',analyticsDay=21,analyticsObject=0;
const analyticsDays=Array.from({length:31},(_,i)=>{const d=i+1,weekday=new Date(2026,9,d).getDay();const visits=weekday===0?0:weekday===6?2:5+(d*7%9);return {visits,reports:visits?1+d%4:0,cleanings:visits?1+d%2:0};});
const analyticsLabels={visits:'Посещения',reports:'Отчёты',cleanings:'Уборки'};
const analyticsTotals=Object.fromEntries(Object.keys(analyticsLabels).map(k=>[k,analyticsDays.reduce((n,d)=>n+d[k],0)]));
const analyticsObjects=[{name:'БЦ Север',hours:184,people:4,days:23},{name:'ЖК Сосновый',hours:128,people:3,days:16},{name:'Технопарк',hours:72,people:2,days:9},{name:'Склад Восток',hours:0,people:0,days:0}];
function analyticsCalendar(){return `<div class="an-calendar"><div class="an-panel-title"><h4>Календарь активности</h4><span>Октябрь</span></div><div class="an-week">${['Пн','Вт','Ср','Чт','Пт','Сб','Вс'].map(d=>`<span>${d}</span>`).join('')}</div><div class="an-days">${'<span></span>'.repeat(3)}${analyticsDays.map((v,i)=>`<button data-analytics-day="${i+1}" aria-pressed="${analyticsDay===i+1}" aria-label="${i+1} октября: ${analyticsLabels[analyticsMetric]} — ${v[analyticsMetric]}" style="--heat:${v[analyticsMetric]?Math.min(4,Math.ceil(v[analyticsMetric]/(analyticsMetric==='visits'?3:1))):0}"><span>${i+1}</span><b>${v[analyticsMetric]||'—'}</b></button>`).join('')}</div><div class="an-legend"><span>Меньше</span>${[0,1,2,3,4].map(i=>`<i style="--heat:${i}"></i>`).join('')}<span>Больше</span></div></div>`;}
function renderAnalytics(animate=false){
 document.querySelector('#management-context-name').textContent=analyticsMode==='object'?'Объект · БЦ Север':'Подрядчик · Техсервис';
 const isObject=analyticsMode==='object',selected=analyticsDays[analyticsDay-1],obj=analyticsObjects[analyticsObject],people=[[['Алексей Воронов','АВ',5],['Елена Соколова','ЕС',3],['Михаил Крылов','МК',2],['Анна Белова','АБ',2]],[['Михаил Крылов','МК',4],['Анна Белова','АБ',2],['Даниил Орлов','ДО',2]],[['Даниил Орлов','ДО',3],['Мария Волкова','МВ',1]],[]][analyticsObject];
 analyticsBoard.innerHTML=`
 <div class="an-metrics">${isObject?Object.entries(analyticsLabels).map(([key,label])=>`<button data-analytics-metric="${key}" aria-pressed="${analyticsMetric===key}"><span>${label}</span><strong>${analyticsTotals[key]}</strong><small>за месяц <span>↗</span></small></button>`).join(''):`<div><span>Отработано за месяц</span><strong>384 <small>ч</small></strong><small>на всех объектах</small></div><div><span>Сотрудники</span><strong>6</strong><small>с посещениями за месяц</small></div><div><span>Объекты с посещениями</span><strong>3 <small>из 4</small></strong><small>1 объект без посещений</small></div>`}</div>
 <div class="an-detail-grid ${isObject?'':'is-contractor'}">${isObject?analyticsCalendar():`<div class="an-object-list"><div class="an-panel-title"><h4>Время по объектам</h4><span>384 ч</span></div>${analyticsObjects.map((o,i)=>`<button data-analytics-object="${i}" aria-pressed="${analyticsObject===i}"><span class="an-object-row"><b>${o.name}</b><strong>${o.hours} <small>ч</small></strong></span><span class="an-bar"><i style="width:${o.hours/184*100}%"></i></span><span class="an-object-meta">${o.hours?`${o.people} сотрудника · ${o.days} ${o.days===23?'дня':'дней'}`:'Без посещений за месяц'}<span>↗</span></span></button>`).join('')}</div>`}
 <div class="an-inspector">${isObject?`<div class="an-panel-title"><h4>${analyticsDay} октября</h4><span class="an-live-dot">Выбранный день</span></div><div class="an-day-stats">${Object.entries(analyticsLabels).map(([k,l])=>`<span><b>${selected[k]}</b>${l.toLowerCase()}</span>`).join('')}</div><div class="an-hour-caption">Посещения по часам завершения</div><div class="an-hours">${Array.from({length:24},(_,h)=>{const n=h===17?Math.ceil(selected.visits*.5):h===18?Math.floor(selected.visits*.3):h===19?selected.visits-Math.ceil(selected.visits*.5)-Math.floor(selected.visits*.3):0;return `<div title="${h}:00 — ${n}"><i style="height:${n*8+3}px"></i>${h%6===0?`<span>${String(h).padStart(2,'0')}</span>`:''}</div>`;}).join('')}</div><div class="an-panel-title an-contract-title"><h4>Подрядчики за месяц</h4><span>Посещения</span></div>${[['Техсервис',Math.round(analyticsTotals.visits*.55)],['Чистый город',Math.round(analyticsTotals.visits*.3)],['Сервис Плюс',analyticsTotals.visits-Math.round(analyticsTotals.visits*.55)-Math.round(analyticsTotals.visits*.3)]].map(([name,n],i)=>`<div class="an-company"><span class="an-company-icon c${i}">${name[0]}</span><div><span>${name}<b>${n}</b></span><i style="--bar:${n/analyticsTotals.visits*100}%"></i></div></div>`).join('')}`:`<div class="an-panel-title"><h4>${obj.name}</h4></div>${obj.hours?`<div class="an-work-total"><strong>${obj.hours}<span> ч</span></strong><p>Отработано за месяц<br>на этом объекте</p></div><div class="an-date-row"><b>21 октября</b><span>${people.reduce((sum,p)=>sum+p[2],0)} ч</span></div><p class="an-employee-caption">Сотрудники за выбранный день</p>${people.map(([name,initials,hours])=>`<div class="an-person"><span>${initials}</span><div><b>${name}</b><small>Отработанное время</small></div><strong>${hours} ч</strong></div>`).join('')}`:`<div class="an-empty"><span>—</span><h4>В этом месяце посещений нет</h4><p>Объект остаётся в списке, чтобы его было удобно проверить.</p></div>`}`}</div></div>`;
 if(animate&&!quiet.matches)analyticsBoard.animate([{opacity:.3,transform:'translateY(7px)'},{opacity:1,transform:'translateY(0)'}],{duration:300,easing:'cubic-bezier(.22,1,.36,1)'});
}
document.querySelectorAll('[data-analytics-mode]').forEach(button=>button.addEventListener('click',()=>{analyticsMode=button.dataset.analyticsMode;document.querySelectorAll('[data-analytics-mode]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));renderAnalytics(true);}));
analyticsBoard.addEventListener('click',event=>{const button=event.target.closest('button');if(!button)return;let focusSelector='';if(button.dataset.analyticsDay){analyticsDay=Number(button.dataset.analyticsDay);focusSelector=`[data-analytics-day="${analyticsDay}"]`;}else if(button.dataset.analyticsMetric){analyticsMetric=button.dataset.analyticsMetric;focusSelector=`[data-analytics-metric="${analyticsMetric}"]`;}else if(button.dataset.analyticsObject){analyticsObject=Number(button.dataset.analyticsObject);focusSelector=`[data-analytics-object="${analyticsObject}"]`;}else return;renderAnalytics();analyticsBoard.querySelector(focusSelector)?.focus({preventScroll:true});});
renderAnalytics();
// Contact prototype: validates locally and never sends or persists phone numbers.
const contactDialog=document.querySelector('#contact-dialog');
const contactForm=document.querySelector('#contact-form');
const contactPhone=document.querySelector('#contact-phone');
const contactError=document.querySelector('#contact-error');
const contactResult=document.querySelector('.contact-result');
let contactClosing=false,contactTouched=false,contactOverflow=false,contactScroll='',contactOpener=null;
function phoneDigits(value){let digits=value.replace(/\D/g,'');if(digits[0]==='7'||digits[0]==='8')digits=digits.slice(1);return digits;}
function phoneMask(d){return '+7'+(d.length?' ('+d.slice(0,3):'')+(d.length>=3?')':'')+(d.length>3?' '+d.slice(3,6):'')+(d.length>6?'-'+d.slice(6,8):'')+(d.length>8?'-'+d.slice(8,10):'');}
function validateContact(showError=false){const digits=phoneDigits(contactPhone.value);const valid=digits.length===10&&!contactOverflow&&!/^(\d)\1{9}$/.test(digits);contactPhone.closest('.contact-input-wrap').classList.toggle('is-valid',valid);contactPhone.setAttribute('aria-invalid',String(showError&&!valid));contactError.textContent=showError&&!valid?'Проверьте корректность номера.':'';return valid;}
contactPhone.addEventListener('input',()=>{const raw=contactPhone.value,caret=contactPhone.selectionStart??raw.length;const before=phoneDigits(raw.slice(0,caret)).length;const digits=phoneDigits(raw);contactOverflow=digits.length>10;contactPhone.value=digits.length||raw?phoneMask(digits.slice(0,10)):'';let position=2,count=0;for(let i=2;i<contactPhone.value.length;i++){if(/\d/.test(contactPhone.value[i]))count++;if(count>=before){position=i+1;break;}position=i+1;}if(caret===raw.length)position=contactPhone.value.length;contactPhone.setSelectionRange(position,position);validateContact(contactTouched);});
contactPhone.addEventListener('keydown',event=>{
 if(event.key!=='Backspace'||contactPhone.selectionStart!==contactPhone.selectionEnd)return;
 const caret=contactPhone.selectionStart,value=contactPhone.value;
 if(caret<=2){event.preventDefault();if(phoneDigits(value).length===0)contactPhone.value='';return;}
 if(!/\d/.test(value[caret-1])){
  event.preventDefault();let index=caret-1;while(index>1&&!/\d/.test(value[index]))index--;
  if(index>1){const next=value.slice(0,index)+value.slice(caret);contactPhone.value=next;contactPhone.setSelectionRange(index,index);contactPhone.dispatchEvent(new Event('input',{bubbles:true}));}
 }
});
contactPhone.addEventListener('blur',()=>{if(contactPhone.value){contactTouched=true;validateContact(true);}});
function openContact(event){if(contactDialog.open||contactClosing)return;contactOpener=event.currentTarget;contactForm.reset();contactTouched=false;contactOverflow=false;validateContact();contactResult.hidden=true;contactForm.hidden=false;document.querySelector('#contact-title').hidden=false;contactDialog.setAttribute('aria-labelledby','contact-title');document.querySelector('#contact-description').hidden=false;contactScroll=document.documentElement.style.overflow;document.documentElement.style.overflow='hidden';contactDialog.showModal();if(!quiet.matches)contactDialog.animate([{opacity:0,transform:'translateY(18px) scale(.97)'},{opacity:1,transform:'translateY(0) scale(1)'}],{duration:350,easing:'cubic-bezier(.22,1,.36,1)'});contactPhone.focus();}
async function closeContact(){if(!contactDialog.open||contactClosing)return;contactClosing=true;if(!quiet.matches)await contactDialog.animate([{opacity:1,transform:'translateY(0) scale(1)'},{opacity:0,transform:'translateY(10px) scale(.98)'}],{duration:180,easing:'ease-in',fill:'forwards'}).finished;contactDialog.close();contactDialog.getAnimations().forEach(a=>a.cancel());document.documentElement.style.overflow=contactScroll;contactClosing=false;contactOpener?.focus({preventScroll:true});}
document.querySelectorAll('.contact-trigger').forEach(button=>button.addEventListener('click',openContact));
document.querySelector('.contact-close').addEventListener('click',closeContact);
document.querySelector('.contact-done').addEventListener('click',closeContact);
contactDialog.addEventListener('cancel',event=>{event.preventDefault();closeContact();});
contactDialog.addEventListener('click',event=>{const r=contactDialog.getBoundingClientRect();if(event.target===contactDialog&&(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom))closeContact();});
contactForm.addEventListener('submit',event=>{event.preventDefault();contactTouched=true;if(!validateContact(true)){contactPhone.focus();return;}contactForm.hidden=true;document.querySelector('#contact-title').hidden=true;contactDialog.setAttribute('aria-labelledby','contact-result-title');document.querySelector('#contact-description').hidden=true;contactResult.hidden=false;contactResult.focus();if(!quiet.matches)contactResult.animate([{opacity:0,transform:'translateY(8px)'},{opacity:1,transform:'translateY(0)'}],{duration:300,easing:'ease-out'});});

// Compact mobile navigation, with the same links as on desktop.
const navToggle=document.querySelector('.nav-toggle');
const siteHeader=document.querySelector('.header');
function closeNavigation(){siteHeader.classList.remove('nav-open');navToggle.setAttribute('aria-expanded','false');navToggle.setAttribute('aria-label','Открыть меню');}
navToggle.addEventListener('click',()=>{const open=navToggle.getAttribute('aria-expanded')!=='true';siteHeader.classList.toggle('nav-open',open);navToggle.setAttribute('aria-expanded',String(open));navToggle.setAttribute('aria-label',open?'Закрыть меню':'Открыть меню');});
document.querySelectorAll('#site-navigation a').forEach(a=>a.addEventListener('click',closeNavigation));
document.addEventListener('click',e=>{if(!siteHeader.contains(e.target))closeNavigation();});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&siteHeader.classList.contains('nav-open')){closeNavigation();navToggle.focus();}});
document.querySelector('.header .contact-trigger').addEventListener('click',closeNavigation);
matchMedia('(min-width: 901px)').addEventListener('change',closeNavigation);
