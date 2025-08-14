# Data: caching, retry och realtid

Varför behövs detta?
- Nätverket är opålitligt: retry/backoff förbättrar robusthet.
- Onödiga anrop kostar: deduplicering och caching sparar resurser.
- Realtid: WebSockets för chatt, notiser, dashboards.

## Enkel caching och deduplicering

Idé: spara svar i minne en kort tid och hindra parallella identiska anrop.

Trade‑off: cache måste invalideras — bra för läs‑tung data som sällan ändras.

## Retry och exponential backoff

När? Transienta fel (nätverk/timeout). Inte för 4xx (klientfel).

Varför? Ökar chansen att lyckas utan att belasta servern.

## WebSockets (realtid)

När? Live‑uppdateringar (chatt, ticker, notifieringar).

Varför? Push från servern i stället för att polla ofta.

Tips: återanslutning, hjärtslag och backoff krävs för robusthet.
