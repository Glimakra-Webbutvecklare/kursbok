# 7-1 Struktur med importer

När ett projekt växer räcker det inte längre att ha all SCSS i en enda fil. Hundratals rader CSS för knappar, navigering, formulär, typografi och färger sammanblandade i samma dokument blir snabbt en mardröm att underhålla.

Lösningen är att dela upp koden i **partiala filer** (partials) och samla dem med en **importstruktur**. Det populäraste sättet att organisera detta kallas **7-1-mönstret** (the 7-1 pattern) och används som standard i tunga frontend-projekt.

## Partiala filer (Partials)

En **partial** är en SCSS-fil vars namn börjar med ett understreck, till exempel `_variables.scss` eller `_buttons.scss`. Understreket signalerar till SCSS-kompilatorn att filen inte ska kompileras till en egen CSS-fil – den är avsedd att importeras i en annan fil.

```text
_variables.scss   ← partial, kompileras inte ensam
_buttons.scss     ← partial, kompileras inte ensam
main.scss         ← huvudfil, kompileras till main.css
```

## Importera med `@use`

SCSS erbjuder två sätt att importera filer: `@import` och `@use`. `@import` är det äldre sättet och är numera **deprecated** (inte längre rekommenderat) och kommer att fasas ut. Den moderna lösningen är `@use`.

```scss
// main.scss
@use 'abstracts/variables';
@use 'abstracts/mixins';
@use 'base/reset';
@use 'base/typography';
@use 'components/buttons';
@use 'layout/header';
```

En viktig skillnad mot `@import` är att `@use` skapar ett **namespace** (namnrymd). Om du importerar `_variables.scss` med `@use` kommer dess variabler att vara tillgängliga som `variables.$primary-color` istället för direkt som `$primary-color`.

```scss
// abstracts/_variables.scss
$primary-color: #007aff;
$font-size-base: 1rem;
```

```scss
// components/_buttons.scss
@use '../abstracts/variables';

.button {
  background-color: variables.$primary-color;
  font-size: variables.$font-size-base;
}
```

Du kan förkorta namespace med `as`:

```scss
@use '../abstracts/variables' as v;

.button {
  background-color: v.$primary-color;
}
```

Eller ta bort namespace helt med `as *` (används sparsamt, gör koden svårare att följa):

```scss
@use '../abstracts/variables' as *;

.button {
  background-color: $primary-color; // Fungerar, men oklart varifrån
}
```

## 7-1-mönstret

7-1-mönstret innebär **7 mappar** med partiala filer och **1 huvudfil** (`main.scss`) som importerar allt.

```text
scss/
|
├── abstracts/
│   ├── _variables.scss    # Variabler (färger, spacing, typsnitt)
│   ├── _functions.scss    # SCSS-funktioner
│   └── _mixins.scss       # Mixins
|
├── base/
│   ├── _reset.scss        # Reset / normalize
│   └── _typography.scss   # Typografiregler
|
├── components/
│   ├── _buttons.scss      # Knappar
│   ├── _cards.scss        # Kort
│   └── _forms.scss        # Formulär
|
├── layout/
│   ├── _header.scss       # Header
│   ├── _footer.scss       # Footer
│   ├── _navigation.scss   # Navigation
│   └── _grid.scss         # Grid
|
├── pages/
│   ├── _home.scss         # Startsidan
│   └── _contact.scss      # Kontaktsidan
|
├── themes/
│   ├── _light.scss        # Ljust tema
│   └── _dark.scss         # Mörkt tema
|
├── vendors/
│   └── _normalize.scss    # Externa bibliotek
|
└── main.scss              # Importerar allt
```

### De 7 mapparna

| Mapp | Innehåll |
|---|---|
| `abstracts/` | Variabler, mixins och funktioner – inget som genererar CSS direkt |
| `base/` | Grundregler: reset, typsnitt, generella HTML-element |
| `components/` | Återanvändbara UI-komponenter: knappar, kort, formulär |
| `layout/` | Strukturella delar av sidan: header, footer, grid |
| `pages/` | Sidspecifika stilar som inte passar i components |
| `themes/` | Stilar för olika teman, t.ex. mörkt läge |
| `vendors/` | Tredjepartsstilar som importeras från externa bibliotek |

### Huvudfilen: `main.scss`

Huvudfilen importerar partials i rätt ordning. Ordningen är viktig – `abstracts/` måste komma före allt annat eftersom de andra filerna är beroende av variablerna och mixins som definieras där.

```scss
// main.scss

// 1. Abstracts – inga CSS-regler, bara definitioner
@use 'abstracts/variables';
@use 'abstracts/functions';
@use 'abstracts/mixins';

// 2. Vendors – externa stilar
@use 'vendors/normalize';

// 3. Base – grundregler
@use 'base/reset';
@use 'base/typography';

// 4. Layout – sidans struktur
@use 'layout/grid';
@use 'layout/header';
@use 'layout/footer';
@use 'layout/navigation';

// 5. Components – återanvändbara delar
@use 'components/buttons';
@use 'components/cards';
@use 'components/forms';

// 6. Pages – sidspecifika stilar
@use 'pages/home';
@use 'pages/contact';

// 7. Themes – teman
@use 'themes/dark';
```

## Ett praktiskt miniexempel

Så här kan ett litet projekt se ut med 7-1-strukturen:

```scss
// abstracts/_variables.scss
$primary-color: #007aff;
$spacing-md: 1rem;
$font-size-base: 1rem;
```

```scss
// base/_typography.scss
@use '../abstracts/variables' as v;

body {
  font-size: v.$font-size-base;
  font-family: 'Inter', sans-serif;
  line-height: 1.6;
}
```

```scss
// components/_buttons.scss
@use '../abstracts/variables' as v;

.button {
  background-color: v.$primary-color;
  color: white;
  padding: v.$spacing-md 2rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    opacity: 0.9;
  }
}
```

```scss
// main.scss
@use 'abstracts/variables';
@use 'base/typography';
@use 'components/buttons';
```

SCSS-kompilatorn slår ihop alla dessa filer till ett enda CSS-dokument – men under utvecklingen har du en tydlig och välorganiserad källkod.

## Varför spelar strukturen roll?

I ett verkligt projekt jobbar ofta flera personer med samma kodbas. En förutsägbar mappstruktur gör det enkelt att svara på frågor som:

- *"Var lägger jag stilar för navigeringen?"* → `layout/_navigation.scss`
- *"Var lägger jag knappens stil?"* → `components/_buttons.scss`
- *"Var definierar jag projektets primärfärg?"* → `abstracts/_variables.scss`

7-1-mönstret är ett **konvent** (convention), inte en absolut regel. Smaller projekt behöver kanske bara `abstracts/`, `base/` och `components/`. Det viktiga är att strukturen är konsekvent och logisk för hela teamet.
