"use client";
import {useState, useEffect} from "react";

type AppointmentSelectorProps = {
    // times: string[];
    behandeling: string;
};

export default function AppointmentSelector({ behandeling }: AppointmentSelectorProps) {

    const [times, setTimes] = useState<string[]>([]);
    const [selectedDay, setSelectedDay] = useState<number | null>(null);
    const [selectedTime, setSelectedTime] = useState<string | null>(null);
    const [loading, setLoading] = useState (false);

    useEffect(() => {
        if (selectedDay === null) return;

        async function fetchTimes() {
            setLoading (true);
            const response = await fetch(
                `/api/tijden?behandeling=${behandeling}&datum=2026-09-${String(selectedDay).padStart(2, "0")}`
            );

            const data = await response.json();

            setTimes(data.tijden);
        }

        fetchTimes();
    }, [selectedDay, behandeling]);

    return (
        <div className="card-container">
            <article className="card">
                <h3>Kies een datum</h3>
                <div className="calendar-grid">
                    <span>Ma</span>
                    <span>Di</span>
                    <span>Wo</span>
                    <span>Do</span>
                    <span>Vr</span>

                    {Array.from({length: 20}, (_, index) => {
                        const day = index + 1;
                        return (
                            <span
                                key={day}
                                className={selectedDay === day ? "selected" : ""}
                                onClick={() => setSelectedDay(day)}>
                                    {day}
                            </span>
                        );
                    })} </div>
            </article>
            <article className="card">
                <h3>Kies een tijd</h3>

                {selectedDay && selectedTime && <h3> U heeft gekozen voor {selectedDay} september om {selectedTime}. </h3>}

                {selectedDay ? (
                    <div className="time-list">
                        {times.map((time) => (
                            <button
                                key={time}
                                type="button"
                                className={selectedTime === time ? "selected" : ""}
                                onClick={() => setSelectedTime(time)}>
                                {time}
                            </button>))
                        }
                    </div>) : (<p>Kies eerst een datum.</p>)
                }
            </article>
        </div>);
}