import fs from 'fs';
import path from 'path';
import { conversationRepositories } from '../repositories/conversation.repositories';
import OpenAI from 'openai';
import template from '../prompt/chatbot.txt';

// Implementation detail
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const parkInfo = fs.readFileSync(
  path.join(__dirname, '../', 'prompt', 'WonderWorld.md'),
  'utf-8'
);
const instructions = template.replace('{{parkInfo', parkInfo);

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
      instructions,
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
