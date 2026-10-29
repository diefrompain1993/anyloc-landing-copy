// Original vector portraits. All signals use one visibility-aware animation clock.
const people=[
 [140,150,'#c0a2fa','#dca47d','#352c37','#7660bd','Анна',1],
 [435,105,'#a3c9fa','#efbd99','#4d302a','#306fb9','Михаил',0],
 [760,185,'#d6e99d','#9c6248','#29272e','#657e3e','Даниил',2],
 [300,355,'#f9ce8c','#edb38d','#7c4230','#b87939','Елена',1],
 [610,395,'#b0dcd7','#c88d69','#273c3b','#3f8f86','Алексей',0],
 [890,450,'#c6b5ed','#f1c9a6','#49302b','#7962aa','Мария',3],
 [125,565,'#a9c9ee','#bd805c','#2d2832','#497bb0','Иван',3],
 [480,600,'#f2b8af','#e5b398','#594036','#b66764','София',2]
];
const actions=[
 ['На объекте','#bce887','<path d="m8 18 7 7 15-15"/>'],
 ['Пишет отчёт','#cba2fa','<path d="M22 7H9a2 2 0 0 0-2 2v20a2 2 0 0 0 2 2h16M12 13h7M12 18h4M19 28l2-7L29 13l4 4-8 8-6 3Z"/>'],
 ['Добавил фото','#a3cdff','<path d="M7 12h5l3-5h8l3 5h5a2 2 0 0 1 2 2v15a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V14a2 2 0 0 1 2-2Z"/><circle cx="19" cy="21" r="6"/>'],
 ['Завершил смену','#ffce95','<path d="M17 7H8v24h9M17 19h15m-6-6 6 6-6 6"/>']
];
let portraitId=0;
function portrait(p,i){const id=`portrait-clip-${portraitId++}`;return `<defs><clipPath id="${id}"><circle r="47"/></clipPath></defs><g clip-path="url(#${id})"><circle r="47" fill="${p[2]}"/><path d="M-37 44Q-36 18 0 17Q36 18 37 44" fill="${p[5]}"/><path d="M-8 13v12q8 10 16 0V13" fill="${p[3]}"/><path d="${[1,2,4,6].includes(i)?'M-23 0q-6-39 24-37 28 2 23 37L19-9h-38Z':'M-22 1q-7-39 22-37 31-1 25 40L21 22h-43Z'}" fill="${p[4]}"/><ellipse cy="-3" rx="21" ry="26" fill="${p[3]}"/><path d="M-23-10q-6-26 22-27 29 0 25 28-14-3-24-17-8 15-23 16" fill="${p[4]}"/><g fill="#30262b"><ellipse cx="-8" cy="-2" rx="1.7" ry="2.2"/><ellipse cx="8" cy="-2" rx="1.7" ry="2.2"/></g><path d="M-5 10q5 5 10 0" fill="none" stroke="#874f45" stroke-width="2" stroke-linecap="round"/>${i%3===0?'<g fill="none" stroke="#493d49" stroke-width="1.8"><rect x="-17" y="-8" width="14" height="11" rx="4"/><rect x="3" y="-8" width="14" height="11" rx="4"/><path d="M-3-4h6"/></g>':''}</g>`;}
document.querySelectorAll('[data-avatar]').forEach(el=>{const i=Number(el.dataset.avatar);el.innerHTML=`<svg viewBox="-52 -52 104 104" aria-hidden="true">${portrait(people[i],i)}</svg>`;});
const graph=document.querySelector('#people-graph');
const edges=[[0,1],[1,2],[2,4],[4,3],[3,6],[6,7],[7,4],[4,5],[5,2],[2,0],[0,3],[3,7],[1,4]];
graph.innerHTML=`<defs><filter id="soft-glow" x="-100%" y="-100%" width="300%" height="300%"><feGaussianBlur stdDeviation="7"/></filter></defs><g>${edges.map(([a,b],i)=>{const A=people[a],B=people[b],d=`M${A[0]} ${A[1]} Q${(A[0]+B[0])/2+20} ${(A[1]+B[1])/2-25} ${B[0]} ${B[1]}`;return `<path class="graph-thread" d="${d}"/><path id="signal-${i}" class="graph-signal" pathLength="1" stroke="${actions[B[7]][1]}" d="${d}"/>`;}).join('')}</g><g>${people.map((p,i)=>{const a=actions[p[7]];return `<g transform="translate(${p[0]} ${p[1]})"><g id="person-${i}" class="graph-person"><circle class="person-glow" r="54" fill="${a[1]}" filter="url(#soft-glow)" opacity="0"/><circle class="person-ring" r="51" fill="none" stroke="${a[1]}" stroke-width="2" opacity="0"/>${portrait(p,i)}<g class="action-badge" transform="translate(24 24)" opacity="0"><rect x="-3" y="-3" width="44" height="44" rx="15" fill="#1e2023"/><rect width="38" height="38" rx="12" fill="${a[1]}"/><g fill="none" stroke="#25302d" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round">${a[2]}</g></g></g><text class="person-name" y="77">${p[6]}</text><text class="person-action" id="action-${i}" y="97" fill="${a[1]}">${a[0]}</text></g>`;}).join('')}</g>`;
const signals=edges.map((_,i)=>graph.querySelector(`#signal-${i}`));
const nodes=people.map((_,i)=>({body:graph.querySelector(`#person-${i}`),glow:graph.querySelector(`#person-${i} .person-glow`),ring:graph.querySelector(`#person-${i} .person-ring`),badge:graph.querySelector(`#person-${i} .action-badge`),label:graph.querySelector(`#action-${i}`)}));
const quiet=matchMedia('(prefers-reduced-motion: reduce)'),toggle=document.querySelector('#motion-toggle');
let paused=quiet.matches,visible=false,frame=0,last=0,clock=0;
const stagger=2100,travel=1650,cycle=edges.length*stagger,clamp=x=>Math.min(1,Math.max(0,x)),smooth=x=>x*x*(3-2*x);
function render(){
 const activation=people.map(()=>0);
 signals.forEach((line,i)=>{const age=(clock-i*stagger+cycle)%cycle,t=clamp(age/travel),fade=1-clamp((age-travel)/900);line.style.strokeDashoffset=String(1-smooth(t));line.style.opacity=String(fade*.9);const arrival=age-travel;if(arrival>=0&&arrival<4100){const intro=clamp(arrival/540),out=1-smooth(clamp((arrival-2800)/1300));activation[edges[i][1]]=Math.max(activation[edges[i][1]],smooth(intro)*out);}});
 nodes.forEach((n,i)=>{const t=quiet.matches?1:activation[i];n.glow.setAttribute('opacity',String(t*.32));n.ring.setAttribute('opacity',String(t*.8));n.body.setAttribute('transform',`scale(${1+t*.045})`);const pop=1+Math.sin(t*Math.PI)*.13;n.badge.setAttribute('opacity',String(t));n.badge.setAttribute('transform',`translate(24 ${24+(1-t)*9}) scale(${(.72+.28*t)*pop})`);n.label.setAttribute('opacity',String(t));});
}
function tick(now){frame=0;if(paused||!visible||document.hidden)return;if(last)clock=(clock+Math.min(now-last,80))%cycle;last=now;render();frame=requestAnimationFrame(tick);}
function sync(){cancelAnimationFrame(frame);frame=0;last=0;document.querySelector('.hero-art').classList.toggle('motion-paused',paused||document.hidden);toggle.setAttribute('aria-pressed',String(paused));toggle.textContent=paused?'▶  Продолжить анимацию':'Ⅱ  Пауза анимации';if(!paused&&visible&&!document.hidden)frame=requestAnimationFrame(tick);}
new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;sync();},{threshold:.05}).observe(graph);
toggle.addEventListener('click',()=>{paused=!paused;sync();});quiet.addEventListener('change',()=>{paused=quiet.matches;render();sync();});document.addEventListener('visibilitychange',sync);render();sync();
