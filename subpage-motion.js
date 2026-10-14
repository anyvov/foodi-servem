'use strict';
(() => {
 const root=document.querySelector('#page-content');
 if(!root)return;
 const reduce=matchMedia('(prefers-reduced-motion: reduce)');
 const mobile=matchMedia('(max-width: 900px)');
 const connection=navigator.connection;
 const seen=new WeakSet(),running=new Map();
 const selector='.sub-hero h1,.sub-hero .eyebrow,.sub-hero>p,.inner-section-title,.company-lead>div,.company-lead>figure,.promise-grid>article,.ceo-portrait,.ceo-letter,.history-ledger>article,.document-grid>article,.partner-grid>article,.chapter-top,.chapter-body>figure,.chapter-body>div,.facility-showcase>article,.equipment-grid>article,.product-visual,.product-profile,.product-card,.board-toolbar,.board-search,.contact-aside,.cta-band';
 const allowed=()=>!reduce.matches&&!connection?.saveData;
 const finish=el=>{const a=running.get(el);if(a){a.cancel();running.delete(el);}};
 const observer='IntersectionObserver' in window?new IntersectionObserver(entries=>{
  entries.forEach(({target:el,isIntersecting})=>{
   if(!isIntersecting)return;
   observer.unobserve(el);
   if(!allowed()||!el.isConnected||el.contains(document.activeElement)||!el.animate)return;
   const siblings=Array.from(el.parentElement.children).filter(n=>n.matches(selector));
   const delay=mobile.matches?0:Math.min(Math.max(siblings.indexOf(el),0),3)*65;
   const photo=el.matches('.company-lead>figure,.chapter-body>figure,.product-visual,.ceo-portrait');
   const title=el.matches('.sub-hero h1,.inner-section-title,.chapter-top');
   const card=el.matches('.promise-grid>article,.facility-showcase>article,.equipment-grid>article,.product-card');
   const index=Math.max(siblings.indexOf(el),0);
   const distance=mobile.matches?18:photo?50:32;
   let frames=[{opacity:.35,transform:`translateY(${distance}px)`},{opacity:1,transform:'none'}];
   if(!mobile.matches){
    if(photo)frames=[{opacity:.5,clipPath:'inset(12% 18% 12% 0%)',transform:'translateY(55px) scale(.94)'},{opacity:1,clipPath:'inset(0% 0% 0% 0%)',transform:'none'}];
    else if(title)frames=[{opacity:.3,transform:'translateX(-36px) skewX(-3deg)'},{opacity:1,transform:'none'}];
    else if(card)frames=[{opacity:.35,transform:`perspective(1000px) translateY(${65+(index%3)*20}px) rotateX(8deg) scale(.94)`},{opacity:1,transform:'none'}];
   }
   const a=el.animate(frames,{duration:mobile.matches?550:1100,delay,easing:'cubic-bezier(.2,.7,.2,1)',fill:'backwards'});
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
 // Scroll-driven photo depth and chapter rules; no mouse tracking or scroll locking.
 const photoSelector='.company-lead>figure img,.chapter-body>figure img,.facility-showcase .source-image img,.hygiene-photo img';
 let photoNodes=[],rules=[],scrollPending=false;
 const refreshDepth=()=>{
  photoNodes=Array.from(root.querySelectorAll(photoSelector));
  rules=Array.from(root.querySelectorAll('.inner-section-title,.chapter-top'));
  photoNodes.forEach(img=>img.parentElement.classList.add('scroll-photo-frame'));
 };
 function paintDepth(){
  scrollPending=false;
  const active=allowed()&&!mobile.matches;
  root.classList.toggle('sub-depth-active',active);
  photoNodes.forEach(img=>{
   if(!active){img.style.removeProperty('transform');return;}
   const box=img.parentElement.getBoundingClientRect();
   if(box.bottom<0||box.top>innerHeight)return;
   const progress=Math.min(1,Math.max(0,(innerHeight-box.top)/(innerHeight+box.height)));
   img.style.transform=`translateY(${(progress-.5)*8}%) scale(1.13)`;
  });
  rules.forEach(el=>{
   const box=el.getBoundingClientRect();
   const progress=active?Math.min(1,Math.max(0,(innerHeight*.9-box.top)/(innerHeight*.5))):1;
   el.style.setProperty('--chapter-line',progress);
  });
 }
 const queueDepth=()=>{if(!scrollPending){scrollPending=true;requestAnimationFrame(paintDepth);}};
 refreshDepth();paintDepth();
 window.addEventListener('scroll',queueDepth,{passive:true});
 window.addEventListener('resize',queueDepth);
 reduce.addEventListener('change',queueDepth);mobile.addEventListener('change',queueDepth);
 connection?.addEventListener?.('change',queueDepth);
 root.addEventListener('load',queueDepth,true);
 new MutationObserver(()=>{refreshDepth();queueDepth();}).observe(root,{childList:true,subtree:true});
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
