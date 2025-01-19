import { NextRequest, NextResponse } from 'next/server';
import Groq from 'groq-sdk';

export const runtime = 'edge';

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});

const systemPrompt = `You are a legal assistant. Your task is to recommend lawyers based on user requirements. You must respond ONLY with a JSON array containing exactly 3 lawyer recommendations. Each recommendation must follow this exact format:

[
  {
    "Name": "Lawyer's full name",
    "Cases Won": "number of cases won (as a string)",
    "Rating": "rating out of 5 (as a string)",
    "Fees": "fee amount (as a string)",
    "Area of Expertise": "primary legal expertise"
  }
]

Use this data to make recommendations:
Name,Area_of_Expertise,Cases_Won,Cases_Lost,Notable_Case,Years_of_Experience,Bar_Council_State,City,Minimum_Fee,Rating
Rajesh Kumar Sharma,Criminal Law,145,32,"State of Maharashtra v. Singh (2022)",22,Maharashtra,Mumbai,25000,4.8
Priya Venkatesh,Corporate Law,89,15,"Reliance Industries Case",15,Delhi,New Delhi,35000,4.7
Mohammed Ismail Khan,Constitutional Law,167,41,"PIL on Environmental Protection",28,Karnataka,Bangalore,40000,4.9
Anjali Deshmukh,Intellectual Property,78,23,"Tech Patent Case",12,Maharashtra,Pune,30000,4.5
Vikram Singh Chauhan,Real Estate Law,112,44,"Land Acquisition Dispute",18,Uttar Pradesh,Lucknow,20000,4.3
Deepika Patel,Family Law,234,67,"Divorce Settlement",20,Gujarat,Ahmedabad,15000,4.6

IMPORTANT: Respond ONLY with the JSON array. Do not include any additional text, explanations, or formatting.`;

export async function POST(request: NextRequest) {
    console.log('API route started');
    
    try {
        // Check API key
        if (!process.env.GROQ_API_KEY) {
            throw new Error('GROQ API key is not configured');
        }

        // Get request body
        const body = await request.json();
        console.log('Request body:', body);

        if (!body.prompt) {
            throw new Error('Prompt is required');
        }

        // Make API call
        const completion = await groq.chat.completions.create({
            messages: [
                { 
                    role: 'system', 
                    content: systemPrompt 
                },
                { 
                    role: 'user', 
                    content: `Find lawyers matching these requirements: ${body.prompt}. Remember to respond ONLY with the JSON array.` 
                }
            ],
            model: "mixtral-8x7b-32768",
            temperature: 0.5,
            max_tokens: 1000,
            top_p: 1,
            stream: false
        });

        const content = completion.choices[0]?.message?.content;
        console.log('Raw AI response:', content);

        if (!content) {
            throw new Error('Empty response from AI');
        }

        // Try to parse the response
        let parsedResponse;
        try {
            // Remove any potential markdown formatting
            const cleanContent = content.replace(/```json\n?|\n?```/g, '').trim();
            parsedResponse = JSON.parse(cleanContent);
        } catch (parseError) {
            console.error('Parse error:', parseError);
            console.error('Failed content:', content);
            throw new Error('Failed to parse AI response as JSON');
        }

        // Validate response structure
        if (!Array.isArray(parsedResponse)) {
            throw new Error('Response is not an array');
        }

        if (parsedResponse.length === 0) {
            throw new Error('No lawyers found in response');
        }

        // Validate each lawyer object
        const requiredFields = ['Name', 'Cases Won', 'Rating', 'Fees', 'Area of Expertise'];
        parsedResponse.forEach((lawyer, index) => {
            requiredFields.forEach(field => {
                if (!(field in lawyer)) {
                    throw new Error(`Missing ${field} in lawyer at index ${index}`);
                }
            });
        });

        return NextResponse.json(parsedResponse);

    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Unknown error occurred' },
            { status: 500 }
        );
    }
}