// Referenced from javascript_openai blueprint
import OpenAI from "openai";

// If there is no API key provided, we will not attempt to call OpenAI and
// instead return a deterministic fallback. This lets local development
// continue without secrets.
const hasOpenAIKey = !!process.env.OPENAI_API_KEY;
const openai = hasOpenAIKey ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) : undefined;

interface GenerateProfileContentParams {
  name: string;
  skill: string;
  location: string;
  languages: string[];
  experience: string;
  workingHours: string;
}

interface GenerateProfileContentResult {
  bio: string;
  slogan: string;
}

export async function generateProfileContent(
  params: GenerateProfileContentParams
): Promise<GenerateProfileContentResult> {
  const prompt = `You are a professional profile writer helping gig workers create compelling profiles.

Worker Information:
- Name: ${params.name}
- Profession: ${params.skill}
- Location: ${params.location}
- Languages: ${params.languages.join(", ")}
- Experience: ${params.experience}
- Working Hours: ${params.workingHours}

Generate a professional profile with:
1. A compelling bio (2-3 sentences) that highlights their skills, experience, and professionalism
2. A catchy, memorable slogan (5-10 words) that captures their unique value

The tone should be professional yet approachable. Focus on what makes them stand out.

Respond in JSON format with keys "bio" and "slogan".`;

  if (!openai) {
    // Local fallback when no OpenAI key is provided.
    return {
      bio: `${params.name} is a skilled ${params.skill} based in ${params.location}. ${params.experience}. Available ${params.workingHours}.`,
      slogan: `${params.skill} - Quality & Reliability`,
    };
  }

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-5",
      messages: [
        {
          role: "system",
          content: "You are an expert at writing professional profiles for gig workers. You create compelling, authentic bios and memorable slogans.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      response_format: { type: "json_object" },
      max_completion_tokens: 500,
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");

    return {
      bio: result.bio || "Professional and experienced worker dedicated to quality service.",
      slogan: result.slogan || "Quality work, delivered with care.",
    };
  } catch (error) {
    console.error("Error generating profile content:", error);
    // Fallback content if AI fails
    return {
      bio: `${params.name} is a skilled ${params.skill} based in ${params.location}. ${params.experience}. Available ${params.workingHours}.`,
      slogan: `${params.skill} - Quality & Reliability`,
    };
  }
}
