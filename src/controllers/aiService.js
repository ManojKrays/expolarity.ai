const { OpenAI } = require("openai");
require("dotenv").config();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function getCareerSuggestions(assessmentResult, country, grade) {
  const prompt = `
You are a career guide for children (ages 10–18, grades 6–12). Explain the career "${assessmentResult}" to a student in grade ${grade} from ${country} in a simple, exciting, and inspiring way.

Provide the following as a valid JSON ONLY:

{
  "career": "${assessmentResult}",
  "introduction": "Explain what this job is in a fun, simple way.",
  "whyThisCareerIsGreat": "Why is it exciting or meaningful for kids?",
  "howToStart": {
    "subjectsToFocus": [...],
    "activitiesToTry": [...],
    "usefulHobbies": [...]
  },
  "educationPath": {
    "highSchool": "...",
    "afterSchoolOptions": {
      "degrees": [...],
      "certifications": [...]
    }
  },
  "skillsToDevelop": {
    "hardSkills": [...],
    "softSkills": [...]
  },
  "careerProgression": {
    "entryLevel": {
      "roles": [...]
    },
    "midLevel": [...],
    "seniorLevel": {
      "positions": [...]
    }
  },
  "topColleges": [...],
  "jobMarketInsight": {
    "demand": "...",
    "futureScope": "..."
  },
  "relatedCareers": [...],
  "motivationalTips": ["Short inspirational quotes for kids"],
  "roadmapImagePrompt": "Design a colorful and cheerful 2D cartoon-style roadmap that guides a student in grade ${grade} from ${country} on how to become a ${assessmentResult}. The roadmap should include step-by-step labeled scenes: starting school, choosing key subjects (like science, math, art, etc., depending on the career), doing fun projects or internships, joining clubs, attending college or vocational training, getting an entry-level job, and finally becoming a successful ${assessmentResult}. Each stage must include clearly readable, bold, high-contrast text labels for kids — placed neatly without clutter. Use fun, child-friendly visuals like books, laptops, science labs, uniforms, animals, rockets, or other career-related items. The style should be cartoonish, vibrant, inspiring, and easy for school children to follow. Ensure the text is large, legible, and stands out well against the background."
}
ONLY return the JSON.
`.trim();

  let careerJson;
  let roadmapImageUrl;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 2000,
    });

    let content = response.choices[0].message.content.trim();

    // Sanitize output (remove possible markdown wrapping)
    content = content
      .replace(/^```json/, "")
      .replace(/```$/, "")
      .trim();

    careerJson = JSON.parse(content);
  } catch (err) {
    console.error("❌ Failed to parse JSON from OpenAI:", err);
    return null;
  }

  // ✅ Now generate image using DALL·E from roadmapImagePrompt
  try {
    const imageRes = await openai.images.generate({
      model: "dall-e-3",
      prompt: careerJson.roadmapImagePrompt,
      n: 1,
      size: "1024x1024",
      quality: "hd",
    });

    roadmapImageUrl = imageRes.data[0].url;
    careerJson.roadmapImageUrl = roadmapImageUrl;
  } catch (err) {
    console.error("❌ Failed to generate roadmap image:", err);
    careerJson.roadmapImageUrl = null;
  }

  return careerJson;
}

module.exports = { getCareerSuggestions };
