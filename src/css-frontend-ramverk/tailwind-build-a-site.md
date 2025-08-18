# Bygga en Dashboardsida med Tailwind CSS

## Introduktion
En dashboardsida är en central plats för att visa viktig information och ge användaren tillgång till olika funktioner. Med Tailwind CSS kan du snabbt bygga en responsiv och modern dashboardsida. I denna lektion går vi igenom:
1. Hur du planerar en dashboardsida.
2. Vilka element som bör vara med.
3. Best practices för att bygga en dashboardsida.
4. Ett praktiskt exempel.

---

## Hur ska man tänka när man bygger en dashboardsida?

### 1. **Definiera syftet**
- Vad är syftet med dashboarden? Är det att visa statistik, hantera användare eller något annat?
- Identifiera de viktigaste funktionerna och informationen som användaren behöver.

### 2. **Prioritera innehåll**
- Placera det viktigaste innehållet högst upp (t.ex. KPI:er, grafer eller notifikationer).
- Använd en tydlig hierarki för att guida användaren.

### 3. **Planera layouten**
- **Sidhuvud (Header)**: För logotyp, navigering och användarprofil.
- **Sidomeny (Sidebar)**: För navigering mellan olika sektioner.
- **Huvudinnehåll (Main Content)**: För grafer, tabeller och annan information.
- **Sidfot (Footer)**: För länkar eller copyright-information.

### 4. **Responsiv design**
- Se till att dashboarden fungerar bra på både desktop och mobila enheter.
- Använd Tailwinds breakpoints (`sm:`, `md:`, `lg:`, etc.) för att anpassa layouten.

---

## Vilka element borde vara med?

### 1. **Sidhuvud (Header)**
- Logotyp.
- Sökfält.
- Användarprofil eller avatar.
- Notifikationsikon.

### 2. **Sidomeny (Sidebar)**
- Navigeringslänkar till olika sektioner (t.ex. Hem, Statistik, Inställningar).
- Ikoner för att göra navigeringen tydligare.

### 3. **Huvudinnehåll (Main Content)**
- **KPI-kort**: För att visa nyckeltal (t.ex. antal användare, försäljning).
- **Grafer och diagram**: För att visualisera data.
- **Tabeller**: För att visa detaljerad information.
- **Snabbåtgärder**: Knapp för att lägga till ny data eller hantera inställningar.

### 4. **Sidfot (Footer)**
- Länkar till hjälp eller support.
- Copyright-information.

---

## Best Practices

1. **Håll det enkelt**
   - Undvik att överbelasta dashboarden med för mycket information.
   - Använd whitespace för att skapa en luftig layout.

2. **Använd konsekventa färger**
   - Använd ett färgschema som passar varumärket.
   - Använd Tailwinds färgklasser för att skapa kontrast och tydlighet.

3. **Responsivitet först**
   - Börja med en mobilvänlig layout och bygg ut för större skärmar.

4. **Använd Tailwinds utility-klasser**
   - Använd klasser som `grid`, `flex`, och `space-x-4` för att snabbt skapa layouten.

5. **Testa användarupplevelsen**
   - Säkerställ att dashboarden är lätt att navigera och att viktig information är lättillgänglig.

---

## Exempel: Bygga en dashboardsida

Här är ett exempel på en enkel dashboardsida:

```html
<div class="min-h-screen bg-gray-100 flex">
  <!-- Sidebar -->
  <aside class="w-64 bg-gray-800 text-white flex flex-col">
    <div class="p-4 text-lg font-bold">Dashboard</div>
    <nav class="flex-1">
      <ul>
        <li class="p-4 hover:bg-gray-700"><a href="#">Hem</a></li>
        <li class="p-4 hover:bg-gray-700"><a href="#">Statistik</a></li>
        <li class="p-4 hover:bg-gray-700"><a href="#">Inställningar</a></li>
      </ul>
    </nav>
    <div class="p-4">© 2025 Företag</div>
  </aside>

  <!-- Main Content -->
  <main class="flex-1 p-6">
    <!-- Header -->
    <header class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">Välkommen, Användare</h1>
      <div class="flex items-center space-x-4">
        <input type="text" placeholder="Sök..." class="p-2 border rounded">
        <img src="https://via.placeholder.com/40" alt="Avatar" class="w-10 h-10 rounded-full">
      </div>
    </header>

    <!-- KPI Cards -->
    <section class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div class="p-4 bg-white rounded shadow">
        <h2 class="text-lg font-bold">Användare</h2>
        <p class="text-2xl font-semibold">1,234</p>
      </div>
      <div class="p-4 bg-white rounded shadow">
        <h2 class="text-lg font-bold">Försäljning</h2>
        <p class="text-2xl font-semibold">45,678 kr</p>
      </div>
      <div class="p-4 bg-white rounded shadow">
        <h2 class="text-lg font-bold">Supportärenden</h2>
        <p class="text-2xl font-semibold">12</p>
      </div>
    </section>

    <!-- Table -->
    <section class="bg-white rounded shadow p-4">
      <h2 class="text-lg font-bold mb-4">Senaste aktiviteter</h2>
      <table class="w-full text-left">
        <thead>
          <tr>
            <th class="border-b p-2">Datum</th>
            <th class="border-b p-2">Aktivitet</th>
            <th class="border-b p-2">Status</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="p-2">2025-08-19</td>
            <td class="p-2">Ny användare registrerad</td>
            <td class="p-2 text-green-500">Slutförd</td>
          </tr>
          <tr>
            <td class="p-2">2025-08-18</td>
            <td class="p-2">Supportärende skapat</td>
            <td class="p-2 text-yellow-500">Pågående</td>
          </tr>
        </tbody>
      </table>
    </section>
  </main>
</div>
```

---

## Övning: Bygg din egen dashboardsida

### Uppgift
Bygg en egen dashboardsida som innehåller:
1. En sidomeny med minst tre länkar.
2. Ett sidhuvud med en sökfält och en användarprofil.
3. Tre KPI-kort som visar nyckeltal.
4. En tabell som visar data.

### Krav
- Använd Tailwinds utility-klasser för layout och styling.
- Gör sidan responsiv så att den fungerar på både mobil och desktop.

### Utmaning
- Lägg till en graf eller diagram med hjälp av ett bibliotek som [Chart.js](https://www.chartjs.org/).
- Lägg till en hover-effekt på sidomenyns länkar.

---

## Sammanfattning
- **Planering**: Definiera syftet och prioritera innehållet.
- **Element**: Inkludera sidhuvud, sidomeny, KPI-kort, tabeller och grafer.
- **Best practices**: Håll det enkelt, använd konsekventa färger och bygg responsivt.

För mer information, besök [Tailwind CSS Dokumentation](https://tailwindcss.com/docs).