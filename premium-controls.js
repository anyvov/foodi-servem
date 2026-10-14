'use strict';
(() => {
  const panels=[...document.querySelectorAll('.preview-tools')];
  document.addEventListener('keydown',e=>{if(e.key==='Escape')panels.forEach(p=>{if(p.open){p.open=false;p.querySelector('summary').focus()}})});
  document.addEventListener('click',e=>panels.forEach(p=>{if(p.open&&!p.contains(e.target))p.open=false}));
  if(document.body.dataset.page==='benchmark'){
    const button=document.querySelector('.menu'),nav=document.querySelector('#nav');
    button.addEventListener('click',()=>{const open=button.getAttribute('aria-expanded')!=='true';button.setAttribute('aria-expanded',String(open));nav.classList.toggle('open',open)});
    document.addEventListener('keydown',e=>{if(e.key==='Escape'){nav.classList.remove('open');button.setAttribute('aria-expanded','false')}});
  }
})();
