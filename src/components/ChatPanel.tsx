"use client";

import { useState, useEffect } from 'react';
import { Item, ChatMessage } from '@/types';
import ReactMarkdown from 'react-markdown';
import { Send, X, Loader2, MessageSquareText } from 'lucide-react';

interface ChatPanelProps {
  item: Item | null;
  onClose: () => void;
}

export default function ChatPanel({ item, onClose }: ChatPanelProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentItemName, setCurrentItemName] = useState<string | null>(null);

  const handleInitialQuery = async () => {
    if (!item) return;
    
    setIsLoading(true);
    try {
      const response = await fetch('/api/askNacho', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          item: item.name,
          query: '',
          lang: 'es',
          history: []
        })
      });

      if (!response.ok) {
        throw new Error('Error en la respuesta del servidor');
      }

      const data = await response.json();
      setMessages([{ role: 'assistant', content: data.response }]);
    } catch (error) {
      console.error('Error:', error);
      setMessages([{ 
        role: 'assistant', 
        content: 'Lo siento, hubo un error al conectar con Nacho. Por favor intenta de nuevo.' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (item) {
      if (currentItemName !== item.name) {
        setMessages([]);
        setQuery('');
        setCurrentItemName(item.name);
        setTimeout(() => {
          handleInitialQuery();
        }, 0);
      }
    } else {
      setMessages([]);
      setQuery('');
      setCurrentItemName(null);
    }
  }, [item]);

  useEffect(() => {
    if (!item) {
      setMessages([]);
      setQuery('');
      setCurrentItemName(null);
    }
  }, [item]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!item || !query.trim() || isLoading) return;

    const userMessage = query.trim();
    setQuery('');
    
    const newMessages = [...messages, { role: 'user' as const, content: userMessage }];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const response = await fetch('/api/askNacho', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          item: item.name,
          query: userMessage,
          lang: 'es',
          history: messages
        })
      });

      if (!response.ok) {
        throw new Error('Error en la respuesta del servidor');
      }

      const data = await response.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.response }]);
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Lo siento, hubo un error al procesar tu pregunta. Por favor intenta de nuevo.' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!item) return null;

  return (
    <div
      className="fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-lg border-t border-gray-300 z-50 transform transition-transform duration-300 ease-out"
      style={{ height: '70vh' }}
    >
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50 rounded-t-2xl">
          <h2 className="text-xl font-semibold text-gray-800 flex items-center">
            <MessageSquareText size={24} className="mr-2 text-[#87CEEB]"/>
            Nacho Asistente
            <span className="text-gray-500 font-normal ml-2 text-lg">- {item.name}</span>
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800 p-1"
            aria-label="Cerrar chat"
          >
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] p-3 rounded-xl shadow ${
                msg.role === 'user' 
                  ? 'bg-[#87CEEB] text-white' 
                  : 'bg-white text-gray-800 border border-gray-200'
              }`}>
                {msg.role === 'assistant' ? (
                  <ReactMarkdown 
                    components={{
                      h3: ({node, ...props}) => <h3 className="text-lg font-semibold mt-2 mb-1 text-[#87CEEB]" {...props} />,
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
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="max-w-[80%] p-3 rounded-xl bg-white border border-gray-200 flex items-center">
                <Loader2 className="animate-spin h-5 w-5 mr-2 text-[#87CEEB]" />
                <span className="text-gray-600">Nacho está pensando...</span>
              </div>
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200 bg-white">
          <div className="flex gap-2">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={`Pregunta sobre ${item.name}...`}
              className="flex-1 border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#87CEEB] focus:border-transparent outline-none"
              disabled={isLoading}
            />
            <button
              type="submit"
              className="bg-[#87CEEB] text-white rounded-lg px-6 py-3 hover:bg-[#87CEEB]/90 disabled:bg-gray-300 disabled:cursor-not-allowed focus:outline-none flex items-center justify-center"
              disabled={isLoading || !query.trim()}
              aria-label="Enviar mensaje"
            >
              {isLoading ? (
                <Loader2 className="animate-spin h-5 w-5" />
              ) : (
                <Send size={20} />
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 