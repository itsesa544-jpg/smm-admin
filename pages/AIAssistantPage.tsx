import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import { Bot, User, SendHorizonal, LoaderCircle, Sparkles } from 'lucide-react';

interface Message {
    role: 'user' | 'model';
    content: string;
}

const AIAssistantPage: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const chatContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [messages, isLoading]);

    const handleSendMessage = async (prompt?: string) => {
        const userMessage = prompt || input;
        if (!userMessage.trim()) return;

        setIsLoading(true);
        setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
        setInput('');

        try {
            // 1. Fetch data from Firestore
            const usersCollection = collection(db, 'users');
            const ordersCollection = collection(db, 'orders');
            const servicesCollection = collection(db, 'services');

            const [usersSnapshot, ordersSnapshot, servicesSnapshot] = await Promise.all([
                getDocs(usersCollection),
                getDocs(ordersCollection),
                getDocs(servicesCollection),
            ]);

            const usersData = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            const ordersData = ordersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            const servicesData = servicesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

            // 2. Construct the prompt for Gemini
            const systemInstruction = `You are an expert AI assistant for an SMM panel administrator. 
            You will be provided with data from the panel's database in JSON format. 
            Use this data to answer the admin's questions accurately and concisely. 
            Provide insights, summaries, and direct answers based ONLY on the provided data.
            Do not make up information. If the answer isn't in the data, say so.
            Format your answers in a clear, readable way. For example, use lists or bold text.
            Today's date is ${new Date().toLocaleDateString()}.`;

            const dataContext = `
            Here is the current data from the SMM panel:
            - Users: ${JSON.stringify(usersData, null, 2)}
            - Orders: ${JSON.stringify(ordersData, null, 2)}
            - Services: ${JSON.stringify(servicesData, null, 2)}
            ---
            My question is: "${userMessage}"`;

            // 3. Call Gemini API
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const response = await ai.models.generateContent({
              model: 'gemini-2.5-flash',
              contents: dataContext,
              config: {
                systemInstruction: systemInstruction,
              },
            });
            
            const modelResponse = response.text;
            setMessages(prev => [...prev, { role: 'model', content: modelResponse }]);

        } catch (error) {
            console.error("Error with AI Assistant:", error);
            const errorMessage = "Sorry, I encountered an error while processing your request. Please try again later.";
            setMessages(prev => [...prev, { role: 'model', content: errorMessage }]);
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        handleSendMessage();
    };

    const examplePrompts = [
        "How many total users are there?",
        "What was the total revenue from all orders?",
        "Which service category is the most popular?",
        "List all users with a balance over $50.",
    ];

    return (
        <div className="bg-card shadow-md rounded-lg h-[calc(100vh-8rem)] flex flex-col">
            <div ref={chatContainerRef} className="flex-1 p-6 overflow-y-auto space-y-6">
                {messages.length === 0 && !isLoading && (
                    <div className="text-center flex flex-col items-center justify-center h-full">
                         <Sparkles className="h-16 w-16 text-primary mb-4" />
                        <h2 className="text-2xl font-semibold text-text-primary">SMM AI Assistant</h2>
                        <p className="text-text-secondary mt-2">Ask me anything about your panel data.</p>
                        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-2xl">
                            {examplePrompts.map(prompt => (
                                <button 
                                    key={prompt}
                                    onClick={() => handleSendMessage(prompt)}
                                    className="p-4 bg-background rounded-lg text-left hover:bg-gray-200 transition-colors"
                                >
                                    <p className="font-medium text-sm text-text-primary">{prompt}</p>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {messages.map((msg, index) => (
                    <div key={index} className={`flex items-start gap-4 ${msg.role === 'user' ? 'justify-end' : ''}`}>
                        {msg.role === 'model' && <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center"><Bot className="w-5 h-5 text-white" /></div>}
                        <div className={`max-w-xl p-4 rounded-xl whitespace-pre-wrap ${msg.role === 'user' ? 'bg-primary text-white' : 'bg-background text-text-primary'}`}>
                            {msg.content}
                        </div>
                        {msg.role === 'user' && <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center"><User className="w-5 h-5 text-white" /></div>}
                    </div>
                ))}
                 {isLoading && messages.length > 0 && (
                    <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center"><Bot className="w-5 h-5 text-white" /></div>
                        <div className="max-w-xl p-4 rounded-xl bg-background text-text-primary flex items-center">
                            <LoaderCircle className="animate-spin w-5 h-5 mr-2" />
                            <span>Thinking...</span>
                        </div>
                    </div>
                )}
            </div>
            <div className="p-4 border-t border-gray-200">
                <form onSubmit={handleFormSubmit} className="relative">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Ask about users, orders, revenue, etc..."
                        disabled={isLoading}
                        className="w-full pl-4 pr-14 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-gray-100"
                    />
                    <button type="submit" disabled={isLoading} className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-primary text-white hover:bg-indigo-700 disabled:bg-indigo-400 transition-colors">
                        <SendHorizonal className="w-5 h-5" />
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AIAssistantPage;
