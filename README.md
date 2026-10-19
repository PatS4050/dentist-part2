npm# Opdrachtbeschrijving - deel 2

## Inleiding
In deel 1 heb je de basisstructuur van de website van Tandartspraktijk de Tandenborstel opgezet: routing, nested routes, een dynamic route per behandeling en een interactieve (maar nog volledig statische) kalenderwidget waarmee een bezoeker een datum en tijd kon *selecteren* — zonder dat daar verder iets mee gebeurde.

In deel 2 bouw je deze opdracht verder uit tot een applicatie die daadwerkelijk werkt: de lijst met behandelingen en beschikbare tijden komt niet langer uit een hardcoded array, maar van de server. Een bezoeker kan een afspraak echt vastleggen, en die afspraak wordt serverside opgeslagen. Je gaat hiervoor aan de slag met data fetching, eigen API-endpoints, Server Actions, caching, environment variables en validatie.

> **Belangrijk:** probeer ook in deze opdracht zo min mogelijk direct naar ChatGPT te grijpen. Zoek eerst zelf naar antwoorden in de officiële Next.js-documentatie — met name de hoofdstukken over Route Handlers, Server Actions, Caching en Environment Variables zijn hier relevant.

## Applicatie starten

Dit is een vervolg op je eigen project van deel 1. Zorg dat die opdracht werkt voordat je begint: de navigatie, alle routes, de nested en dynamic route en de kalenderwidget met lokale state moeten al functioneren.

```bash
npm install
npm run dev
```

Open http://localhost:3000 en controleer of je project nog werkt zoals je het in deel 1 hebt opgeleverd.

## Opdrachtbeschrijving

### 1. Voorbereiding

Lees voordat je begint de volgende hoofdstukken van de officiële Next.js-documentatie globaal door:

* Route Handlers and Middleware
* Fetching Data
* Caching and Revalidating
* Server Actions and Mutations
* Environment Variables

Je hoeft ze nog niet uit je hoofd te kennen — het is genoeg als je straks weet waar je moet zoeken.

> Bedenk voordat je verder leest: in deel 1 stond steeds de vraag centraal "moet dit in de browser draaien, of kan dit op de server?" Welke onderdelen van de kalenderwidget uit deel 1 horen volgens jou eigenlijk op de server thuis, en welke horen echt in de browser te blijven?

### 2. Behandelingen ophalen via een eigen endpoint

In deel 1 stond de lijst met behandelingen hardcoded in je dynamic-route-pagina:

```js
const treatments = [
  { url: "controle", name: "Periodieke controle" },
  { url: "bleken", name: "Tanden bleken" },
  { url: "klacht", name: "Pijn of klacht" },
];
```

Verplaats deze array naar een eigen Route Handler op `app/api/behandelingen/route.ts`, die deze data teruggeeft als JSON:

```ts
// app/api/behandelingen/route.ts
const treatments = [
  { url: "controle", name: "Periodieke controle" },
  { url: "bleken", name: "Tanden bleken" },
  { url: "klacht", name: "Pijn of klacht" },
];

export async function GET() {
  return Response.json({ treatments });
}
```

Pas je dynamic-route-pagina (`/afspraken/maken/[behandeling]`) aan zodat deze de behandelingen niet meer uit een lokale array haalt, maar ophaalt bij dit endpoint. Let op: dit blijft een Server Component, dus je kunt de fetch gewoon rechtstreeks in de pagina zelf doen.

Controleer dat de 404-afhandeling nog steeds werkt: wanneer iemand naar `/afspraken/maken/fietsen` gaat, moet dit nog steeds doorverwijzen naar je 404-pagina — ook al komt de lijst met geldige behandelingen nu van een endpoint in plaats van een lokale array.

> Wat is het verschil tussen het rechtstreeks importeren van de `treatments`-array in je pagina (zoals in deel 1) en het ophalen ervan via `fetch()` bij een eigen Route Handler (zoals nu)? Bedenk een situatie waarin dat verschil er echt toe doet.

### 3. Beschikbare tijden per dag

Op dit moment toont de kalenderwidget voor elke dag dezelfde, hardcoded lijst met tijden uit deel 1. In werkelijkheid is niet elk tijdstip op elke dag beschikbaar — tijden die al geboekt zijn, mogen niet nog een keer worden getoond.

Maak een bestand `lib/afspraken.ts` dat, net als een echte database, de afspraken bijhoudt — voorlopig gewoon in een array in het geheugen:

```ts
// lib/afspraken.ts
export type Afspraak = {
  id: number;
  behandeling: string; // de url-slug, bijv. "bleken"
  datum: string;       // bijv. "2026-09-12"
  tijd: string;         // bijv. "10:30"
  naam: string;
  email: string;
};

const afspraken: Afspraak[] = [];
let nextId = 1;

export function getAfspraken(): Afspraak[] {
  return afspraken;
}

export function isTijdBezet(behandeling: string, datum: string, tijd: string): boolean {
  return afspraken.some(
    (a) => a.behandeling === behandeling && a.datum === datum && a.tijd === tijd
  );
}

export function voegAfspraakToe(afspraak: Omit<Afspraak, "id">): Afspraak {
  const nieuw = { id: nextId++, ...afspraak };
  afspraken.push(nieuw);
  return nieuw;
}
```

Maak vervolgens een Route Handler op `app/api/tijden/route.ts` die, gegeven een behandeling en een datum, de volledige tijden-array uit deel 1 teruggeeft *minus* de tijden die al bezet zijn. Gebruik hiervoor de `searchParams` van het `Request`-object:

```ts
// app/api/tijden/route.ts
import { isTijdBezet } from "../../../lib/afspraken";

const alleTijden = ["09:00", "09:30", "10:00", "10:30", "11:00", "11:30"];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const behandeling = searchParams.get("behandeling");
  const datum = searchParams.get("datum");

  if (!behandeling || !datum) {
    return Response.json(
      { error: "behandeling en datum zijn verplicht." },
      { status: 400 }
    );
  }

  const beschikbareTijden = alleTijden.filter(
    (tijd) => !isTijdBezet(behandeling, datum, tijd)
  );

  return Response.json({ tijden: beschikbareTijden });
}
```

Je kalendercomponent is een Client Component (hij houdt tenslotte state bij van de geselecteerde datum). Zorg dat deze component, telkens wanneer een gebruiker een nieuwe datum aanklikt, dit endpoint opnieuw aanroept met een gewone `fetch()` en de getoonde tijden bijwerkt. Toon een duidelijke laadstatus terwijl de tijden worden opgehaald.

> In deel 1 stond de `times`-array *buiten* de component gedeclareerd. Waarom kan dat nu niet meer op dezelfde manier?

### 4. Een afspraak daadwerkelijk vastleggen (Server Action)

Voeg aan de kalenderwidget een bevestigingsknop toe ("Afspraak bevestigen") die verschijnt zodra een datum én tijd zijn gekozen, samen met invoervelden voor naam en e-mailadres.

Maak in `app/afspraken/maken/[behandeling]/actions.ts` een Server Action die de afspraak verwerkt:

```ts
"use server";

import { isTijdBezet, voegAfspraakToe } from "../../../../lib/afspraken";
import { revalidatePath } from "next/cache";

export type AfspraakResultaat =
  | { success: true; afspraak: { datum: string; tijd: string } }
  | { success: false; error: string };

export async function maakAfspraakAction(
  _vorigeStatus: AfspraakResultaat,
  formData: FormData
): Promise<AfspraakResultaat> {
  const behandeling = formData.get("behandeling") as string;
  const datum = formData.get("datum") as string;
  const tijd = formData.get("tijd") as string;
  const naam = formData.get("naam") as string;
  const email = formData.get("email") as string;

  // Validatie hoort hier, niet (alleen) in de browser: een gebruiker kan
  // de client-side controles altijd omzeilen.
  if (!naam || naam.trim().length === 0) {
    return { success: false, error: "Vul uw naam in." };
  }
  if (!email || !email.includes("@")) {
    return { success: false, error: "Vul een geldig e-mailadres in." };
  }
  if (isTijdBezet(behandeling, datum, tijd)) {
    return { success: false, error: "Dit tijdstip is helaas net vergeven. Kies een ander tijdstip." };
  }

  voegAfspraakToe({ behandeling, datum, tijd, naam: naam.trim(), email: email.trim() });

  // De lijst met beschikbare tijden moet na het boeken opnieuw worden
  // opgehaald, anders blijft het net vergeven tijdstip zichtbaar.
  revalidatePath("/afspraken/maken/" + behandeling);

  return { success: true, afspraak: { datum, tijd } };
}
```

Koppel deze Server Action aan je formulier (bijvoorbeeld met `useFormState` uit `react-dom`). Toon bij succes een bevestiging in dezelfde stijl als in deel 1 ("U heeft een afspraak gemaakt voor 12 september om 10:30."), en bij een fout de foutmelding die de Server Action teruggeeft.

> Waarom controleer je `isTijdBezet` hier nog een keer, terwijl de tijd toch al uit een gefilterde lijst kwam die deze tijden niet meer zou moeten bevatten? Bedenk een scenario waarin dit verschil maakt.

### 5. Cachen van de juiste data

Niet alle data in deze applicatie verandert even vaak. Bekijk de twee endpoints die je hebt gebouwd en bepaal voor elk een passende cache-strategie:

* `/api/behandelingen` — de lijst met behandelingen wijzigt zelden.
* `/api/tijden` — de beschikbare tijden veranderen bij elke nieuwe boeking.

Pas de `fetch()`-aanroepen naar deze endpoints aan met de cache-strategie die jij het meest passend vindt (`force-cache`, `no-store`, of `next: { revalidate: ... }`), en onderbouw je keuze in een kort commentaar bij de code.

> Wat zou er (zichtbaar voor een gebruiker) misgaan als je voor `/api/tijden` per ongeluk `force-cache` zou gebruiken?

### 6. Praktijkgegevens en een beveiligde overzichtspagina

De praktijk wil zelf een overzicht kunnen inzien van alle gemaakte afspraken, maar dit overzicht mag natuurlijk niet voor iedereen toegankelijk zijn.

Maak een `.env.local`-bestand (dit bestand commit je niet, het staat al in `.gitignore`) met twee variabelen:

```
ADMIN_SLEUTEL="tandenborstel-demo-2026"
NEXT_PUBLIC_PRAKTIJK_TELEFOONNUMMER="030 - 123 45 67"
```

Gebruik `NEXT_PUBLIC_PRAKTIJK_TELEFOONNUMMER` om het telefoonnummer op de afsprakenpagina te tonen in plaats van dit hardcoded in de JSX te zetten.

Maak vervolgens een pagina op `/admin/afspraken` die:
* alle afspraken uit `lib/afspraken.ts` toont in een tabel (naam, e-mailadres, behandeling, datum, tijd), maar alleen wanneer de bezoeker de juiste sleutel meegeeft, bijvoorbeeld via `/admin/afspraken?sleutel=tandenborstel-demo-2026`;
* een duidelijke melding toont ("Geen toegang") wanneer de sleutel ontbreekt of onjuist is.

Vergelijk hierbij bewust de twee variabelen: waarom gebruik je voor het telefoonnummer wél het `NEXT_PUBLIC_`-voorvoegsel, en voor de sleutel niet?

> Deze manier van beveiligen (een sleutel in de URL) is bewust simpel gehouden voor deze opdracht. Wat zijn de zwaktes hiervan? Wat zou een volgende, betere stap zijn om deze pagina echt te beveiligen?

### 7. Database koppeling (conceptueel)

`lib/afspraken.ts` gedraagt zich in deze opdracht als een piepkleine database: alle Route Handlers en Server Actions die met afspraken werken, praten uitsluitend via de functies in dit bestand met de data, en dit bestand wordt nooit vanuit een Client Component geïmporteerd.

Beantwoord de volgende vragen in een kort tekstblokje (bijvoorbeeld bovenaan je README, of als los antwoordbestand):

> Herstart je development-server. Wat is er met de gemaakte afspraken gebeurd, en waarom?

> Zou het een probleem zijn als `getAfspraken()`, `isTijdBezet()` en `voegAfspraakToe()` ook in een Client Component gebruikt zouden mogen worden? Betrek in je antwoord zowel de `ADMIN_SLEUTEL` als de gegevens van andere bezoekers.

> Wat zou er moeten veranderen aan `lib/afspraken.ts` om dit daadwerkelijk met een relationele database te laten werken in plaats van met een array in het geheugen? Je hoeft dit nog niet te bouwen — een korte beschrijving in eigen woorden is genoeg. (Dit is precies waar de volgende les mee verdergaat.)
