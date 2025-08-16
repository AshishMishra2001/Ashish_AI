// src/app/page.tsx
'use client'; // This directive tells Next.js this is a client-side component

import { useState, FormEvent, useRef, useEffect } from 'react';
import Linkify from 'react-linkify'; // The library for making links clickable

// Define the structure of a message object
interface Message {
  text: string;
  isUser: boolean;
}

export default function ChatPage() {
  // State to hold the list of messages
  const [messages, setMessages] = useState<Message[]>([]);
  // State for the user's current input
  const [input, setInput] = useState('');
  // State to track if the AI is thinking
  const [isLoading, setIsLoading] = useState(false);
  // Ref to the chat container for auto-scrolling
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Effect to scroll to the bottom of the chat when messages change
  useEffect(() => {
    chatContainerRef.current?.scrollTo({ top: chatContainerRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  // Function to handle form submission
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { text: input, isUser: true };
    setMessages((prev) => [...prev, userMessage]); // Add user message to chat
    setInput(''); // Clear input field
    setIsLoading(true); // Set loading state to true

    try {
      // Send the user's message to our backend API
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input }),
      });

      if (!res.ok) throw new Error('API request failed');

      const data = await res.json();
      const aiMessage: Message = { text: data.response, isUser: false };
      setMessages((prev) => [...prev, aiMessage]); // Add AI response to chat

    } catch (error) {
      console.error(error);
      // Show an error message in the chat
      const errorMessage: Message = { text: "Sorry, I'm having a little trouble thinking right now. Please try again later.", isUser: false };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false); // Set loading state to false
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white font-sans">
      <header className="bg-gray-800 p-4 shadow-md">
        <h1 className="text-2xl font-bold text-center">Chat with Ashish-AI</h1>
      </header>

      <main ref={chatContainerRef} className="flex-grow overflow-y-auto p-4 space-y-4">
        {messages.map((msg, index) => (
          <div key={index} className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}>
            {/* === CHANGE START === */}
            <p className={`max-w-lg p-3 rounded-2xl break-words ${msg.isUser ? 'bg-blue-600 rounded-br-none' : 'bg-gray-700 rounded-bl-none'}`}>
              <Linkify componentDecorator={(decoratedHref, decoratedText, key) => (
                  <a href={decoratedHref} key={key} target="_blank" rel="noopener noreferrer" className="text-blue-300 hover:underline">
                    {decoratedText}
                  </a>
                )}>
                {msg.text}
              </Linkify>
            </p>
            {/* === CHANGE END === */}
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
              <p className="max-w-lg p-3 rounded-2xl bg-gray-700 rounded-bl-none animate-pulse">
                Thinking...
              </p>
          </div>
        )}
      </main>

      <footer className="p-4 bg-gray-800">
        <form onSubmit={handleSubmit} className="flex items-center space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-grow p-3 rounded-full bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Ask me anything about my work, hobbies, or thoughts..."
            disabled={isLoading}
          />
          <button type="submit" className="bg-blue-600 text-white font-bold py-3 px-5 rounded-full hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed" disabled={isLoading}>
            Send
          </button>
        </form>
      </footer>
    </div>
  );
}