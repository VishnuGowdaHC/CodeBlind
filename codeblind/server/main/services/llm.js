import 'dotenv/config';
import { response } from 'express';
import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API });
export const gradePlayerCode = async (playerCode, pieceData, fullProblem) => {
    console.log("In groq: "+playerCode, pieceData, fullProblem);

    const prompt = `
        
            You are validating pseudocode logic written by a beginner. 
            BACKGROUND:
                    The team is building a system for: "${fullProblem.id}".
            FUNCTION: ${pieceData.functionName}
            GOAL: ${pieceData.expectedBehavior}
            INPUTS: ${JSON.stringify(pieceData.sampleInput)}

            STUDENT PSEUDOCODE:
            ${playerCode}

            RULES:
            - Ignore ALL syntax errors — this is pseudocode, not real code
            - Ignore variable naming, formatting, and style
            - ONLY check: does the logic correctly achieve the goal?
            - If the intent is clear and the approach is correct, pass it

            Return ONLY raw JSON, no markdown, no backticks:
            {
            "score": 85,
            "feedback": "One sentence and give an explanation. Harsh if wrong, encouraging if right.",
            "passed": true
            }  
    `;

    try {
        const response = await groq.chat.completions.create({
            messages: [
            {
                role: "user",
                content: prompt,
            },
            ],
            model: "openai/gpt-oss-20b",
            response_format: { type: "json_object" }
        });
        const rawText = response.choices[0].message.content;
        
        console.log("Raw AI Output:", rawText);
        return JSON.parse(rawText);
    } catch (error) {
        console.error("AI Grading failed:", error);
        return { score: 0, feedback: "Compiler error or AI timeout.", passed: false };
    }
};

export const verify = async ({finalData}) => {
    if (!finalData || !finalData.actualSystem) {
        console.error("🚨 EMERGENCY: finalData was empty when it reached llm.js!");
        return { matched: false, confidence: 0, feedback: "Server data error." };
    }
    const promptForAI = `
        You are comparing a player's guess to the actual answer.

        ACTUAL ANSWER: "${finalData.actualSystem}"
        PLAYER GUESS: "${finalData.teamGuess}"

        The guess does NOT need to be exact. If the core idea matches, it's correct.
        Examples of correct guesses for "Food Delivery App": "food app", "zomato type system", "ordering food", "restaurant delivery"
        Examples of wrong guesses: "social media", "banking system", "hospital management"

        Return ONLY raw JSON, no markdown, no backticks:
        {
        "matched": true,
        "confidence": 85,
        "feedback": "One sentence explaining why it matched or didn't."
        }
        `;

    try {
        const completion = await groq.chat.completions.create({
            messages: [
            {
                role: "user",
                content: promptForAI,
            },
            ],
            model: "openai/gpt-oss-20b",
            response_format: { type: "json_object" }
        })
        const rawText = completion.choices[0].message.content;
        
        return JSON.parse(rawText);
    } catch (error) {
        console.error("AI Verification failed:", error);
        return { matched: false, confidence: 0, feedback: "Compiler error or AI timeout." };
    }
}