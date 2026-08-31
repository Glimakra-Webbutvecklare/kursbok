# Kulturverkstan

Körbart referensprojekt för kursbokens React-kapitel. Det är en pedagogisk
demo, inte ett riktigt bokningssystem.

## Lokalt med API

```bash
npm install
npm run dev
```

Vite öppnas på `http://localhost:5173` och demo-API:t kör på
`http://localhost:3001/api`. POST mot `/api/bookings` sparas i `db.json`.

## Statisk förhandsgranskning (som GitHub Pages)

```bash
npm run build
npm run preview
```

Då hämtas workshops från `public/workshops.json`. En bokning visas som
bekräftelse i appen men sparas inte på någon server.

`npm start` startar bara json-server. Det är inte hosting.

## Publicera

När projektet ligger i ett eget GitHub-repository:

1. Pusha till `main`.
2. Settings → Pages → Source: **GitHub Actions**.
3. Workflowen i `.github/workflows/deploy.yml` bygger `dist` och publicerar.

På en projektsajt (`användarnamn.github.io/reponamn/`) sätter Vite `base` från
`GITHUB_REPOSITORY`. Håll `db.json` och `public/workshops.json` i synk när du
ändrar workshoptexter.
