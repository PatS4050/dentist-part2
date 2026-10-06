import { getAfspraken } from "@/lib/afspraken";

export default async function AfsprakenPage({
                                                searchParams,
                                            }: {
    searchParams: Promise<{ sleutel?: string }>;
}) {
    const params = await searchParams;
    const sleutel = params.sleutel;

    if (sleutel !== process.env.ADMIN_SLEUTEL) {
        return (
            <main>
                <h1>Geen toegang</h1>
                <p>Je hebt geen geldige sleutel opgegeven.</p>
            </main>
        );
    }
    const afspraken = getAfspraken();

    return (
        <main>
            <h1>Alle afspraken</h1>

            <table>
                <thead>
                <tr>
                    <th>Naam</th>
                    <th>E-mailadres</th>
                    <th>Behandeling</th>
                    <th>Datum</th>
                    <th>Tijd</th>
                </tr>
                </thead>

                <tbody>
                {afspraken.map((afspraak, index) => (
                    <tr key={index}>
                        <td>{afspraak.naam}</td>
                        <td>{afspraak.email}</td>
                        <td>{afspraak.behandeling}</td>
                        <td>{afspraak.datum}</td>
                        <td>{afspraak.tijd}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </main>
    );
}