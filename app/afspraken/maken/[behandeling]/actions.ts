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