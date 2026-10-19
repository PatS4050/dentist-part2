import Header from "@/components/Header";
import Link from "next/link";
import {getBehandelingen} from "@/lib/behandelingen";


export default async function MakeAppointment() {
    const behandelingen = await getBehandelingen();
    return (
        <main className="page-container">
            <Header
                icon="/logo.svg"
                title="Afspraak maken"
            />

            <section className="intro">
                <h2>Plan uw afspraak</h2>
                <p>
                    Fijn dat u een afspraak wilt maken bij Tandartspraktijk de
                    Tandenborstel. Kies hieronder waarvoor u een afspraak wilt maken.
                </p>
            </section>

            <section className="card-container">
                {/*<article className="card">*/}
                {/*    <h3>Periodieke controle</h3>*/}
                {/*    <p>*/}
                {/*        Tijdens een controle bekijkt de tandarts uw tanden en*/}
                {/*        tandvlees. We controleren of er gaatjes of andere problemen*/}
                {/*        zijn.*/}
                {/*    </p>*/}
                {/*    <Link*/}
                {/*        href="/afspraken/maken/controle"*/}
                {/*        className="link-button"*/}
                {/*    >*/}
                {/*        Plan periodieke controle*/}
                {/*    </Link>*/}
                {/*</article>*/}

                {/*<article className="card">*/}
                {/*    <h3>Tanden bleken</h3>*/}
                {/*    <p>*/}
                {/*        Wilt u meer informatie of een afspraak maken voor het bleken*/}
                {/*        van uw tanden?*/}
                {/*    </p>*/}
                {/*    <Link*/}
                {/*        href="/afspraken/maken/bleken"*/}
                {/*        className="link-button"*/}
                {/*    >*/}
                {/*        Maak bleekafspraak*/}
                {/*    </Link>*/}
                {/*</article>*/}

                {behandelingen.map((behandeling) => (
                    <article className="card" key={behandeling.id}>
                        <h3>{behandeling.title}</h3>
                        <p>{behandeling.subtitle}</p>
                        <Link
                            href={`/afspraken/maken/${behandeling.slug}`}
                            className="link-button"
                        >
                            {behandeling.button}
                        </Link>
                    </article>
                ))}
            </section>

            {/*<section className="card-container">*/}
            {/*    <article className="card">*/}
            {/*        <h3>Pijn of klacht</h3>*/}
            {/*        <p>*/}
            {/*            Staat uw behandeling er niet tussen? Heeft u pijn of andere klachten die beoordeeld moeten worden? Neem dan contact met ons op. We helpen u graag verder.*/}
            {/*        </p>*/}
            {/*        <Link*/}
            {/*            href="/afspraken/maken/klacht"*/}
            {/*            className="link-button"*/}
            {/*        >*/}
            {/*            Neem contact op*/}
            {/*        </Link>*/}
            {/*    </article>*/}
            {/*</section>*/}

            <section className="box info-box">
                <h3>Wat gebeurt er daarna?</h3>
                <p>
                    Nadat u uw behandeling heeft gekozen, kunt u een geschikt moment
                    selecteren. In deze oefening is het vervolg nog niet uitgewerkt.
                </p>
            </section>
        </main>
    );
}