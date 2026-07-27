# To-Do List

브라우저에서 바로 사용할 수 있는 간단한 할 일 목록 앱입니다. 별도의 빌드 과정이나 서버 없이 순수 HTML/CSS/JavaScript로 작성되었으며, `localStorage`를 사용해 브라우저에 데이터를 저장합니다.

## 사용법

`index.html` 파일을 브라우저에서 열면 바로 사용할 수 있습니다.

```bash
open index.html   # macOS
# 또는 파일을 더블클릭해서 열기
```

## 기능

- 할 일 추가 / 삭제
- 완료 체크 표시
- 할 일 텍스트 클릭 후 수정
- 전체 / 진행중 / 완료 필터
- 완료된 항목 일괄 삭제
- 새로고침해도 유지되는 로컬 저장 (localStorage)
- 라이트/다크 모드 자동 대응

## 파일 구성

- `index.html` – 페이지 구조
- `style.css` – 스타일
- `app.js` – 동작 로직

## 기도편지 블로그

`prayer-letters/` 폴더에 기도편지를 나누는 블로그 사이트가 별도로 있습니다. 사용법은 `prayer-letters/README.md`를 참고하세요.
