# Study Vault

GitHub Pages에 바로 올릴 수 있는 정적 지식창고 사이트입니다.

## 폴더 구조

```txt
.
├─ index.html
├─ pages/
│  ├─ explorer.html
│  ├─ library.html
│  └─ about.html
├─ assets/
│  ├─ css/
│  ├─ js/
│  ├─ images/
│  └─ icons/
├─ data/
│  ├─ site.json
│  ├─ subjects/
│  └─ common/
└─ docs/
```

## 실행

로컬에서는 `index.html`을 더블클릭하면 일부 브라우저에서 JSON fetch가 막힐 수 있습니다.
VS Code의 Live Server 확장 또는 Python 간단 서버를 추천합니다.

```bash
python -m http.server 5500
```

그 뒤 `http://localhost:5500`으로 접속하세요.
