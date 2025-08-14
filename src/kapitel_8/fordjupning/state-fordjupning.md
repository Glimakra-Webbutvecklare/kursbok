# State: reducer, Context och normalisering

Varför behövs detta?
- När props‑drilling blir tungt och flera komponenter behöver samma data.
- När state‑uppdateringar blir komplexa och kräver förutsägbarhet.

## Reducer + Context

Reducer ger ett deterministiskt sätt att uppdatera state utifrån action → nytt state. Context delar detta state i trädet.

När? När flera delar av appen måste läsa/uppdatera samma state och “lyfta state” inte räcker.

```jsx
import { createContext, useContext, useReducer } from 'react';

const AppContext = createContext();

function reducer(state, action) {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload };
    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, { user: null });
  const value = { state, dispatch };
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
```

Varför? Reducer minskar implicit logik utspridd i många setState‑anrop och gör flöden testbara.

## Normalisering av data

När? När du har inbäddade listor/objekt som blir svåra att uppdatera utan buggar.

Princip: spara data “platt” per typ (`entities`) och referera med ids.

Fördel: enklare uppdateringar och memoization; mindre risk för oavsiktliga re‑renders.

## När extern state‑hanterare?

- Du behöver features som devtools, middleware, time‑travel, asynk‑flöden.
- Alternativ: Zustand, Redux Toolkit, Jotai. Välj när behoven finns — inte i förväg.
