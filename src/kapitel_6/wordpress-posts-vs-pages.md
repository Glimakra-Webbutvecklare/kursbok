# Skillnaden mellan Posts och Pages i WordPress

När du bygger en webbplats i WordPress är en av de första frågorna: ska innehållet vara ett **Post (inlägg)** eller en **Page (sida)**?

Det här valet påverkar hur innehållet visas, hur lätt det blir att navigera på sajten och hur redaktörer arbetar i adminpanelen.

## Förkunskaper

Innan du börjar bör du ha läst:

- [WordPress](./wordpress.md)
- [Installation med Local by Flywheel](./wordpress-local.md)

## Vad är ett Post (inlägg)?

Ett **Post (inlägg)** är tidsbaserat innehåll. Inlägg används oftast för:

- Blogg
- Nyheter
- Uppdateringar
- Artiklar som publiceras löpande

Ett inlägg har normalt:

- Publiceringsdatum
- Författare
- Kategorier (categories)
- Taggar (tags)
- Plats i ett flöde (senaste först)

## Vad är en Page (sida)?

En **Page (sida)** är statiskt innehåll som inte är kopplat till datumflöde. Sidor används oftast för:

- Om oss
- Kontakt
- Tjänster
- Integritetspolicy

En sida har normalt:

- Ingen synlig tidsstämpel
- Ingen kategori/tagg som standard
- Fast plats i navigering (meny)
- Hierarki (överordnad/underordnad sida)

## Jämförelse: Posts vs Pages

| Egenskap | Post (inlägg) | Page (sida) |
|---|---|---|
| Typ av innehåll | Löpande och tidsbaserat | Statiskt och långsiktigt |
| Datum i fokus | Ja | Nej (oftast) |
| Kategorier/taggar | Ja | Nej (som standard) |
| Visas i bloggflöde | Ja | Nej |
| Vanlig användning | Nyheter, artiklar, blogg | Om oss, Kontakt, policy |

## Exempel från en skolsajt

Tänk dig en skolas webbplats:

- **Post (inlägg):** "Öppet hus 15 mars", "Nytt schema publicerat"
- **Page (sida):** "Om utbildningen", "Kontakt", "Ansökan"

En enkel tumregel är:

- Om innehållet ska komma i ett **flöde över tid** → använd **Post (inlägg)**
- Om innehållet ska vara **stabilt i menystrukturen** → använd **Page (sida)**

## URL-struktur och navigering

WordPress bygger ofta olika URL-mönster:

- Inlägg kan hamna under till exempel `/blogg/valkommen-till-kursen/`
- Sidor kan ha mer direkta URL:er som `/kontakt/`

Det gör det enklare för användaren att förstå om innehållet är en del av nyhetsflödet eller en permanent informationssida.

## Säkerhet och roller i redaktörsarbete

Valet mellan inlägg och sidor är också en arbetsflödesfråga:

- Ge rätt användarroll (role, behörighet) till rätt person.
- Begränsa vilka som får publicera (publish) direkt.
- Granska innehåll innan publicering, särskilt inlägg med länkar och inbäddningar.

Det minskar risken för felpublicering och osäkert innehåll.

## Vanliga misstag

1. Lägga all information som inlägg, även statiska sidor.
2. Använda sidor för nyhetsinnehåll som borde gå i flöde.
3. Sakna tydlig kategori-struktur för inlägg.
4. Otydlig meny där viktiga sidor är svåra att hitta.

## Sammanfattning

- **Post (inlägg)** passar för löpande, datumstyrt innehåll.
- **Page (sida)** passar för stabilt innehåll i webbplatsens grundstruktur.
- Rätt val från början gör sajten enklare att underhålla, navigera och skala.

## Reflektionsfrågor

1. Vilket innehåll på din tänkta webbplats ska vara inlägg respektive sidor?
2. Hur skulle du strukturera kategorier för inlägg så att det blir lätt att hitta rätt?
3. Vilka sidor behöver alltid vara tillgängliga i huvudmenyn?
