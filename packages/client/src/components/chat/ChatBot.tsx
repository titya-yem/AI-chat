import axios from 'axios';
import { useRef, useState } from 'react';
import TypingIndecator from './TypingIndecator';
import type { Message } from './ChatMessages';
import ChatMessages from './ChatMessages';
import ChatInput, { type ChatFormData } from './ChatInput';

type ChatResponse = {
  message: string;
};

const ChatBot = () => {
  // useState to store and manage chat messages
  const [messages, setMessages] = useState<Message[]>([]);
  const [isBotTyping, setIsBotTyping] = useState(false);
  const [error, setError] = useState('');
  // Generate a unique conversation ID for the session
  const conversationId = useRef(crypto.randomUUID());

  const onSubmit = async ({ prompt }: ChatFormData) => {
    try {
      // Append user message to messages array
      // prev is the previous state and we spread it to keep existing messages
      // setMessage updates the state with the new USER message
      setMessages((prev) => [...prev, { content: prompt, role: 'user' }]);
      setIsBotTyping(true);
      setError('');

      const { data } = await axios.post<ChatResponse>('/api/chat', {
        prompt,
        conversationId: conversationId.current,
      });
      // Append chatbot response to messages array
      // setMessage updates the state with the new BOT message
      setMessages((prev) => [...prev, { content: data.message, role: 'bot' }]);
    } catch (error) {
      console.log(error);
      setError('Something went wrong, Please try again later');
    } finally {
      setIsBotTyping(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-col flex-1 gap-3 mb-10 overflow-y-auto">
        <ChatMessages messages={messages} />
        {isBotTyping && <TypingIndecator />}
        {error && <p className="text-red-500">{error}</p>}
      </div>
      <ChatInput onSubmit={onSubmit} />
    </div>
  );
};

export default ChatBot;
