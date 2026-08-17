# Kulturverkstan

Körbart referensprojekt för kursbokens React-kapitel. Det är en pedagogisk
demo, inte ett riktigt bokningssystem.

```bash
npm install
npm run dev
```

Vite öppnas på `http://localhost:5173` och demo-API:t kör på
`http://localhost:3001/api`.

Produktionskontroll:

```bash
npm run build
npm start
```

Då serveras både React-appen och `/api` från samma port. `db.json` innehåller
endast demodata och kan återställas genom att tömma arrayen `bookings`.
