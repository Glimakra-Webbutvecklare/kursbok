# Promises och Async/Await

Som vi såg i föregående avsnitt kan callbacks leda till rörig kod, speciellt när flera asynkrona operationer måste utföras i sekvens ("Callback Hell"). För att lösa detta introducerades **Promises** (Löften) i JavaScript.

**Vad är ett Promise?**

Ett Promise representerar det framtida resultatet av en asynkron operation. Det är ett objekt som fungerar som en platshållare för ett värde som ännu inte är känt, men som *lovar* att leverera ett värde (eller ett fel) vid någon tidpunkt i framtiden.

Tänk på det som att beställa en bok online. Du får en orderbekräftelse (ett Promise) direkt. Boken (värdet) har inte kommit än, men orderbekräftelsen lovar att du antingen kommer att få boken (Promise *fulfilled*) eller ett meddelande om att något gick fel, t.ex. att boken var slutsåld (Promise *rejected*).

## Promise-livscykel

Ett Promise kan befinna sig i ett av tre tillstånd:

1.  **Pending (Väntande):** Det initiala tillståndet. Operationen har startat men är ännu inte slutförd eller misslyckad.
2.  **Fulfilled (Uppfylld):** Operationen slutfördes framgångsrikt. Promiset har nu ett resulterande värde.
3.  **Rejected (Avvisad):** Operationen misslyckades. Promiset har nu en anledning (ett felobjekt) till varför det misslyckades.

Ett Promise kan bara övergå från *pending* till antingen *fulfilled* eller *rejected*, och när det väl har hänt ändras dess tillstånd aldrig igen. Man säger att Promiset är **settled** (avgjort).

## Att Använda Promises: `.then()` och `.catch()`

För att hantera resultatet (eller felet) av ett Promise använder vi metoderna `.then()` och `.catch()`.

*   `.then(onFulfilled, onRejected)`: Tar emot upp till två argument, båda funktioner:
    *   `onFulfilled`: Körs om Promiset blir *fulfilled*. Den tar emot det resulterande värdet som argument.
    *   `onRejected`: Körs om Promiset blir *rejected*. Den tar emot felorsaken som argument. (Det är vanligare att använda `.catch()` för detta).
*   `.catch(onRejected)`: Tar emot en funktion som körs om Promiset blir *rejected*. Det är ett mer läsbart sätt att hantera fel än att skicka en andra funktion till `.then()`.

```javascript
// Simulerar en asynkron operation som returnerar ett Promise
function fetchData() {
  return new Promise((resolve, reject) => {
    // Simulera nätverksfördröjning
    setTimeout(() => {
      const success = Math.random() > 0.3; // 70% chans att lyckas
      if (success) {
        resolve({ data: "Hämtad data!" }); // Uppfyll Promiset med data
      } else {
        reject(new Error("Kunde inte hämta data.")); // Avvisa Promiset med ett fel
      }
    }, 1500);
  });
}

console.log("Startar datahämtning...");

fetchData()
  .then((result) => {
    // Körs om Promiset blir fulfilled
    console.log("Success:", result.data);
  })
  .catch((error) => {
    // Körs om Promiset blir rejected
    console.error("Error:", error.message);
  })
  .finally(() => {
    // Körs alltid, oavsett om det lyckades eller misslyckades
    console.log("Datahämtning avslutad (fulfilled eller rejected).");
  });

console.log("Promise startat, väntar på resultat...");

// Output (exempel vid success):
// Startar datahämtning...
// Promise startat, väntar på resultat...
// (efter 1.5 sekunder)
// Success: Hämtad data!
// Datahämtning avslutad (fulfilled eller rejected).

// Output (exempel vid error):
// Startar datahämtning...
// Promise startat, väntar på resultat...
// (efter 1.5 sekunder)
// Error: Kunde inte hämta data.
// Datahämtning avslutad (fulfilled eller rejected).
```

Notera `.finally()` som körs oavsett utfall, användbart för t.ex. städning eller att dölja en laddningsindikator.

## Kedjade Promises (Chaining)

Styrkan med `.then()` är att den *också* returnerar ett Promise. Detta gör att vi kan kedja flera asynkrona operationer efter varandra på ett läsbart sätt, utan djup nästling.

```javascript
fetchData() // Returnerar ett Promise
  .then(result1 => {
    console.log("Steg 1 klart:", result1.data);
    // Starta nästa operation, som också returnerar ett Promise
    return anotherAsyncOperation(result1.data);
  })
  .then(result2 => {
    console.log("Steg 2 klart:", result2);
    // ...och så vidare...
  })
  .catch(error => {
    // Ett enda catch hanterar fel från *alla* föregående steg i kedjan
    console.error("Ett fel inträffade i kedjan:", error.message);
  });
```

## Async/Await: Syntaktiskt Socker

Även om kedjade Promises är mycket bättre än Callback Hell, kan koden fortfarande bli lite svårläst med många `.then()`. ES2017 introducerade `async` och `await` för att skriva asynkron kod som *ser ut* som synkron kod.

*   **`async function`**: När du deklarerar en funktion med `async` framför, händer två saker:
    1.  Funktionen returnerar *alltid* automatiskt ett Promise. Om funktionen returnerar ett värde, blir det värdet resultatet av ett *fulfilled* Promise. Om funktionen kastar ett fel, blir det felet anledningen till ett *rejected* Promise.
    2.  Det möjliggör användningen av `await` inuti funktionen.
*   **`await`**: Kan *endast* användas inuti en `async function`. När du sätter `await` framför ett anrop som returnerar ett Promise, pausas exekveringen av `async`-funktionen (utan att blockera huvudtråden!) tills det Promiset är *settled* (avgjort).
    *   Om Promiset blir *fulfilled*, returnerar `await`-uttrycket det uppfyllda värdet.
    *   Om Promiset blir *rejected*, kastar `await`-uttrycket felet (som kan fångas med `try...catch`).

```javascript
// Samma fetchData som tidigare

// async funktion för att använda await
async function processData() {
  console.log("Startar processData (async)...");
  try {
    // Pausar här tills fetchData() är fulfilled eller rejected
    const result = await fetchData();
    console.log("Data hämtad (inom async):");

    // Kan nu använda resultatet som om det vore synkront
    const processedData = result.data.toUpperCase();
    console.log("Bearbetad data:", processedData);

    // Om vi hade fler await-anrop skulle de köras sekventiellt
    // const result2 = await anotherAsyncOperation(processedData);
    // console.log("Resultat från andra operationen:", result2);

    return processedData; // Detta blir värdet för Promiset som processData returnerar

  } catch (error) {
    // Fångar fel från await fetchData() eller andra fel i try-blocket
    console.error("Fel i processData:", error.message);
    // Kan välja att kasta felet vidare eller returnera ett standardvärde
    throw error; // Kasta om felet så att anroparen kan fånga det
  }
}

console.log("Anropar processData...");

// Eftersom processData är async, returnerar den ett Promise
processData()
  .then(finalResult => {
    console.log("processData lyckades med resultat:", finalResult);
  })
  .catch(error => {
    console.error("processData misslyckades:", error.message);
  });

console.log("processData anropad, väntar...");
```

**Fördelar med Async/Await:**

*   **Läslighet:** Koden ser mycket mer ut som traditionell, synkron kod.
*   **Felhantering:** Använder standard `try...catch`, vilket många utvecklare är vana vid.
*   **Enklare felsökning:** Lättare att följa kodflödet och sätta brytpunkter.

`async/await` är idag det vanligaste sättet att hantera Promises i modern JavaScript-utveckling.
