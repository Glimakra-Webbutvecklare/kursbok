# Mobile-first design: Bygg för litet, skala uppåt

När vi utvecklar responsiva webbplatser finns det två huvudsakliga strategier för hur vi strukturerar vår CSS och våra Media Queries (mediefrågor):

1.  **Desktop-first design:** Man skriver först alla stilar för stora datorskärmar och använder sedan `max-width` i Media Queries för att *modifiera* eller *ta bort* stilar för mindre skärmar (surfplattor, mobiler).
2.  **Mobile-first design:** Man skriver först de grundläggande stilarna för de *minsta* skärmarna (mobiler) och använder sedan `min-width` i Media Queries för att *lägga till* eller *modifiera* stilar för successivt större skärmar.

**Mobile-first design rekommenderas starkt och anses idag vara bästa praxis.**

**Mål:** Förstå vad mobile-first design innebär, varför den är fördelaktig, och hur den implementeras med CSS och Media Queries.

## Varför mobile-first design?

*   **Fokus på kärninnehåll:** Mobila skärmar har begränsat utrymme. Mobile-first design tvingar oss att prioritera det absolut viktigaste innehållet och funktionerna från början. Detta leder ofta till en renare och mer fokuserad användarupplevelse på *alla* enheter.
*   **Prestanda:** Mobila enheter har ofta långsammare processorer och sämre nätverksuppkoppling än datorer. Genom att ladda de enklaste stilarna först och bara lägga till mer komplexa layouter och funktioner för större skärmar (som har mer kraft), kan vi förbättra prestandan på mobilen.
*   **Enklare CSS:** Det är ofta lättare att *lägga till* stilar för större skärmar (t.ex. gå från en enkel kolumn till flera) än att *skriva över* eller *nollställa* komplexa desktop-stilar för mindre skärmar. Detta kan leda till mindre och mer lätthanterlig CSS.
*   **Progressive enhancement:** Mobile-first design går hand i hand med principen om *progressiv förbättring* (progressive enhancement). Man börjar med en grundläggande, fungerande upplevelse för alla (även äldre webbläsare eller enheter med begränsad funktionalitet) och lägger sedan på förbättringar (mer avancerad layout, JavaScript-effekter) för de webbläsare och enheter som stödjer dem.

## Hur implementeras mobile-first design?

1.  **Skriv bas-CSS för mobil:** Skriv dina CSS-regler utanför några Media Queries. Dessa regler ska definiera grundutseendet och layouten för den minsta skärmen du siktar på (oftast en enkel, enkolumns-layout).

2.  **Använd `min-width` Media Queries:** Identifiera dina breakpoints (brytpunkter) där designen behöver anpassas för större skärmar.

3.  **Lägg till stilar för större skärmar:** Inuti `@media (min-width: ...)`-blocken, lägg till de CSS-regler som behövs för att anpassa layouten och utseendet för den större skärmstorleken. Du behöver bara skriva de regler som *ändras* eller *läggs till* – de grundläggande mobil-stilarna ärvs automatiskt.

**Exempel (konceptuellt):**

```css
/* =================================== */
/* Bas-stilar (mobile-first design - gäller ALLTID) */
/* =================================== */
body {
  font-family: sans-serif;
  line-height: 1.5;
  padding: 10px;
}

.container {
  width: 100%; /* Tar upp hela bredden på små skärmar */
}

nav ul {
  padding: 0;
  list-style: none;
}

nav li {
  margin-bottom: 10px; /* Länkar under varandra */
}

.card {
  border: 1px solid #ccc;
  padding: 15px;
  margin-bottom: 15px;
}

/* Dölj sidopanelen på små skärmar */
.sidebar {
    display: none;
}

/* =================================== */
/* Mellanstora skärmar (t.ex. surfplattor och uppåt) */
/* =================================== */
@media (min-width: 768px) {
  body {
    padding: 20px;
  }

  .container {
    max-width: 960px; /* Begränsa bredden */
    margin: 0 auto; /* Centrera */
    display: flex; /* Använd Flexbox för layout */
    gap: 20px; /* Avstånd mellan flex-items */
  }

  main { /* Huvudinnehållet tar upp mer plats */
      flex: 3; /* Tar 3 delar av tillgängligt utrymme */
  }

  .sidebar { /* Visa sidopanelen */
      display: block;
      flex: 1; /* Tar 1 del av tillgängligt utrymme */
  }

  nav li {
    display: inline-block; /* Länkar bredvid varandra */
    margin-bottom: 0;
    margin-right: 15px;
  }
}

/* =================================== */
/* Stora skärmar (t.ex. desktop och uppåt) */
/* =================================== */
@media (min-width: 1200px) {
  body {
    font-size: 110%; /* Lite större text */
  }

  /* Eventuella ytterligare anpassningar för stora skärmar */
}
```

I det här exemplet:

*   Definieras grundläggande stilar för typsnitt, padding och en enkel layout (allt i en kolumn, ingen sidebar) först.
*   Vid `768px` (`min-width`) introduceras Flexbox för att skapa en tvåkolumnslayout (`main` och `sidebar`), navigeringslänkarna placeras bredvid varandra, och containern centreras.
*   Vid `1200px` (`min-width`) justeras textstorleken ytterligare.

## Sammanfattning

Mobile-first design är en strategi där man designar och kodar för den minsta skärmen först och sedan använder `min-width` i Media Queries för att progressivt förbättra och anpassa layouten för större skärmar. Detta leder ofta till bättre prestanda på mobilen, renare kod och ett större fokus på kärninnehållet. Det är den rekommenderade metoden för att bygga responsiva webbplatser idag.

Nu är det dags att praktisera dessa CSS-koncept!
