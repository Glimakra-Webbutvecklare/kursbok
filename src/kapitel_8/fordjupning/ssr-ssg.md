# SSR/SSG och Next.js

Varför behövs detta?
- SEO och snabb första rendering: innehåll finns i HTML vid första svar.
- Prestanda på långsamma enheter/nät: mindre JS behövs för att visa första innehållet.

Begrepp:
- SSR (Server‑Side Rendering): HTML genereras per request.
- SSG (Static Site Generation): HTML genereras vid build (snabbt + billigt att serva).

När välja vad?
- SSR: sidor med personaliserat/inloggat innehåll.
- SSG: publika, ofta lästa sidor som sällan ändras (blogg, produktsidor).

Next.js kortfattat:
- Filbaserad routing, inbyggd SSR/SSG, data‑fetching på servern, bildoptimering m.m.
- Börja när du har behov (SEO/prestanda) som motiverar lärokostnaden.
