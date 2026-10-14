# FOODI SERVEM

회사 홈페이지 리뉴얼 시연용 정적 사이트입니다.

## 실행

프로젝트 루트에서 `python3 -m http.server 8080` 실행 후 http://localhost:8080 으로 접속합니다.

## GitHub Pages

Settings → Pages → Deploy from a branch → main → /(root) → Save.

## 구성

HTML, CSS, JavaScript와 이미지·폰트·영상으로 구성되며 빌드가 필요하지 않습니다. 메인 페이지는 index.html입니다.

게시판 자료 열람은 가능하지만 문의 등록·관리자 기능·그누보드 서버 연동은 별도 백엔드 구현이 필요합니다.

## 이전 기록

2026-10-14 기준 원본 소스 커밋: 6de9bcda32990b2f89d4415805460ebfebac8b79. 메인 모션 토글 버튼 제거 반영. 대형 이미지 I308/I310은 동일 해상도·동일 RGBA 픽셀의 무손실 WebP로 변환했습니다. 원본 PNG는 기존 소스 저장소에 보존되어 있습니다.
