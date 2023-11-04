
const getMsgString = (msg: string, data: { [key: string]: string | number }[]) => {
    return msg
        + `\n \n give your response in json without any formating and start with a 'title' which describe the data and a 'overview' which gives some key take aways about the data. Put your results in the 'data' property as an array. \n`
        + '\n \n Here is the data in json format: \n'
        + JSON.stringify(data, null, 2)
}

export default async function createMessage(message: string, data: { [key: string]: string | number }[]) {
    const apiKey = process.env.OPENAI_API_KEY
    const url = 'https://api.openai.com/v1/chat/completions'

    const body = JSON.stringify({
        messages: [
            {
                role: 'system',
                content: 'You are an expert data scientist and you have to help a executive manager to analyze the data and give key insights for a presentation.',
            },
            {
                role: 'user',
                content: 'Hi, I am an executive manager and I need your help to analyze the data and give key insights for a presentation.',
            },
            {
                role: 'user',
                content: getMsgString(message, data),
            },
        ],
        model: 'gpt-3.5-turbo',
        stream: false,
    })

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiKey}`,
        },
        body,
    })
    if (!response.ok) {
        throw new Error(`OpenAI API returned HTTP error ${response.status}`);
    }
    const responseData = await response.json()
    return responseData;
}