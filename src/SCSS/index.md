# 🧠 Sammanfattningslektion: SCSS / SASS

## 🎯 1. Vad är SCSS och varför används det

**SCSS = en utökning av CSS** som låter dig använda variabler, funktioner och struktur.

**Fördelar:**
- Variabler  
- Nesting  
- Mixins & Functions  
- Struktur med moduler  
- Logik (loops & maps)

~~~scss
// Lägg för att använda er av SCSS inbyggda Color Modul
@use 'sass:color'

$primary-color: #007aff;

button {
  background: $primary-color;

  &:hover {
    // color.scale använder sig av SCSS inbyggda Color Modul och 
    // i detta exemplet gör knappen 10% ljusare vid :hover
    background: color.scale($primary-color, $lightness: 10%);
  }
}
~~~

---

## 🎨 2. Variabler

Definiera återanvändbara värden för färger, typsnitt, spacing osv.

~~~scss
$font-stack: 'Inter', sans-serif;
$spacing-md: 1rem;
$primary-color: #007aff;
~~~

💡 Gör designen konsekvent och lätt att uppdatera.

---

## 🧱 3. Nesting

Skriv CSS hierarkiskt, men undvik för djup nesting.

~~~scss
.card {
  background: white;

  h2 {
    color: black;
  }

  &:hover {
    background: lightgray;
  }
}
~~~

---

## ⚙️ 4. Mixins & Functions

### 🔹 Mixins

Återanvändbara kodblock med parametrar — ofta för layout eller breakpoints.

~~~scss
@mixin flex($justifyContent, $alignItems) {
  display: flex;
  justify-content: $justifyContent;
  align-items: $alignItems;
}

// För att få en container med innehållet både centrerat i horisontell och vertikal led

.container {
  @include flex(center, center);
}
~~~

### 🔹 Functions

Returnerar ett värde — perfekt för beräkningar.

~~~scss
// Man designar ofta i px men vill ha det i REM i koden, så är detta en enkel funktion
// att använda för att kunna ange pixelvärden och få resultatet i REM

@function rem($px) {
  @return $px / 16 * 1rem;
}

.title {
  font-size: rem(24); // 24 / 16 * 1rem = 1.5rem
}
~~~

---

## 🧩 5. Partials och struktur

Använd `_filnamn.scss` och importera med `@import`.

~~~scss
@import 'folder/filenamn'
~~~

### 📁 Exempel på mappstruktur

```text
SCSS/
|
|– abstracts/
|   |– _variables.scss   # Sass Variables
|   |– _functions.scss   # Sass Functions
|   |– _mixins.scss      # Sass Mixins
|   |– _helpers.scss     # Class & placeholders helpers
|
|– base/
|   |– _reset.scss       # Reset/normalize
|   |– _typography.scss  # Typography rules
|   ...                  # Etc…
|
|– components/
|   |– _buttons.scss     # Buttons
|   |– _carousel.scss    # Carousel
|   |– _cover.scss       # Cover
|   |– _dropdown.scss    # Dropdown
|   ...                  # Etc…
|
|– layout/
|   |– _navigation.scss  # Navigation
|   |– _grid.scss        # Grid system
|   |– _header.scss      # Header
|   |– _footer.scss      # Footer
|   |– _sidebar.scss     # Sidebar
|   |– _forms.scss       # Forms
|   ...                  # Etc…
|
|– pages/
|   |– _home.scss        # Home specific styles
|   |– _contact.scss     # Contact specific styles
|   ...                  # Etc…
|
|– themes/
|   |– _theme.scss       # Default theme
|   |– _admin.scss       # Admin theme
|   ...                  # Etc…
|
|– vendors/
|   |– _bootstrap.scss   # Bootstrap
|   |– _jquery-ui.scss   # jQuery UI
|   ...                  # Etc…
|
`– main.scss             # Main Sass file

```

---

## 🔁 6. Loopar & Maps

Automatisera kod och skapa upprepade komponenter.

~~~scss
// Detta är en SCSS Map innehållande våra färger
$colors: (
  primary: #007aff,
  secondary: #ff4081,
  success: #4caf50
);

// Denna ForEach Loopen loopar igenom alla färgerna i vår map
// $name är det som står till vänster om : tecknet i map:en
// $color är det som stårl till höger om : teckent i map:en
// $colors är vilken map den skall läsa från

@each $name, $color in $colors {
  .btn-#{$name} {
    background-color: $color;
  }
}
~~~

**Ger:**

~~~css
.btn-primary { background-color: #007aff; }
.btn-secondary { background-color: #ff4081; }
.btn-success { background-color: #4caf50; }
~~~

---

## 🧠 7. Best Practices

✅ Håll koden strukturerad  
✅ Använd variabler och mixins smart  
✅ Undvik djup nesting  
✅ Kommentera tydligt  
✅ Kompilera till minifierad CSS i produktion  

---

## 💻 8. Mini-projekt: Övning

**Uppgift:**  
Skapa en knappkomponent med:
- Färgvariabler  
- En mixin för hover-effekt  
- En loop för att generera flera färgversioner  

~~~scss
$btn-colors: (
  primary: #007aff,
  danger: #ff3b30,
  success: #34c759
);

@mixin btn($color) {
  background: $color;
  color: white;
  border: none;
  padding: 0.75rem 1.25rem;
  border-radius: 0.5rem;

  &:hover {
    background: darken($color, 10%);
  }
}

@each $name, $color in $btn-colors {
  .btn-#{$name} {
    @include btn($color);
  }
}
~~~

✅ **Tips:**  
Den här sammanfattningen fungerar bra som referens i ett GitHub-projekt, undervisningsmaterial eller som snabbguide inför lektioner.