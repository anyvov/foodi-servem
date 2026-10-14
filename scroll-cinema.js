'use strict';
// Called inside the GSAP matchMedia context: its timeline and pin are reverted together.
window.setupScrollCinema=(gsap,ScrollTrigger,desktop)=>{
 const root=document.querySelector('.scroll-cinema');
 if(!root)return()=>{};
 const panels=[...root.querySelectorAll('.cinema-panel')],hud=root.querySelector('.cinema-hud');
 const dots=[...root.querySelectorAll('.cinema-dots span')],counter=root.querySelector('[data-cinema-count]');
 const header=document.querySelector('.atelier-header');
 const headerHeight=()=>Math.ceil(header.getBoundingClientRect().height);
 root.style.setProperty('--cinema-header',headerHeight()+'px');
 root.classList.add('cinema-active');hud.hidden=false;
 let current=-1;
 const stage=index=>{
  if(current===index)return;current=index;
  panels.forEach((panel,i)=>{panel.inert=i!==index;panel.setAttribute('aria-hidden',String(i!==index));});
  dots.forEach((dot,i)=>dot.classList.toggle('active',i===index));counter.textContent='0'+(index+1);
 };
 const timeline=gsap.timeline({defaults:{ease:'none'},scrollTrigger:{
  trigger:root,start:()=>`top top+=${headerHeight()}`,end:()=>'+='+Math.round(innerHeight*(desktop?2.8:2.2)),
  pin:true,pinSpacing:true,anticipatePin:1,scrub:desktop?.65:.35,invalidateOnRefresh:true,
  onRefreshInit:()=>root.style.setProperty('--cinema-header',headerHeight()+'px')
 }});
 timeline.set('.cinema-two',{clipPath:'inset(100% 0% 0% 0%)'})
 .set('.cinema-three',{clipPath:'inset(0% 0% 100% 0%)'})
 .to('.cinema-one .opening-copy',{yPercent:-15,opacity:0,duration:.8},.15)
 .to('.cinema-one .opening-media',{width:'100%',height:'100%',duration:1.2},0)
 .to('.cinema-one .media-caption,.cinema-one .media-edge',{opacity:0,duration:.5},.1)
 .to('.cinema-two',{clipPath:'inset(0% 0% 0% 0%)',duration:1},1)
 .from('.cinema-factory',{scale:1.25,xPercent:desktop?8:0,duration:1.6},1)
 .from('.cinema-two .cinema-copy',{y:desktop?90:20,opacity:0,duration:.7},1.55)
 .from('.cinema-two .cinema-large-word',{xPercent:25,duration:1.6},1.1)
 .to('.cinema-two .cinema-copy',{y:-60,opacity:0,duration:.6},2.8)
 .to('.cinema-three',{clipPath:'inset(0% 0% 0% 0%)',duration:1},3)
 .from('.cinema-cut',{xPercent:100,rotation:18,scale:.6,duration:1.3},3)
 .from('.cinema-three .cinema-copy',{y:desktop?80:20,opacity:0,duration:.8},3.45)
 .from('.cinema-orbit',{scale:.65,rotation:40,duration:1.6},3)
 .from('.cinema-three .cinema-large-word',{xPercent:-25,duration:1.4},3.2)
 .to({}, {duration:.7});
 // Follow the actual scrubbed animation rather than the wheel position so controls match the visible scene.
 timeline.eventCallback('onUpdate',()=>stage(timeline.time()<1.6?0:timeline.time()<3.5?1:2));
 stage(timeline.time()<1.6?0:timeline.time()<3.5?1:2);
 return()=>{root.classList.remove('cinema-active');root.style.removeProperty('--cinema-header');hud.hidden=true;panels.forEach(p=>{p.inert=false;p.removeAttribute('aria-hidden')});};
};
