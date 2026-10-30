import {bindProductUI, detailView} from './product-ui.js';
const world = document.querySelector('.al-world');
const quiet = matchMedia('(prefers-reduced-motion: reduce)');
world.classList.add('al-motion');
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => { if(entry.isIntersecting) {entry.target.classList.add('is-visible'); revealObserver.unobserve(entry.target);} });
}, {threshold: .12});
world.querySelectorAll('[data-enter]').forEach(element => revealObserver.observe(element));

const storyIcon=(type)=>`<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">${({check:'<path d="m5 12 4 4L19 6"/>',nfc:'<path d="M7 8a6 6 0 0 1 0 8M11 5a10 10 0 0 1 0 14M15 2a14 14 0 0 1 0 20"/>',file:'<path d="M14 3H5v18h14V8Zm0 0v5h5M8 12h8M8 16h6"/>',camera:'<path d="M3 7h4l2-3h6l2 3h4v14H3Z"/><circle cx="12" cy="13" r="4"/>'})[type]}</svg>`;
const stories={
 presence:{number:'01 / ПРИСУТСТВИЕ',heading:'Отмечайте приход<br>и уход через NFC',text:'Сотрудник прикладывает телефон к NFC-метке на объекте. Anyloc сохраняет время отметки, а руководитель видит текущие смены и отработанные часы.',tags:['Вход и выход','Рабочее время'],link:'Посмотреть учёт присутствия',screen:'presence',title:'Вы на месте',subtitle:'Начало смены · 09:41',icon:'nfc',event:'Вход подтверждён',detail:'БЦ Орион · Алексей Воронов'},
 service:{number:'02 / ОБСЛУЖИВАНИЕ',heading:'Сохраняйте отчёты<br>об обслуживании',text:'После проверки оборудования сотрудник отправляет отчёт с фотографиями и комментарием. Руководитель может открыть запись в журнале объекта.',tags:['Фото и комментарии','Журнал объекта'],link:'Посмотреть пример отчёта',screen:'reports',title:'Проверка завершена',subtitle:'Проверка оборудования',icon:'file',event:'Отчёт в журнале',detail:'Осмотр завершён · 2 фотографии'},
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
 document.querySelector('#story-visual').innerHTML=`<div class="exhibit-light"></div><img class="exhibit-building" src="assets/scenario-building.png" alt="Объёмный макет офисного здания с входом и рабочими помещениями"><div class="exhibit-pin">${storyIcon(v.icon)}<span>${v.pin}</span></div>${extra}<div class="exhibit-event"><div class="exhibit-event-top"><span>${storyIcon(v.icon)}</span><b>${v.name}</b><time>${v.time}</time></div><p>${v.detail}</p><div class="exhibit-event-status">${storyIcon('check')}${v.status}<span></span></div></div>`;
 if(animate&&!quiet.matches){panel.querySelectorAll('.story-copy,.exhibit-event,.exhibit-pin,.exhibit-token,.exhibit-mini,.exhibit-photo').forEach(el=>el.animate([{opacity:0,translate:'0 10px'},{opacity:1,translate:'0 0'}],{duration:450,easing:'cubic-bezier(.22,1,.36,1)'}));}
}
document.querySelectorAll('[data-place]').forEach(b=>b.addEventListener('click',()=>setStory(b.dataset.place)));
setStory('presence',false);

// Static fragments from the supplied iOS screenshots. Only the section switcher is interactive.
const mobileViews={
 objects:{title:'Объекты',heading:'Информация об объекте<br>в мобильном приложении',text:'Откройте нужный объект, посмотрите адрес, контакты и последние отчёты. Отсюда можно перейти к отправке нового отчёта.',chips:['Список объектов','Контакты','Журнал'],color:'#2768df',bg:'#eaf1ff',first:['objects',100,630,'Список объектов в приложении Anyloc'],second:['object',236,390,'Карточка объекта с адресом, контактами и кнопкой отчёта'],label:'Карточка объекта',stamp:'В приложении',icon:'file'},
 scan:{title:'NFC-отметки',heading:'Отмечайте приход и уход<br>с помощью телефона',text:'Поднесите телефон к NFC-метке на объекте. Сохранённую отметку можно проверить в истории вместе с временем входа или выхода.',chips:['Сканирование NFC','Вход и выход'],color:'#7550d8',bg:'#f0eaff',first:['scan',430,450,'Поиск NFC-метки в приложении'],second:['history',430,305,'Записи о входе и выходе в истории'],label:'Отметка в истории',stamp:'NFC',icon:'nfc'},
 report:{title:'Отчёты',heading:'Отправляйте отчёты<br>с места работы',text:'Опишите выполненную работу и приложите фотографии или файлы. Отправленные отчёты сохраняются в журнале объекта.',chips:['Описание работы','Фото и файлы'],color:'#2768df',bg:'#eaf1ff',first:['report',237,820,'Форма отчёта с полем описания, вложениями и кнопкой отправки'],second:['object',660,385,'Последние отчёты в карточке объекта'],label:'Журнал объекта',stamp:'Отчёт',icon:'file'},
 tasks:{title:'Задачи',heading:'Проверяйте задачи<br>и сроки выполнения',text:'В приложении видны назначенные работы и сроки. Выполненные задачи остаются в списке с отметкой о завершении.',chips:['Назначенные работы','Сроки','Статусы'],color:'#bc7a00',bg:'#fff1cd',first:['tasks',100,375,'Открытые задачи с датами выполнения'],second:['tasks',475,290,'Выполненные задачи с отметками'],label:'Выполненные работы',stamp:'Задачи',icon:'check'},
 history:{title:'История',heading:'Просматривайте отметки<br>и рабочее время',text:'Проверьте рабочие часы за неделю, время входа и выхода, а также отправленные отчёты. Записи в истории сгруппированы по дням.',chips:['Рабочие часы','Отметки','Отчёты'],color:'#348269',bg:'#e4f2eb',first:['history',100,310,'Рабочие часы за неделю в приложении'],second:['history',430,620,'История входов, выходов и отправленных отчётов'],label:'Записи по дням',stamp:'История',icon:'file'}
};
const mobileTabs=[...document.querySelectorAll('[data-mobile]')];
let activeMobile;
function setMobile(key,animate=true){
 if(activeMobile===key)return;activeMobile=key;
 const d=mobileViews[key],panel=document.querySelector('#mobile-panel'),art=document.querySelector('#mobile-collage');
 mobileTabs.forEach(b=>{const selected=b.dataset.mobile===key;b.setAttribute('aria-selected',String(selected));b.tabIndex=selected?0:-1;});
 panel.setAttribute('aria-labelledby',`mobile-tab-${key}`);panel.dataset.mobileView=key;
 panel.style.setProperty('--mobile-accent',d.color);panel.style.setProperty('--mobile-tint',d.bg);
 document.querySelector('#mobile-copy').innerHTML=`<div class="mobile-product"><img src="assets/favicon.png" width="32" height="32" alt=""><strong>Anyloc</strong><span>${d.title}</span></div><h2>${d.heading}</h2><p>${d.text}</p>`;
 art.innerHTML=`<img class="unified-ios-art" src="assets/ios/showcase-${key}.svg?v=3" width="680" height="520" alt="${d.first[3]}. ${d.second[3]}." draggable="false">`;
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

// Self-contained product examples; all controls change only this preview.
const workEntries=[
 {time:'09:41',name:'Алексей Воронов',initials:'АВ',title:'Начало работы',note:'Отметка через NFC',icon:'nfc',color:'green',heading:'Сотрудник на объекте',body:'Алексей отметил приход через NFC-метку у входа. Время сохранилось в журнале объекта.',image:null},
 {time:'10:24',name:'Михаил Крылов',initials:'МК',title:'Проверка вентиляции',note:'Отчёт с фотографией',icon:'file',color:'blue',heading:'Проверка вентиляции',body:'Выполнен осмотр решёток и фильтров. Посторонних шумов не обнаружено.',image:'assets/technical-room.png'},
 {time:'11:15',name:'Анна Смирнова',initials:'АС',title:'Уборка общих зон',note:'Фотоотчёт',icon:'camera',color:'purple',heading:'Уборка завершена',body:'Полы и поверхности очищены. Фотография результата приложена к отчёту.',image:'assets/atrium.jpg'}
];
let selectedEntry=1,selectedRole='lead',selectedPurpose='presence',selectedFormat='Excel',activeFeature;
const featureStage=document.querySelector('#space-stage');
const workHead=(title,description)=>`<div class="workspace-view-head"><h3>${title}</h3><p>${description}</p></div>`;
function entryDetail(){const d=workEntries[selectedEntry];return `<div class="work-detail-heading"><span class="work-avatar ${d.color}">${d.initials}</span><div><b>${d.name}</b><small>БЦ Орион · ${d.time}</small></div><span class="work-detail-icon">${storyIcon(d.icon)}</span></div>${d.image?`<img class="work-detail-photo" src="${d.image}" alt="${d.heading}">`:`<div class="work-arrival">${storyIcon('check')}<strong>${d.time}</strong><span>Вход на объект</span></div>`}<h4>${d.heading}</h4><p>${d.body}</p>`;}
const workRoles={
 lead:{name:'Руководитель',initials:'АК',title:'Работа команды под контролем',text:'Просматривает объекты, отчёты и работу команды в пределах выданных прав.',items:['Назначенные объекты','Работа сотрудников','Отчёты команды']},
 partner:{name:'Подрядчик',initials:'МВ',title:'Свои сотрудники и объекты',text:'Работает с назначенными объектами и сотрудниками своей организации.',items:['Свои объекты','Свои сотрудники','Работы организации']},
 worker:{name:'Сотрудник',initials:'ДС',title:'Всё для работы на объекте',text:'Отмечает присутствие, выполняет назначенные задачи и отправляет отчёты.',items:['Отметки прихода и ухода','Назначенные задачи','Отправка отчётов']}
};
function roleDetail(){const d=workRoles[selectedRole];return `<div class="work-access-emblem">${storyIcon('check')}</div><span class="work-caption">${d.name}</span><h4>${d.title}</h4><p>${d.text}</p><div class="work-permissions">${d.items.map(t=>`<div>${storyIcon('check')}<span>${t}</span></div>`).join('')}</div>`;}
function tagDetail(){const journal=selectedPurpose==='journal';return `<div class="work-tag-device"><span class="work-screw screw-a"></span><span class="work-screw screw-b"></span><div class="work-tag-coil">${storyIcon('nfc')}<b>Anyloc</b></div></div><div class="work-tag-result"><span>${storyIcon(journal?'file':'check')}</span><div><b>${journal?'Откроется журнал':'Сохранится отметка'}</b><small>${journal?'Отчёт о выполненной работе':'Приход или уход с объекта'}</small></div></div>`;}
function formatDetail(){if(selectedFormat==='JSON')return `<div class="work-code-head"><span class="file-dot"></span>anyloc-history.json</div><pre>{
  "object": "БЦ Орион",
  "employee": "Алексей Воронов",
  "event": "Вход",
  "time": "09:41"
}</pre>`;
 if(selectedFormat==='CSV')return `<div class="work-code-head"><span class="file-dot"></span>anyloc-history.csv</div><pre>Объект,Сотрудник,Событие,Время
БЦ Орион,Алексей Воронов,Вход,09:41
БЦ Орион,Михаил Крылов,Отчёт,10:24
БЦ Орион,Анна Смирнова,Отчёт,11:15</pre>`;
 return `<div class="work-code-head"><span class="file-dot"></span>anyloc-history.xlsx</div><div class="work-table-scroll"><table><thead><tr><th></th><th>Сотрудник</th><th>Событие</th><th>Время</th></tr></thead><tbody>${workEntries.map((d,i)=>`<tr><td>${i+1}</td><td>${d.name}</td><td>${i?'Отчёт':'Вход'}</td><td>${d.time}</td></tr>`).join('')}</tbody></table></div><div class="work-sheet-footer">БЦ Орион <span>3 записи</span></div>`;
}
const featureViews={
 journal:()=>`${workHead('История работ по объекту','Выберите запись, чтобы посмотреть подробности и фотографии.')}<div class="workspace-journal"><div class="work-feed"><div class="work-feed-label">Сегодня <span>3 записи</span></div>${workEntries.map((d,i)=>`<button class="work-entry" data-entry="${i}" aria-pressed="${i===selectedEntry}"><time>${d.time}</time><span class="work-event-icon ${d.color}">${storyIcon(d.icon)}</span><span><b>${d.title}</b><small>${d.name} · ${d.note}</small></span><i>↗</i></button>`).join('')}</div><article class="work-detail" id="work-detail" aria-live="polite">${entryDetail()}</article></div>`,
 access:()=>`${workHead('Доступ зависит от роли','Сотрудники видят только те объекты и данные, к которым им выдан доступ.')}<div class="workspace-access"><div class="work-role-list">${Object.entries(workRoles).map(([key,d],i)=>`<button data-work-role="${key}" aria-pressed="${selectedRole===key}"><span class="work-avatar ${['blue','purple','green'][i]}">${d.initials}</span><span><b>${d.name}</b><small>${['Управление командой','Своя организация','Работа на объекте'][i]}</small></span><i>→</i></button>`).join('')}<p class="work-footnote">Набор прав задаётся администратором.</p></div><article class="work-role-detail" id="work-role-detail" aria-live="polite">${roleDetail()}</article></div>`,
 tags:()=>`${workHead('Одна метка — нужное действие','Укажите объект и выберите, что откроется при касании телефона.')}<div class="workspace-tags"><div class="work-tag-visual" id="work-tag-visual">${tagDetail()}</div><div class="work-tag-settings"><span class="work-field-label">Объект</span><div class="work-object-field">БЦ Орион <span>Главный вход</span></div><span class="work-field-label">Назначение метки</span><div class="work-purpose-options">${[['presence','check','Присутствие','Учёт прихода и ухода'],['journal','file','Журнал работ','Отправка отчётов с объекта']].map(([key,icon,name,desc])=>`<button data-work-purpose="${key}" aria-pressed="${selectedPurpose===key}">${storyIcon(icon)}<span><b>${name}</b><small>${desc}</small></span><i></i></button>`).join('')}</div></div></div>`,
 export:()=>`${workHead('Данные в удобном формате','Сравните форматы для расчётов, сверок и дальнейшей обработки.')}<div class="workspace-export"><div class="work-export-options"><span class="work-field-label">Формат выгрузки</span>${[['Excel','X','Таблица для расчётов'],['CSV','≡','Импорт в другие системы'],['JSON','{ }','Структурированные данные']].map(([key,icon,desc])=>`<button data-work-format="${key}" aria-pressed="${selectedFormat===key}"><span class="work-file-icon">${icon}</span><span><b>${key}</b><small>${desc}</small></span><i>→</i></button>`).join('')}<p class="work-footnote">Предпросмотр на примере трёх записей.</p></div><div class="work-export-preview" id="work-export-preview" aria-live="polite">${formatDetail()}</div></div>`
};
const featureTabs=[...document.querySelectorAll('[data-feature]')];
function setFeature(key){
 if(activeFeature===key)return;activeFeature=key;
 featureTabs.forEach(b=>{const active=b.dataset.feature===key;b.setAttribute('aria-selected',String(active));b.tabIndex=active?0:-1;});
 featureStage.setAttribute('aria-labelledby',`feature-${key}`);featureStage.innerHTML=featureViews[key]();
 if(!quiet.matches){featureStage.getAnimations().forEach(a=>a.cancel());featureStage.animate([{opacity:0,translate:'0 6px'},{opacity:1,translate:'0 0'}],{duration:320,easing:'cubic-bezier(.22,1,.36,1)'});}
}
featureTabs.forEach((b,i)=>{b.addEventListener('click',()=>setFeature(b.dataset.feature));b.addEventListener('keydown',e=>{let n;if(e.key==='ArrowRight')n=(i+1)%4;else if(e.key==='ArrowLeft')n=(i+3)%4;else if(e.key==='Home')n=0;else if(e.key==='End')n=3;else return;e.preventDefault();setFeature(featureTabs[n].dataset.feature);featureTabs[n].focus();});});
featureStage.addEventListener('click',e=>{
 const b=e.target.closest('button');if(!b)return;
 function select(attribute){featureStage.querySelectorAll(`[${attribute}]`).forEach(x=>x.setAttribute('aria-pressed',String(x===b)));}
 if(b.dataset.entry!==undefined){selectedEntry=Number(b.dataset.entry);select('data-entry');document.querySelector('#work-detail').innerHTML=entryDetail();}
 if(b.dataset.workRole){selectedRole=b.dataset.workRole;select('data-work-role');document.querySelector('#work-role-detail').innerHTML=roleDetail();}
 if(b.dataset.workPurpose){selectedPurpose=b.dataset.workPurpose;select('data-work-purpose');document.querySelector('#work-tag-visual').innerHTML=tagDetail();}
 if(b.dataset.workFormat){selectedFormat=b.dataset.workFormat;select('data-work-format');document.querySelector('#work-export-preview').innerHTML=formatDetail();}
});
setFeature('journal');
