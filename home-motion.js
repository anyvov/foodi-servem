'use strict';
(() => {
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
  resetScenes();emit();
  if(!enabled)return;
  const gsap=window.gsap,ST=window.ScrollTrigger;
  media=gsap.matchMedia();
  media.add({desktop:'(min-width: 901px)',mobile:'(max-width: 900px)'},context=>{
   const desktop=context.conditions.desktop;
   const cleanupCinema=window.setupScrollCinema?.(gsap,ST,desktop);
   gsap.fromTo('.reading-progress>span',{scaleX:0},{scaleX:1,ease:'none',scrollTrigger:{trigger:'main',start:'top top',end:'bottom bottom',scrub:.2}});
   document.querySelectorAll('.section-top,.collection-heading,.story-heading,.spaces-heading,.company-story-copy,.news-strip>div,.closing>.micro,.closing h2').forEach(el=>{
    gsap.from(el,{y:desktop?36:18,opacity:.25,duration:.8,ease:'power2.out',scrollTrigger:{trigger:el,start:'top 94%',once:true}});
   });
   // Each section has its own rhythm; keep links visible and keyboard reachable.
   const focusCleanups=[];
   function reveal(el,from,delay=0){
    const tween=gsap.from(el,{...from,duration:desktop?1:.65,delay,ease:'power3.out',
     scrollTrigger:{trigger:el,start:'top 94%',once:true}});
    const finish=()=>tween.progress(1);
    el.addEventListener('focusin',finish);
    focusCleanups.push(()=>el.removeEventListener('focusin',finish));
   }
   function scrollReveal(el,from,trigger,start='top 92%',end='top 35%'){
    const tween=gsap.fromTo(el,from,{y:0,x:0,rotation:0,scale:1,opacity:1,
     ease:'none',scrollTrigger:{trigger,start,end,scrub:.65}});
    // Keyboard users immediately get a stationary, fully revealed link.
    const finish=()=>{tween.scrollTrigger.disable(false);tween.progress(1);};
    const resume=event=>{if(!el.contains(event.relatedTarget))tween.scrollTrigger.enable();};
    el.addEventListener('focusin',finish);el.addEventListener('focusout',resume);
    focusCleanups.push(()=>{el.removeEventListener('focusin',finish);el.removeEventListener('focusout',resume);});
   }
   document.querySelectorAll('.collection-item').forEach((el,i)=>{
    if(desktop)scrollReveal(el,{y:110+i*32,x:(i-1.5)*18,rotation:(i-1.5)*4,scale:.88,opacity:.4},'.collection-grid');
    else reveal(el,{y:35,opacity:.35});
   });
   document.querySelectorAll('.home-promotions-grid article').forEach((el,i)=>{
    if(desktop)scrollReveal(el,{y:i===1?140:75,x:0,rotation:0,scale:.96,opacity:.4},'.home-promotions-grid');
    else reveal(el,{y:28,opacity:.35});
    const img=el.querySelector('img');
    if(img)reveal(img,{clipPath:'inset(0% 12% 14% 12%)'},desktop?i*.12:0);
   });
   document.querySelectorAll('.space-grid>a').forEach((el,i)=>{
    if(desktop)scrollReveal(el,{y:90+i*55,x:0,rotation:0,scale:.92,opacity:.4},'.space-grid');
    else reveal(el,{y:28,opacity:.35});
    const caption=el.querySelector('figcaption');
    if(caption)reveal(caption,{x:desktop?0:12,y:desktop?22:0},desktop?i*.13+.15:0);
   });
   document.querySelectorAll('.document-links>a,.history-pair>a,.news-rows>a').forEach((el,i)=>{
    reveal(el,{y:desktop?35:18,opacity:.4},desktop?(i%2)*.1:0);
   });
   const closingLink=document.querySelector('.closing-link');
   if(closingLink)reveal(closingLink,{scale:.75,rotation:-20,opacity:.4});
   document.querySelectorAll('#collection,#promotions,#business,#spaces').forEach(section=>{
    const top=section.querySelector('.section-top');
    if(top)gsap.fromTo(top,{'--section-progress':0},{'--section-progress':1,ease:'none',
     scrollTrigger:{trigger:section,start:'top 80%',end:'bottom 70%',scrub:.5}});
   });
   if(!desktop){
    steps.forEach(step=>{
     reveal(step,{y:25,opacity:.45});
     ST.create({trigger:step,start:'top 65%',end:'bottom 35%',toggleClass:'is-current'});
    });
   }
   // Native scrolling remains in control; no scroll-jacking, snapping or forced navigation.
   if(desktop){

    let current=-1;
    const show=index=>{
     if(index===current)return;current=index;
     scenes.forEach((scene,i)=>{scene.classList.toggle('is-active',i===index);gsap.to(scene,{autoAlpha:i===index?1:0,duration:.6,overwrite:true});
      if(i===index){gsap.fromTo(scene.querySelector('img'),{scale:1.12,y:24},{scale:1,y:0,duration:1.1,ease:'power2.out',overwrite:true});gsap.fromTo(scene.querySelector('.scene-word'),{y:32,opacity:0},{y:0,opacity:1,duration:.75,ease:'power3.out',overwrite:true});}
     });
     steps.forEach((step,i)=>step.classList.toggle('is-current',i===index));
     count.textContent=`0${index+1} / 04`;
     gsap.to('.story-track>span',{scaleX:(index+1)/4,duration:.5,overwrite:true});
    };
    steps.forEach((step,i)=>ST.create({trigger:step,start:'top 60%',end:'bottom 60%',onEnter:()=>show(i),onEnterBack:()=>show(i)}));
    // Restore the correct chapter when re-enabling motion mid-page.
    let initial=0;steps.forEach((step,i)=>{if(step.getBoundingClientRect().top<innerHeight*.6)initial=i;});show(initial);
    gsap.fromTo('.company-wordmark',{xPercent:-7,y:70,opacity:.3},{xPercent:7,y:-50,opacity:1,ease:'none',scrollTrigger:{trigger:'.company-story',start:'top bottom',end:'bottom top',scrub:.8}});
    document.querySelectorAll('.space-grid img').forEach(el=>gsap.fromTo(el,{scale:1.24,yPercent:6},{scale:1,yPercent:0,ease:'none',scrollTrigger:{trigger:el.closest('.space-photo'),start:'top bottom',end:'bottom 35%',scrub:.8}}));
   }
   return()=>{focusCleanups.forEach(cleanup=>cleanup());cleanupCinema?.();resetScenes();};
  });
  window.ScrollTrigger.refresh();
 }
 if(!window.gsap||!window.ScrollTrigger){enabled=false;document.documentElement.classList.add('motion-off');emit();return;}
 window.gsap.registerPlugin(window.ScrollTrigger);
 reduce.addEventListener('change',()=>{enabled=!reduce.matches&&!connection?.saveData;sync();});
 connection?.addEventListener?.('change',()=>{enabled=!reduce.matches&&!connection.saveData;sync();});
 sync();
 document.fonts?.ready.then(()=>window.ScrollTrigger.refresh());
 window.addEventListener('load',()=>window.ScrollTrigger.refresh(),{once:true});
})();
