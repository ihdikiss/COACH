/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GoogleGenAI, Type } from "@google/genai";
import { UserProfile, CoachingProgram } from "../types";
import { ALLAWI_LOGIC_PROMPT } from "../constants";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

export async function generateAllawiProgram(user: UserProfile): Promise<CoachingProgram> {
  const userStats = `
    User Profile:
    Age: ${user.age}
    Weight: ${user.weight}kg
    Gender: ${user.gender}
    Skill Level: ${user.skillLevel}
    Goal: ${user.goal}
  `;

  const prompt = `${ALLAWI_LOGIC_PROMPT}\n\n${userStats}\n\nGenerate the complete 3-month program now.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-flash-latest", 
      contents: [
        {
          role: "user",
          parts: [{ text: `${prompt}\n\nIMPORTANT: You MUST generate EXACTLY 3 months, with 4 weeks per month, and 7 days per week. Do not truncate the JSON output.` }]
        }
      ],
      config: {
        responseMimeType: "application/json",
        maxOutputTokens: 8192,
        temperature: 0.1, // Lower temperature for more consistent JSON structure
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            overview: { type: Type.STRING },
            months: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  month: { type: Type.NUMBER },
                  title: { type: Type.STRING },
                  weeks: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        week: { type: Type.NUMBER },
                        weekName: { type: Type.STRING },
                        focus: { type: Type.STRING },
                        labInsight: { type: Type.STRING },
                        planningAdvice: { type: Type.STRING },
                        days: {
                          type: Type.ARRAY,
                          items: {
                            type: Type.OBJECT,
                            properties: {
                              day: { type: Type.STRING },
                              activityTitle: { type: Type.STRING },
                              warmup: {
                                type: Type.OBJECT,
                                properties: {
                                  description: { type: Type.STRING },
                                  duration: { type: Type.STRING }
                                },
                                required: ["description", "duration"]
                              },
                              mainPart: {
                                type: Type.OBJECT,
                                properties: {
                                  description: { type: Type.STRING },
                                  duration: { type: Type.STRING }
                                },
                                required: ["description", "duration"]
                              },
                              cooldown: {
                                type: Type.OBJECT,
                                properties: {
                                  description: { type: Type.STRING },
                                  duration: { type: Type.STRING }
                                },
                                required: ["description", "duration"]
                              },
                              intensity: { type: Type.STRING },
                              intensityIcon: { type: Type.STRING },
                              notes: { type: Type.STRING },
                              totalDuration: { type: Type.STRING }
                            },
                            required: ["day", "activityTitle", "warmup", "mainPart", "cooldown", "intensity", "intensityIcon", "totalDuration"]
                          }
                        }
                      },
                      required: ["week", "weekName", "focus", "labInsight", "planningAdvice", "days"]
                    }
                  }
                },
                required: ["month", "title", "weeks"]
              }
            },
            safetyWarnings: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          },
          required: ["title", "overview", "months", "safetyWarnings"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("لم يتم استلام أي رد من الذكاء الاصطناعي");
    
    // Clean potential markdown formatting just in case
    const cleanedText = text.replace(/```json\n?|\n?```/g, "").trim();
    
    return JSON.parse(cleanedText) as CoachingProgram;
  } catch (error) {
    console.error("Error generating program:", error);
    // Re-throw with more context if needed, but App.tsx will catch it
    throw error;
  }
}
