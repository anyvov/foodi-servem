'use strict';
document.querySelectorAll('.customer-menu').forEach(menu=>{
 const summary=menu.querySelector('summary');
 menu.addEventListener('mouseenter',()=>{if(matchMedia('(hover: hover) and (pointer: fine)').matches)menu.open=true;});
 menu.addEventListener('mouseleave',()=>{if(!menu.contains(document.activeElement))menu.open=false;});
 menu.addEventListener('focusout',()=>setTimeout(()=>{if(!menu.contains(document.activeElement)&&!menu.matches(':hover'))menu.open=false;},0));
 menu.addEventListener('keydown',event=>{if(event.key==='Escape'){event.stopPropagation();menu.open=false;summary.focus();}});
 document.addEventListener('click',event=>{if(!menu.contains(event.target))menu.open=false;});
 const current=document.body.dataset.board||location.pathname.replace(/\/+$/, '').split('/').pop().replace(/\.html$/i,'').toLowerCase();
 menu.querySelectorAll('a').forEach(link=>{if(link.getAttribute('href').replace(/\.html$/i,'')===current)link.setAttribute('aria-current','page');});
});

// Shared floating return-to-top control.
(() => {
 const button=document.createElement('button');
 button.type='button';button.className='scroll-top';button.hidden=true;
 button.setAttribute('aria-label','맨 위로 이동');
 button.innerHTML='<svg viewBox="0 0 24 24" width="24" height="24" fill="none" aria-hidden="true" focusable="false"><path d="M12 20V4m-7 7 7-7 7 7" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>';
 document.body.append(button);
 let queued=false;
 const update=()=>{queued=false;button.hidden=window.scrollY<480;};
 window.addEventListener('scroll',()=>{if(!queued){queued=true;requestAnimationFrame(update);}},{passive:true});
 window.addEventListener('pageshow',update);
 button.addEventListener('click',()=>{
  const target=document.querySelector('main');
  if(target){const had=target.hasAttribute('tabindex');if(!had){target.setAttribute('tabindex','-1');target.addEventListener('blur',()=>target.removeAttribute('tabindex'),{once:true});}target.focus({preventScroll:true});}
  window.scrollTo({top:0,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});
 });
 update();
})();
