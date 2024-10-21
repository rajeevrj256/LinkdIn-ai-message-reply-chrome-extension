import axios from 'axios';

// Define the base URL for your backend API
const BASE_URL = 'http://localhost:3000'; // Adjust according to your backend URL

// Define an interface for the API response
interface ApiResponse {
  reply: string; // Adjust this structure based on your actual API response
}

// Function to get a reply from the AI model for a given LinkedIn message
export const getReply = async (messageContent: string): Promise<string> => {
  try {
    const response = await axios.post<ApiResponse>(`${BASE_URL}/generate-reply`, {
      content: messageContent,
    });

    // Return the generated reply from the response
    console.log(response.data.reply);
    return response.data.reply;

  } catch (error) {
    console.error("Error fetching reply from API:", error);
    throw new Error("Failed to generate reply. Please try again later.");
  }
};