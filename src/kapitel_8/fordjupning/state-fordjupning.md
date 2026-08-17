# Context och reducer

I kärnkapitlet skickades data med props och gemensam state lyftes till `App`.
Det är fortfarande förstahandsvalet. Context och reducer blir relevanta när ett
verkligt problem har vuxit fram.

> **Mål:** Känna igen när Context respektive reducer kan förenkla en app och när vanliga props och `useState` är tydligare.

## Context: samma värde långt ned i trädet

Context kan vara rimligt för exempelvis språk eller tema som används på många
platser. Det är inte en ersättning för alla props.

```jsx
import { createContext, useContext, useState } from 'react';

const DisplayContext = createContext(null);

export function DisplayProvider({ children }) {
  const [showPrices, setShowPrices] = useState(true);

  return (
    <DisplayContext.Provider value={{ showPrices, setShowPrices }}>
      {children}
    </DisplayContext.Provider>
  );
}

export function useDisplay() {
  const context = useContext(DisplayContext);

  if (!context) {
    throw new Error('useDisplay måste användas inom DisplayProvider');
  }

  return context;
}
```

En komponent långt ned kan läsa inställningen:

```jsx
function WorkshopPrice({ priceSek }) {
  const { showPrices } = useDisplay();
  return showPrices ? <p>{priceSek} kr</p> : null;
}
```

Använd inte Context när:

- endast en förälder och ett barn behöver värdet,
- en vanlig prop tydligt visar beroendet,
- staten egentligen hör till en enda komponent.

## Reducer: flera namngivna förändringar

En reducer tar emot aktuell state och en action och returnerar nästa state.
Den får inte mutera det gamla objektet.

```jsx
const initialBooking = {
  workshopId: '',
  slotId: '',
  name: '',
  email: '',
  participants: 1,
  message: '',
};

function bookingReducer(state, action) {
  switch (action.type) {
    case 'field_changed':
      return {
        ...state,
        [action.name]: action.value,
      };

    case 'slot_selected':
      return {
        ...state,
        workshopId: action.workshopId,
        slotId: action.slotId,
      };

    case 'reset':
      return initialBooking;

    default:
      throw new Error(`Okänd action: ${action.type}`);
  }
}
```

Använd den i en komponent:

```jsx
import { useReducer } from 'react';

const [booking, dispatch] = useReducer(bookingReducer, initialBooking);

dispatch({
  type: 'field_changed',
  name: 'participants',
  value: 2,
});
```

Reducer passar när samma state har många olika förändringar och event handlers
blivit svåra att överblicka. För ett par enkla värden är `useState` tydligare.

## Context och reducer tillsammans

De kan kombineras när många avlägsna komponenter både läser state och skickar
actions. Gör det först när båda problemen finns. Börja inte där bara för att
lösningen ser mer avancerad ut.

## Övning

Välj **en**:

1. Lägg en inställning för att visa/dölja priser i Context.
2. Flytta Kulturverkstans bokningsobjekt till en reducer med actions för ändrat
   fält, valt tillfälle och återställning.

**Klar när:** kärnflödet beter sig likadant som före refaktoreringen och du kan
förklara vilket konkret problem verktyget löste.

## Första hjälpen

| Symptom | Kontroll |
|---|---|
| Context är `null` | Komponenten ligger troligen utanför providern |
| State ändras inte | Reducern måste returnera ett nytt objekt |
| “Okänd action” | Jämför `action.type` tecken för tecken |
| Allt blev svårare | Backa och använd props eller `useState` |
