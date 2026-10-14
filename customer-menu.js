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
