# Data och publicera

Appen blir er för att **innehållet** är ert: bilder ni tar, texter ni skriver, fält ni kommer överens om. Sista steget är att någon utanför gruppen kan öppna den utan `localhost`.

> **Mål:**  
> Samla minst tio annoterade poster med egna bilder, hålla koll på samtycke och `alt`-text, och publicera frontend plus API.

**Förutsättning:** [API-kontraktet](./api-kontrakt.md) och [Docker](./docker.md). Hosting-begrepp finns i [Att hosta en applikation](../kapitel_6/hosta-applikation.md).

---

## Samla data tillsammans

Gör det som en issue, inte som "någon tar lite bilder i helgen".

1. Enas om vad en post *är* (en fågel, en lunch, ett minnesmärke).
2. Ta **egna** foton. Kopiera inte från Google.
3. Annotera samma fält som i `api.md`: `title`, `description`, `altText`, `tags`, `observedAt`, sökväg till filen.
4. Lägg filerna i `data/images/` och raderna i `data/items.json`.
5. PR:a datasetet. År 2 seedar från den filen.

**Minst tio poster.** Färre ger en tom demo och inget att testa listan mot.

```json
{
  "id": "a3f1",
  "title": "Koltrast vid matsalsfönstret",
  "description": "Hane, sjöng från eken bakom matsalsbyggnaden.",
  "imageUrl": "/data/images/koltrast.jpg",
  "altText": "Svart fågel med orange näbb på en gren",
  "tags": ["fagel", "skolgard"],
  "observedAt": "2026-04-12"
}
```

`altText` är inte samma sak som `title`. Alt-texten beskriver bilden för den som inte ser den.

---

## Samtycke och upphovsrätt

- Fotografera inte personer på nära håll utan att de vet om det. Klasskamrater i bakgrunden: fråga.
- Barn och känsliga miljöer: låt bli, välj en annan domän.
- Ni äger era bilder. Lägg en rad i README: "Foton tagna av gruppen, användning i studiesyfte."

Det här är inte juristkurs – det är minimalt omdöme innan ni pushar till ett publikt repo.

---

## Publicera frontend

Vanilla-frontend är statiska filer. **GitHub Pages** (Settings → Pages, branch `main`, mapp `/frontend` eller ett `gh-pages`-flöde) är den enklaste vägen. Då får ni en `https://<grupp>.github.io/...`-URL.

Peka `API_BASE` mot den **publicerade** API-URL:en, inte `localhost`. En `config.js` som läser `window.API_BASE` låter er sätta värdet i en liten `config.prod.js` utan att hårdkoda i varje `fetch`.

Andra värdar går bra om läraren säger det. Poängen är en länk i README.

---

## Publicera API:t

API:t behöver en process och oftast en databas. Frontend kan ligga på
[GitHub Pages](../kapitel_8/hosta-react-app.md) som Kulturverkstan. API:t kan
inte det – använd den Node-värd som läraren anger (samma idé, annan mapp:
`api/` plus compose).

Checklistan är densamma oavsett värd:

- Bygg från GitHub så en merge på `main` kan bli en ny deploy.
- Sätt `CORS_ORIGIN` till frontendens riktiga origin, inte bara `http://localhost:8080`.
- Hemligheter i plattformens env-variabler, inte i repot.
- Seed körs medvetet (en gång), inte vid varje omstart mot en databas som redan har data.

---

## README som skyltfönster

README är det första en lärare, klasskamrat eller arbetsgivare ser:

1. Vad appen är, på tre meningar.
2. Länk till live-frontend och till API (eller `/api/items`).
3. Hur man kör lokalt (`docker compose up --build`).
4. Vem som gjort vad (år 1 / år 2), utan att det låter som en alibi-lista – peka på PR:er.
5. Att bilderna är era.

Om README saknar live-länk är appen inte publicerad, den är bara pushad.

---

## Checkpoint

- [ ] Minst tio poster med egna bilder, `altText` och fält som matchar `api.md`.
- [ ] Ingen bild ni inte har rätt att lägga upp.
- [ ] Frontend nås på en publik URL.
- [ ] API nås på en publik URL och CORS tillåter frontenden.
- [ ] README länkar båda och förklarar `docker compose up`.

Öva processen i [Praktiska övningar](./ovningar.md) parallellt med att ni samlar data – vänta inte till sista dagen.
