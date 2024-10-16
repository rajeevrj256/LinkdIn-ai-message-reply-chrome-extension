import { HfInference } from "@huggingface/inference";
import dotenv from "dotenv";

dotenv.config();

const inference = new HfInference(process.env.Hugging_face_key);

export const Model = async ({ content }) => {
  try {
    let result = "";
    const prompts = [
      `Respond briefly to this LinkedIn message: '${content}'. Keep it concise, ideally 1-2 sentences.`,
      `Provide a quick reply to this LinkedIn message: '${content}'. Make it short and to the point.`,
      `Draft a short response to this LinkedIn message: '${content}'. Limit it to a couple of sentences.`,
      `Create a polite and succinct reply to this LinkedIn message: '${content}'. Aim for clarity.`,
      `Write a professional response to the LinkedIn message: '${content}'. Make it informative yet brief.`,
      `Compose a friendly and short reply to this LinkedIn message: '${content}'. Be engaging.`,
      `How would you reply to this LinkedIn message: '${content}' in a concise manner?`,
      `Write a brief and courteous response to this LinkedIn message: '${content}'.`,
      `Summarize your reply to this LinkedIn message: '${content}'. Keep it simple.`,
      `What would be an appropriate short response to this LinkedIn message: '${content}'?`,
    ];

    const prompt = prompts[Math.floor(Math.random() * prompts.length)];
    // Loop to stream the completion response chunk by chunk
    for await (const chunk of inference.chatCompletionStream({
      model: "mistralai/Mistral-Nemo-Instruct-2407",
      messages: [{ role: "user", content:prompt}],
      max_tokens: 500,
    })) {
      // Collect the generated text
      const generatedText = chunk.choices[0]?.delta?.content || "";
      result += generatedText;
      process.stdout.write(generatedText);  // Output the chunk
    }

    // You can return the full result if needed elsewhere
    return result;
  } catch (error) {
    console.error("Error generating response from the model:", error);
    return "An error occurred while generating the reply.";
  }
};

//export default Model;
