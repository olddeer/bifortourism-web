import axios from "axios";
import {API_KEY} from "../../config";
 // Replace with your OpenAI API key
const CHAT_GPT_URL = "https://api.openai.com/v1/chat/completions";

export const createTitleAndDescription = async (dimensions, measures) => {
    const prompt = `
You are a chatbot in a collaborative BI app. Based on the given dimensions and measures, generate a title and description. 
- Dimensions: ${dimensions.join(", ") || "none"}
- Measures: ${measures.join(", ") || "none"}.
Create something concise, professional, and relevant.`;

    try {
        const response = await axios.post(
            CHAT_GPT_URL,
            {
                model: "gpt-4", // Use "gpt-4" or "gpt-3.5-turbo" depending on your subscription
                messages: [
                    { role: "system", content: "You are a helpful assistant." },
                    { role: "user", content: prompt }
                ]
            },
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${API_KEY}`
                }
            }
        );

        const reply = response.data.choices[0].message.content;
        return reply;
    } catch (error) {
        throw new Error(`Failed to generate title and description: ${error.response?.data?.error?.message || error.message}`);
    }
};
export const searchByAlreadyCreated = async (description, objects) => {
    const prompt = `
You are a chatbot in a collaborative BI app. Based on the given description and provided objects, that have dimension, measure and description find most relevant object. 
- Description: ${description}
- Objects: ${JSON.stringify(objects)}.
Chat should return only title and description of the object. 
Choose something relevant.`;

    try {
        const response = await axios.post(
            CHAT_GPT_URL,
            {
                model: "gpt-4", // Use "gpt-4" or "gpt-3.5-turbo" depending on your subscription
                messages: [
                    { role: "system", content: "You are a helpful assistant." },
                    { role: "user", content: prompt }
                ]
            },
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${API_KEY}`
                }
            }
        );

        const reply = response.data.choices[0].message.content;
        return reply;
    } catch (error) {
        throw new Error(`Failed to generate title and description: ${error.response?.data?.error?.message || error.message}`);
    }
};
