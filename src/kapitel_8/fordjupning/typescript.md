# TypeScript i React

Varför TypeScript?
- Fångar fel vid utveckling (fel props, felaktiga svar från API).
- Bättre autocompletion och refaktoreringsstöd.
- Tydligare kontrakt mellan komponenter.

## Props och state

```tsx
// Button.tsx
type ButtonProps = {
  text: string;
  onClick?: () => void;
  disabled?: boolean;
};

export function Button({ text, onClick, disabled = false }: ButtonProps) {
  return (
    <button disabled={disabled} onClick={onClick}>
      {text}
    </button>
  );
}
```

Varför? Komponentens API blir själv‑dokumenterande och säkert.

## Event‑typer

```tsx
function Form() {
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value);
  };

  return (
    <form onSubmit={onSubmit}>
      <input onChange={onChange} />
      <button type="submit">Skicka</button>
    </form>
  );
}
```

## Hooks och generics

```tsx
function useFetch<T>(url: string) {
  const [data, setData] = React.useState<T | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    let active = true;
    fetch(url)
      .then((r) => (r.ok ? r.json() : Promise.reject(r.statusText)))
      .then((json) => active && setData(json as T))
      .catch((err) => active && setError(String(err)));
    return () => {
      active = false;
    };
  }, [url]);

  return { data, error };
}
```

## Gradvis införande
- Starta med att typa nya filer (`.tsx`) och centrala modeller (User, Product).
- Aktivera striktare TS‑regler först när teamet är bekvämt.
- Behåll interop med JS: du kan blanda `.ts/.tsx` och `.js/.jsx` i samma projekt.
