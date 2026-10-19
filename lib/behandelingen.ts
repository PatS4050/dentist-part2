export type Behandeling = {
    id: number;
    slug: string;
    title: string;
    subtitle: string;
    button:string;
};

export async function getBehandelingen(): Promise<Behandeling[]> {
    const response = await fetch(
        `${process.env.SUPABASE_URL}/rest/v1/behandelingen?select=*`,
        {
            headers: {
                apikey: process.env.SUPABASE_PUBLISHABLE_KEY!,
            },
            next: {revalidate: 3}, // data maximaal 3 sec oud
        }
    );
// ------ test ----
    console.log("Status:", response.status);
    const data = await response.json();
    console.log("Data:", JSON.stringify(data, null, 2));
// ------ test eind ----

    if (!response.ok) {
        throw new Error("Behandelingen ophalen mislukt");
    }

    return data;
}