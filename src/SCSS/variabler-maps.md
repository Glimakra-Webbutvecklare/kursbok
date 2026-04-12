# Variabler och Maps i SCSS

En av de mest grundläggande anledningarna till att använda SCSS är möjligheten att definiera **variabler** (variables). I vanlig CSS upprepar man ofta samma värden på dussintals ställen – samma blåa färg, samma typsnittsstorlek, samma avstånd. Ska du sedan byta en enda färg kan det innebära hundratals manuella ändringar.

SCSS löser detta med variabler: definiera ett värde en gång, använd det hur många gånger som helst.

## Variabler i SCSS

En SCSS-variabel deklareras med ett `$`-tecken följt av ett namn och ett värde.

```scss
$primary-color: #007aff;
$font-size-base: 1rem;
$spacing-md: 1.5rem;
```

Värdena kan sedan användas var som helst i din SCSS-kod:

```scss
$primary-color: #007aff;
$spacing-md: 1.5rem;

.button {
  background-color: $primary-color;
  padding: $spacing-md;
}

a {
  color: $primary-color;
}
```

När SCSS kompileras till CSS ersätts alla variabelreferenser med deras konkreta värden. Om du senare behöver byta `$primary-color` räcker det att ändra på ett enda ställe.

### Skillnaden mot CSS custom properties

CSS har sina egna variabler, så kallade **custom properties** (anpassade egenskaper):

```css
:root {
  --primary-color: #007aff;
}

.button {
  background-color: var(--primary-color);
}
```

SCSS-variabler och CSS custom properties löser liknande problem men på olika sätt:

| | SCSS-variabler | CSS custom properties |
|---|---|---|
| Syntax | `$variabel: värde` | `--variabel: värde` |
| Tillgänglig i webbläsaren | Nej (kompileras bort) | Ja (lever i CSS) |
| Kan ändras med JavaScript | Nej | Ja |
| Stöd för logik och beräkningar | Ja | Begränsat |

I moderna projekt kombineras ofta SCSS-variabler (för logik under kompilering) med CSS custom properties (för dynamik i webbläsaren).

### Scope (räckvidd)

SCSS-variabler följer en **scope** (räckvidd) liknande variabler i andra programmeringsspråk. En variabel deklarerad utanför alla selektorer är **global** och kan användas överallt. En variabel deklarerad inuti en selektor är **lokal** och finns bara där.

```scss
$global-color: #007aff; // Global variabel

.card {
  $local-spacing: 2rem; // Lokal variabel – finns bara i .card

  padding: $local-spacing;
  color: $global-color; // Funkar – global räckvidd
}

.button {
  color: $global-color;    // Funkar
  // padding: $local-spacing; // Fel! $local-spacing finns inte här
}
```

## Maps i SCSS

En **map** (karta) är en SCSS-datastruktur som lagrar par av nycklar och värden – ungefär som ett objekt i JavaScript eller en associativ array i PHP. Maps är perfekta för att gruppera relaterade värden, till exempel alla projektets färger eller spacing-steg.

### Syntax

En map deklareras med parenteser och komma-separerade nyckel-värde-par:

```scss
$colors: (
  primary: #007aff,
  secondary: #ff4081,
  success: #4caf50,
  danger: #f44336,
);
```

### Hämta ett värde ur en map

För att hämta ett enskilt värde ur en map används `map.get()` från SCSS inbyggda `sass:map`-modul:

```scss
@use 'sass:map';

$colors: (
  primary: #007aff,
  secondary: #ff4081,
);

.button-primary {
  background-color: map.get($colors, primary);
}

.button-secondary {
  background-color: map.get($colors, secondary);
}
```

### Iterera med `@each`

Den riktiga kraften hos maps framträder när man kombinerar dem med `@each`-loopar. Istället för att skriva liknande CSS-regler för hand för varje variant kan SCSS generera dem automatiskt:

```scss
@use 'sass:map';

$colors: (
  primary: #007aff,
  secondary: #ff4081,
  success: #4caf50,
  danger: #f44336,
);

@each $name, $color in $colors {
  .btn-#{$name} {
    background-color: $color;
    color: white;
    padding: 0.5rem 1rem;
    border-radius: 4px;
  }
}
```

`#{}` kallas för **interpolation** (interpolering) och används för att sätta in variabelns värde direkt i ett klassnamn eller en selektor. Koden ovan genererar fyra CSS-klasser: `.btn-primary`, `.btn-secondary`, `.btn-success` och `.btn-danger` – utan att du behöver skriva varje regel för hand.

### Praktiskt exempel: ett designsystem med maps

Maps lämpar sig väl för att bygga ett konsekvent **design system** (designsystem). Här är ett exempel med en spacing-skala:

```scss
@use 'sass:map';

$spacing: (
  xs: 0.25rem,
  sm: 0.5rem,
  md: 1rem,
  lg: 1.5rem,
  xl: 2rem,
  xxl: 3rem,
);

$font-sizes: (
  sm: 0.875rem,
  md: 1rem,
  lg: 1.25rem,
  xl: 1.5rem,
  xxl: 2rem,
);

// Generera hjälpklasser för margin-bottom
@each $name, $value in $spacing {
  .mb-#{$name} {
    margin-bottom: $value;
  }
}

// Generera hjälpklasser för font-size
@each $name, $value in $font-sizes {
  .text-#{$name} {
    font-size: $value;
  }
}
```

Resultatet blir ett komplett bibliotek av hjälpklasser – samma princip som ramverk som Bootstrap och Tailwind CSS bygger på.

## Generera CSS custom properties från maps

En vanlig tillämpning av maps är att generera CSS custom properties (CSS-variabler) som kan ändras i webbläsaren. Detta är särskilt användbart för tema – en color map kan bli CSS-variabler som senare kan bytas dynamiskt.

### Från map till CSS-variabler

```scss
@use 'sass:map';

// Definiera färg-mappen
$colors: (
  primary: #0b6bcb,
  success: #1a7f37,
  warning: #9a6700,
  danger: #cf222e,
  info: #0969da,
);

// Generera CSS custom properties från mappen
:root {
  @each $name, $color in $colors {
    --color-#{$name}: #{$color};
  }
}
```

Detta kompileras till:

```css
:root {
  --color-primary: #0b6bcb;
  --color-success: #1a7f37;
  --color-warning: #9a6700;
  --color-danger: #cf222e;
  --color-info: #0969da;
}
```

### Praktiskt exempel: teman med maps

```scss
@use 'sass:map';

// Light theme färger
$colors-light: (
  bg: #ffffff,
  surface: #f6f8fa,
  text: #1f2328,
  primary: #0b6bcb,
);

// Dark theme färger
$colors-dark: (
  bg: #0d1117,
  surface: #161b22,
  text: #e6edf3,
  primary: #58a6ff,
);

// Exportera light theme som standard
:root {
  @each $name, $color in $colors-light {
    --color-#{$name}: #{$color};
  }
}

// Exportera dark theme med data-attribut
[data-theme='dark'] {
  @each $name, $color in $colors-dark {
    --color-#{$name}: #{$color};
  }
}

// Nu kan komponenter använda dessa
.card {
  background: var(--color-surface);
  color: var(--color-text);
}

.button {
  background: var(--color-primary);
  color: #fff;
}
```

**Varför är detta användbara?**

1. Du skriver varje färg en gång i en map
2. Mappen genererar CSS-variabler automatiskt
3. CSS-variablerna kan ändras utan ombyggnad
4. Komponenter använder `var()` istället för hårdkodade färger
5. Temaväxling blir smidigt och snabbt

Denna kombination av SCSS-maps och CSS custom properties är grunden i moderna designsystem.

## Se även

- [Loopar i praktiken och utility-klasser](./loopar-utility-klasser.md) – hur man använder @each med maps för att generera CSS
- [Design tokens och CSS custom properties](./design-tokens-css-custom-properties.md) – hur maps kan exporteras som CSS-variabler
- [Theming: ljust och mörkt tema](./theming.md) – hur maps används för att bygga tema-system

## Sammanfattning

- SCSS-variabler deklareras med `$namn: värde` och gör koden lätt att underhålla.
- Variabler har scope: globala variabler kan användas överallt, lokala bara inom sin selektor.
- Maps är nyckel-värde-strukturer som grupperar relaterade värden.
- `map.get($map, nyckel)` hämtar ett enskilt värde.
- `@each $nyckel, $värde in $map` loopar igenom alla par i en map och kan automatgenerera CSS-regler.
