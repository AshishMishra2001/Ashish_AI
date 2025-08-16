// // src/app/page.tsx
// 'use client'; // This directive tells Next.js this is a client-side component

// import { useState, FormEvent, useRef, useEffect } from 'react';
// import Linkify from 'react-linkify'; // The library for making links clickable

// // Define the structure of a message object
// interface Message {
//   text: string;
//   isUser: boolean;
// }

// export default function ChatPage() {
//   // State to hold the list of messages
//   const [messages, setMessages] = useState<Message[]>([]);
//   // State for the user's current input
//   const [input, setInput] = useState('');
//   // State to track if the AI is thinking
//   const [isLoading, setIsLoading] = useState(false);
//   // Ref to the chat container for auto-scrolling
//   const chatContainerRef = useRef<HTMLDivElement>(null);

//   // Effect to scroll to the bottom of the chat when messages change
//   useEffect(() => {
//     chatContainerRef.current?.scrollTo({ top: chatContainerRef.current.scrollHeight, behavior: 'smooth' });
//   }, [messages]);

//   // Function to handle form submission
//   const handleSubmit = async (e: FormEvent) => {
//     e.preventDefault();
//     if (!input.trim() || isLoading) return;

//     const userMessage: Message = { text: input, isUser: true };
//     setMessages((prev) => [...prev, userMessage]); // Add user message to chat
//     setInput(''); // Clear input field
//     setIsLoading(true); // Set loading state to true

//     try {
//       // Send the user's message to our backend API
//       const res = await fetch('/api/chat', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ message: input }),
//       });

//       if (!res.ok) throw new Error('API request failed');

//       const data = await res.json();
//       const aiMessage: Message = { text: data.response, isUser: false };
//       setMessages((prev) => [...prev, aiMessage]); // Add AI response to chat

//     } catch (error) {
//       console.error(error);
//       // Show an error message in the chat
//       const errorMessage: Message = { text: "Sorry, I'm having a little trouble thinking right now. Please try again later.", isUser: false };
//       setMessages((prev) => [...prev, errorMessage]);
//     } finally {
//       setIsLoading(false); // Set loading state to false
//     }
//   };

//   return (
//     <div className="flex flex-col h-screen bg-gray-900 text-white font-sans">
//       <header className="bg-gray-800 p-4 shadow-md">
//         <h1 className="text-2xl font-bold text-center">Chat with Ashish-AI</h1>
//       </header>

//       <main ref={chatContainerRef} className="flex-grow overflow-y-auto p-4 space-y-4">
//         {messages.map((msg, index) => (
//           <div key={index} className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}>
//             {/* === CHANGE START === */}
//             <p className={`max-w-lg p-3 rounded-2xl break-words ${msg.isUser ? 'bg-blue-600 rounded-br-none' : 'bg-gray-700 rounded-bl-none'}`}>
//               <Linkify componentDecorator={(decoratedHref, decoratedText, key) => (
//                   <a href={decoratedHref} key={key} target="_blank" rel="noopener noreferrer" className="text-blue-300 hover:underline">
//                     {decoratedText}
//                   </a>
//                 )}>
//                 {msg.text}
//               </Linkify>
//             </p>
//             {/* === CHANGE END === */}
//           </div>
//         ))}
//         {isLoading && (
//           <div className="flex justify-start">
//               <p className="max-w-lg p-3 rounded-2xl bg-gray-700 rounded-bl-none animate-pulse">
//                 Thinking...
//               </p>
//           </div>
//         )}
//       </main>

//       <footer className="p-4 bg-gray-800">
//         <form onSubmit={handleSubmit} className="flex items-center space-x-2">
//           <input
//             type="text"
//             value={input}
//             onChange={(e) => setInput(e.target.value)}
//             className="flex-grow p-3 rounded-full bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
//             placeholder="Ask me anything about my work, hobbies, or thoughts..."
//             disabled={isLoading}
//           />
//           <button type="submit" className="bg-blue-600 text-white font-bold py-3 px-5 rounded-full hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed" disabled={isLoading}>
//             Send
//           </button>
//         </form>
//       </footer>
//     </div>
//   );
// }


// src/app/page.tsx
'use client'; 

import { useState, FormEvent, useRef, useEffect } from 'react';
import Linkify from 'react-linkify';

interface Message {
  text: string;
  isUser: boolean;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatContainerRef.current?.scrollTo({ top: chatContainerRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

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

  // --- vvv THIS IS THE NEW, PROFESSIONAL LAYOUT vvv ---
  return (
    // Main container with the aurora background
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white font-sans p-4 relative overflow-hidden">
      
      {/* The animated aurora background element */}
      <div className="absolute top-1/2 left-1/2 w-[1400px] h-[1400px] -translate-x-1/2 -translate-y-1/2 rounded-full aurora-background opacity-30"></div>

      {/* The content container that sits on top of the background */}
      <div className="w-full max-w-3xl mx-auto flex flex-col h-[90vh] z-10">
        
        {/* Step 1: The new, polished header */}
        <header className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400">
            Ashish AI
          </h1>
          <p className="text-lg text-gray-400 mt-2">
            A Conversation with my Digital Twin, powered by Gemini.
          </p>
        </header>

        {/* Step 2: The contained chat window */}
        <div className="flex-grow bg-black/30 backdrop-blur-md rounded-2xl shadow-2xl border border-gray-700 flex flex-col">
          
          {/* The scrollable message area */}
          <main ref={chatContainerRef} className="flex-grow overflow-y-auto p-6 space-y-6">
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
            {isLoading && (
              <div className="flex justify-start">
                  <div className="max-w-lg p-4 rounded-2xl bg-gray-800 rounded-bl-none animate-pulse">
                    Thinking...
                  </div>
              </div>
            )}
          </main>

          {/* Step 3: The polished input form */}
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
              <button type="submit" className="bg-blue-600 text-white font-bold py-3 px-6 rounded-full hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed transition-colors duration-300" disabled={isLoading}>
                Send
              </button>
            </form>
          </footer>
        </div>
      </div>
    </div>
  );
}