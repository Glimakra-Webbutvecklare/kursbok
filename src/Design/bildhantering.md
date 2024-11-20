# Bildhantering för webben

## Vanliga bildformat och deras användningsområden

Här är en översikt av de vanligaste bildformaten och vad de används för:

### 1. JPG/JPEG (Joint Photographic Experts Group)
- **Egenskaper**:  
  - Bra för fotografier och bilder med många färgtoner.  
  - Använder lossy-komprimering (minskar filstorlek men förlorar viss kvalitet).  
- **Fördelar**:  
  - Liten filstorlek, snabb att ladda.  
  - Stöds av alla webbläsare och program.  
- **Nackdelar**:  
  - Förlorar kvalitet vid upprepade redigeringar.  
- **Användningsområden**:  
  - Fotografier på webbsidor.  
  - Bilder som inte kräver transparens.

---

### 2. PNG (Portable Network Graphics)
- **Egenskaper**:  
  - Stödjer transparens och hög färgkvalitet.  
  - Använder lossless-komprimering (ingen kvalitetsförlust).  
- **Fördelar**:  
  - Perfekt för bilder med skarpa linjer, text eller grafik.  
  - Behåller kvalitet även efter flera redigeringar.  
- **Nackdelar**:  
  - Större filstorlek jämfört med JPG.  
- **Användningsområden**:  
  - Logotyper, ikoner och grafik med transparens.  
  - Bilder där hög kvalitet krävs.

---

### 3. GIF (Graphics Interchange Format)
- **Egenskaper**:  
  - Stödjer animationer.  
  - Begränsat till 256 färger, vilket gör det mindre lämpligt för fotografier.  
- **Fördelar**:  
  - Perfekt för enkla animationer och loopade bilder.  
  - Transparent bakgrund stöds (men med lägre kvalitet än PNG).  
- **Nackdelar**:  
  - Begränsad färgpalett kan påverka bildkvaliteten.  
- **Användningsområden**:  
  - Korta animationer och enkla grafikfiler.  
  - Memes och dekorativa element.

---

### 4. SVG (Scalable Vector Graphics)
- **Egenskaper**:  
  - Vektorbilder som kan skalas oändligt utan kvalitetsförlust.  
  - Skrivet i XML-format, vilket gör dem redigerbara med kod.  
- **Fördelar**:  
  - Mycket liten filstorlek för grafik som logotyper och ikoner.  
  - Stödjer animationer och interaktiva element.  
- **Nackdelar**:  
  - Inte lämplig för fotografier eller komplexa rasterbilder.  
- **Användningsområden**:  
  - Logotyper, ikoner och grafik på webbsidor.  
  - Används ofta i responsiv design.

---

### 5. WebP (Web Picture Format)
- **Egenskaper**:  
  - Modernt bildformat som kombinerar fördelarna med JPG och PNG.  
  - Stödjer både lossy och lossless-komprimering.  
  - Har transparens och animationer som tillval.  
- **Fördelar**:  
  - Mindre filstorlek än både JPG och PNG utan synbar kvalitetsförlust.  
  - Optimerat för snabbare webbsidor.  
- **Nackdelar**:  
  - Inte fullt kompatibelt med äldre webbläsare.  
- **Användningsområden**:  
  - Bilder på moderna webbsidor.  
  - Perfekt för både fotografier och grafik.

---

### Sammanfattning

| **Format** | **Användning**            | **Fördelar**                       | **Nackdelar**                      |
|------------|---------------------------|-------------------------------------|-------------------------------------|
| JPG        | Fotografier               | Liten filstorlek, snabb att ladda  | Förlorar kvalitet vid komprimering |
| PNG        | Grafik, logotyper         | Transparens, hög kvalitet          | Stor filstorlek                    |
| GIF        | Animationer               | Loopar animationer                 | Begränsad färgpalett               |
| SVG        | Vektorgrafik, ikoner      | Skalbart, liten filstorlek         | Ej lämpligt för fotografier        |
| WebP       | Allt (foton + grafik)     | Hög kvalitet, liten filstorlek     | Begränsad webbläsarstöd            |



## Upplösning för bilder

Upplösning beskriver hur många pixlar en bild innehåller och påverkar både kvalitet och filstorlek. Den mäts ofta i **PPI (pixels per inch)** för skärm och **DPI (dots per inch)** för tryck.  

- **Webbstandard**: 72 PPI räcker för digitala bilder eftersom skärmar inte kräver högre densitet.  
- **För tryck**: 300 DPI rekommenderas för att säkerställa skarpa utskrifter.  

En högre upplösning ger bättre kvalitet men ökar filstorleken, vilket kan påverka prestanda, särskilt på webben.

### **Retinaskärmar**
Retinaskärmar (som används i Apple-enheter) har en mycket högre pixeldensitet än vanliga skärmar. För att bilder ska se skarpa och tydliga ut på dessa skärmar rekommenderas att använda bilder med minst **2x upplösning** (dvs. dubbelt så många pixlar) jämfört med standardbilder. Detta säkerställer att bilderna inte ser suddiga ut på skärmar med hög pixeldensitet.


## Varför optimera bilder för webben?

- **Prestanda**:  
  Stora bildfiler tar längre tid att ladda, vilket påverkar webbplatsens hastighet och användarupplevelse.

- **SEO-fördelar**:  
  Snabbare sidor laddar snabbare och förbättrar därmed webbplatsens sökmotorrankning.

- **Användarvänlighet**:  
  Mindre filer är enklare att hantera på mobila enheter, särskilt med begränsad bandbredd.


## Guide: Hur man optimerar bilder och dimensioner i Figma och exporterar för webben

Att optimera bilder för webben är viktigt för att förbättra webbplatsens prestanda och användarupplevelse. Här är en enkel guide för att optimera och exportera bilder i Figma för användning på webben.

### 1. Skapa rätt dimensioner
- **Bestäm bildens syfte**: Börja med att tänka på var och hur bilden kommer att användas. Är det en bakgrundsbild, en ikon eller ett fotografi? Detta påverkar både storlek och upplösning.
- **Skala till rätt storlek**: Justera bildens dimensioner i Figma så att den inte är större än nödvändigt. En stor bild kan dras ned i storlek när den exporteras, men det är bättre att börja med rätt mått.

### 2. Använd rätt bildformat
- **JPG/JPEG**: Perfekt för fotografier och bilder med många färger. Välj detta format när du har stora bilder eller foton.
- **PNG**: Välj PNG för bilder som kräver transparens eller skarpa kanter, som logotyper och ikoner.
- **SVG**: Använd SVG för vektorgrafik som logotyper, ikoner och grafik som ska skalas utan kvalitetsförlust.
- **WebP**: Om du vill ha en balans mellan bra kvalitet och liten filstorlek, använd WebP (kan vara bra för både foton och grafik på moderna webbsidor).

### 3. Optimera bildkvaliteten
- **Komprimera bilder**: När du exporterar en bild, välj en komprimeringsnivå som balanserar kvalitet och filstorlek. För webben vill du hålla bilderna så små som möjligt utan att förlora för mycket kvalitet.
  - I Figma, när du exporterar, kan du justera komprimeringsinställningarna för att minska filstorleken.
  - För JPG och PNG, använd en komprimeringsgrad som ger bra kvalitet men ändå håller filstorleken liten (t.ex. 80-90% komprimering).
  - För WebP, välj det lägsta kvalitetsalternativet som ger ett bra resultat för att få en liten filstorlek.

### 4. Exportera bilder från Figma
- **Välj rätt exportalternativ**:
  - Markera de bilder eller element som du vill exportera.
  - Klicka på "Export" längst ner i panelen. Här kan du välja filformat, upplösning och komprimeringsnivå.
  
  **För högupplösta skärmar (retina)**:
  - Om du skapar bilder för skärmar med hög pixeldensitet (som retinaskärmar), välj att exportera en **2x** version av bilden. Detta säkerställer att bilden ser skarp ut på skärmar med högre upplösning.
  - För att exportera en 2x-bild, välj exportupplösning som `@2x` i Figma-exportinställningarna.

- **Webbexportinställningar**:
  - Exportera bilder i olika storlekar för att stödja responsiv design. Använd till exempel olika storlekar för olika skärmupplösningar, t.ex. 480px, 800px och 1200px bredd beroende på användarens enhet.
  - Exportera bilder med rätt DPI/ PPI-inställningar: För webben räcker 72 DPI, men för tryck behöver du 300 DPI.

### 5. Använd "srcset" för att optimera bilder för olika skärmstorlekar
För att ladda rätt bildstorlek beroende på användarens skärm, använd `srcset` i HTML. Detta gör att din webbsida kan ladda en högupplöst bild på en stor skärm och en mindre bild på en mobil enhet.

```html
<img 
  src="image-480px.jpg" 
  srcset="image-480px.jpg 480w, image-800px.jpg 800w, image-1200px.jpg 1200w" 
  sizes="(max-width: 600px) 480px, (max-width: 1200px) 800px, 1200px" 
  alt="Exempelbild">
```

## Uppgift: Skapa en responsiv bildgalleri-webbplats i Figma

### Syfte:
Denna uppgift syftar till att ge praktisk erfarenhet av att skapa en responsiv design med bilder som optimeras för olika skärmstorlekar och enheter. Du kommer att använda Figma för att skapa och organisera bilder, layout och interaktivitet.

### Steg för uppgiften:

1. **Skapa en ny Figma-fil**:
   - Starta ett nytt projekt i Figma och skapa en artboard för en webbsida (t.ex. 1440x1024 px för desktop).

2. **Skapa en header med navigering**:
   - Skapa en header som innehåller en logotyp, en meny med länkar (hem, galleri, kontakt) och en call-to-action (CTA) knapp.

3. **Designa ett bildgalleri**:
   - Skapa ett valfritt galleri

4. **Anpassa bildstorlekar för responsiv design**:
   - Skapa flera artboards som representerar olika skärmstorlekar (mobil, tablet, desktop).
   - För varje artboard, justera bildstorlekar och layout så att bilderna passar bra på mindre skärmar utan att förlora kvalitet.

5. **Exportera bilder för webben**:
   - Välj rätt filformat (JPG, PNG, eller SVG beroende på bildens innehåll) och exportera bilder för webben med rätt dimensioner och optimering för olika skärmstorlekar.
   - Exportera flera versioner av bilder för att simulera olika upplösningar.
  
6. **Skapa en enkel webbsida där du laddar in dina bilder**:
   - Laborera kring srcset och size för att se om hur dina exporterade bilder behandlas av webbläsaren.
   

### Utvärdering:
- **Användarvänlighet**: Är galleriet enkelt att navigera på både stora och små skärmar?
- **Responsiv design**: Har layouten justerats korrekt för olika skärmstorlekar?
- **Bildoptimering**: Har bilderna rätt storlek och upplösning för att ladda snabbt utan att förlora kvalitet?

