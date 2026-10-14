'use strict';
(() => {
 const route=document.body.dataset.board||location.pathname.replace(/\/+$/, '').split('/').pop().replace(/\.html$/i,'').toLowerCase();
 const inquiry=route==='inquiry';
 const category=route==='news'?'공지사항':'기업소식';
 const tabs=active=>`<nav class="section-nav" aria-label="게시판 메뉴">${[['notice.html','기업소식'],['news.html','공지사항'],['inquiry.html','문의게시판']].map(([url,label])=>`<a href="${url}" ${label===active?'aria-current="page"':''}>${label}</a>`).join('')}</nav>`;
 if(inquiry){
  renderInquiryBoard(tabs);
 }else if(page==='board'){
  const q=(param.get('q')||'').slice(0,100), items=posts.filter(p=>p.category===category&&p.title.includes(q));
  const url=category==='공지사항'?'news.html':'notice.html';
  document.title=category+' | FOODI · SERVEM';
  root.innerHTML=hero(category==='기업소식'?'COMPANY NEWS':'NOTICE',category,category==='기업소식'?'푸드아이·써브엠의 활동과 소식을 전합니다.':'푸드아이·써브엠의 공지사항을 확인하세요.')+`<div class="content">${tabs(category)}<form class="search-form board-search" action="${url}"><label for="board-q">제목 검색</label><input id="board-q" name="q" maxlength="100" value="${esc(q)}" placeholder="검색어를 입력하세요"><button>검색</button></form><p class="caption">${items.length}건</p><div class="board-list">${items.map(p=>`<a class="board-row" href="post.html?id=${p.id}"><span class="badge">${category}</span><h2>${esc(p.title)}</h2><time datetime="${p.date}">${p.date}</time></a>`).join('')||`<div class="empty">검색 결과가 없습니다. <a href="${url}">목록 전체 보기</a></div>`}</div>${archiveNote}</div>`;
 }else if(page==='post'){
  renderLocalPost();
  const item=posts.find(p=>p.id===param.get('id'));
  if(item){root.querySelector('.content')?.insertAdjacentHTML('afterbegin',tabs(item.category));root.querySelectorAll('a[href="board.html"]').forEach(a=>{a.href=item.category==='공지사항'?'news.html':'notice.html';a.textContent='← '+item.category+' 목록';});}
 }
})();
