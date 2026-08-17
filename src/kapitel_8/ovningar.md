# Praktiska övningar: färdigställ Kulturverkstan

Här sätter du samman kapitlets delar. Fortsätt i samma repository och gör en
checkpoint i taget. Börja inte om från ett färdigt projekt om din egen app går
att reparera.

> **Mål:** Självständigt färdigställa, felsöka och förklara ett tillgängligt bokningsflöde med React.

## Så arbetar du

För varje checkpoint:

1. Läs resultatet och skriv vad du tror behöver ändras.
2. Gör en liten ändring åt gången.
3. Kontrollera resultatet i webbläsaren.
4. Läs Console och Network innan du ber om hjälp.
5. Committa först när “Klar när” stämmer.

<details>
<summary>Om du har tappat bort dig helt</summary>

Jämför filnamn och dataform med referensprojektet `examples/kulturverkstan` i
kursbokens repository. Kopiera inte hela lösningen. Hitta den minsta skillnaden
som förklarar ditt fel.

</details>

## Checkpoint 1: komponenter och data

### Resultat

Startsidan visar minst tre workshops från en array. Varje kort visar kategori,
titel, beskrivning, tid, pris och totalt antal lediga platser.

### Din uppgift

- Använd `WorkshopList` och `WorkshopCard`.
- Rendera med `map` och stabil `key`.
- Visa “Fullbokad” när alla tillfällen har `placesLeft: 0`.
- Lägg till en egen workshop med minst två tillfällen.

### Vanligt fel

Om samma data visas i alla kort är värdena troligen hårdkodade i
`WorkshopCard` i stället för lästa från `workshop`-propen.

<details>
<summary>Tips 1</summary>

Följ dataflödet `App → WorkshopList → WorkshopCard`.

</details>

<details>
<summary>Tips 2</summary>

Kontrollera `workshops.map((workshop) => ...)` och
`<WorkshopCard workshop={workshop} />`.

</details>

**Klar när:** fyra olika kort visas från data, ett fullbokat läge går att
demonstrera och du kan förklara varför `key` använder `workshop.id`.

> Commit: `git commit -m "bygg workshoplistan från data"`

## Checkpoint 2: events och state

### Resultat

Besökaren kan filtrera kategorier, välja ett ledigt tillfälle och ändra antal
deltagare. Sammanfattningen uppdateras direkt.

### Din uppgift

- Låt `App` äga vald kategori och bokningsobjektet.
- Beräkna den filtrerade listan under rendering.
- Skicka val uppåt med en event-prop.
- Uppdatera bokningsobjektet och eventuella arrayer utan mutation.
- Hindra deltagarantal från att bli mindre än 1 eller större än antal platser.

### Felsök med flit

Byt tillfälligt en funktionell update mot två anrop med ett gammalt värde.
Förutsäg resultatet, kör och återställ sedan den korrekta varianten.

<details>
<summary>Tips</summary>

När nästa värde bygger på det förra: använd
`setBooking((current) => ({ ...current, ... }))`.

</details>

**Klar när:** filter, val och deltagarantal fungerar tillsammans och du kan
rita state nedåt och eventet uppåt i komponentträdet.

> Commit: `git commit -m "lägg till val och state"`

## Checkpoint 3: tillgängligt formulär

### Resultat

Ett kontrollerat formulär samlar in exakt dessa fält:

```js
{
  workshopId,
  slotId,
  name,
  email,
  participants,
  message,
}
```

### Din uppgift

- Koppla alla värden till state med `value` och `onChange`.
- Koppla varje synlig etikett med `htmlFor` och `id`.
- Validera tid, namn, e-post och antal deltagare vid submit.
- Koppla feltext med `aria-describedby` och ogiltigt fält med `aria-invalid`.
- Visa submitstatus med `aria-live="polite"`.

### Kontroll utan mus

Ladda om sidan och använd endast `Tab`, piltangenter, `Shift+Tab`, `Space` och
`Enter`. Fokus ska synas och hela formuläret ska gå att skicka.

<details>
<summary>Tips</summary>

Om det inte går att skriva: kontrollera att `name`, state-nyckeln, `value` och
`onChange` syftar på samma fält.

</details>

**Klar när:** tomma eller felaktiga värden stoppas vid rätt fält och en giltig
bokning visas i en sammanfattning.

> Commit: `git commit -m "validera bokningsformuläret"`

## Checkpoint 4: appens routes

### Resultat

Kulturverkstan använder exakt dessa routes:

- `/`
- `/workshops/:workshopId`
- `/book/:workshopId`
- `/confirm`

### Din uppgift

- Använd `Link` eller `NavLink` för vanlig navigation.
- Läs `workshopId` med `useParams`.
- Navigera till `/confirm` först efter en giltig bokning.
- Visa hjälpsamma lägen för okänd workshop, okänd route och saknad bekräftelse.

### Avsiktligt fel

Skriv in `/workshops/finns-inte` och `/något-helt-annat`. Båda ska hjälpa
användaren tillbaka utan en tom vit sida.

**Klar när:** adress och innehåll ändras utan helsidesladdning och alla fyra
routes går att demonstrera.

> Commit: `git commit -m "koppla bokningsflödet till routes"`

## Checkpoint 5: API och robusta UI-lägen

### Resultat

Workshops hämtas från `/api/workshops` och bokningen skickas till
`/api/bookings`.

### Din uppgift

- Visa loading, error, empty och success.
- Kontrollera `response.ok` före `response.json()`.
- Avbryt GET-anropet i Effectets cleanup.
- Skicka POST i submit-eventet, inte i ett Effect.
- Lås submitknappen medan POST-anropet pågår.

### Testa alla lägen

| Läge | Så testar du |
|---|---|
| loading | gör nätverket långsammare i DevTools |
| error | stoppa API:t eller skriv en felaktig URL tillfälligt |
| empty | ersätt `workshops` i `db.json` med `[]` tillfälligt |
| success | återställ data och ladda om |

Återställ alltid `db.json` och URL:en efter testet.

**Klar när:** du kan visa alla fyra GET-lägen, Network visar ett POST med sex
förväntade fält och dubbla klick inte skapar två anrop.

> Commit: `git commit -m "hantera api och alla ui-lägen"`

## Checkpoint 6: bygg, publicera och kamratkontrollera

### Din uppgift

1. Kör `npm run build` utan fel.
2. Kör `npm start` och prova en direkt omladdning på `/book/keramik`.
3. Publicera enligt hosting-lektionen.
4. Låt en klasskamrat genomföra bokningsflödet utan instruktioner.
5. Be klasskamraten ge en konkret sak som var tydlig och en som bör ändras.

**Klar när:** den publika appen klarar samma kontroll som den lokala och du har
gjort minst en förbättring efter kamratens test.

> Commit: `git commit -m "färdigställ kulturverkstan"`

## Gör appen till din egen

När alla checkpoints fungerar ska du ändra innehållet utan att byta teknisk
lösning:

- välj ett eget namn och en enkel visuell stil,
- skriv minst fyra egna workshops,
- förbättra tom-, fel- och bekräftelselägenas texter,
- lägg till en relevant filtrering,
- skriv en README med installation, scripts och appens routes.

## Definition of Done inför caseveckorna

- [ ] Minst tre egna komponenter med tydliga ansvar.
- [ ] Props, lista med stabila keys och villkorlig rendering.
- [ ] Events och lokalt eller lyft state utan mutation.
- [ ] Tillgängligt kontrollerat formulär med validering.
- [ ] GET och POST med synlig status och felhantering.
- [ ] De fyra beslutade appvyerna plus en wildcard-fallback för okända adresser.
- [ ] Hjälpsamma tom- och fellägen.
- [ ] Begripliga commits och en README.
- [ ] Fungerande publicerad app.
- [ ] Du kan förklara var rendering, events och Effects används.

Context, reducers och custom hooks krävs inte. De hör till fördjupningen.
