# Praktiska övningar: grupparbete

Övningarna tränar **processen**, inte en todo-app. Gör dem i gruppens repo (eller en kopia) med riktiga issues och PR:er. Simuleringarna i lektionerna var uppvärmning.

> **Mål:**  
> Ha gjort loopen issue → branch → PR → review minst en gång, löst en konflikt ihop, kört compose och skrivit kontraktstester mot `api.md`.

**Förutsättning:** Kickoff enligt [Projektet och rollerna](./roller.md) är gjord.

---

## Övning 1: Från bugg till issue och branch

Någon i gruppen skriver (med flit) den här rapporten i chatten:

> "Listan är blank när JSON:en är en tom array. Jag vet inte om det laddar eller om det är tomt."

1. Skapa en issue med titel, labels och **klart när** (till exempel: tom array visar texten "Inga poster ännu." i `#status`).
2. Assigna en person. Flytta kortet till `Pågår` på Project-boarden.
3. Från uppdaterad `main`:

```bash
git switch main
git pull
git switch -c fix/issue-N-tom-lista
```

4. Pusha branchen (även med en tom commit om ni bara övar namngivning – helst med den faktiska fixen).

**Checkpoint:** issuen har nummer, branchen heter `fix/issue-<nummer>-...`, och `Closes #<nummer>` kan användas i nästa PR.

---

## Övning 2: Granska en medvetet dålig PR

Kopiera diffen nedan till en branch (en person) och öppna en PR **utan** att städa den. Resten av gruppen reviewar. Målet är att **Request changes** med konkreta radkommentarer – inte "ser fint ut".

```javascript
// frontend/js/list.js  – medvetet dålig
async function load() {
  const res = await fetch("http://localhost:3000/api/items");
  const data = await res.json();
  document.querySelector("#list").innerHTML = data
    .map(
      (item) =>
        `<article><h2>${item.name}</h2><p>${item.description}</p>
         <img src="${item.imageUrl}"></article>`
    )
    .join("");
  console.log("data", data);
}
load();
```

Minst tre saker reviewern ska fånga:

| Problem | Varför det är allvarligt |
| --- | --- |
| `item.name` i stället för `title` | Bryter `api.md` – korten blir tomma |
| `innerHTML` med API-data | XSS om description innehåller HTML |
| Ingen `response.ok`, inget tomt/fel-tillstånd | Blank sida när API:t dör |
| Hårdkodad localhost-URL | Går sönder mot mock och mot produktion |
| Saknad `alt` | Bilden är obrukbar för skärmläsare |
| `console.log` kvar | Skräp i en "klar" PR |

Skriv kommentarer som i [GitHub-workflow](./github-workflow.md): peka på raden och säg vad som ska ändras. Författaren fixar, pushar, reviewern resolve:ar trådarna och Approve:ar.

**Checkpoint:** PR:en har minst tre review-kommentarer som inte är "bra jobbat", och en senare commit som åtgärdar dem.

---

## Övning 3: Konflikt tillsammans

Två personer, samma fil (`frontend/js/config.js` eller README):

1. Båda skapar varsin branch från samma `main`.
2. Person A ändrar en rad, committa, PR, merge till `main` (efter snabb review).
3. Person B ändrar **samma rad** på sin branch, pushar, öppnar PR – GitHub varnar.
4. Person B kör `git fetch` och `git merge origin/main` lokalt. **Båda sitter med** när `<<<<<<<` redigeras bort.
5. Commit, push, PR blir mergbar.

**Checkpoint:** merge-commit eller konfliktlösning syns i historiken, och ni kan berätta vad `HEAD` betydde i markeringarna. Tvinga inte `push --force`.

---

## Övning 4: `docker compose up`

När compose-filen finns i `main`:

1. En person som **inte** skrev Dockerfilen klonar om (eller `git pull`) på en ren mapp.
2. Kopierar `.env.example` → `.env`.
3. Kör `docker compose up --build`.
4. Öppnar frontend-URL och `GET` mot `/api/items`.
5. Om det failar: `docker compose logs api` och en issue, inte "det funkar hos mig".

**Checkpoint:** någon annan än författaren har startat stacken utan extra hemliga steg.

---

## Övning 5: Tre kontraktstester ur `api.md`

År 2 (år 1 får sitta med och läsa testerna):

Skriv tester som bara utgår från kontraktet:

1. Lista → `200` + `title` / `imageUrl` / `altText` på en post.
2. `POST` utan `title` → `400`.
3. Okänt id → `404`.

Pusha på en PR och se Actions bli gröna (eller röda, då fixar ni).

**Checkpoint:** en medveten ändring av fältnamnet i API:t gör CI röd innan ni ändrar testet.

---

## Övning 6: Tio annoterade poster

Som grupp, en PR mot `data/`:

- Minst tio egna bilder i `data/images/`.
- `data/items.json` med fält som matchar `api.md`.
- `altText` på varje bild.
- Ingen person ni inte frågat.

**Checkpoint:** seedad lista i API:t visar *era* bilder, inte `placeholder.png`.

---

## Sammanfattning

Om ni kan öppna en issue, granska en dålig PR, lösa en konflikt ihop, starta compose och se CI falla när kontraktet bryts – då kan ni grupparbete. Appen är beviset ni lämnar utåt; GitHub-historiken är beviset ni lämnar in.
