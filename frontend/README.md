# frontend

Site do portfólio em **React 18 + Vite**. A documentação geral do projeto está no [README da raiz](../README.md).

```bash
npm install
copy .env.example .env     # Windows (no Linux/Mac: cp .env.example .env)
npm run dev                # http://localhost:5173
npm run build              # gera a pasta dist/
```

## Onde mexer

| O que | Onde |
|---|---|
| Textos, projetos, experiências, contatos, skills | `src/data.js` |
| Textos da interface (PT/EN) | `src/i18n.jsx` |
| Cores e tema | variáveis no topo de `src/styles.css` |
| Prints/GIFs dos projetos | coloque em `public/projects/` e referencie em `src/data.js` (`image: '/projects/laje.png'`) |
| Endereço da API | `VITE_API_URL` no `.env` |
