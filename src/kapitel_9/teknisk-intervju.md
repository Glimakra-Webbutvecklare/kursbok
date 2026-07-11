# Tekniska intervjufrågor: Node.js och backend

Använd frågorna för att kontrollera att du kan förklara valen i
`portfolio-api`, inte bara skriva av kod. Försök svara högt innan du öppnar
lösningsförslaget.

## 1. Vad är skillnaden mellan Node.js och JavaScript i webbläsaren?

<details>
<summary>Förslag till svar</summary>

JavaScript är språket. Webbläsaren och Node.js är olika körmiljöer.
Webbläsaren ger tillgång till DOM och `window`; Node.js ger bland annat fil-,
process- och nätverks-API:er. Båda använder en händelseloop för asynkront
arbete, men de tillhandahåller olika plattforms-API:er.
</details>

## 2. Varför använder projektet ES modules?

<details>
<summary>Förslag till svar</summary>

`"type": "module"` gör att `.js`-filer använder `import` och `export`. Det ger
samma moderna modulsyntax som frontend och statiskt analyserbara beroenden.
CommonJS med `require` finns i äldre Node-kod, men modulsystemen bör inte
blandas utan en tydlig integrationsstrategi.

```javascript
import express from 'express';
export const app = express();
```
</details>

## 3. Beskriv request–response-flödet i Express

<details>
<summary>Förslag till svar</summary>

En request passerar middleware i registreringsordning. En middleware kan ändra
`request`/`response`, skicka ett svar eller fortsätta med `next()`. En route
väljs utifrån metod och URL, controllern arbetar med data och skickar exakt ett
svar. Fel skickas till en felmiddleware med `next(error)`.
</details>

## 4. Vilka statuskoder använder ett CRUD-API?

<details>
<summary>Förslag till svar</summary>

- `200` för lyckad läsning eller uppdatering.
- `201` för skapad resurs, gärna med `Location`-header.
- `204` för lyckad borttagning utan response body.
- `400` för ogiltig input.
- `401` när giltig autentisering saknas.
- `403` när identiteten saknar rättighet.
- `404` när resursen inte finns.
- `500` för oväntade serverfel utan att läcka intern information.
</details>

## 5. Varför behövs både schema- och requestvalidering?

<details>
<summary>Förslag till svar</summary>

Requestvalidering ger tidiga, tydliga fel och kan begränsa vilka fält klienten
får skicka. Mongoose-schemat är ett sista skydd för databasens datakvalitet,
oavsett vilken kodväg som sparar dokumentet. Uppdateringar behöver
`runValidators: true`.
</details>

## 6. Vad är skillnaden mellan autentisering och auktorisation?

<details>
<summary>Förslag till svar</summary>

Autentisering svarar på *vem användaren är*, exempelvis genom en verifierad
JWT. Auktorisation svarar på *vad användaren får göra*, exempelvis att bara
rollen `admin` får skapa projekt. Lösenord lagras som bcrypt-hash, aldrig som
klartext.

```javascript
router.post('/', authenticate, requireAdmin, createProject);
```
</details>

## 7. JWT eller sessioner – när väljer du vilket?

<details>
<summary>Förslag till svar</summary>

Sessioner lagrar tillstånd på servern och ger enkel logout/revokering, men
kräver ett delat sessionslager vid flera instanser. JWT är självständiga och
passar API-klienter, men en stulen token gäller normalt tills den löper ut.
Cookiebaserad auth kräver dessutom genomtänkt CSRF-skydd. Inget av alternativen
är automatiskt säkrast i alla system.
</details>

## 8. Varför delas `app.js` och `server.js`?

<details>
<summary>Förslag till svar</summary>

`app.js` konfigurerar och exporterar Express-appen. `server.js` ansluter
databasen och öppnar porten. Då kan Supertest importera appen utan att starta
en riktig server eller lämna öppna handles efter testet.
</details>

## 9. Vad testar du med Jest och Supertest?

<details>
<summary>Förslag till svar</summary>

Enhetstest isolerar små funktioner och ersätter beroenden. Integrationstest
med Supertest skickar requests genom Express-stacken. Viktiga fall är lyckat
svar, valideringsfel, saknad token, fel roll och okänd resurs. Testet bör följa
Arrange–Act–Assert och inte vara beroende av produktionsdata.
</details>

## 10. Vad krävs före driftsättning?

<details>
<summary>Förslag till svar</summary>

- Hemligheter och anslutningssträngar ligger i miljövariabler.
- CORS tillåter endast kända frontend-origins.
- HTTPS, säkra cookies och kortlivade tokens används där det passar.
- Input valideras och felmeddelanden läcker inte stack traces.
- Dependencies granskas och uppdateras.
- Health endpoint, strukturerad loggning och övervakning finns.
- Databasens användare har minsta nödvändiga behörighet.
- Tester körs automatiskt före deployment.
</details>

## Intervjutips

- Tänk högt och förklara trade-offs.
- Fråga om krav innan du väljer arkitektur.
- Börja med en liten korrekt lösning.
- Nämn fel-, säkerhets- och testfall.
- Var tydlig med vad du vet och hur du skulle verifiera resten.
