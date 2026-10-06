// app/api/behandelingen/route.ts
const treatments = [
    { url: "controle", name: "Periodieke controle" },
    { url: "bleken", name: "Tanden bleken" },
    { url: "klacht", name: "Pijn of klacht" },
];

export async function GET() {
    return Response.json({ treatments });
}