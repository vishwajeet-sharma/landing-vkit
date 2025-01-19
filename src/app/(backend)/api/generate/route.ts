import { NextRequest, NextResponse } from 'next/server';
import Groq from 'groq-sdk';

export const runtime = 'edge';

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});

const systemPrompt = `You are an expert legal assistant. Based on the following user inputs of location and type of case, use the following csv data to suggest lawyer name, number of wins, losses, rating, :

Name,Area_of_Expertise,Cases_Won,Cases_Lost,Notable_Case,Years_of_Experience,Bar_Council_State,City,Minimum_Fee,Rating
Name,Area_of_Expertise,Cases_Won,Cases_Lost,Notable_Case,Years_of_Experience,Bar_Council_State,City,Minimum_Fee,Rating
Rajesh Kumar Sharma,Criminal Law,145,32,"State of Maharashtra v. Singh (2022) - Murder Defense",22,Maharashtra,Mumbai,25000,4.8
Priya Venkatesh,Corporate Law,89,15,"Reliance Industries Merger Case (2021)",15,Delhi,New Delhi,35000,4.7
Mohammed Ismail Khan,Constitutional Law,167,41,"PIL on Environmental Protection",28,Karnataka,Bangalore,40000,4.9
Anjali Deshmukh,Intellectual Property,78,23,"Tech Patent Infringement Case",12,Maharashtra,Pune,30000,4.5
Vikram Singh Chauhan,Real Estate Law,112,44,"Land Acquisition Dispute",18,Uttar Pradesh,Lucknow,20000,4.3
Deepika Patel,Family Law,234,67,"High-Profile Divorce Settlement",20,Gujarat,Ahmedabad,15000,4.6
Suresh Krishnamurthy,Tax Law,156,28,"International Tax Evasion Case",25,Tamil Nadu,Chennai,45000,4.8
Aisha Rahman,Human Rights,89,31,"Minority Rights Protection Case",14,Delhi,New Delhi,25000,4.4
Arjun Mehta,Banking Law,145,32,"Banking Fraud Investigation",19,Maharashtra,Mumbai,40000,4.7
Kavita Reddy,Environmental Law,67,22,"Industrial Pollution Case",11,Telangana,Hyderabad,20000,4.2
Sanjay Joshi,Labor Law,189,45,"Workers' Union Dispute",21,Maharashtra,Thane,25000,4.5
Nandini Subramaniam,Maritime Law,56,18,"International Shipping Dispute",16,Kerala,Kochi,35000,4.6
Rahul Malhotra,Criminal Defense,178,56,"High-Profile Corruption Case",23,Delhi,New Delhi,50000,4.9
Sneha Kulkarni,Medical Law,89,34,"Medical Negligence Suit",13,Maharashtra,Nagpur,30000,4.4
Abdul Karim,Civil Law,234,78,"Property Inheritance Dispute",26,Uttar Pradesh,Noida,25000,4.7
Lakshmi Narayanan,Corporate Litigation,167,43,"Merger & Acquisition Case",20,Tamil Nadu,Chennai,40000,4.8
Prakash Gupta,Immigration Law,78,25,"International Visa Dispute",12,Delhi,New Delhi,30000,4.3
Meera Chatterjee,Competition Law,145,38,"Anti-Trust Violation Case",17,West Bengal,Kolkata,35000,4.6
Raj Kapoor,Bankruptcy Law,123,41,"Corporate Insolvency Case",19,Punjab,Chandigarh,40000,4.5
Zara Sheikh,International Law,91,28,"Cross-Border Trade Dispute",15,Delhi,New Delhi,45000,4.7
Harish Verma,Contract Law,178,52,"Commercial Contract Breach",22,Rajasthan,Jaipur,30000,4.4
Anita Desai,Media Law,67,19,"Defamation Case",11,Maharashtra,Mumbai,25000,4.2
Vijay Menon,Construction Law,156,47,"Infrastructure Project Dispute",24,Kerala,Trivandrum,35000,4.6
Pooja Singhania,Securities Law,89,26,"Stock Market Fraud Case",13,Delhi,New Delhi,40000,4.5
Kunal Bose,Entertainment Law,112,33,"Film Industry Copyright Case",16,West Bengal,Kolkata,30000,4.3
Ritu Khanna,Consumer Protection,234,65,"Class Action Lawsuit",21,Delhi,New Delhi,25000,4.7
Ashok Pillai,Sports Law,78,24,"Cricket Contract Dispute",14,Tamil Nadu,Chennai,35000,4.4
Fatima Syed,Education Law,145,39,"University Admission Case",18,Uttar Pradesh,Lucknow,20000,4.3
Vivek Mathur,Insurance Law,167,48,"Insurance Claim Dispute",23,Gujarat,Ahmedabad,30000,4.6
Neha Sharma,Telecommunications,91,27,"Telecom License Dispute",12,Delhi,New Delhi,35000,4.5
Gopal Krishna,Agriculture Law,178,54,"Farmers' Rights Case",25,Punjab,Amritsar,25000,4.7
Sarita Malik,Aviation Law,67,21,"Airline Liability Case",11,Delhi,New Delhi,40000,4.4
Dhruv Patel,Energy Law,156,42,"Power Project Dispute",20,Gujarat,Surat,35000,4.6
Prerna Saxena,Administrative Law,89,29,"Government Policy Challenge",15,Delhi,New Delhi,30000,4.3
Imran Qureshi,Criminal Prosecution,234,68,"Cybercrime Investigation",24,Maharashtra,Mumbai,45000,4.8
Shweta Nair,Fintech Law,78,23,"Digital Payment Dispute",13,Karnataka,Bangalore,35000,4.5
Nitin Agarwal,Real Estate Litigation,145,37,"Commercial Property Dispute",19,Delhi,New Delhi,40000,4.7
Maya Chakraborty,Healthcare Law,167,49,"Hospital Management Case",22,West Bengal,Kolkata,30000,4.6
Kamal Vora,Trade Law,91,26,"Import-Export Dispute",14,Gujarat,Vadodara,25000,4.4
Shalini Tiwari,Public Interest,178,53,"Environmental Protection PIL",21,Madhya Pradesh,Bhopal,20000,4.5
Rajiv Malhotra,Arbitration,67,20,"International Arbitration Case",12,Delhi,New Delhi,45000,4.7
Sunita Rao,Privacy Law,156,44,"Data Protection Case",18,Karnataka,Bangalore,35000,4.6
Arun Kapoor,Intellectual Property Rights,89,28,"Software Patent Case",16,Delhi,New Delhi,40000,4.8
Yasmin Ahmed,Constitutional Rights,234,69,"Fundamental Rights Case",23,Uttar Pradesh,Kanpur,30000,4.7
Deepak Iyer,Corporate Governance,78,22,"Shareholder Dispute",13,Tamil Nadu,Coimbatore,35000,4.5
Rani Mukherjee,Family Disputes,145,36,"Child Custody Battle",17,West Bengal,Kolkata,25000,4.4
Sameer Oberoi,Banking Fraud,167,47,"Financial Crime Case",20,Delhi,New Delhi,50000,4.8
Anjana Krishna,Environmental Protection,91,25,"Wildlife Conservation Case",14,Kerala,Kochi,30000,4.5
Vinod Sharma,Labor Rights,178,55,"Employee Benefits Dispute",22,Haryana,Gurgaon,35000,4.6

Please provide a list of at least three lawyers. The response should strictly be in the following JSON format:
[
  {
    Name:'Name',
    "Cases Won":'Cases Won',
    Rating: 'rating',
    Fees: 'Fees',
    "Area of Expertise": 'Area of Expertise'
  }
]

Write NOTHING ELSE. Only the JSON above should be your response.
`;


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