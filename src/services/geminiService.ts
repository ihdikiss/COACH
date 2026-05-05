/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GoogleGenAI, Type } from "@google/genai";
import { UserProfile, CoachingProgram, MonthlyPlan } from "../types";
import { ALLAWI_LOGIC_PROMPT } from "../constants";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

/**
 * Generates the initial program structure including metadata and the first month's plan.
 * This prevents timeouts by not generating all 90 days at once.
 */
export async function generateInitialProgram(user: UserProfile): Promise<CoachingProgram> {
  const userStats = `
    User Profile:
    Age: ${user.age}
    Weight: ${user.weight}kg
    Gender: ${user.gender}
    Skill Level: ${user.skillLevel}
    Goal: ${user.goal}
  `;

  const prompt = `${ALLAWI_LOGIC_PROMPT}\n\n${userStats}\n\nPhase 1: Generate the Program Title, Overview, and Month 1 ONLY.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-flash-latest", 
      contents: [
        {
          role: "user",
          parts: [{ text: `${prompt}\n\nIMPORTANT: Return EXACTLY ONE month. Month number MUST be 1. Do not truncate the JSON output.` }]
        }
      ],
      config: {
        responseMimeType: "application/json",
        maxOutputTokens: 8192,
        temperature: 0,
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
    
    const cleanedText = text.replace(/```json\n?|\n?```/g, "").trim();
    return JSON.parse(cleanedText) as CoachingProgram;
  } catch (error) {
    console.error("Error generating initial program:", error);
    throw error;
  }
}

/**
 * Generates a specific month's plan based on user profile and previous progress.
 */
export async function generateSubsequentMonth(
  user: UserProfile, 
  monthNumber: number,
  previousContext?: string
): Promise<MonthlyPlan> {
  const prompt = `${ALLAWI_LOGIC_PROMPT}
  
  User Profile:
  Age: ${user.age}, Weight: ${user.weight}kg, Goal: ${user.goal}, Level: ${user.skillLevel}

  ${previousContext ? `Context from previous phase: ${previousContext}` : ""}

  Task: Generate Month ${monthNumber} ONLY.
  It MUST follow the logic of the previous month but progress appropriately.
  
  Return a SINGLE MonthlyPlan object.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-flash-latest", 
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      config: {
        responseMimeType: "application/json",
        maxOutputTokens: 8192,
        temperature: 0,
        responseSchema: {
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
                        totalDuration: { type: Type.STRING },
                        notes: { type: Type.STRING }
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
      }
    });

    const text = response.text;
    if (!text) throw new Error("لم يتم استلام أي رد من الذكاء الاصطناعي");
    const cleanedText = text.replace(/```json\n?|\n?```/g, "").trim();
    return JSON.parse(cleanedText) as MonthlyPlan;
  } catch (error) {
    console.error(`Error generating month ${monthNumber}:`, error);
    throw error;
  }
}
