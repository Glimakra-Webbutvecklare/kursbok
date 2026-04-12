# Mixins i SCSS

Precis som variabler låter oss återanvända *värden*, låter **mixins** oss återanvända hela *CSS-regler*. Om du märker att du skriver samma uppsättning CSS-deklarationer om och om igen – till exempel för flexbox-centrering eller mediafrågor – är det ett tecken på att ett mixin kan förenkla koden.

## Vad är ett Mixin?

Ett **mixin** är ett namngivet block av CSS-regler som kan inkluderas var som helst i din SCSS-kod. Tänk på det som en funktion som istället för att returnera ett värde "klistrar in" ett kodblock.

### En analogi: Muffinsrecept

Föreställ dig ett grundmuffinsrecept som innehåller bas-ingredienserna – mjöl, ägg, mjölk och socker. Det är själva **mixinet**. Sedan kan du göra tusentals varianter genom att lägga på olika **toppings** och **fyllningar** – choklad, blåbär, karamell, kokos osv. Det är samma grundrecept, men resultatet ser helt olika ut beroende på vad du väljer att lägga på.

I SCSS är det precis samma. Du skriver en gång hur en button, en flexbox-center eller en mediafråga fungerar, och sedan varierar du den genom **parametrar** (parametrar är dina toppings). På så sätt får du många olika varianter utan att upprepa hela receptet.

```scss
@mixin flex-center {
  display: flex;
  justify-content: center;
  align-items: center;
}
```

Inkludera mixinet med `@include`:

```scss
.hero {
  @include flex-center;
  height: 100vh;
}

.modal {
  @include flex-center;
}
```

Det kompileras till:

```css
.hero {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.modal {
  display: flex;
  justify-content: center;
  align-items: center;
}
```

## Mixins med parametrar

Mixins blir riktigt kraftfulla när de tar **parametrar** (parameters) – argument som styr vad mixinet genererar. Parametrar deklareras med `$`-tecken, precis som vanliga variabler.

Tänk på det så här: grundmuffinsrecepet är mixinet, och parametrarna är de toppings och fyllningar du kan välja. Varje gång du inkluderar mixinet kan du ge det andra "ingredienser" och få en helt annan slut-produkt.

### Button-muffin med olika toppings

Här är ett exempel som följer muffins-analogin helt genom – en knapp-mixin som tar "topping" och "fyllning" som parametrar:

```scss
// Definiera våra "toppings" och "fyllningar" (färgvariabler)
$chocolate-topping: #6f4e37;
$blueberry-filling: #4169e1;
$caramel-topping: #d4a574;
$strawberry-filling: #ff6b9d;

// Grundrecept: button-mixin
@mixin button-muffin($topping, $filling, $label) {
  background-color: $topping;
  border: 3px solid $filling;
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: $filling;
    border-color: $topping;
    transform: scale(1.05);
  }

  &::before {
    content: "🧁 ";
  }

  &::after {
    content: " #{$label}";
  }
}

// Året många varianter – samma recept, olika kombinationer!
.btn-chocolate-blueberry {
  @include button-muffin($chocolate-topping, $blueberry-filling, "Choklad & Blåbär");
}

.btn-caramel-strawberry {
  @include button-muffin($caramel-topping, $strawberry-filling, "Karamell & Jordgubbe");
}

.btn-blueberry-chocolate {
  @include button-muffin($blueberry-filling, $chocolate-topping, "Blåbär & Choklad");
}
```

Du får tre helt olika knappar genom att bara byta ordning på "toppings" och "fyllningar" – utan att skriva om någon CSS-regel!

```scss
@mixin flex($justify-content: center, $align-items: center) {
  display: flex;
  justify-content: $justify-content;
  align-items: $align-items;
}

.header {
  @include flex(space-between, center);
}

.card-grid {
  @include flex(flex-start, stretch);
}

.hero {
  @include flex; // Använder standardvärden: center, center
}
```

Värdet efter `:` är ett **standardvärde** (default value). Om du inte skickar in ett argument används standardvärdet automatiskt.

**Se även:** [Funktioner i SCSS](./funktioner.md) för att förstå skillnaden mellan mixins och funktioner.

### Namngivna argument

Du kan skicka in argument med namn för att göra anrop tydligare och kunna hoppa över argument du inte vill ändra:

```scss
.footer {
  @include flex($justify-content: space-between);
  // $align-items får sitt standardvärde: center
}
```

## Praktiska exempel

### Breakpoint-mixin

Mediafrågor (media queries) är ett vanligt tillfälle för mixins. Istället för att skriva `@media (min-width: 768px)` varje gång skapar vi ett mixin:

```scss
$breakpoints: (
  sm: 576px,
  md: 768px,
  lg: 992px,
  xl: 1200px,
);

@use 'sass:map';

@mixin breakpoint($size) {
  $value: map.get($breakpoints, $size);
  @media (min-width: $value) {
    @content;
  }
}
```

`@content` är en platshållare (placeholder) för allt du skriver inuti `@include`-blocket – ungefär som `children` i React. Användningen ser ut så här:

```scss
.container {
  padding: 1rem;

  @include breakpoint(md) {
    padding: 2rem;
    max-width: 960px;
    margin: 0 auto;
  }
}
```

Det kompileras till:

```css
.container {
  padding: 1rem;
}

@media (min-width: 768px) {
  .container {
    padding: 2rem;
    max-width: 960px;
    margin: 0 auto;
  }
}
```

### Knappstilar med tema

```scss
@mixin button-variant($bg-color, $text-color: white) {
  background-color: $bg-color;
  color: $text-color;
  border: none;
  padding: 0.5rem 1.25rem;
  border-radius: 4px;
  cursor: pointer;
  transition: opacity 0.2s ease;

  &:hover {
    opacity: 0.85;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}

.btn-primary {
  @include button-variant(#007aff);
}

.btn-danger {
  @include button-variant(#f44336);
}

.btn-light {
  @include button-variant(#f8f9fa, #333);
}
```

### Trunkering av text

```scss
@mixin truncate($max-width: 100%) {
  max-width: $max-width;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.card-title {
  @include truncate(200px);
}

.nav-link {
  @include truncate;
}
```

## Mixin vs `@extend`

SCSS erbjuder också `@extend` som ett sätt att dela stilar mellan selektorer. Det är lätt att blanda ihop dessa – här är skillnaden:

| | `@mixin` + `@include` | `@extend` |
|---|---|---|
| Kan ta parametrar | Ja | Nej |
| Kopierar CSS-regler | Ja (duplicerar output) | Nej (grupperar selektorer) |
| Flexibel | Hög | Låg |
| Rekommenderas | Ja, i de flesta fall | Sällan |

```scss
// Med @extend – selektorer grupperas
%button-base {
  padding: 0.5rem 1rem;
  border-radius: 4px;
}

.btn-primary {
  @extend %button-base;
  background: blue;
}

.btn-danger {
  @extend %button-base;
  background: red;
}

// Kompileras till:
// .btn-primary, .btn-danger { padding: 0.5rem 1rem; border-radius: 4px; }
// .btn-primary { background: blue; }
// .btn-danger  { background: red; }
```

`@extend` kan orsaka oväntade sidoeffekter i komplexa projekt. Som tumregel: **använd mixins**.

## Mixin vs funktion

Mixins och SCSS-funktioner kan verka lika – båda tar parametrar och är återanvändbara. Skillnaden är:

- En **funktion** *returnerar ett värde*: `font-size: rem(24)`
- Ett **mixin** *genererar CSS-regler*: `@include flex-center`

```scss
// Funktion – returnerar ett värde
@function rem($px) {
  @return $px / 16 * 1rem;
}

.title {
  font-size: rem(24); // 1.5rem
}

// Mixin – genererar regler
@mixin visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
}

.screen-reader-text {
  @include visually-hidden;
}
```

## Se även

- [Funktioner i SCSS](./funktioner.md) – när man använder funktioner istället för mixins
- [Responsiv SCSS med breakpoints](./responsiv-breakpoints.md) – breakpoint-mixins i praktiken
- [Nesting och selektorstrategi](./nesting-selektorstrategi.md) – ofta kombineras med nesting

## Sammanfattning

- Mixins definieras med `@mixin namn { }` och inkluderas med `@include namn`.
- Parametrar med standardvärden gör mixins flexibla och återanvändbara.
- `@content` gör att mixins kan ta in ett block – perfekt för mediafrågor och liknande mönster.
- Mixins är oftast att föredra framför `@extend` tack vare sin flexibilitet.
- Använd mixins för regler, funktioner för beräknade värden.
