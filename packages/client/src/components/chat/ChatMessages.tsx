import { useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';

export type Message = {
  content: string;
  role: 'user' | 'bot';
};

type Props = {
  messages: Message[];
};

const ChatMessages = ({ messages }: Props) => {
  const lastMessageRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    lastMessageRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const onCopyMessage = (event: React.ClipboardEvent) => {
    // Custom copy handler to copy only selected text without extra white spaces
    // window.getSelection() retrieves the selected text
    const selection = window.getSelection()?.toString().trim();
    if (selection) {
      // Prevent the default copy behavior
      event.preventDefault();
      // Set the clipboard data to the selected text
      // 'text/plain' specifies the MIME type of the data being set
      event.clipboardData.setData('text/plain', selection);
    }
  };

  return (
    <div className="flex flex-col gap-3">
      {messages.map((message, index) => (
        <div
          key={index}
          onCopy={onCopyMessage}
          ref={index === messages.length - 1 ? lastMessageRef : null}
          className={`px-3 py-1 rounedd-xl ${message.role === 'user' ? 'bg-blue-600 text-white self-end' : 'bg-gray-100 text-black self-start'}`}
        >
          <ReactMarkdown>{message.content}</ReactMarkdown>
        </div>
      ))}
    </div>
  );
};

export default ChatMessages;
