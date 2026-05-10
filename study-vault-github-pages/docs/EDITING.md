# 수정·관리 가이드

## 과목 카드 수정

`data/subjects/*.json` 파일을 수정하세요.

예시:

```json
{
  "id": "math",
  "name": "수학",
  "icon": "∑",
  "description": "수학 설명",
  "colors": ["#2563eb", "#7c3aed"],
  "levels": []
}
```

## 단원 추가

각 과목 JSON 안에서 원하는 `units` 배열에 아래 형식으로 추가합니다.

```json
{
  "id": "math-h1-3",
  "title": "새 단원 제목",
  "summary": "단원 한 줄 설명",
  "keywords": ["키워드1", "키워드2"],
  "concepts": [
    "핵심 개념 1",
    "핵심 개념 2",
    "핵심 개념 3"
  ],
  "questions": [
    "문제 1",
    "문제 2",
    "문제 3"
  ]
}
```

## 새 과목 추가

1. `data/subjects/new-subject.json` 파일을 만듭니다.
2. 기존 과목 JSON 구조를 복사해서 수정합니다.
3. `data/site.json`의 `subjectFiles`에 파일명을 추가합니다.

```json
"subjectFiles": [
  "math.json",
  "korean.json",
  "new-subject.json"
]
```

## 색상 변경

전체 색상은 `assets/css/base.css`의 `:root` 변수에서 바꿉니다.

```css
--primary: #2563eb;
--primary-2: #7c3aed;
--accent: #f59e0b;
```

## 기능 수정

- 메인 화면: `assets/js/main.js`
- 탐색 화면: `assets/js/explorer.js`
- 자료실 화면: `assets/js/library.js`
- 테마: `assets/js/theme.js`
