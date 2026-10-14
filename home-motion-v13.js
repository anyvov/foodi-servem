'use strict';
(() => {
 const button=document.querySelector('.motion-control');
 const reduce=matchMedia('(prefers-reduced-motion: reduce)');
 const connection=navigator.connection;
 let enabled=!reduce.matches&&!connection?.saveData;
 let media=null;
 const scenes=[...document.querySelectorAll('.story-scene')];
 const steps=[...document.querySelectorAll('.story-step')];
 const count=document.querySelector('[data-scene-count]');
 const emit=()=>document.dispatchEvent(new CustomEvent('foodi:motion',{detail:{enabled}}));
 function resetScenes(){window.gsap?.killTweensOf([...scenes,document.querySelector('.story-track>span')]);scenes.forEach(s=>{s.style.removeProperty('opacity');s.style.removeProperty('visibility')});scenes.forEach((s,i)=>s.classList.toggle('is-active',i===0));steps.forEach(s=>s.classList.remove('is-current'));count.textContent='01 / 04';}
 function sync(){
  if(media){media.revert();media=null;}
  document.body.classList.toggle('motion-active',enabled);
  document.documentElement.classList.toggle('motion-off',!enabled);
  button.setAttribute('aria-pressed',String(enabled));
  button.innerHTML=enabled?'모션 켜짐 <span aria-hidden="true">Ⅱ</span>':'모션 꺼짐 <span aria-hidden="true">▶</span>';
  resetScenes();emit();
  if(!enabled)return;
  const gsap=window.gsap,ST=window.ScrollTrigger;
  media=gsap.matchMedia();
  media.add({desktop:'(min-width: 901px)',mobile:'(max-width: 900px)'},context=>{
   const desktop=context.conditions.desktop;
   gsap.from('.headline-line',{y:desktop?52:24,opacity:0,stagger:.12,duration:.85,ease:'power3.out'});
   gsap.from('.opening-media',{clipPath:'inset(7% 5% 7% 5%)',duration:1.1,ease:'power3.out'});
   gsap.fromTo('.reading-progress>span',{scaleX:0},{scaleX:1,ease:'none',scrollTrigger:{trigger:'main',start:'top top',end:'bottom bottom',scrub:.2}});
   document.querySelectorAll('.section-top,.collection-heading,.story-heading,.spaces-heading,.company-story-copy,.news-strip>div,.closing>.micro,.closing h2').forEach(el=>{
    gsap.from(el,{y:desktop?36:18,opacity:.25,duration:.8,ease:'power2.out',scrollTrigger:{trigger:el,start:'top 94%',once:true}});
   });
   // Native scrolling remains in control; no scroll-jacking, snapping or forced navigation.
   if(desktop){
    gsap.to('.opening-media>img,.opening-media>video',{scale:1.09,yPercent:3,ease:'none',scrollTrigger:{trigger:'.opening',start:'top top',end:'bottom top',scrub:.7}});
    let current=-1;
    const show=index=>{
     if(index===current)return;current=index;
     scenes.forEach((scene,i)=>{scene.classList.toggle('is-active',i===index);gsap.to(scene,{autoAlpha:i===index?1:0,duration:.5,overwrite:true});});
     steps.forEach((step,i)=>step.classList.toggle('is-current',i===index));
     count.textContent=`0${index+1} / 04`;
     gsap.to('.story-track>span',{scaleX:(index+1)/4,duration:.5,overwrite:true});
    };
    steps.forEach((step,i)=>ST.create({trigger:step,start:'top 60%',end:'bottom 60%',onEnter:()=>show(i),onEnterBack:()=>show(i)}));
    // Restore the correct chapter when re-enabling motion mid-page.
    let initial=0;steps.forEach((step,i)=>{if(step.getBoundingClientRect().top<innerHeight*.6)initial=i;});show(initial);
    gsap.from('.company-wordmark',{y:80,opacity:.2,ease:'none',scrollTrigger:{trigger:'.company-story',start:'top bottom',end:'center center',scrub:.6}});
    document.querySelectorAll('.space-grid img').forEach(el=>gsap.from(el,{scale:1.13,ease:'none',scrollTrigger:{trigger:el,start:'top bottom',end:'center center',scrub:.6}}));
   }
   return resetScenes;
  });
  media.add('(hover: hover) and (pointer: fine)',context=>{
   const clean=[];
   document.querySelectorAll('.collection-item').forEach(card=>{
    const photo=card.querySelector('.item-photo img');
    const move=context.add('move'+clean.length,e=>{const rect=card.getBoundingClientRect();gsap.to(photo,{x:((e.clientX-rect.left)/rect.width-.5)*16,y:((e.clientY-rect.top)/rect.height-.5)*12,scale:1.045,duration:.4,overwrite:true});});
    const leave=context.add('leave'+clean.length,()=>gsap.to(photo,{x:0,y:0,scale:1,duration:.45,overwrite:true}));
    card.addEventListener('pointermove',move);card.addEventListener('pointerleave',leave);
    clean.push(()=>{card.removeEventListener('pointermove',move);card.removeEventListener('pointerleave',leave);});
   });
   return()=>clean.forEach(fn=>fn());
  });
  window.ScrollTrigger.refresh();
 }
 if(!window.gsap||!window.ScrollTrigger){enabled=false;document.documentElement.classList.add('motion-off');emit();return;}
 window.gsap.registerPlugin(window.ScrollTrigger);
 button.hidden=false;
 button.addEventListener('click',()=>{enabled=!enabled;sync();});
 reduce.addEventListener('change',()=>{enabled=!reduce.matches&&!connection?.saveData;sync();});
 connection?.addEventListener?.('change',()=>{if(connection.saveData){enabled=false;sync();}});
 sync();
 document.fonts?.ready.then(()=>window.ScrollTrigger.refresh());
 window.addEventListener('load',()=>window.ScrollTrigger.refresh(),{once:true});
})();
