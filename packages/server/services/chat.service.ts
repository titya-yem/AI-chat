import fs from 'fs';
import path from 'path';
import { conversationRepositories } from '../repositories/conversation.repositories';
import template from '../prompt/chatbot.txt';
import { llmClient } from '../llm/client';

const parkInfo = fs.readFileSync(
  path.join(__dirname, '../', 'prompt', 'WonderWorld.md'),
  'utf-8'
);
const instructions = template.replace('{{parkInfo}}', parkInfo);

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
    const response = await llmClient.generateText({
      model: 'gpt-4o-mini',
      instructions,
      prompt,
      temperature: 0.2,
      maxTokens: 200,
      previousResponsseId:
        conversationRepositories.getLastResponseId(conversationId),
    });

    conversationRepositories.setLastResponseId(conversationId, response.id);

    return {
      id: response.id,
      message: response.text,
    };
  },
};
