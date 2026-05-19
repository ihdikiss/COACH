import { UserProfile, CoachingProgram, MonthlyPlan, ProgramType } from "../types";
import { ALLAWI_LOGIC_PROMPT } from "../constants";

export async function generateInitialProgram(user: UserProfile): Promise<CoachingProgram> {
  const userStats = `
    Age: ${user.age}
    Weight: ${user.weight}kg
    Height: ${user.height}cm
    Gender: ${user.gender}
    Skill Level: ${user.skillLevel}
    Goal: ${user.goal}
    Program Frequency: ${user.programType === ProgramType.THREE_DAY ? '3-Day Condensed (Training only 3 days per week)' : 'Weekly Full (Standard 5-6 days per week)'}
  `;

  const prompt = `${ALLAWI_LOGIC_PROMPT}\n\n${userStats}\n\nPhase 1: Generate the Program Title, Overview, and Month 1 ONLY.\nREMINDER: Each week must start with "الاثنين" and end with "الأحد".
  
  Format the response as a VALID JSON object with this structure:
  {
    "title": "...",
    "overview": "...",
    "months": [
      {
        "month": 1,
        "title": "...",
        "weeks": [
          {
            "week": 1,
            "focus": "...",
            "sessions": [
              { "day": "الاثنين", "activity": "...", "description": "...", "intensity": "low|medium|high|rest", "duration": "...", "type": "..." }
              ... (up to Sunday)
            ]
          }
        ]
      }
    ],
    "safetyWarnings": ["..."]
  }`;

  const res = await fetch("/api/gemini/generate-initial", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ prompt }),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || "فشل الخادم في الاتصال بـ Gemini API");
  }

  const data = await res.json();
  const text = data.text;
  
  // Clean JSON from potential markdown blocks
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error("فشل AI في توليد بيانات صالحة");
  
  return JSON.parse(jsonMatch[0]);
}

export async function generateSubsequentMonth(user: UserProfile, monthNumber: number, previousContext: string): Promise<MonthlyPlan> {
  const prompt = `${ALLAWI_LOGIC_PROMPT}
  
  User Profile:
  Age: ${user.age}, Weight: ${user.weight}kg, Goal: ${user.goal}, Level: ${user.skillLevel}, Frequency: ${user.programType === ProgramType.THREE_DAY ? '3-Day Condensed' : 'Weekly Full'}

  ${previousContext ? `Context from previous phase: ${previousContext}` : ""}

  Generate Month ${monthNumber} ONLY.
  Structure should be:
  {
    "month": ${monthNumber},
    "title": "...",
    "weeks": [ ... ]
  }`;

  const res = await fetch("/api/gemini/generate-subsequent", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ prompt }),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || "فشل الخادم في الاتصال بـ Gemini API");
  }

  const data = await res.json();
  const text = data.text;
  
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error("فشل AI في توليد بيانات الشهر التالي");
  
  return JSON.parse(jsonMatch[0]);
}
