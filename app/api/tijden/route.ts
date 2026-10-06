// app/api/tijden/route.ts
import { isTijdBezet } from "../../../lib/afspraken";

const alleTijden = ["09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "13:30", "14:00", "14:30","15:00", "15:30", "16:00"];

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