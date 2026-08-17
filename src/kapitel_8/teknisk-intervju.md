# Förklara och felsök React

Det här är inte ett facit att memorera. Använd frågorna för att öva på att
läsa kod, förutsäga resultat och förklara Kulturverkstans lösningar högt.

## Så tränar du

1. Dölj svaret.
2. Svara med egna ord och peka på ett exempel i din app.
3. Visa koden eller kör den när frågan ber om det.
4. Jämför med kontrollpunkterna.

## 1. Komponenter och props

**Fråga:** Vad är skillnaden mellan `WorkshopList` och `WorkshopCard`, och hur
kommer en workshop fram till kortet?

<details>
<summary>Kontrollpunkter</summary>

- Båda är funktionskomponenter som returnerar JSX.
- Listan använder `map` och skapar ett kort per objekt.
- Objektet skickas ned med en prop.
- `key` hjälper React identifiera rätt objekt i listan men är inte en vanlig prop.

</details>

## 2. Förutsäg rendering

```jsx
function Places({ placesLeft }) {
  return <p>{placesLeft > 0 ? `${placesLeft} platser kvar` : 'Fullbokad'}</p>;
}
```

**Fråga:** Vad visas för `placesLeft={0}` respektive `placesLeft={3}`? Varför
behövs ingen state?

<details>
<summary>Svar</summary>

`0` visar “Fullbokad” och `3` visar “3 platser kvar”. Resultatet kan räknas
direkt från propen under rendering och ska därför inte dupliceras i state.

</details>

## 3. Events och state

**Fråga:** Varför är följande update säkrare när nästa värde bygger på det
förra?

```jsx
setParticipants((current) => current + 1);
```

<details>
<summary>Kontrollpunkter</summary>

- Setter-funktionen tar emot det senaste köade värdet.
- Event handlern beskriver en förändring, rendering beskriver resultatet.
- State ska inte ändras direkt med `participants += 1`.

</details>

## 4. Objekt utan mutation

Felsök koden:

```jsx
booking.name = event.target.value;
setBooking(booking);
```

<details>
<summary>Lösningsförslag</summary>

```jsx
setBooking((current) => ({
  ...current,
  name: event.target.value,
}));
```

Det skapar ett nytt objekt och bevarar övriga fält.

</details>

## 5. Kontrollerade formulär

**Fråga:** Vilka fyra delar binder ett textfält till React state?

<details>
<summary>Kontrollpunkter</summary>

- statevärdet
- `value`
- `onChange`
- en state-update som använder `event.target.value`

För tillgänglighet behövs dessutom en synlig `label` kopplad med `htmlFor`
och `id`.

</details>

## 6. Lyfta state

**Fråga:** Varför ligger den bekräftade bokningen i `App` och inte bara i
`BookingForm`?

<details>
<summary>Svar</summary>

Både bokningssidan och bekräftelsesidan behöver värdet. Deras gemensamma
förälder äger därför state och skickar data eller eventfunktioner som props.

</details>

## 7. Rendering, event eller Effect?

Placera varje rad på rätt plats:

1. filtrera workshops efter vald kategori
2. skicka bokning med POST
3. hämta workshops när appen visas

<details>
<summary>Svar</summary>

1. Beräkna under rendering.
2. Kör i formulärets submit-event.
3. Synkronisera med API:t i ett Effect.

</details>

## 8. Fyra API-lägen

**Fråga:** Varför räcker det inte med `workshops.map(...)` direkt efter att ett
anrop har startat?

<details>
<summary>Kontrollpunkter</summary>

Gränssnittet behöver kunna skilja på loading, error, ett lyckat men tomt svar
och success med data. Annars får användaren en tom eller missvisande sida.

</details>

## 9. Routing

Förklara vad parametern blir:

```jsx
<Route path="/workshops/:workshopId" element={<WorkshopPage />} />
```

Adress: `/workshops/keramik`

<details>
<summary>Svar</summary>

`useParams()` ger ett objekt där `workshopId` är strängen `"keramik"`.
Komponenten använder värdet för att hitta rätt objekt i workshops-arrayen.

</details>

## 10. Felsök en tom sida

**Fråga:** I vilken ordning undersöker du en tom vit React-sida?

<details>
<summary>Kontrollpunkter</summary>

1. Läs första felet i webbläsarens Console.
2. Kontrollera terminalen där Vite kör.
3. Kontrollera import, export och filnamn.
4. Kontrollera props och värden precis före felet.
5. För API-problem: öppna Network och läs status samt response.

</details>

## Praktisk slutfråga

Demonstrera Kulturverkstan och förklara samtidigt:

- var workshopdata kommer ifrån,
- vilken komponent som äger bokningsstate,
- hur ett event rör sig uppåt och props nedåt,
- vad som händer mellan submit och `/confirm`,
- vilket felmeddelande användaren får om API:t är avstängt.

Du är redo när du kan förklara flödet utan att läsa upp koden rad för rad.
