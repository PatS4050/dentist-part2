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