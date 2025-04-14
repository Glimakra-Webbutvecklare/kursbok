# Asynkron Programmering i JavaScript

I grund och botten är JavaScript ett **single-threaded** (entrådat) språk. Det betyder att det bara kan göra en sak i taget, steg för steg, i den ordning koden är skriven. Tänk dig en kock som bara kan hacka en grönsak åt gången innan hen går vidare till nästa.

**Varför är detta viktigt?**

Om JavaScript bara kan göra en sak i taget, vad händer när en uppgift tar lång tid? Till exempel:

*   Vänta på svar från en server (nätverksanrop).
*   Läsa en stor fil från hårddisken.
*   Komplexa beräkningar.
*   Vänta en viss tid (t.ex. med `setTimeout`).

I ett strikt synkront flöde skulle hela programmet (och ofta hela webbläsarens flik!) stanna upp och vänta tills den tidskrävande uppgiften är klar. Detta kallas **blockering** (blocking) och leder till en dålig användarupplevelse – sidan fryster och blir oresponsiv.

```javascript
// Synkront exempel (simulerat)
console.log("Startar uppgift...");

// Simulerar en tidskrävande operation (blockerar i 5 sekunder)
const start = Date.now();
while (Date.now() < start + 5000) {
  // Gör ingenting, bara väntar...
}

console.log("Uppgiften klar!"); // Denna loggas först efter 5 sekunder
console.log("Annan kod körs..."); // Denna måste också vänta
```

Under de 5 sekunderna i exemplet ovan skulle webbsidan vara helt fryst.

## Den Asynkrona Lösningen: Callback-funktioner

För att undvika blockering använder JavaScript (och dess körmiljöer som webbläsare och Node.js) en **asynkron** modell för tidskrävande operationer. Istället för att vänta, säger JavaScript: "Starta den här uppgiften, och när den är klar, kör den här specifika funktionen".

Denna specifika funktion som skickas med för att köras senare kallas en **callback-funktion** (återanropsfunktion).

```javascript
console.log("Startar timer...");

// setTimeout är en asynkron funktion
setTimeout(() => {
  // Detta är callback-funktionen
  console.log("Timer klar efter 2 sekunder!");
}, 2000); // 2000 millisekunder = 2 sekunder

console.log("Timer startad, fortsätter med annan kod...");

// Output:
// Startar timer...
// Timer startad, fortsätter med annan kod...
// (efter 2 sekunder)
// Timer klar efter 2 sekunder!
```

Notera hur `setTimeout` inte blockerar. Koden fortsätter direkt till nästa `console.log`, och callback-funktionen körs först när timern har gått ut.

## Händelseloopen (The Event Loop)

Men hur fungerar detta bakom kulisserna? Hur kan JavaScript, som är entrådat, hantera saker som händer "samtidigt"?

Nyckeln är **händelseloopen** (event loop) och samarbete mellan JavaScript-motorn och dess körmiljö (t.ex. webbläsaren).

1.  **Call Stack (Anropsstacken):** Här exekveras den vanliga, synkrona JavaScript-koden. Funktioner läggs på stacken när de anropas och tas bort när de är klara.
2.  **Web APIs (Webbläsar-API:er):** När JavaScript stöter på en asynkron operation (som `setTimeout`, `fetch`, DOM-händelser), skickas den vidare till ett webbläsar-API som hanterar den utanför JavaScripts huvudtråd.
3.  **Callback Queue (Callback-kön) / Task Queue:** När webbläsar-API:et är klart med sin uppgift (t.ex. timern har gått ut, data har hämtats), läggs den tillhörande callback-funktionen i en kö.
4.  **Event Loop (Händelseloopen):** Detta är en process som ständigt övervakar två saker: Är anropsstacken (Call Stack) tom? Finns det något i callback-kön?
5.  **Exekvering:** Om anropsstacken är tom och det finns en callback i kön, plockar händelseloopen den första callback-funktionen från kön och lägger den på anropsstacken för att köras.

```mermaid
graph TD
    subgraph JavaScript Engine
        CS[Call Stack]
    end

    subgraph Browser/Node APIs
        WA[Web APIs (setTimeout, fetch, DOM etc.)]
    end

    subgraph Task Queues
        CQ[Callback Queue (Tasks)]
        MQ[Microtask Queue (Promises etc.)] -- Högre prioritet --> EL
    end

    EL{Event Loop} -- Checks if Call Stack is empty --> CS

    CS -- Runs sync code --> CS
    CS -- Calls async func --> WA
    WA -- Callback ready --> CQ
    WA -- Promise resolved/rejected --> MQ

    EL -- Checks queues --> CQ
    EL -- Checks queues --> MQ

    MQ -- Has task & CS empty --> EL
    CQ -- Has task & CS empty & MQ empty --> EL

    EL -- Moves callback --> CS

    style WA fill:#f9d,stroke:#333,stroke-width:2px
    style CS fill:#ccf,stroke:#333,stroke-width:2px
    style CQ fill:#dfd,stroke:#333,stroke-width:2px
    style MQ fill:#ffe,stroke:#333,stroke-width:2px
    style EL fill:#eee,stroke:#333,stroke-width:4px
```

*Diagrammet ovan illustrerar flödet: Synkron kod körs på Call Stack. Asynkrona operationer skickas till Web APIs. När de är klara hamnar deras callbacks i Callback Queue (för t.ex. `setTimeout`) eller Microtask Queue (för t.ex. Promises - dessa har högre prioritet). Event Loop kontrollerar kontinuerligt om Call Stack är tom och flyttar sedan uppgifter från köerna (Microtask först) till Call Stack för exekvering.*

**Analogi:** Tänk dig en restaurangkock (JavaScript Call Stack) som bara kan laga en rätt i taget. När en gäst beställer något som tar lång tid (t.ex. en långkokt gryta - en asynkron operation), tar en servitör (Web API) beställningen och sätter igång grytan på en annan spis. Kocken fortsätter med andra snabba beställningar. När grytan är klar, säger servitören till via en bong (Callback läggs i kön). När kocken är klar med det hen höll på med (Call Stack är tom), tittar hen på bongarna (Event Loop kollar kön) och tar nästa färdiga rätt (Callback flyttas till Call Stack) för att lägga upp den.

Detta system gör att JavaScript kan hantera många operationer utan att blockera huvudtråden, vilket håller webbsidan responsiv.

## Callback Hell

Callbacks är grundläggande, men när man har flera asynkrona operationer som beror på varandra kan det leda till djupt nästlad kod, ofta kallat "Callback Hell" eller "Pyramid of Doom".

```javascript
// Exempel på Callback Hell (konceptuellt)
operation1((resultat1) => {
  console.log("Klar med 1");
  operation2(resultat1, (resultat2) => {
    console.log("Klar med 2");
    operation3(resultat2, (resultat3) => {
      console.log("Klar med 3");
      // ...och så vidare...
    });
  });
});
```

Denna kod blir svårläst och svår att underhålla. Detta är ett av huvudproblemen som **Promises**, vilka vi tittar på i nästa avsnitt, löser.
