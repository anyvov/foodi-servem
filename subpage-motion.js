'use strict';
(() => {
 const root=document.querySelector('#page-content');
 if(!root)return;
 const reduce=matchMedia('(prefers-reduced-motion: reduce)');
 const mobile=matchMedia('(max-width: 900px)');
 const connection=navigator.connection;
 const seen=new WeakSet(),running=new Map();
 const selector='.sub-hero h1,.sub-hero .eyebrow,.sub-hero>p,.inner-section-title,.company-lead>div,.company-lead>figure,.promise-grid>article,.ceo-portrait,.ceo-letter,.history-ledger>article,.document-grid>article,.partner-grid>article,.chapter-top,.chapter-body,.facility-showcase>article,.equipment-grid>article,.product-visual,.product-profile,.product-card,.board-toolbar,.board-search,.contact-aside,.cta-band';
 const allowed=()=>!reduce.matches&&!connection?.saveData;
 const finish=el=>{const a=running.get(el);if(a){a.cancel();running.delete(el);}};
 const observer='IntersectionObserver' in window?new IntersectionObserver(entries=>{
  entries.forEach(({target:el,isIntersecting})=>{
   if(!isIntersecting)return;
   observer.unobserve(el);
   if(!allowed()||!el.isConnected||el.contains(document.activeElement)||!el.animate)return;
   const siblings=Array.from(el.parentElement.children).filter(n=>n.matches(selector));
   const delay=mobile.matches?0:Math.min(Math.max(siblings.indexOf(el),0),3)*65;
   const photo=el.matches('.company-lead>figure,.product-visual,.ceo-portrait');
   const distance=mobile.matches?18:photo?50:32;
   const frames=[{opacity:.35,transform:`translateY(${distance}px)${photo?' scale(.96)':''}`},{opacity:1,transform:'none'}];
   const a=el.animate(frames,{duration:mobile.matches?500:800,delay,easing:'cubic-bezier(.2,.7,.2,1)',fill:'backwards'});
   running.set(el,a);
   a.onfinish=a.oncancel=()=>{if(running.get(el)===a)running.delete(el);};
  });
 },{threshold:0,rootMargin:'0px 0px -24px 0px'}):null;
 function scan(){
  root.querySelectorAll(selector).forEach(el=>{if(seen.has(el))return;seen.add(el);if(observer&&allowed())observer.observe(el);});
  running.forEach((a,el)=>{if(!el.isConnected)finish(el);});
 }
 root.addEventListener('focusin',event=>{
  for(let el=event.target;el&&el!==root;el=el.parentElement){observer?.unobserve(el);finish(el);}
 });
 const reset=()=>{if(!allowed()){observer?.disconnect();running.forEach((a,el)=>finish(el));}};
 reduce.addEventListener('change',reset);connection?.addEventListener?.('change',reset);
 let pending=false;
 new MutationObserver(()=>{if(pending)return;pending=true;requestAnimationFrame(()=>{pending=false;scan();});}).observe(root,{childList:true,subtree:true});
 scan();
 // Indicate the current chapter without changing the URL or moving focus.
 const links=Array.from(root.querySelectorAll('.inner-nav a[href^="#"]'));
 const chapters=links.map(link=>({link,section:document.getElementById(link.hash.slice(1))})).filter(x=>x.section);
 if(chapters.length){
  let scheduled=false;
  const update=()=>{
   scheduled=false;
   const line=Math.min(innerHeight*.35,240);
   let active=chapters[0];
   chapters.forEach(chapter=>{if(chapter.section.getBoundingClientRect().top<=line)active=chapter;});
   chapters.forEach(({link})=>{if(link===active.link)link.setAttribute('aria-current','location');else link.removeAttribute('aria-current');});
  };
  const schedule=()=>{if(!scheduled){scheduled=true;requestAnimationFrame(update);}};
  window.addEventListener('scroll',schedule,{passive:true});window.addEventListener('resize',schedule);update();
 }
})();
