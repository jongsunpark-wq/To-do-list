# 기도편지 블로그

기도편지를 정리해서 나누는 블로그 형식의 정적 사이트입니다. 빌드 과정 없이 순수 HTML/CSS/JavaScript로 만들어져 있습니다.

## 미리보기

`fetch`로 `posts.json`을 불러오기 때문에, `index.html`을 더블클릭해서 바로 열면 브라우저 보안 정책(CORS)에 막혀 글 목록이 안 보일 수 있습니다. 간단한 로컬 서버로 열어주세요.

```bash
cd prayer-letters
python -m http.server 8000
# 브라우저에서 http://localhost:8000 접속
```

배포(GitHub Pages 등) 후에는 이런 문제 없이 정상 동작합니다.

## 글 추가/수정하기

`posts.json` 파일을 편집합니다. 각 글은 아래 형식입니다.

```json
{
  "id": "고유-아이디",
  "title": "글 제목",
  "date": "2026-07-01",
  "tags": ["기도제목", "감사제목"],
  "excerpt": "목록에 보일 짧은 요약",
  "thumbnail": "images/파일명.jpg",
  "images": ["images/파일명1.jpg", "images/파일명2.jpg"],
  "content": "<p>본문. 문단은 p 태그로 구분.</p>"
}
```

- `id`는 다른 글과 겹치지 않아야 합니다.
- `thumbnail`/`images`에 적은 파일이 `images/` 폴더에 없으면 "사진 준비중" 표시가 자동으로 뜹니다 (에러 없음).
- 날짜(`date`)가 최신인 글이 목록 맨 위에 표시됩니다.

## 사진 추가하기

`images/README.md` 참고. 이 저장소는 로컬 PC나 Google Drive 경로에 직접 접근할 수 없으므로, 사진 파일을 이 폴더 안에 직접 넣어야 합니다.

## 공개 범위 안내

현재 `<meta name="robots" content="noindex, nofollow">`를 넣어 검색엔진에 노출되지 않도록 했습니다. 다만 이는 "링크를 아는 사람만 보는" 것을 도와주는 최소한의 장치일 뿐, 실제 접근 제어(로그인/비밀번호)는 아닙니다. 저장소를 공개(public) GitHub 저장소로 두면 코드와 사진 파일 자체는 누구나 볼 수 있으니, 더 강한 비공개가 필요하면:

- 저장소를 private으로 두고 GitHub Pages(비공개 배포가 가능한 플랜) 또는 Netlify/Vercel의 비밀번호 보호 기능을 사용
- 또는 페이지 접근에 간단한 비밀번호 입력을 요구하는 기능 추가(참고용 정도의 보안)

사역지 보안이 민감한 경우, 실명·구체적 지명·상호명·차량 번호판 등이 사진이나 글에 노출되지 않았는지 게시 전에 다시 확인해 주세요.

## 파일 구성

- `index.html` – 페이지 구조
- `style.css` – 스타일
- `app.js` – 목록/상세/태그 필터/이미지 라이트박스 로직
- `posts.json` – 글 데이터
- `images/` – 사진 파일
