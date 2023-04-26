import { Configuration, OpenAIApi, ChatCompletionRequestMessage } from "openai";
import config from "./config";

const configuration = new Configuration({
    apiKey: config().OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

export async function sendChatCompletionUser(messages: Array<ChatCompletionRequestMessage>) {
    try {  
        const completion = await openai.createChatCompletion({
            model: "gpt-3.5-turbo-0301",
            messages: messages,
            max_tokens: 40
        });

        return completion.data.choices[0].message?.content;
    } catch (error: any) {
        if (error.response) {
            console.log(error.response.status);
            console.log(error.response.data);
        } else {
            console.log(error.message);
        }
    }
}

export async function sendChatCompletionSystem(message: string) {
    try {
        const completion = await openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: "system",
                    content: message
                }
            ],
        });
        return completion.data.choices[0].message?.content;
    } catch (error: any) {
        if (error.response) {
            console.log(error.response.status);
            console.log(error.response.data);
        } else {
            console.log(error.message);
        }
    }
} 