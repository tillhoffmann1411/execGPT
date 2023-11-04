import createMessage from './createMessage';

export async function POST(request: Request) {
    const res = await request.json();
    try {
        const analyis = await createMessage(res.message, res.data);
        const message = analyis.choices[0].message;
        return Response.json({ message });
    } catch (error) {
        console.error('Error by creating analysis: ', error);
        return new Response(JSON.stringify(error), { status: 500 });
    }
};
