import { conversationRepositories } from '../repositories/conversation.repositories';
import OpenAI from 'openai';

// Implementation detail
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

type ChatResponse = {
  id: string;
  message: string;
};

// Public interface
export const chatService = {
  async sendMessage(
    prompt: string,
    conversationId: string
  ): Promise<ChatResponse> {
    const response = await client.responses.create({
      model: 'gpt-4o-mini',
      input: prompt,
      temperature: 0.2,
      max_output_tokens: 200,
      previous_response_id:
        conversationRepositories.getLastResponseId(conversationId),
    });

    conversationRepositories.setLastResponseId(conversationId, response.id);

    return {
      id: response.id,
      message: response.output_text,
    };
  },
};
