import {notFound} from "next/navigation";
import AppointmentPicker from "@/components/AppointmentSelector";
import AppointmentSelector from "@/components/AppointmentSelector";

type PageProps = {
    params: Promise<{
        behandeling: string;
    }>;
};

// const times = ["09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "13:30", "14:00", "14:30","15:00", "15:30", "16:00"];

// const treatments = [
//     {url: 'controle', name: 'Periodieke controle'},
//     {url: 'bleken', name: 'Tanden bleken'},
//     {url: 'klacht', name: 'Pijn of klacht'},
// ]git add

export default async function TreatmentPage({params}: PageProps) {

    const response = await fetch("http://localhost:3000/api/behandelingen");
// const response = await fetch("/api/behandelingen"); werkt blijkbaar niet
    const data = await response.json();
    const treatments = data.treatments;
    const {behandeling} = await params;

    const appointmentType = treatments.find(treatment => treatment.url === behandeling);

    if (!appointmentType) {
        notFound();
    }

    return (
        <main className="page-container">
            <h1>Afspraak maken</h1>

            <section className="intro">
                <h2>Behandeling: {appointmentType.name}</h2>

                <p>
                    U wilt een afspraak maken voor de behandeling <strong>{appointmentType.name}</strong>.
                </p>
            </section>

            <AppointmentSelector behandeling={behandeling}/>

            {/*<section className="card-container">*/}
            {/*    <article className="card">*/}
            {/*        <h2>Kies een datum</h2>*/}

            {/*        <div className="calendar-grid">*/}
            {/*            <span>Ma</span>*/}
            {/*            <span>Di</span>*/}
            {/*            <span>Wo</span>*/}
            {/*            <span>Do</span>*/}
            {/*            <span>Vr</span>*/}

            {/*            {Array.from({length: 29}, (item, index) => (*/}
            {/*                <span key={index}>{index + 1}</span>*/}
            {/*            ))}*/}
            {/*        </div>*/}
            {/*    </article>*/}

            {/*    <article className="card calendar">*/}
            {/*        <h2>Kies een tijd</h2>*/}

            {/*        <div className="time-list">*/}
            {/*            <button>09:00</button>*/}
            {/*            <button>09:30</button>*/}
            {/*            <button>10:30</button>*/}
            {/*            <button>11:00</button>*/}
            {/*            <button>11:30</button>*/}
            {/*            <button>13:30</button>*/}
            {/*            <button>14:30</button>*/}
            {/*            <button>15:00</button>*/}
            {/*            <button>15:30</button>*/}
            {/*        </div>*/}
            {/*    </article>*/}
            {/*</section>*/}
        </main>
    );
}