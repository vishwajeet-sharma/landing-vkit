'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/card';
import { Input } from '@/components/input';
import { Button } from '@/components/button';
import { ScrollArea } from '@/components/scroll-area';
import { Send } from 'lucide-react';
import { EmojiEvents, Star } from '@mui/icons-material';

interface Lawyer {
    Name: string;
    "Cases Won": string;
    Rating: string;
    Fees: string;
    "Area of Expertise": string;
}

interface Message {
    role: 'user' | 'assistant';
    content: string;
    lawyers?: Lawyer[];
    error?: string;
}

const Chatbot = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const sendMessage = async () => {
        if (!input.trim() || isLoading) return;

        setIsLoading(true);
        const userMessage: Message = { role: 'user', content: input };
        setMessages(prev => [...prev, userMessage]);

        try {
            const response = await fetch('/api/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt: input }),
            });

            const data = await response.json();
            console.log('API Response:', data); // Debug log

            if (!response.ok) {
                throw new Error(data.error || 'Failed to get recommendations');
            }

            if (Array.isArray(data) && data.length > 0) {
                const aiMessage: Message = {
                    role: 'assistant',
                    content: 'Here are some recommended lawyers based on your requirements:',
                    lawyers: data
                };
                setMessages(prev => [...prev, aiMessage]);
            } else {
                throw new Error('Invalid response format');
            }

        } catch (error) {
            console.error('Error:', error);
            const errorMessage: Message = {
                role: 'assistant',
                content: error instanceof Error ? error.message : 'An error occurred',
                error: 'error'
            };
            setMessages(prev => [...prev, errorMessage]);
        }

        setIsLoading(false);
        setInput('');
    };

    return (
        <div className="w-full max-w-6xl mx-auto p-4">
            <Card className="bg-black border-gray-800">
                <CardHeader className="border-b border-gray-800">
                <CardTitle className="text-gray-200 mx-auto">Saved List</CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {[
                    {
                        Name: "John Doe",
                        Expertise: "Criminal Law",
                        CasesWon: 120,
                        Rating: 4.5,
                        Fees: 1500,
                    },
                    {
                        Name: "Jane Smith",
                        Expertise: "Family Law",
                        CasesWon: 95,
                        Rating: 4.8,
                        Fees: 2000,
                    },
                    {
                        Name: "Albert Brown",
                        Expertise: "Corporate Law",
                        CasesWon: 150,
                        Rating: 4.7,
                        Fees: 2500,
                    },
                    ].map((lawyer, index) => (
                    <div
                        key={index}
                        className="border border-gray-700 rounded p-4 bg-gray-900 flex flex-col justify-center items-center text-center transition-transform duration-300 hover:scale-105"
                    >
                        <div className="font-semibold text-lg text-gray-200 mb-2">{lawyer.Name}</div>
                        <div className="text-sm text-gray-400 space-y-2">
                        <div>
                            <span className="font-medium text-gray-300">Expertise:</span> {lawyer.Expertise}
                        </div>
                        <div className="flex items-center justify-center">
                            <EmojiEvents className="text-green-500 mr-2" />
                            <span className="font-semibold text-green-500">{lawyer.CasesWon}</span>
                        </div>
                        <div className="flex items-center justify-center">
                            <Star className="text-yellow-500 mr-2" />
                            <span className="font-semibold text-yellow-500">{lawyer.Rating}/5.0</span>
                        </div>
                        <div>
                            <span className="font-medium text-red-300">Fees: ₹{lawyer.Fees}</span>
                        </div>
                        </div>
                    </div>
                    ))}
                </div>
                </CardContent>
            </Card>
            </div>

    );
};

export default Chatbot;