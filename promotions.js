'use strict';
// Existing homepage banners in their original order. Add/remove entries here;
// visibility is independent of layout. GNUboard administrator integration pending.
window.FOODI_PROMOTIONS = [
 {id:'gift',visible:true,title:'LA갈비 선물세트',text:'소중한 분께 전하는 정성. 푸드아이의 선물세트를 만나보세요.',image:'assets/source/I089.jpg',href:'products.html?category=선물세트',link:'선물세트 보기'},
 {id:'seasoned',visible:true,title:'맛을 더한 양념육',text:'다양한 메뉴에 어울리는 우육·돈육 양념 제품을 소개합니다.',image:'assets/seasoning-wide.jpg',href:'products.html?category=양념육',link:'양념육 보기'},
 {id:'beef',visible:true,title:'부위별로 만나는 우육',text:'메뉴에 맞는 부위와 규격으로 필요한 제품을 찾아보세요.',image:'assets/hero.jpg',href:'products.html?category=우육',link:'우육 제품 보기'}
];
(() => {
 const root=document.querySelector('[data-promotions]');if(!root)return;
 const entries=window.FOODI_PROMOTIONS.filter(x=>x.visible);
 if(!entries.length){root.hidden=true;return;}
 const escape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 root.innerHTML=`<div class="section-top"><p class="micro">FOODI × SERVEM / PROMOTIONS</p><span class="promotion-count">${entries.length}개의 제품 소식</span></div><h2>제품 소식 & 프로모션.</h2><div class="home-promotions-grid">${entries.map(x=>`<article><a href="${escape(x.href)}"><img src="${escape(x.image)}" width="1903" height="600" loading="lazy" alt="${escape(x.title)}"><h3>${escape(x.title)}</h3></a><p>${escape(x.text)}</p><a class="line-link" href="${escape(x.href)}">${escape(x.link)} <span>↗</span></a></article>`).join('')}</div>`;
})();
