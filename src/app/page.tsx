
// src/app/page.tsx
'use client'; 

import { useState, FormEvent, useRef, useEffect } from 'react';
import Linkify from 'react-linkify';
// Step 1: Import the icons you want to use
import { FaLinkedin, FaGithub, FaEnvelope, FaInstagram, FaFacebook } from 'react-icons/fa6';

interface Message {
  text: string;
  isUser: boolean;
}

// Step 2: Define your prompt suggestions
const promptSuggestions = [
  "What is your M.Tech research about?",
  "Tell me about the DoctorHunt project.",
  "What are your main technical skills?",
  "What are your hobbies?",
];

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      text: "Hi there! I&apos;m Ashish&apos;s AI persona. Feel free to ask me anything about his skills, projects, or experience. I&apos;m here to help!.",
      isUser: false
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatContainerRef.current?.scrollTo({ top: chatContainerRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  // Step 3: Create a function to handle suggestion clicks
  const handleSuggestionClick = (prompt: string) => {
    setInput(prompt);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { text: input, isUser: true };
    setMessages((prev) => [...prev, userMessage]); 
    setInput('');
    setIsLoading(true); 

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input }),
      });

      if (!res.ok) throw new Error('API request failed');

      const data = await res.json();
      const aiMessage: Message = { text: data.response, isUser: false };
      setMessages((prev) => [...prev, aiMessage]);

    } catch (error) {
      console.error(error);
      const errorMessage: Message = { text: "Sorry, I'm having a little trouble thinking right now. Please try again later.", isUser: false };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false); 
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white font-sans p-4 relative overflow-hidden">
      
      <div className="absolute top-1/2 left-1/2 w-[1400px] h-[1400px] -translate-x-1/2 -translate-y-1/2 rounded-full aurora-background opacity-30"></div>

      {/* Main container for all content */}
      <div className="w-full max-w-3xl mx-auto flex flex-col h-[90vh] z-10">
        
        <header className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400">
            Ashish's AI
          </h1>
          <p className="text-lg text-gray-400 mt-2">
            A Conversation with my Digital Twin.
          </p>
        </header>

        <div className="flex-grow bg-black/30 backdrop-blur-md rounded-2xl shadow-2xl border border-gray-700 flex flex-col overflow-hidden">
          
          <main ref={chatContainerRef} className="flex-grow min-h-0 overflow-y-auto p-6 space-y-6">
            {messages.map((msg, index) => (
              <div key={index} className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-lg p-4 rounded-2xl break-words text-base leading-relaxed ${msg.isUser ? 'bg-blue-600 rounded-br-none' : 'bg-gray-800 rounded-bl-none'}`}>
                  <Linkify componentDecorator={(decoratedHref, decoratedText, key) => (
                      <a href={decoratedHref} key={key} target="_blank" rel="noopener noreferrer" className="text-blue-300 hover:underline">
                        {decoratedText}
                      </a>
                    )}>
                    {msg.text}
                  </Linkify>
                </div>
              </div>
            ))}

            {/* Step 4: Conditionally render prompt suggestions */}
            {messages.length === 1 && !isLoading && (
              <div className="flex flex-col items-center animate-fade-in">
                <p className="text-gray-400 mb-4">Or try one of these prompts:</p>
                <div className="flex flex-wrap justify-center gap-2">
                  {promptSuggestions.map((prompt) => (
                    <button
                      key={prompt}
                      onClick={() => handleSuggestionClick(prompt)}
                      className="bg-gray-800/50 hover:bg-gray-700/70 text-sm text-gray-200 px-4 py-2 rounded-full transition-colors duration-300"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {isLoading && (
              <div className="flex justify-start">
                <div className="max-w-lg p-4 rounded-2xl bg-gray-800 rounded-bl-none flex items-center space-x-2">
                  <span className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></span>
                  <span className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                  <span className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
                </div>
              </div>
            )}
          </main>

          <footer className="p-4 bg-black/20 border-t border-gray-700 rounded-b-2xl">
            <form onSubmit={handleSubmit} className="flex items-center space-x-4">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-grow p-3 rounded-full bg-gray-800 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                placeholder="Ask me anything..."
                disabled={isLoading}
              />
              <button 
                type="submit" 
                className="bg-blue-600 text-white p-3 rounded-full hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed transition-colors duration-300 flex-shrink-0" 
                disabled={isLoading}
                aria-label="Send message"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                  <path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" />
                </svg>
              </button>
            </form>
          </footer>
        </div>
        
        {/* Step 5: The new social links footer */}
        <div className="text-center mt-8">
          <p className="text-gray-500 mb-4">Connect with me</p>
          <div className="flex justify-center items-center space-x-6">
            <a href="https://www.linkedin.com/in/ashish---mishra/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn Profile" className="text-gray-400 hover:text-white transition-colors duration-300">
              <FaLinkedin size={24} />
            </a>
            <a href="https://github.com/AshishMishra2001" target="_blank" rel="noopener noreferrer" aria-label="GitHub Profile" className="text-gray-400 hover:text-white transition-colors duration-300">
              <FaGithub size={24} />
            </a>
            <a href="mailto:amishra8094@gmail.com" aria-label="Send an Email" className="text-gray-400 hover:text-white transition-colors duration-300">
              <FaEnvelope size={24} />
            </a>
            <a href="https://www.instagram.com/ashishmishra_official/" target="_blank" rel="noopener noreferrer" aria-label="Instagram Profile" className="text-gray-400 hover:text-white transition-colors duration-300">
              <FaInstagram size={24} />
            </a>
            <a href="https://www.facebook.com/profile.php?id=100008701507702/" target="_blank" rel="noopener noreferrer" aria-label="Facebook Profile" className="text-gray-400 hover:text-white transition-colors duration-300">
              <FaFacebook size={24} />
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}