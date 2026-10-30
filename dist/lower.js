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


// Small local interactions keep all four capabilities visible at once.
document.querySelectorAll('[data-gallery-icon]').forEach(el=>el.innerHTML=storyIcon(el.dataset.galleryIcon));
const gallery=document.querySelector('.feature-gallery');
gallery.addEventListener('click',e=>{
 const b=e.target.closest('button');if(!b)return;
 function select(attribute){gallery.querySelectorAll(`[${attribute}]`).forEach(x=>x.setAttribute('aria-pressed',String(x===b)));}
 if(b.dataset.galleryRole){select('data-gallery-role');document.querySelector('#gallery-role-note').textContent=({lead:'Просмотр работы команды на доступных объектах',partner:'Свои сотрудники и назначенные объекты',worker:'Личные отметки, задачи и отправка отчётов'})[b.dataset.galleryRole];}
 if(b.dataset.galleryTag){select('data-gallery-tag');document.querySelector('#gallery-tag-result').textContent=b.dataset.galleryTag==='journal'?'Откроется журнал для отправки отчёта':'Сохранится время прихода или ухода';}
 if(b.dataset.galleryFormat){select('data-gallery-format');document.querySelector('#gallery-format-note').textContent=({Excel:'Excel — таблица для расчётов и сверок',CSV:'CSV — строки данных для импорта в другие системы',JSON:'JSON — структурированные данные для обработки'})[b.dataset.galleryFormat];}
});
