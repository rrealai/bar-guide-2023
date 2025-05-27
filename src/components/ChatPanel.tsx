'use client';

import { useState, useEffect, FormEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Mic, X, Loader2, MessageSquareText } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface ChatPanelProps {
  isOpen: boolean;
  onClose: () => void;
  selectedItemName: string | null;
  initialRecipeText?: string; // Optional: if we want to show recipe before first LLM call
}

interface ChatMessage {
  type: 'user' | 'nacho';
  content: string;
}

export default function ChatPanel({ 
  isOpen,
  onClose,
  selectedItemName,
  initialRecipeText 
}: ChatPanelProps) {
  const [currentQuery, setCurrentQuery] = useState('');
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentLang, setCurrentLang] = useState<'es' | 'en'>('es'); // Default to Spanish

  // Effect to fetch initial explanation when panel opens for a new item
  useEffect(() => {
    if (isOpen && selectedItemName && chatHistory.length === 0) {
      // If there's initial recipe text, display it or a part of it as Nacho's first message
      // Or, directly make the first API call for the selected item explanation
      // For now, let's make the API call immediately.
      fetchNachoResponse(selectedItemName, "", currentLang);
    }
    // Reset history if item changes and panel is already open (or simply rely on panel re-mount)
    // For simplicity, let's assume panel closes and opens for new items, clearing state.
    if (!isOpen) {
        setChatHistory([]);
        setCurrentQuery('');
    }
  }, [isOpen, selectedItemName, currentLang]); // Removed chatHistory from deps to avoid loop

  const fetchNachoResponse = async (itemName: string | null, query: string, lang: 'es' | 'en') => {
    setIsLoading(true);
    if (query) {
      setChatHistory(prev => [...prev, { type: 'user', content: query }]);
    }

    try {
      const response = await fetch('/api/askNacho', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          item: itemName || "", 
          query: query, 
          lang: lang 
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'API request failed');
      }

      const data = await response.json();
      setChatHistory(prev => [...prev, { type: 'nacho', content: data.answer }]);
    } catch (error) {
      console.error("Error fetching Nacho's response:", error);
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
      setChatHistory(prev => [...prev, { type: 'nacho', content: `Error: ${errorMessage}` }]);
    } finally {
      setIsLoading(false);
      setCurrentQuery('');
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!currentQuery.trim() || isLoading) return;
    fetchNachoResponse(selectedItemName, currentQuery, currentLang);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ y: "100%" }}
          animate={{ y: "0%" }}
          exit={{ y: "100%" }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed bottom-0 left-0 right-0 h-[70vh] md:h-[60vh] bg-white border-t border-gray-300 shadow-2xl rounded-t-2xl z-50 flex flex-col overflow-hidden"
          style={{ maxWidth: '100vw' }} // Ensure it does not exceed viewport width on desktop
        >
          {/* Header */}
          <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
            <h2 className="text-xl font-semibold text-primary flex items-center">
              <MessageSquareText size={24} className="mr-2 text-primary"/>
              Nacho Asistente
              {selectedItemName && <span className="text-gray-500 font-normal ml-2 text-lg">- {selectedItemName}</span>}
            </h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
              <X size={24} />
            </button>
          </div>

          {/* Chat History */}
          <div className="flex-grow p-4 overflow-y-auto space-y-4 bg-gray-100/50">
            {chatHistory.map((msg, index) => (
              <div key={index} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div 
                  className={`max-w-[80%] p-3 rounded-xl shadow ${msg.type === 'user' ? 'bg-primary text-white' : 'bg-gray-200 text-gray-800'}`}
                >
                  {msg.type === 'nacho' ? (
                    <ReactMarkdown 
                      components={{
                        h3: ({node, ...props}) => <h3 className="text-lg font-semibold mt-2 mb-1 text-primary" {...props} />,
                        ul: ({node, ...props}) => <ul className="list-disc list-inside ml-2 mb-2" {...props} />,
                        ol: ({node, ...props}) => <ol className="list-decimal list-inside ml-2 mb-2" {...props} />,
                        li: ({node, ...props}) => <li className="mb-1" {...props} />,
                        p: ({node, ...props}) => <p className="mb-2 last:mb-0" {...props} />,
                      }}
                    >
                      {msg.content}
                    </ReactMarkdown>
                  ) : (
                    msg.content
                  )}
                </div>
              </div>
            ))}
            {isLoading && chatHistory.length > 0 && (
              <div className="flex justify-start">
                <div className="max-w-[80%] p-3 rounded-lg bg-gray-200 text-gray-800 flex items-center">
                  <Loader2 className="animate-spin h-5 w-5 mr-2" />
                  Nacho está pensando...
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="p-4 border-t border-gray-200 bg-gray-50">
            <form onSubmit={handleSubmit} className="flex items-center space-x-2">
              <input 
                type="text"
                value={currentQuery}
                onChange={(e) => setCurrentQuery(e.target.value)}
                placeholder={selectedItemName ? `Pregunta sobre ${selectedItemName}...` : "Escribe tu pregunta..."}
                className="flex-grow p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                disabled={isLoading}
              />
              <button 
                type="button" 
                className="p-3 text-gray-600 hover:text-primary disabled:text-gray-300 focus:outline-none"
                // onClick={() => alert("Voice input not implemented yet")}
                disabled={isLoading}
              >
                <Mic size={24} />
              </button>
              <button 
                type="submit"
                className="p-3 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:bg-primary/50 focus:outline-none flex items-center justify-center w-12 h-12"
                disabled={isLoading || !currentQuery.trim()}
              >
                {isLoading ? <Loader2 className="animate-spin h-5 w-5" /> : <Send size={24} />}
              </button>
            </form>
             {/* Language toggle - basic example */}
            <div className="mt-2 text-right">
                <button onClick={() => setCurrentLang(lang => lang === 'es' ? 'en' : 'es')} className="text-xs text-gray-500 hover:text-primary">
                    {currentLang === 'es' ? 'Switch to English' : 'Cambiar a Español'}
                </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
} 