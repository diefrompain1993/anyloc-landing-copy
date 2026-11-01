// Original vector portraits. All signals use one visibility-aware animation clock.
const people=[
 [140,150,'#c0a2fa','#dca47d','#352c37','#7660bd','Анна',1,'female'],
 [435,105,'#a3c9fa','#efbd99','#4d302a','#306fb9','Михаил',0,'male'],
 [760,185,'#d6e99d','#d5a17e','#29272e','#657e3e','Даниил',2,'male'],
 [300,355,'#f9ce8c','#edb38d','#7c4230','#b87939','Елена',1,'female'],
 [610,395,'#b0dcd7','#c88d69','#273c3b','#3f8f86','Алексей',0,'male'],
 [890,450,'#c6b5ed','#f1c9a6','#49302b','#7962aa','Мария',3,'female'],
 [125,565,'#a9c9ee','#d9ac89','#2d2832','#497bb0','Иван',3,'male'],
 [480,600,'#f2b8af','#e5b398','#594036','#b66764','София',2,'female']
];
const actions=[
 ['На объекте','#bce887','<path d="m8 18 7 7 15-15"/>'],
 ['Пишет отчёт','#cba2fa','<path d="M22 7H9a2 2 0 0 0-2 2v20a2 2 0 0 0 2 2h16M12 13h7M12 18h4M19 28l2-7L29 13l4 4-8 8-6 3Z"/>'],
 ['Добавил фото','#a3cdff','<path d="M7 12h5l3-5h8l3 5h5a2 2 0 0 1 2 2v15a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V14a2 2 0 0 1 2-2Z"/><circle cx="19" cy="21" r="6"/>','Добавила фото'],
 ['Завершил смену','#ffce95','<path d="M17 7H8v24h9M17 19h15m-6-6 6 6-6 6"/>','Завершила смену']
];
function actionLabel(person,action){
 const a=actions[action];
 return people[person][8]==='female' ? (a[3] ?? a[0]) : a[0];
}
let portraitId=0;
function portrait(p,i){
 const id=`portrait-clip-${portraitId++}`,skin=p[3],hair=p[4];
 const backs=[
 'M-25 23V-13Q-26-39 0-38Q27-38 25-9V24Z',
 'M-23-5Q-27-35-3-36Q18-42 25-19L22 0Z',
 'M-23-5Q-29-27-17-32Q-19-42-7-39Q0-47 8-39Q23-42 24-29Q31-23 23-4Z',
 'M-25 20Q-34 0-24-21Q-23-35-4-35Q18-40 26-18Q33 5 23 20Z',
 'M-23 0L-23-22Q-18-37 2-35L23-24V0Z',
 'M-24 24L-25-12Q-23-36 0-36Q27-35 25-10L23 24Z',
 'M-23-2Q-25-29-9-31Q12-37 23-14L23 0Z',
 'M-23 20Q-30-9-19-27Q-10-40 12-31Q27-23 24 3L21 23Z'
 ];
 const fronts=[
 'M-24-9Q-28-34-3-37Q21-39 25-12L16-17L1-28Q-7-12-24-9Z',
 'M-23-8L-24-22Q-21-37-4-35L17-38L24-25Q7-28-1-18Q-10-10-23-8Z',
 'M-23-13Q-27-29-17-31Q-12-39-4-33Q3-40 10-32Q23-35 24-15L17-19L9-16L1-21L-9-16Z',
 'M-25-6Q-29-34-5-34Q22-38 26-9L18-16Q0-10-8-27Q-14-15-25-6Z',
 'M-23-13V-23Q-13-35 4-32L22-23V-14Q8-20-1-23Q-12-14-23-13Z',
 'M-24-7Q-28-34 0-36Q28-34 24-7L17-9L14-22L12-10L-3-13L-8-23L-11-10Z',
 'M-22-13Q-20-28-7-30Q13-34 22-13L14-17Q6-24-1-19L-15-14Z',
 'M-23-6Q-25-31-5-33Q17-36 23-13Q11-16 5-27Q-5-9-23-6Z'
 ];
 const extras=[
 '<g fill="none" stroke="#493d49" stroke-width="1.8"><rect x="-17" y="-8" width="14" height="11" rx="4"/><rect x="3" y="-8" width="14" height="11" rx="4"/><path d="M-3-4h6"/></g>',
 '<path d="M-6 12Q0 16 6 12" fill="none" stroke="#874f45" stroke-width="1.5"/>',
 '<path d="M-20 4Q-17 26 0 26Q17 26 20 4L13 13Q0 20-13 13Z" fill="'+hair+'"/>',
 '<g fill="#efc76e"><circle cx="-22" cy="9" r="3"/><circle cx="22" cy="9" r="3"/></g>',
 '<path d="M-8 9Q-4 4 0 8Q4 4 8 9Q3 12 0 10Q-3 12-8 9" fill="'+hair+'"/>',
 '<path d="M-22-20Q0-40 23-20" fill="none" stroke="#ead293" stroke-width="4"/>',
 '<g fill="none" stroke="#384b62" stroke-width="2"><circle cx="-10" cy="-3" r="7"/><circle cx="10" cy="-3" r="7"/><path d="M-3-3h6"/></g>',
 '<g fill="#b87a63"><circle cx="-12" cy="4" r="1"/><circle cx="-8" cy="5" r="1"/><circle cx="8" cy="5" r="1"/><circle cx="12" cy="4" r="1"/></g>'
 ];
 return `<defs><clipPath id="${id}"><circle r="47"/></clipPath></defs><g clip-path="url(#${id})"><circle r="47" fill="${p[2]}"/>${i===7?`<circle cx="16" cy="-31" r="12" fill="${hair}"/>`:''}<path d="${backs[i]}" fill="${hair}"/><path d="M-38 48Q-37 20 0 19Q37 20 38 48" fill="${p[5]}"/><path d="M-8 13v12q8 10 16 0V13" fill="${skin}"/><ellipse cy="-3" rx="${[21,20,22,21,22,20,21,19][i]}" ry="${[26,27,25,25,26,27,26,25][i]}" fill="${skin}"/><path d="${fronts[i]}" fill="${hair}"/><g fill="#30262b"><ellipse cx="-8" cy="-2" rx="1.7" ry="2.2"/><ellipse cx="8" cy="-2" rx="1.7" ry="2.2"/></g><path d="M-5 10q5 5 10 0" fill="none" stroke="#874f45" stroke-width="2" stroke-linecap="round"/>${extras[i]}</g>`;
}
document.querySelectorAll('[data-avatar]').forEach(el=>{const i=Number(el.dataset.avatar);el.innerHTML=`<svg viewBox="-52 -52 104 104" aria-hidden="true">${portrait(people[i],i)}</svg>`;});
const graph=document.querySelector('#people-graph');
const edges=[[0,1],[1,2],[2,4],[4,3],[3,6],[6,7],[7,4],[4,5],[5,2],[2,0],[0,3],[3,7],[1,4]];
graph.innerHTML=`<defs><filter id="soft-glow" x="-100%" y="-100%" width="300%" height="300%"><feGaussianBlur stdDeviation="7"/></filter></defs><g>${edges.map(([a,b],i)=>{const A=people[a],B=people[b],d=`M${A[0]} ${A[1]} Q${(A[0]+B[0])/2+20} ${(A[1]+B[1])/2-25} ${B[0]} ${B[1]}`;return `<path class="graph-thread" d="${d}"/><path id="signal-${i}" class="graph-signal" pathLength="1" stroke="${actions[B[7]][1]}" d="${d}"/>`;}).join('')}</g><g>${people.map((p,i)=>{const a=actions[p[7]];return `<g transform="translate(${p[0]} ${p[1]})"><g id="person-${i}" class="graph-person"><circle class="person-glow" r="54" fill="${a[1]}" filter="url(#soft-glow)" opacity="0"/><circle class="person-ring" r="51" fill="none" stroke="${a[1]}" stroke-width="2" opacity="0"/>${portrait(p,i)}<g class="action-badge" transform="translate(24 24)" opacity="0"><rect x="-3" y="-3" width="44" height="44" rx="15" fill="#1e2023"/><rect width="38" height="38" rx="12" fill="${a[1]}"/><g fill="none" stroke="#25302d" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round">${a[2]}</g></g></g><text class="person-name" y="77">${p[6]}</text><text class="person-action" id="action-${i}" y="97" fill="${a[1]}">${actionLabel(i,p[7])}</text></g>`;}).join('')}</g>`;
const signals=edges.map((_,i)=>graph.querySelector(`#signal-${i}`));
const nodes=people.map((_,i)=>({body:graph.querySelector(`#person-${i}`),glow:graph.querySelector(`#person-${i} .person-glow`),ring:graph.querySelector(`#person-${i} .person-ring`),badge:graph.querySelector(`#person-${i} .action-badge`),label:graph.querySelector(`#action-${i}`)}));
// Plan events in order so adjacent signals and repeat visits never reuse an action.
const plannedActions=[];
const lastPersonActions=people.map(p=>p[7]);
const actionCounts=people.map(()=>actions.map(()=>0));
function actionForEvent(edgeIndex,lap){
 const eventIndex=lap*edges.length+edgeIndex;
 while(plannedActions.length<=eventIndex){
  const index=plannedActions.length,[from,to]=edges[index%edges.length];
  const previous=plannedActions[index-1];
  const excluded=new Set([previous,lastPersonActions[from],lastPersonActions[to]]);
  const candidates=actions.map((_,offset)=>(lastPersonActions[to]+1+offset)%actions.length)
   .filter(action=>!excluded.has(action));
  // Prefer less-used actions for this person; preserve rotation order on ties.
  const next=candidates.reduce((best,action)=>actionCounts[to][action]<actionCounts[to][best]?action:best);
  plannedActions.push(next);lastPersonActions[to]=next;actionCounts[to][next]++;
 }
 return plannedActions[eventIndex];
}
const shownActions=people.map(p=>p[7]);
function showAction(person,action){
 if(shownActions[person]===action)return;
 shownActions[person]=action;
 const n=nodes[person],a=actions[action];
 n.glow.setAttribute('fill',a[1]);n.ring.setAttribute('stroke',a[1]);
 n.badge.querySelector('rect:nth-child(2)').setAttribute('fill',a[1]);
 n.badge.querySelector('g').innerHTML=a[2];
 n.label.textContent=actionLabel(person,action);n.label.setAttribute('fill',a[1]);
}
const quiet=matchMedia('(prefers-reduced-motion: reduce)');
let paused=quiet.matches,visible=false,frame=0,last=0,clock=0;
const stagger=2100,travel=1650,cycle=edges.length*stagger,clamp=x=>Math.min(1,Math.max(0,x)),smooth=x=>x*x*(3-2*x);
function render(){
 const activation=people.map(()=>0),latestArrival=people.map(()=>Infinity);
 signals.forEach((line,i)=>{
  const elapsed=clock-i*stagger;
  if(elapsed<0){line.style.opacity='0';return;}
  const lap=Math.floor(elapsed/cycle),age=elapsed-lap*cycle;
  const action=actionForEvent(i,lap),t=clamp(age/travel),fade=1-clamp((age-travel)/900);
  line.setAttribute('stroke',actions[action][1]);
  line.style.strokeDashoffset=String(1-smooth(t));line.style.opacity=String(fade*.9);
  const arrival=age-travel,person=edges[i][1];
  if(arrival>=0&&arrival<4100&&arrival<latestArrival[person]){
   latestArrival[person]=arrival;
   const intro=clamp(arrival/540),out=1-smooth(clamp((arrival-2800)/1300));
   activation[person]=smooth(intro)*out;
   showAction(person,action);
  }
 });
 nodes.forEach((n,i)=>{const t=quiet.matches?1:activation[i];n.glow.setAttribute('opacity',String(t*.32));n.ring.setAttribute('opacity',String(t*.8));n.body.setAttribute('transform',`scale(${1+t*.045})`);const pop=1+Math.sin(t*Math.PI)*.13;n.badge.setAttribute('opacity',String(t));n.badge.setAttribute('transform',`translate(24 ${24+(1-t)*9}) scale(${(.72+.28*t)*pop})`);n.label.setAttribute('opacity',String(t));});
}
function tick(now){frame=0;if(paused||!visible||document.hidden)return;if(last)clock+=Math.min(now-last,80);last=now;render();frame=requestAnimationFrame(tick);}
function sync(){cancelAnimationFrame(frame);frame=0;last=0;document.querySelector('.hero-art').classList.toggle('motion-paused',paused||document.hidden);if(!paused&&visible&&!document.hidden)frame=requestAnimationFrame(tick);}
new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;sync();},{threshold:.05}).observe(graph);
quiet.addEventListener('change',()=>{paused=quiet.matches;render();sync();});document.addEventListener('visibilitychange',sync);render();sync();

// Reveal stationary antenna contours; only the soft mask follows the pointer.
(()=>{
 const hero=document.querySelector('.connected-hero'),field=document.querySelector('.hero-nfc-field');
 if(!hero||!field||!matchMedia('(hover:hover) and (pointer:fine)').matches)return;
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 let x=0,y=0,tx=0,ty=0,frame=0,active=false;
 function draw(){
  const blend=reduced.matches?1:.085;x+=(tx-x)*blend;y+=(ty-y)*blend;
  field.style.setProperty('--nfc-x',x+'px');field.style.setProperty('--nfc-y',y+'px');
  frame=active&&(Math.abs(tx-x)+Math.abs(ty-y)>.2)?requestAnimationFrame(draw):0;
 }
 hero.addEventListener('pointermove',e=>{
  if(e.pointerType==='touch')return;
  const r=hero.getBoundingClientRect();tx=e.clientX-r.left;ty=e.clientY-r.top;
  const boundary=hero.querySelector('.hero-actions').getBoundingClientRect().bottom-r.top+20;
  if(ty>boundary){active=false;field.classList.remove('is-visible');return;}
  if(!active){x=tx;y=ty;}active=true;field.classList.add('is-visible');if(!frame)frame=requestAnimationFrame(draw);
 },{passive:true});
 hero.addEventListener('pointerleave',()=>{active=false;field.classList.remove('is-visible');});
})();
