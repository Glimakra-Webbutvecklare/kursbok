# Theming: ljust och mörkt tema

Theming innebär att samma komponenter kan få olika visuella uttryck utan att HTML-strukturen behöver ändras. Vanligast är light theme (ljust tema) och dark theme (mörkt tema).

## Varför CSS custom properties för tema?

Du har lärt dig om SCSS-variabler, men för tema använder vi istället **CSS custom properties** (CSS-variabler). Här är varför:

| Aspekt | SCSS-variabler | CSS custom properties |
|---|---|---|
| **Kompilering** | Ersätts vid build, försvinner | Lever i den slutliga CSS:en |
| **Ändring** | Kräver ombyggnad | Kan ändras utan ombyggnad |
| **JavaScript** | Ingen åtkomst | Kan läsas och skrivas med JS |
| **Tema-byte** | Måste bygga om för varje tema | Ändra värden, omedelbar effekt |

**Exempel på skillnaden:**

```scss
// SCSS-variabel – ersätts vid kompilering
$primary-color: #007aff;

.button {
  background: $primary-color;  // Blir: background: #007aff;
}
```

```css
/* CSS custom property – lever kvar i CSS */
:root {
  --primary-color: #007aff;
}

.button {
  background: var(--primary-color);  /* Kan ändras under körning! */
}
```

Om du senare vill byta tema för användaren behöver du bara ändra CSS-variablerna – inget build eller omstart krävs. Det är det som gör CSS-variabler så kraftfulla för tema.

## Steg-för-steg: Bygg ett mörkt och ljust tema

Här är en praktisk guide med mappstruktur och kod för varje steg.

### Steg 1: Skapa mappstruktur för teman

```text
SCSS/
  abstracts/
    _variables.scss     # Grundvariabler (inte färger än)
    _index.scss
  themes/
    _light.scss         # Light theme
    _dark.scss          # Dark theme
    _index.scss         # Exporterar båda
  components/
    _card.scss
    _button.scss
  main.scss
```

### Steg 2: Definiera grundvariabler (abstracts/_variables.scss)

Här definierar du värdena som inte är temaspecifika – spacing, typografi osv.

```scss
// abstracts/_variables.scss

// Spacing
$spacing-xs: 0.25rem;
$spacing-sm: 0.5rem;
$spacing-md: 1rem;
$spacing-lg: 1.5rem;
$spacing-xl: 2rem;

// Typografi
$font-family-base: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
$font-size-base: 1rem;
$font-size-sm: 0.875rem;
$font-size-lg: 1.125rem;

// Border radius
$radius-sm: 0.25rem;
$radius-md: 0.5rem;
$radius-lg: 0.75rem;
```

### Steg 3: Skapa light theme (themes/_light.scss)

```scss
// themes/_light.scss

:root {
  // Bakgrund
  --color-bg: #ffffff;
  --color-surface: #f6f8fa;
  --color-surface-secondary: #eaeef2;

  // Text
  --color-text: #1f2328;
  --color-text-secondary: #656d76;
  --color-text-tertiary: #8b949e;

  // Primär färg (brand)
  --color-primary: #0b6bcb;
  --color-primary-hover: #0969da;
  --color-primary-active: #033d8b;

  // Status färger
  --color-success: #1a7f37;
  --color-warning: #9a6700;
  --color-danger: #cf222e;
  --color-info: #0969da;

  // Fokus
  --color-focus: #0b6bcb;

  // Border
  --color-border: #d0d7de;
}
```

### Steg 4: Skapa dark theme (themes/_dark.scss)

```scss
// themes/_dark.scss

[data-theme='dark'] {
  // Bakgrund
  --color-bg: #0d1117;
  --color-surface: #161b22;
  --color-surface-secondary: #21262d;

  // Text
  --color-text: #e6edf3;
  --color-text-secondary: #8b949e;
  --color-text-tertiary: #6e7681;

  // Primär färg (brand)
  --color-primary: #58a6ff;
  --color-primary-hover: #79c0ff;
  --color-primary-active: #0969da;

  // Status färger
  --color-success: #3fb950;
  --color-warning: #d29922;
  --color-danger: #f85149;
  --color-info: #79c0ff;

  // Fokus
  --color-focus: #58a6ff;

  // Border
  --color-border: #30363d;
}
```

**Viktigt:** Lägg märke till att farger är olika för dark theme – inte bara mörkare versioner av light. `--color-primary` är en helt annan färg i dark mode för bättre kontrast.

### Steg 5: Exportera teman (themes/_index.scss)

```scss
// themes/_index.scss
@forward 'light';
@forward 'dark';
```

### Steg 6: Skapa komponenter som använder tokens (components/_card.scss)

```scss
// components/_card.scss
@use '../abstracts/variables' as v;

.card {
  background: var(--color-surface);
  color: var(--color-text);
  border: 1px solid var(--color-border);
  border-radius: v.$radius-md;
  padding: v.$spacing-lg;
  transition: background-color 0.2s ease, color 0.2s ease;
}

.card__title {
  color: var(--color-text);
  font-size: v.$font-size-lg;
  margin: 0 0 v.$spacing-md 0;
}

.card__text {
  color: var(--color-text-secondary);
  margin: 0;
}
```

### Steg 7: Skapa knappar med tema (components/_button.scss)

```scss
// components/_button.scss
@use '../abstracts/variables' as v;

.button {
  border: none;
  border-radius: v.$radius-md;
  padding: v.$spacing-sm v.$spacing-md;
  font-family: v.$font-family-base;
  cursor: pointer;
  transition: all 0.2s ease;

  &:focus-visible {
    outline: 3px solid var(--color-focus);
    outline-offset: 2px;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}

// Primär knapp
.button--primary {
  background: var(--color-primary);
  color: #fff;

  &:hover {
    background: var(--color-primary-hover);
  }

  &:active {
    background: var(--color-primary-active);
  }
}

// Sekundär knapp (outline)
.button--secondary {
  background: transparent;
  border: 2px solid var(--color-primary);
  color: var(--color-primary);

  &:hover {
    background: var(--color-surface-secondary);
  }
}

// Danger knapp
.button--danger {
  background: var(--color-danger);
  color: #fff;

  &:hover {
    filter: brightness(1.1);  // Lite ljusare vid hover
  }
}
```

### Steg 8: Anslut allt i main.scss

```scss
// main.scss
@use 'abstracts/variables';
@use 'themes';              // Importerar både light och dark
@use 'components/card';
@use 'components/button';
```

### Steg 9: Använd det i HTML

```html
<!-- Light theme (standard) -->
<div class="card">
  <h3 class="card__title">Min kort</h3>
  <p class="card__text">Innehål här...</p>
  <button class="button button--primary">Klicka</button>
</div>

<!-- Dark theme -->
<html data-theme="dark">
  <body>
    <div class="card">
      <h3 class="card__title">Min kort</h3>
      <p class="card__text">Innehål här...</p>
      <button class="button button--primary">Klicka</button>
    </div>
  </body>
</html>
```

### Steg 10: Lägg till tema-switcher med JavaScript (valfritt)

```html
<button id="theme-toggle">🌙 Dark</button>

<script>
  const toggle = document.getElementById('theme-toggle');
  const html = document.documentElement;

  toggle.addEventListener('click', () => {
    const current = html.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    
    html.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
    toggle.textContent = next === 'dark' ? '☀️ Light' : '🌙 Dark';
  });

  // Återställ sparad tema vid sidladdning
  const saved = localStorage.getItem('theme') || 'light';
  html.setAttribute('data-theme', saved);
  toggle.textContent = saved === 'dark' ? '☀️ Light' : '🌙 Dark';
</script>
```

## Sammanfattning av processen

1. **Abstracts:** Grundvariabler som spacing, typografi (samma i båda teman)
2. **Themes:** CSS custom properties för färger (olika per tema)
3. **Components:** Komponenter som använder `var()` för färger
4. **main.scss:** Sammanslutning av alles
5. **HTML:** Användning av `data-theme` för att byta tema

Fördelarna:
- Samma SCSS-kod för båda teman
- Temabyte utan ny build
- Lätt att lägga till fler teman senare
- Tydlig indelning mellan struktur och design

## Automatisk tema-uppstart

Du kan även utgå från prefers-color-scheme.

```scss
@media (prefers-color-scheme: dark) {
  :root {
    --color-bg: #0d1117;
    --color-surface: #161b22;
    --color-text: #e6edf3;
  }
}
```

## Kontrast och tillgänglighet

När du bygger tema måste du kontrollera kontrast mellan text och bakgrund. Låg kontrast gör innehåll svårt att läsa, särskilt i mörka teman.

## Vanliga misstag

1. Hårdkodade färger i komponenter som kringgår tokens.
2. Endast färgbyte utan att kontrollera hover, focus och disabled.
3. Mörkt tema där grå nyanser blir för lika varandra.

## Säkerhet och robusthet

Tema-byte ska inte påverka funktionalitet. Om fokusmarkeringar försvinner i ett tema kan användaren missa viktiga interaktioner i formulär och dialoger.

## Sammanfattning

- Theming byggs bäst med semantiska tokens.
- CSS custom properties gör tema-byte möjligt utan ny build.
- SCSS hjälper till med struktur och återanvändning.
- Kontrast och fokusstilar måste testas i alla teman.

## Se även

- [Design tokens och CSS custom properties](./design-tokens-css-custom-properties.md) – grunderna för tokens
- [Variabler och Maps](./variabler-maps.md) – hur man genererar CSS-variabler från maps
- [Tillgänglighet i SCSS](./tillganglighet.md) – fokusstilar och kontrast i teman

## Övningar

1. Skapa light och dark theme med data-theme.
2. Bygg en kortkomponent och en knapp som fungerar i båda teman.
3. Lägg till fokusstil som syns tydligt i båda lägena.
