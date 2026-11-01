// Original physical NFC plate, restored from the first landing design.
const stage=document.querySelector('#finale-tag');
const canvas=stage.querySelector('canvas');
let visible=false,started=false;
const observer=new IntersectionObserver(entries=>{
 visible=entries[0].isIntersecting;
 if(visible&&!started){started=true;initPlate().catch(error=>{stage.dataset.state='fallback';console.warn('NFC plate preview unavailable',error);});}
 if(visible)stage.dispatchEvent(new Event('plate-visible'));
},{rootMargin:'120px'});
observer.observe(stage);
async function initPlate(){
 const THREE=await import('./assets/three.module.js');
 const renderer=new THREE.WebGLRenderer({canvas,alpha:true,antialias:true,powerPreference:'low-power'});
 renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.outputColorSpace=THREE.SRGBColorSpace;
 renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.16;
 const scene=new THREE.Scene();
 const camera=new THREE.PerspectiveCamera(35,1,.1,100);
  scene.add(new THREE.HemisphereLight(0xe5effa,0x66615b,1.65));
  const key=new THREE.DirectionalLight(0xfff5e7,2.6);key.position.set(-4,6,5);scene.add(key);
  const fill=new THREE.DirectionalLight(0xc2d9f6,.9);fill.position.set(5,2,3);scene.add(fill);
  const rim=new THREE.DirectionalLight(0xe1ecfa,3.8);rim.position.set(1,5,-4);scene.add(rim);
  const group=new THREE.Group();scene.add(group);
  function roundedPath(w,h,r){const s=new THREE.Shape();s.moveTo(-w/2+r,-h/2);s.lineTo(w/2-r,-h/2);s.quadraticCurveTo(w/2,-h/2,w/2,-h/2+r);s.lineTo(w/2,h/2-r);s.quadraticCurveTo(w/2,h/2,w/2-r,h/2);s.lineTo(-w/2+r,h/2);s.quadraticCurveTo(-w/2,h/2,-w/2,h/2-r);s.lineTo(-w/2,-h/2+r);s.quadraticCurveTo(-w/2,-h/2,-w/2+r,-h/2);return s;}
  const shape=roundedPath(3.35,3.35,.24);
  for(const x of [-1.43,1.43])for(const y of [-1.43,1.43]){const hole=new THREE.Path();hole.absarc(x,y,.075,0,Math.PI*2,true);shape.holes.push(hole);}
  const geo=new THREE.ExtrudeGeometry(shape,{depth:.065,bevelEnabled:true,bevelSegments:5,steps:1,bevelSize:.016,bevelThickness:.016,curveSegments:48});geo.translate(0,0,-.0325);
  // Three registered maps describe a fine powder-coated surface: pigment, roughness, and relief.
  // ExtrudeGeometry uses world-space cap UVs, so one texture spans the whole plate rather than tiling below a pixel.
  let seed=1977;const random=()=>{seed=(1664525*seed+1013904223)>>>0;return seed/4294967296;};
  const textureSize=1024,gridSize=513,noise=Float32Array.from({length:gridSize*gridSize},random);
  function surfaceMap(kind){
    const surface=document.createElement('canvas');surface.width=surface.height=textureSize;
    const context=surface.getContext('2d'),pixels=context.createImageData(textureSize,textureSize);
    for(let y=0;y<textureSize;y++)for(let x=0;x<textureSize;x++){
      const gx=x/2,gy=y/2,ix=Math.floor(gx),iy=Math.floor(gy),tx=gx-ix,ty=gy-iy;
      const a=noise[iy*gridSize+ix]*(1-tx)+noise[iy*gridSize+ix+1]*tx;
      const b=noise[(iy+1)*gridSize+ix]*(1-tx)+noise[(iy+1)*gridSize+ix+1]*tx;
      const grain=a*(1-ty)+b*ty,fine=random()-.5;
      const v=kind==='color'?227+grain*16+fine*8:kind==='roughness'?182+grain*54+fine*12:85+grain*85+fine*20;
      const i=(y*textureSize+x)*4;pixels.data[i]=pixels.data[i+1]=pixels.data[i+2]=v;pixels.data[i+3]=255;
    }
    context.putImageData(pixels,0,0);
    const map=new THREE.CanvasTexture(surface);map.wrapS=map.wrapT=THREE.RepeatWrapping;
    map.repeat.set(1/3.35,1/3.35);map.offset.set(.5,.5);map.anisotropy=Math.min(renderer.capabilities.getMaxAnisotropy(),8);
    if(kind==='color')map.colorSpace=THREE.SRGBColorSpace;
    return map;
  }
  const faceMaterial=new THREE.MeshPhysicalMaterial({color:0x474c53,map:surfaceMap('color'),roughness:.6,roughnessMap:surfaceMap('roughness'),metalness:.25,clearcoat:.12,clearcoatRoughness:.48,bumpMap:surfaceMap('bump'),bumpScale:.004,envMapIntensity:.9});
  const edgeMaterial=new THREE.MeshPhysicalMaterial({color:0x282d34,roughness:.3,metalness:.45,clearcoat:.35,clearcoatRoughness:.25});
  const body=new THREE.Mesh(geo,[faceMaterial,edgeMaterial]);group.add(body);
  // Front artwork follows the photographed physical plate in normalized coordinates.
  // Raised warm sand-gold artwork matches the physical plate and shares the scene's lighting.
  const inkColor=0xe1a05b;
  const ink=new THREE.MeshStandardMaterial({color:inkColor,roughness:.62,metalness:.02});
  const inkZ=.054,inkRadius=.011;
  const point=(x,y)=>new THREE.Vector3((x-.5)*3.35,(.5-y)*3.35,inkZ);
  function raisedLine(draw){
    const path=new THREE.CurvePath();let cursor;
    const pen={move(x,y){cursor=point(x,y);},line(x,y){const next=point(x,y);path.add(new THREE.LineCurve3(cursor,next));cursor=next;},curve(cx,cy,x,y){const next=point(x,y);path.add(new THREE.QuadraticBezierCurve3(cursor,point(cx,cy),next));cursor=next;}};
    draw(pen);const mesh=new THREE.Mesh(new THREE.TubeGeometry(path,Math.max(96,path.curves.length*80),inkRadius,8,false),ink);group.add(mesh);
    const cap=new THREE.SphereGeometry(inkRadius,12,8);
    for(const end of [path.getPoint(0),path.getPoint(1)]){const bead=new THREE.Mesh(cap,ink);bead.position.copy(end);group.add(bead);}
  }
  function phoneOutline(left,right,top,radius){raisedLine(p=>{p.move(left,1);p.line(left,top+radius);p.curve(left,top,left+radius,top);p.line(right-radius,top);p.curve(right,top,right,top+radius);p.line(right,1);});}
  phoneOutline(.163,.837,.035,.083);
  phoneOutline(.180,.820,.053,.070);
  raisedLine(p=>{p.move(.163,.381);p.curve(.137,.381,.137,.413);p.line(.137,.548);p.curve(.137,.580,.163,.580);});
  raisedLine(p=>{p.move(.837,.225);p.curve(.861,.225,.861,.251);p.line(.861,.300);p.curve(.861,.326,.837,.326);});
  for(const [x,y,sx,sy] of [[.261,.112,1,1],[.743,.112,-1,1],[.261,.593,1,-1],[.743,.593,-1,-1]]){
    raisedLine(p=>{p.move(x,y+.059*sy);p.line(x,y+.010*sy);p.curve(x,y,x+.010*sx,y);p.line(x+.059*sx,y);});
  }
  await document.fonts.load('500 54px Inter').catch(()=>{});
  const lettering=document.createElement('canvas');lettering.width=lettering.height=2048;
  const letteringContext=lettering.getContext('2d');letteringContext.scale(2,2);letteringContext.fillStyle='#ffffff';letteringContext.textAlign='center';
  letteringContext.font='500 54px Inter, Arial, sans-serif';letteringContext.fillText('{ ваша компания }',512,795);
  letteringContext.font='500 49px Inter, Arial, sans-serif';letteringContext.fillText('Anyloc.ru',512,877);
  const front=new THREE.CanvasTexture(lettering);front.colorSpace=THREE.SRGBColorSpace;front.anisotropy=Math.min(renderer.capabilities.getMaxAnisotropy(),8);
  const decal=new THREE.Mesh(new THREE.PlaneGeometry(3.35,3.35),new THREE.MeshStandardMaterial({color:inkColor,map:front,transparent:true,depthWrite:false,roughness:.62,metalness:.02,bumpMap:front,bumpScale:.003}));decal.position.z=.055;group.add(decal);
  const tagRadius=.590,tagY=.490;
  const tag=new THREE.Mesh(new THREE.CylinderGeometry(tagRadius,tagRadius,.025,128),new THREE.MeshPhysicalMaterial({color:0xe8ebed,roughness:.46,metalness:.03,clearcoat:.22,clearcoatRoughness:.3}));tag.rotation.x=Math.PI/2;tag.position.set(0,tagY,.066);group.add(tag);
  const ring=new THREE.Mesh(new THREE.TorusGeometry(tagRadius+.007,.006,16,128),new THREE.MeshStandardMaterial({color:0x62666a,metalness:.2,roughness:.5}));ring.position.set(0,tagY,.066);group.add(ring);


 const home={x:.12,y:-.3};
 let targetX=home.x,targetY=home.y,frame=0,last=0,drag=null,dirty=true;
 const reducedMotion=matchMedia('(prefers-reduced-motion: reduce)').matches;
 let introPending=!reducedMotion,introActive=false,introElapsed=0;
 group.rotation.set(home.x,reducedMotion?home.y:home.y+Math.PI,-.055);
 const entranceObserver=new IntersectionObserver(entries=>{
  if(entries[0].isIntersecting&&entries[0].intersectionRatio>=.45&&introPending){
   introPending=false;introActive=true;dirty=true;requestFrame();entranceObserver.disconnect();
  }
 },{threshold:.45});
 if(introPending)entranceObserver.observe(stage);
 function takeControl(){
  if(!introPending&&!introActive)return;
  introPending=false;introActive=false;entranceObserver.disconnect();
  targetX=group.rotation.x;targetY=group.rotation.y;
 }

 function requestFrame(){if(!frame&&visible&&!document.hidden){last=performance.now();frame=requestAnimationFrame(draw);}}
 function draw(time){
  frame=0;if(!visible||document.hidden)return;
  const delta=Math.min((time-last)/1000,.05);last=time;
  const ease=1-Math.exp(-delta/0.075);
  if(introActive){
   introElapsed+=delta;
   const t=Math.min(introElapsed/1.9,1),smooth=t*t*t*(t*(t*6-15)+10);
   group.rotation.y=home.y+Math.PI*(1-smooth);
   group.rotation.x=home.x-Math.sin(t*Math.PI)*.09;
   if(t===1){introActive=false;group.rotation.set(home.x,home.y,-.055);}
  }else if(!introPending){
   group.rotation.x+=(targetX-group.rotation.x)*ease;
   group.rotation.y+=(targetY-group.rotation.y)*ease;
  }
  const moving=introActive||(!introPending&&Math.abs(targetX-group.rotation.x)+Math.abs(targetY-group.rotation.y)>.0001);
  if(!moving&&!introPending){group.rotation.x=targetX;group.rotation.y=targetY;}
  if(dirty||moving){renderer.render(scene,camera);dirty=false;}
  if(moving)frame=requestAnimationFrame(draw);
 }
 function resize(){
  const width=canvas.clientWidth,height=canvas.clientHeight;if(!width||!height)return;
  renderer.setSize(width,height,false);camera.aspect=width/height;
  camera.position.z=2.25/(Math.tan(camera.fov*Math.PI/360)*Math.min(camera.aspect,1));
  camera.updateProjectionMatrix();dirty=true;requestFrame();
 }
 new ResizeObserver(resize).observe(canvas);
 canvas.addEventListener('pointerdown',e=>{
  if(e.button!==0||drag!==null)return;
  takeControl();
  drag={id:e.pointerId,x:e.clientX,y:e.clientY};canvas.setPointerCapture(e.pointerId);
  canvas.classList.add('is-dragging');canvas.focus({preventScroll:true});
 });
 canvas.addEventListener('pointermove',e=>{
  if(!drag||e.pointerId!==drag.id)return;
  targetY+=(e.clientX-drag.x)*.009;targetX+=(e.clientY-drag.y)*.009;
  drag.x=e.clientX;drag.y=e.clientY;dirty=true;requestFrame();
 });
 function release(e){if(drag&&e.pointerId===drag.id){drag=null;canvas.classList.remove('is-dragging');}}
 canvas.addEventListener('pointerup',release);canvas.addEventListener('pointercancel',release);canvas.addEventListener('lostpointercapture',release);
 function restore(){targetX=home.x;targetY=home.y;dirty=true;requestFrame();}
 canvas.addEventListener('keydown',e=>{
  if(!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Home'].includes(e.key))return;
  e.preventDefault();takeControl();if(e.key==='Home'){restore();return;}
  if(e.key==='ArrowLeft')targetY-=.22;if(e.key==='ArrowRight')targetY+=.22;
  if(e.key==='ArrowUp')targetX-=.22;if(e.key==='ArrowDown')targetX+=.22;
  dirty=true;requestFrame();
 });
 document.addEventListener('visibilitychange',()=>{if(document.hidden){cancelAnimationFrame(frame);frame=0;}else{dirty=true;requestFrame();}});
 stage.addEventListener('plate-visible',()=>{dirty=true;requestFrame();});
 canvas.addEventListener('webglcontextlost',e=>{e.preventDefault();cancelAnimationFrame(frame);frame=0;stage.dataset.state='fallback';});
 canvas.addEventListener('webglcontextrestored',()=>{stage.dataset.state='ready';dirty=true;requestFrame();});
 new THREE.TextureLoader().load('assets/atrium.jpg',tex=>{
  tex.mapping=THREE.EquirectangularReflectionMapping;tex.colorSpace=THREE.SRGBColorSpace;
  const pmrem=new THREE.PMREMGenerator(renderer);scene.environment=pmrem.fromEquirectangular(tex).texture;
  scene.environmentIntensity=.85;tex.dispose();pmrem.dispose();dirty=true;requestFrame();
 });
 stage.dataset.state='ready';resize();
}

