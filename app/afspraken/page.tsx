import Header from "@/components/Header";
import Link from "next/link";
import {getBehandelingen} from "@/lib/behandelingen";

export default async function MakeAppointment() {
    const behandelingen = await getBehandelingen();

    return (
        <main className="page-container">
            <Header icon="/logo.svg" title="Afspraak maken"/>

            <section className="intro">
                <h2>Kies een behandeling</h2>
                <p>
                    Selecteer hieronder de behandeling waarvoor u een afspraak wilt maken.
                    Daarna kiest u een datum en een tijd.
                </p>
            </section>

            <section className="card-container">
                {behandelingen.map((behandeling) => (
                    <article className="card" key={behandeling.id}>
                        <h3>{behandeling.title}</h3>
                        <p>{behandeling.subtitle}</p>
                        <Link
                            href={`/afspraken/maken/${behandeling.slug}`}
                            className="link-button"
                        >
                            Maak een afspraak
                        </Link>
                    </article>
                ))}
            </section>
        </main>
    );
}