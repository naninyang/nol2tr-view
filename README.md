# 놀이터뷰 nol2tr_view

유튜브에 업로드된 맨투맨 인터뷰, 뉴스와 관련된 곡을 추천해주고

대리클릭하여 콘텐츠 내용을 알려주는 콘텐츠도 제공합니다.

## 관련 서비스

### 숏뷰뉴스 short.view.news

- 저장소: https://github.com/naninyang/short-view-news-frontend
- 서비스: https://shorts.dev1stud.io

### 기억뉴스상자 memorial.newsbox

- 저장소: https://github.com/naninyang/memorial-news-box-frontend
- 서비스: https://memorial.dev1stud.io

## 사용된 주요 기술

### Frontend

- Next.js
- react-device-detect
- react-modal w/ Route As Modal
- TypeScript
- Emotion
- SASS
- Google YouTube iframe API
- Masonry w/ Masonic
- Perfect Scrollbar
- pull-to-refresh (without Mutate Caching)
- PWA
- SWR w/ useSWRInfinite
- Notion Client
- Strapi API
- API: Fetch, Axios 혼용
- Node 18
- vercel deployment

### Web Opengraph Scrap API Server

- Next.js
- TypeScript
- iconv
- cheerio
- vercel deployment

### Backend

- AWS EC2
- GCP (Compute Engine, Cloud DNS, Networking)
- Nginx
- PM2
- MariaDB
- Node 20 with fnm
- Strapi

## Troubleshooting

이슈를 등록해 주시거나 [여기](https://nol2tr.dev1stud.io/contact-us)를 이용해 주세요.

### 발견되거나 알려진 버그

- 첫 댓글 등록시 등록한 댓글 자동으로 확인 불가 (이미 댓글이 1개라도 있을 때는 정상 동작)
  - 저장은 잘 됨

## TO-DO

- 데이터 불러올 때 텍스트가 세로 가운데 정렬이 안되는 현상 해결 (최소 세로폭 설정 문제)
  - iOS, iPadOS 의 안전 공간 계산 문제로 복잡함
- 영상이 내려간 경우 (삭제/비공개 전환) 자동으로 해당 article 걸러내기
  - 의외로 삭제하거나 비공개로 전환되는 유튜브 영상 기사가 꽤 발생함

## Supported PWA App. Download

PWA 형태의 앱 다운로드를 지원합니다.

Google Chrome에서는 메뉴에 다운로드 링크가 있으며, Safari에서는 메인 화면에 내려받는 방법이 안내되어 있습니다.

MS Windows, Apple macOS, Android, iOS, iPadOS 등 대부분의 모던 디바이스를 지원합니다.

## 광고제안

### 광고 집행 영역

- 유튜브에 업로드 된 영상이 있어야 하고, 홍보하고 싶은 아이템이 웹사이트 혹은 앱 스토어라면 링크가 추가로 있어야 합니다. (링크만 있으면 어떤 것이든 가능)

### 광고 집행 주의사항

- 19금 아이템은 반려됩니다. (폭력적이거나 잔인한 유튜브 영상은 뉴스 기사 역시 가져오고 있지 않습니다.)
- 의약품, 건강기능식품, 화장품 광고는 반려됩니다.
- 앱 광고도 받습니다.

## 주의사항 및 저작권

이 서비스는 Vercel, AWS 그리고 Google과 관련이 없습니다.
