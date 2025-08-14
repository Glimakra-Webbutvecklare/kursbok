# Prestanda: memo, virtualisering och splitting

Varför behövs detta?
- Stora listor eller tunga komponenter kan göra UI segt.
- Onödiga re‑renders fördyrar upplevelsen.

Guiden: optimera när du ser ett problem, inte i förväg.

## Undvik onödiga re‑renders

- Dela upp stora komponenter i mindre.
- Använd `React.memo` för rena presentionskomponenter.
- Använd `useMemo` för tunga beräkningar och `useCallback` för stabila callbacks.

Fallgrop: överanvändning gör koden svårare att förstå och kan ge sämre prestanda.

## Virtualisering av listor

När? Listor med hundratals/tusentals rader.

Bibliotek: `react-window`, `react-virtualized`.

Varför? Rendera endast synliga rader → drastiskt mindre DOM‑arbete.

## Code‑splitting och lazy loading

När? Stora sidor/verktyg som sällan används.

`React.lazy` + `Suspense` för att ladda delar på begäran. Varför? Kortare initial laddning, bättre TTI.

## Mät innan du optimerar

- Använd React DevTools Profiler för att se re‑renders.
- Inspektera bundle‑storlek och nätverk.
- Optimera det som faktiskt är flaskhalsen.
