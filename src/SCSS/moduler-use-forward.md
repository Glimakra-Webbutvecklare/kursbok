# Moduler med @use och @forward

Modern Sass rekommenderar modulsystemet med @use och @forward i stället för @import. Det ger tydligare beroenden och bättre struktur i större projekt.

## Varför lämna @import?

@import lägger allt i global scope (global räckvidd). Det kan skapa namnkonflikter när flera filer råkar använda samma variabelnamn.

@use isolerar varje modul med namespace (namnrymd), vilket gör koden säkrare och mer läsbar.

## @use – Ladda en modul

**@use laddar en fil och gör dess innehål tillgängligt med ett namespace.**

```scss
// abstracts/_variables.scss
$primary-color: #007aff;
$radius-md: 0.5rem;
```

```scss
// components/_button.scss
@use '../abstracts/variables' as v;

.button {
  background: v.$primary-color;  // Måste använda namespace v.$
  border-radius: v.$radius-md;
}
```

Det viktiga här:
- `@use` **laddar** filen `_variables.scss`
- Allt från filen blir tillgängligt under namespace `v`
- Du måste skriva `v.$primary-color` – inte bara `$primary-color`
- **Du kan bara läsa** variablerna, inte ändra dem

## @forward – Exponera moduler för andra

**@forward låter en fil dela vidare innehål från andra filer. Det är som att säga "användare av denna fil kan också nå dessa variabler".**

```scss
// abstracts/_index.scss
@forward 'variables';
@forward 'mixins';
@forward 'functions';
```

Nu kan andra filer göra detta:

```scss
// components/_card.scss
@use '../abstracts' as a;  // Laddar index.scss

.card {
  border-radius: a.$radius-md;      // Från variables via forward
  @include a.flex-center;            // Från mixins via forward
  font-size: a.rem(16);              // Från functions via forward
}
```

Det viktiga här:
- `@forward` **exponerar** innehålet från andra filer
- Den som använder `@use '../abstracts'` får tillgång till allt som är forwardat
- Det är bättre än att räkna upp många `@use`-rader

## Skillnad mellan @use och @forward

| Aspekt | @use | @forward |
|---|---|---|
| **Vad gör det?** | Laddar och använder en modul | Exponerar innehål från andra moduler |
| **Syfte** | "Jag behöver detta i min fil" | "Andra ska kunna nå detta genom mig" |
| **Typ av fil** | Vilken fil som helst | Ofta index.scss, ett "publikt API" |
| **Namespace** | Ja, du måste använda det | Ja, det passeras vidare |

### Praktiskt exempel: utan och med @forward

**Version 1: Utan @forward (många @use)**

```scss
// components/_card.scss
@use '../abstracts/variables' as v;  // Måste importa var för sig
@use '../abstracts/mixins' as m;
@use '../abstracts/functions' as f;

.card {
  border-radius: v.$radius-md;
  @include m.flex-center;
  font-size: f.rem(16);
}
```

**Version 2: Med @forward (renare)**

```scss
// abstracts/_index.scss – en central start
@forward 'variables';
@forward 'mixins';
@forward 'functions';
```

```scss
// components/_card.scss – mycket renare
@use '../abstracts' as a;  // En import istället för tre

.card {
  border-radius: a.$radius-md;  // Tillgängligt via forward
  @include a.flex-center;        // Tillgängligt via forward
  font-size: a.rem(16);          // Tillgängligt via forward
}
```

Den andra versionen är mycket enklare att läsa och underhålla.

## När använder man vad?

**Använd @use när:**
- Du behöver innehål från en modul i din nuvarande fil
- Du vill explicit visa vad du är beroende av
- Du skriver en komponentfil eller en fil som faktiskt gör något

**Använd @forward när:**
- Du bygger en "samling" av moduler (som abstracts/)
- Du vill skapa ett rent offentligt API för mappen
- Du vill göra det enklare för andra filer att importera

## Fullständigt praktiskt exempel

**Mappstruktur:**

```text
SCSS/
  abstracts/
    _variables.scss   (definierar $primary-color, osv)
    _mixins.scss      (definierar flex-center mixin)
    _functions.scss   (definierar rem() funktion)
    _index.scss       (forwardar allt)
  components/
    _button.scss      (använder @use för abstracts)
    _card.scss        (använder @use för abstracts)
  main.scss           (importerar komponenter)
```

**abstracts/_index.scss – Det centrala API:et:**

```scss
// Denna fil samlar allt från abstracts-mappen
@forward 'variables';
@forward 'mixins';
@forward 'functions';
```

**components/_button.scss – Använder @use:**

```scss
@use '../abstracts' as a;  // Laddar allt som är forwardat

.button {
  background: a.$primary-color;
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: a.$radius-md;
  font-size: a.rem(16);

  &:hover {
    @include a.focus-ring;  // Från abstracts/mixins via forward
  }
}
```

**main.scss – Slutligen:**

```scss
@use 'abstracts';           // Får allt från abstracts/_index.scss
@use 'components/button';   // Komponenten laddar redan abstracts
@use 'components/card';
```

Resultatet: Mycket tydligt, lätt att underhålla och enkelt att utöka!

## Migrering från @import

1. Byt @import mot @use i varje fil.
2. Lägg till namespace där variabler och mixins används.
3. Skapa indexfiler med @forward för mappar som abstracts.
4. Kontrollera att builden ger samma CSS-output som tidigare.

## När ska `as *` användas?

Du kan skriva `as *` för att ta bort namespace:

```scss
@use '../abstracts' as *;  // Nu kan du skriva $primary-color direkt

.button {
  background: $primary-color;  // Fungerar, men oklart varifrån det kommer
}
```

**Rekommendation:** Undvik `as *` i större projekt. Det gör koden svårare att förstå och underhålla. Det är bättre att alltid använda ett tydligt namespace så att det är klart varifrån varje symbol kommer.

## Säkerhet och robusthet

Tydliga moduler minskar risken för oavsiktliga stilkrockar i kritiska komponenter, till exempel formulär för inloggning. Mindre överraskningar i CSS minskar risken för regressionsfel vid release.

## Sammanfattning

- @use ersätter @import i modern Sass.
- Namespace gör beroenden tydliga.
- @forward används för att bygga rena offentliga API:er mellan SCSS-filer.
- Moduler gör projektet enklare att skala i team.

## Se även

- [7-1 Struktur med importer](./sju-ett-struktur.md) – hur @use/@forward används i praktisk mappstruktur
- [Variabler och Maps](./variabler-maps.md) – vad som oftast exporteras via @forward

## Övningar

1. Bygg en abstracts-map med variables, functions och mixins samt en _index.scss med @forward.
2. Refaktorera två komponentfiler så att de använder @use med namespace.
3. Testa as * och förklara när det kan vara okej och när det bör undvikas.
