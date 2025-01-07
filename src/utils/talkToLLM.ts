import axios from 'axios'

const talkToLLM = async(url: string, data: any, method: string, instructions: any) => {
    try {
        const response = await axios.request({
            method: method,
            headers:{
                "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
                "Content-Type": "application/json"
            },
            url: url,
            data: {
                "model": "google/gemini-2.0-flash-exp:free",
                "messages": [
                    {
                        "role": "system",
                        "content": {
                            "type": "text",
                            "text": instructions
                        }
                    },
                    {
                        "role": "system",
                        "content": {
                            "type": "text",
                            "text": `The following is the user data you will use to generate the projection: ${JSON.stringify(data)}.`
                        }
                    }
                ]
            }
        })

        return response.data;
    } catch (error: any) {
        console.log(error);
        return error;
    }
}

export default talkToLLM;