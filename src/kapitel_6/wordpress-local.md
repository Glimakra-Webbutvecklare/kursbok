# WordPress

I den här guiden installerar du en lokal WordPress-sida med **Local** (tidigare Local by Flywheel). En lokal installation är perfekt för utveckling, test och lärande innan du publicerar sajten online.

## 1. Installera Local

1. Gå till [Local](https://localwp.com/).
2. Klicka på **Download**.
3. Välj operativsystem och fyll i formuläret.
4. Ladda ner installationsfilen och kör installationen.
5. Starta Local när installationen är klar.

## 2. Skapa en ny WordPress-sajt

1. Klicka på **+ Create a new site**.
2. Ange ett namn på sajten, till exempel `min-wp-sajt`.
3. Klicka på **Continue**.

### Välj miljö

Du kan välja:

- **Preferred** (snabbast för nybörjare)
- **Custom** (om du vill styra PHP-version, webbserver och databas)

Välj **Preferred** och klicka på **Continue**.

### Skapa WordPress-användare

1. Ange:
	- **Username** (admin-användare)
	- **Password**
	- **Email**
2. Klicka på **Add Site**.

Local skapar nu en komplett WordPress-installation med databas automatiskt.

## 3. Starta och öppna sajten

När sajten är skapad:

1. Välj sajten i vänstermenyn.
2. Klicka på **Start site** om den inte redan är startad.
3. Klicka på:
	- **Open site** för att se framsidan
	- **WP Admin** för att logga in i adminpanelen

## 4. Logga in i WordPress-admin

1. Öppna **WP Admin**.
2. Logga in med uppgifterna du angav vid skapandet.
3. Verifiera att du ser WordPress-panelen (Dashboard).

## 5. Grundläggande första inställningar

Efter första inloggningen är det bra att direkt göra följande:

1. **Inställningar > Allmänt**
	- Kontrollera titel och tidszon.
2. **Inställningar > Permalänkar**
	- Välj **Inläggsnamn** för snygga URL:er.
3. **Utseende > Teman**
	- Aktivera ett tema du vill arbeta med.
4. **Tillägg > Lägg till nytt**
	- Installera bara tillägg du faktiskt behöver.

## Vanliga problem och lösningar

### Porten är upptagen

Om sajten inte startar kan Local visa att en port redan används.

- Stäng andra program som använder lokal webbserver (t.ex. XAMPP/MAMP).
- Starta om sajten i Local.

### Admin-sidan öppnas inte

- Kontrollera att sajten är **Started** i Local.
- Testa att klicka på **WP Admin** igen.
- Starta om Local om problemet kvarstår.

### Glömt lösenord

- Använd länken **Glömt lösenord?** på inloggningssidan.
- Du kan också uppdatera användaruppgifter via Local om mejl inte fungerar lokalt.

## Sammanfattning

Du har nu:

- Installerat Local
- Skapat en lokal WordPress-sajt
- Loggat in i adminpanelen
- Gjort grundläggande konfiguration

Nästa steg är att skapa sidor/inlägg, testa teman och bygga vidare på din webbplats i en trygg lokal utvecklingsmiljö.


