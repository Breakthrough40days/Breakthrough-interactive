const canvas=document.querySelector('#world'),ctx=canvas.getContext('2d',{alpha:true});
const wrap=canvas.parentElement, reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
let W=0,H=0,dpr=1,particles=[],pointer={x:-9999,y:-9999,active:false},drag={on:false,x:0,y:0},rot={x:-.13,y:-.35},targetRot={x:-.13,y:-.35};
const N=innerWidth<600?1050:innerWidth<1000?1800:2800;
function resize(){dpr=Math.min(devicePixelRatio||1,2);W=wrap.clientWidth;H=wrap.clientHeight;canvas.width=W*dpr;canvas.height=H*dpr;canvas.style.width=W+'px';canvas.style.height=H+'px';ctx.setTransform(dpr,0,0,dpr,0,0)}
function randn(){let u=0,v=0;while(!u)u=Math.random();while(!v)v=Math.random();return Math.sqrt(-2*Math.log(u))*Math.cos(2*Math.PI*v)}
function make(){particles=[];for(let i=0;i<N;i++){// A living upward spiral: pressure below opening into possibility above.
 const t=Math.random()*Math.PI*5.4, progress=t/(Math.PI*5.4), core=.2+progress*.72;
 const arm=(Math.random()<.56?1:-1); const radius=(34+155*core)*(0.45+Math.random()*.65);
 let x=Math.cos(t*arm)*radius+randn()*18*(1-progress*.4);
 let z=Math.sin(t*arm)*radius+randn()*18*(1-progress*.4);
 let y=(progress-.5)*360+randn()*35;
 // loosen particles near the top into an expanding field
 if(progress>.68){const bloom=(progress-.68)/.32;x+=randn()*95*bloom;z+=randn()*95*bloom;y+=Math.random()*55*bloom}
 particles.push({x,y,z,bx:x,by:y,bz:z,vx:0,vy:0,screenX:0,screenY:0,size:.45+Math.random()*1.45,alpha:.25+Math.random()*.72});}}
function project(p){let x=p.x,y=p.y,z=p.z;const cy=Math.cos(rot.y),sy=Math.sin(rot.y),cx=Math.cos(rot.x),sx=Math.sin(rot.x);let x1=x*cy-z*sy,z1=x*sy+z*cy,y1=y;let y2=y1*cx-z1*sx,z2=y1*sx+z1*cx;const scale=Math.min(W,H)/540,pers=650/(650+z2);return{x:W*.52+x1*scale*pers,y:H*.49-y2*scale*pers,z:z2,pers}}
function tick(){ctx.clearRect(0,0,W,H);targetRot.y+=reduced?0:.00045;rot.x+=(targetRot.x-rot.x)*.07;rot.y+=(targetRot.y-rot.y)*.07;
 const ordered=[];for(const p of particles){p.vx+=(p.bx-p.x)*.022;p.vy+=(p.by-p.y)*.022;p.vz+=(p.bz-p.z)*.022;p.vx*=.89;p.vy*=.89;p.vz*=.89;p.x+=p.vx;p.y+=p.vy;p.z+=p.vz;const q=project(p);p.screenX=q.x;p.screenY=q.y;
 if(pointer.active&&!drag.on&&!reduced){const dx=q.x-pointer.x,dy=q.y-pointer.y,d2=dx*dx+dy*dy,R=92;if(d2<R*R&&d2>1){const d=Math.sqrt(d2),force=(1-d/R)*2.8;p.vx+=dx/d*force;p.vy-=dy/d*force;p.vz+=(Math.random()-.5)*force*1.7}}
 ordered.push([q,p])}ordered.sort((a,b)=>a[0].z-b[0].z);for(const [q,p] of ordered){const depth=Math.max(.25,Math.min(1.2,q.pers));ctx.beginPath();ctx.arc(q.x,q.y,p.size*depth,0,Math.PI*2);const warm=(p.by>90&&Math.random()>.65);ctx.fillStyle=warm?`rgba(185,104,70,${p.alpha*.75})`:`rgba(31,38,34,${p.alpha*Math.min(1,q.pers)})`;ctx.fill()}
 requestAnimationFrame(tick)}
function pos(e){const r=canvas.getBoundingClientRect(),q=e.touches?e.touches[0]:e;return{x:q.clientX-r.left,y:q.clientY-r.top}}
canvas.addEventListener('pointermove',e=>{const p=pos(e);pointer.x=p.x;pointer.y=p.y;pointer.active=true;if(drag.on){targetRot.y+=(p.x-drag.x)*.006;targetRot.x+=(p.y-drag.y)*.004;targetRot.x=Math.max(-1.05,Math.min(.75,targetRot.x));drag.x=p.x;drag.y=p.y}});
canvas.addEventListener('pointerdown',e=>{canvas.setPointerCapture(e.pointerId);const p=pos(e);drag={on:true,x:p.x,y:p.y}});canvas.addEventListener('pointerup',()=>drag.on=false);canvas.addEventListener('pointercancel',()=>drag.on=false);canvas.addEventListener('pointerleave',()=>{pointer.active=false;if(!drag.on){pointer.x=-9999;pointer.y=-9999}});
new ResizeObserver(resize).observe(wrap);resize();make();tick();
const days=document.querySelector('#days');for(let i=1;i<=40;i++){const d=document.createElement('div');d.className='day';d.textContent=String(i).padStart(2,'0');d.title=`Day ${i}`;days.appendChild(d)}