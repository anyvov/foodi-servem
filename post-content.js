'use strict';
function renderLocalPost(){
 const p=posts.find(x=>x.id===param.get('id'));if(!p)return;
 const bodies={
 P002:{paragraphs:['test'],note:'기존 홈페이지의 테스트 게시글입니다.'},
 P004:{paragraphs:['ㅅㄷㄴㅅ'],note:'기존 홈페이지의 테스트 게시글입니다.'},
 P005:{paragraphs:['대한적십자사봉사회 하남지구협의회가 설을 앞두고 명절 음식 나눔 활동을 진행한 소식입니다. 기존 게시글에는 2022년 설 명절 나눔 행사 사진과 관련 소개 글이 실려 있습니다.','아래 사진은 당시 나눔 현장입니다. 이 페이지의 게시일은 기존 홈페이지에 글이 등록된 날짜이며, 행사 개최일과는 다릅니다.'],image:'I307',caption:'2022년 설 명절 음식 나눔 현장 · 기존 게시글 수록 사진',note:'기존 게시 자료를 바탕으로 정리한 요약입니다.'},
 P006:{paragraphs:['대한적십자사봉사회 하남지구협의회는 2024년 설을 맞아 지역의 취약계층 200세대에 명절 음식과 떡국 재료를 전달했습니다.','써브엠은 불고기 120kg을 후원했습니다. 봉사자들은 2월 5일부터 7일까지 음식을 준비하고 대상 가정에 전달했습니다.'],note:'기존 게시글의 행사 자료를 바탕으로 정리한 요약입니다. 기사 이미지 전문은 복제하지 않았습니다.'},
 P007:{paragraphs:['하남시가 대한적십자사봉사회 하남지구협의회의 유공회원에게 시장 표창을 수여한 소식입니다. 써브엠 정상열 대표가 수상자에 포함돼 있습니다.','게시된 보도 내용에 따르면 수여식은 코로나19 상황을 고려해 참석 규모를 줄여 진행됐습니다. 지역사회를 위한 봉사자들의 활동을 격려하는 자리였습니다.'],image:'I215',caption:'유공회원 표창 관련 사진 · 기존 게시글 수록',note:'기존 보도 내용을 정리한 요약입니다.'}
 };
 const b=bodies[p.id];if(!b)return;
 const siblings=posts.filter(x=>x.category===p.category),i=siblings.findIndex(x=>x.id===p.id);
 const link=(item,label)=>item?`<a class="text-link" href="post.html?id=${item.id}">${label} · ${esc(item.title)}</a>`:'';
 document.title=p.title+' | FOODI · SERVEM';
 root.innerHTML=hero(p.category,p.title,'게시일 '+p.date)+`<div class="content"><article class="article"><p class="badge">${p.category}</p><div class="article-body">${b.image?`<figure><img src="assets/posts/${b.image}.png" alt="${esc(b.caption)}" style="display:block;max-width:100%;height:auto;margin:0 auto"><figcaption>${esc(b.caption)}</figcaption></figure>`:''}${b.paragraphs.map(t=>`<p>${esc(t)}</p>`).join('')}</div><nav class="sub-actions" aria-label="게시글 이동">${link(siblings[i-1],'이전 글')}${link(siblings[i+1],'다음 글')}</nav><div class="sub-actions"><a class="solid" href="${p.category==='공지사항'?'news':'notice'}.html">목록으로</a></div></article></div>`;
}
