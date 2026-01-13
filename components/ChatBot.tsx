import React, { useState, useRef, useEffect } from 'react';
import { Scores, ChatMessage } from '../types';
import { streamChatResponse } from '../services/geminiService';

interface ChatBotProps {
  scores: Scores;
}

const ChatBot: React.FC<ChatBotProps> = ({ scores }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: 'أهلاً بك! أنا مساعدك الذكي 🤖. اطلعت على نتيجتك، كيف يمكنني مساعدتك في فهمها أو التخطيط لمستقبلك؟' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: ChatMessage = { role: 'user', text: input };
    
    // 1. Add user message to UI state
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    // 2. Add placeholder for AI response
    const aiMsgPlaceholder: ChatMessage = { role: 'model', text: '', isThinking: true };
    setMessages(prev => [...prev, aiMsgPlaceholder]);

    try {
      // Prepare history for API. 
      // Note: 'messages' here refers to the state BEFORE the current user message was added 
      // (due to closure), which is exactly what we want for 'history' (previous context).
      // The current message is sent as the 'message' argument to streamChatResponse.
      const apiHistory = messages.map(m => ({
        role: m.role,
        parts: [{ text: m.text }]
      }));

      const streamResult = await streamChatResponse(userMsg.text, scores, apiHistory);
      
      let fullText = '';
      
      for await (const chunk of streamResult) {
        // Correctly access the text property
        const chunkText = chunk.text;
        
        if (chunkText) {
          fullText += chunkText;
          
          setMessages(prev => {
            const newMessages = [...prev];
            const lastMsg = newMessages[newMessages.length - 1];
            if (lastMsg.role === 'model') {
              lastMsg.text = fullText;
              lastMsg.isThinking = false; 
            }
            return newMessages;
          });
        }
      }

    } catch (error) {
      console.error(error);
      setMessages(prev => {
         const newMessages = [...prev];
         const lastMsg = newMessages[newMessages.length - 1];
         lastMsg.text = "عذراً، حدث خطأ أثناء الاتصال. يرجى المحاولة لاحقاً.";
         lastMsg.isThinking = false;
         return newMessages;
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          fixed bottom-6 right-6 z-50 w-14 h-14 md:w-16 md:h-16 rounded-full shadow-2xl 
          flex items-center justify-center text-white transition-all duration-300 transform hover:scale-110
          ${isOpen ? 'bg-red-500 rotate-45' : 'bg-gradient-to-r from-indigo-600 to-purple-600'}
        `}
      >
        {isOpen ? (
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        ) : (
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-[90vw] md:w-96 h-[60vh] md:h-[500px] bg-white rounded-2xl shadow-2xl flex flex-col border border-slate-100 animate-slide-up overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4 text-white">
            <h3 className="font-bold text-lg flex items-center gap-2">
              <span>🤖</span> مساعدك الشخصي
            </h3>
            <p className="text-xs opacity-80">يستخدم الذكاء الاصطناعي لتحليل نتيجتك</p>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50 scrollbar-hide">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-start' : 'justify-end'}`}>
                 <div className={`
                    max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed shadow-sm relative
                    ${msg.role === 'user' 
                      ? 'bg-indigo-600 text-white rounded-br-none' 
                      : 'bg-white text-slate-700 border border-slate-200 rounded-bl-none'
                    }
                 `}>
                    {msg.isThinking && !msg.text ? (
                      <div className="flex gap-1 items-center h-5">
                         <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></span>
                         <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-75"></span>
                         <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-150"></span>
                      </div>
                    ) : (
                      // Simple markdown-ish rendering for line breaks
                      msg.text.split('\n').map((line, i) => <p key={i} className="min-h-[1rem]">{line}</p>)
                    )}
                 </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-3 bg-white border-t border-slate-100 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="اكتب سؤالك هنا..."
              disabled={isLoading}
              className="flex-1 bg-slate-100 text-slate-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm disabled:opacity-50"
            />
            <button
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              className="bg-indigo-600 hover:bg-indigo-700 text-white p-3 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-5 h-5 transform rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatBot;