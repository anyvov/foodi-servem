'use strict';
(() => {
 const menu=document.querySelector('.nav-toggle'),nav=document.querySelector('#atelier-nav'),options=document.querySelector('.studio-options');
 const closeMenu=()=>{nav.classList.remove('open');menu.setAttribute('aria-expanded','false')};
 menu.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';nav.classList.toggle('open',open);menu.setAttribute('aria-expanded',String(open))});
 nav.addEventListener('click',e=>{if(e.target.closest('a'))closeMenu()});
 document.addEventListener('keydown',e=>{if(e.key==='Escape'){if(nav.classList.contains('open')){closeMenu();menu.focus()}if(options?.open){options.open=false;options.querySelector('summary').focus()}}});
 document.addEventListener('click',e=>{if(options?.open&&!options.contains(e.target))options.open=false});
 const video=document.querySelector('#opening-film'),button=document.querySelector('#film-toggle'),status=document.querySelector('#film-status'),reduce=matchMedia('(prefers-reduced-motion: reduce)');
 if(!video)return;
 let wanted=false,generation=0;
 const showPhoto=(message='기존 제품 사진 · 정지 화면')=>{generation++;wanted=false;video.pause();video.hidden=true;button.setAttribute('aria-pressed','false');button.innerHTML='영상 재생 <span>▶</span>';status.textContent=message};
 async function play(){wanted=true;const request=++generation;if(!video.getAttribute('src'))video.src='assets/hero-photo-film.mp4';video.muted=true;try{await video.play();if(request!==generation||!wanted){if(!wanted)video.pause();return}video.hidden=false;button.setAttribute('aria-pressed','true');button.innerHTML='영상 정지 <span>Ⅱ</span>';status.textContent='기존 제품 사진으로 만든 모션 영상 · 무음'}catch{if(request===generation)showPhoto('사진 표시 중 · 영상은 재생 버튼으로 다시 시도할 수 있습니다.')}}
 button.addEventListener('click',()=>wanted?showPhoto():play());
 document.addEventListener('foodi:motion',e=>{if(!e.detail.enabled)showPhoto('모션 꺼짐 · 사진 배경')});
 video.addEventListener('error',()=>showPhoto('영상을 불러오지 못해 기존 사진을 표시합니다.'));
 document.addEventListener('visibilitychange',()=>{if(document.hidden)video.pause();else if(wanted)play()});
 reduce.addEventListener('change',e=>{if(e.matches)showPhoto('모션 줄이기 설정 · 사진 배경')});
 if(!reduce.matches&&!navigator.connection?.saveData)play();else showPhoto(reduce.matches?'모션 줄이기 설정 · 사진 배경':'데이터 절약 설정 · 사진 배경');
})();
