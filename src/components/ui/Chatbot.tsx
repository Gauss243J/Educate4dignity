import React, { useState } from 'react';
import { MessageCircle, X, Send, Minus, Maximize2 } from 'lucide-react';
import { Button } from './Button';
import { Input } from './Input';
import { Card, CardContent, CardHeader, CardTitle } from './Card';

interface ChatMessage {
  id: string;
  message: string;
  isBot: boolean;
  timestamp: Date;
}

export const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      message: 'Hello! How can I help you today? Ask me about our projects, donations, or how to get involved.',
      isBot: true,
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');

  const sendMessage = () => {
    if (!inputMessage.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      message: inputMessage,
      isBot: false,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);

    // Simple bot responses
    setTimeout(() => {
      const botResponse = getBotResponse(inputMessage);
      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        message: botResponse,
        isBot: true,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
    }, 1000);

    setInputMessage('');
  };

  const getBotResponse = (message: string): string => {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('project')) {
      return 'We have various projects in education, clean water, and sustainable agriculture. You can explore them on our Projects page. Would you like to know more about a specific type?';
    } else if (lowerMessage.includes('donate') || lowerMessage.includes('donation')) {
      return 'Thank you for your interest in donating! You can make a donation on our Donate page. We accept one-time and recurring donations through Stripe.';
    } else if (lowerMessage.includes('volunteer') || lowerMessage.includes('help')) {
      return 'We welcome volunteers! You can get involved as a supplier, distributor, trainer, or team member. Please visit our Contact page to learn more.';
    } else if (lowerMessage.includes('contact')) {
      return 'You can reach us through our Contact page or email us directly. We\'re here to help!';
    } else {
      return 'I\'m here to help! You can ask me about our projects, how to donate, volunteer opportunities, or how to contact us.';
    }
  };

  // Fermé totalement -> bouton flottant
  if (!isOpen) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          aria-label="Open chat assistant"
          className="rounded-full w-14 h-14 shadow-lg flex items-center justify-center bg-[var(--rose-600)] hover:bg-[var(--rose-700)] text-white"
        >
          <MessageCircle className="w-7 h-7" strokeWidth={2.2} />
        </Button>
      </div>
    );
  }

  // Ouvert mais minimisé -> barre réduite
  if (isOpen && isMinimized) {
    return (
      <div className="fixed bottom-4 right-4 z-50 w-72">
        <div className="bg-white/95 backdrop-blur-md border border-slate-200 rounded-xl shadow-lg flex items-center justify-between px-4 py-2.5">
          <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
            <MessageCircle className="w-5 h-5 text-rose-600" />
            <span className="text-[13px] font-semibold">Assistant</span>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              aria-label="Restore chat"
              onClick={() => setIsMinimized(false)}
              className="h-9 w-9 p-0 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-colors"
            >
              <Maximize2 className="w-5 h-5" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              aria-label="Close chat"
              onClick={() => { setIsOpen(false); setIsMinimized(false); }}
              className="h-9 w-9 p-0 text-rose-600 hover:text-white hover:bg-rose-600 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 w-80">
      <Card className="h-96 flex flex-col">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm">Educate4Dignity Assistant</CardTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                aria-label="Minimize chat"
                onClick={() => setIsMinimized(true)}
                className="h-9 w-9 p-0 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-colors"
              >
                <Minus className="w-5 h-5" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                aria-label="Close chat"
                onClick={() => { setIsOpen(false); setIsMinimized(false); }}
                className="h-9 w-9 p-0 text-rose-600 hover:text-white hover:bg-rose-600 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="flex-1 flex flex-col p-3">
          <div className="flex-1 overflow-y-auto space-y-2 mb-3">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`p-2 rounded-lg text-sm ${
                  msg.isBot
                    ? 'bg-gray-100 text-gray-800'
                    : 'bg-primary text-white ml-8'
                }`}
              >
                {msg.message}
              </div>
            ))}
          </div>
          
          <div className="flex gap-2">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1"
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            />
            <Button onClick={sendMessage} size="sm" aria-label="Send message" className="flex items-center gap-1">
              <Send className="w-4 h-4" />
              <span className="hidden sm:inline">Send</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
