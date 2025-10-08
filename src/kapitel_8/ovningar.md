# Praktiska Övningar och Projekt: Bygg Kompletta React-applikationer

Nu när vi har lärt oss React-fundamenten är det dags att sätta samman allt i praktiska projekt. Dessa övningar bygger gradvis från enkla komponenter till kompletta applikationer.

**Mål:** Tillämpa React-kunskaper i verkliga projekt, integrera API:er, hantera state management och skapa användbara applikationer.

## Övning 1: Todo-lista med useState

- Bygg en enkel todo-app med möjligheter att lägga till, toggla och ta bort todos.
- Visa antal kvarvarande todos och filtrering (alla/aktiva/klara).

Klar-kriterier:
- Todo-listan överlever sidladdning.
- Varje todo har stabil `key` (t.ex. id).
- Inga muterande operationer på state-arrayer (använd spread operator ... ).

## Övning 2: Konsumera publikt API + Routing

- Hämta data från ett publikt API (t.ex. SWAPI eller PokéAPI).
- Visa lista och detaljsida för ett item via React Router (v6), inkl. `useParams`.
- Hantera `loading`/`error`-states och tomma resultat.

Klar-kriterier:
- Lista och detaljvy fungerar via klient-routing (ingen helsidladdning).
- Sök/filter uppdaterar URL query params med `useSearchParams`.

## Övning 3: Formulär med validering och API

- Bygg ett formulär (t.ex. registrering eller produktform) med kontrollerade inputs.
- Validera fält vid blur och submit; visa felmeddelanden.
- Skicka data till ett mock-API (json-server eller liknande) och hantera svar/fel.
- Bonus: Använd `react-hook-form` för att jämföra ergonomi/prestanda.

Klar-kriterier:
- Validering hindrar felaktiga submissioner och visar användarvänliga fel.
- Efter lyckad submit nollställs formuläret eller navigera till en bekräftelsesida.

## Övning 4: Global state med Context

- Implementera tema-växling (ljus/mörk) med Context + persistens i `localStorage`.
- Applicera temat på hela appen via CSS-klass eller `data-theme` på `html`-elementet.

Klar-kriterier:
- Temat sparas och läses in vid start.
- Ingen props drilling för temahantering.

## Övning 5: Prestandaoptimering och stora listor

- Rendera en lista med 1 000+ items.
- Optimera med `React.memo`, `useMemo`, `useCallback` där det ger effekt.
- Implementera virtualisering med `react-window` och jämför FPS/scroll-känsla.

Klar-kriterier:
- Mätbar förbättring när virtualisering används.
- Inga onödiga re-renders av listitems (verifiera med React DevTools Profiler).

---

Checklista (Definition of Done) för kapitel:
- API-anrop hanterar `loading`/`error` och cleanup (AbortController).
- Routing-exempel följer v6 (relativa paths, `NavLink` utan `activeClassName`).
- Inga state-mutationer i exempel (kopior vid sortering/uppdatering).
- ESLint `react-hooks/exhaustive-deps` aktiverat i projektet.
- Tillgänglighet: formulär har etiketter, fokus är synligt, och knappar har beskrivande text.
