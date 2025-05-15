const { OpenAI } = require("openai");
require("dotenv").config();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function getCareerSuggestions(assessmentResult, country, grade) {
  const prompt = `You are an expert career advisor. Your task is to provide a detailed career path for a student based on their selected career option, current grade, and country of study.

### Input Details:
- Career Option: ${assessmentResult}  
- Current Grade: ${grade}  
- Country: ${country}

### Expected Output:
1. **Overview of the Career**  
   - A brief introduction to ${assessmentResult} and why it is a good choice.  

2. **Educational Requirements**  
   - School subjects to focus on at grade ${grade}.  
   - Recommended high school courses or activities.  
   - College/university degrees required (specific to ${country}).  
   - Alternative education paths (certifications, diplomas, vocational training).  

3. **Skills & Competencies Needed**  
   - Essential soft and hard skills for ${assessmentResult}.  
   - Recommended extracurricular activities to develop these skills.  

4. **Career Progression Path**  
   - Entry-level roles and salaries in ${country}.  
   - Mid-level career growth opportunities.  
   - Senior positions and expected salary range.  

5. **Top Institutions & Courses (Specific to ${country})**  
   - Best colleges/universities offering degrees for ${assessmentResult}.  
   - Online certification programs (if available).  

6. **Job Market Insights**  
   - Demand for ${assessmentResult} in ${country}.  
   - Future job trends, automation impact, and opportunities.  

7. **Alternative Career Paths**  
   - Similar career options if the student wants flexibility.  
   - Other industries where ${assessmentResult} skills are valuable.  

### Formatting:
- Provide the response in a structured format with bullet points.  
- Ensure the career path is **realistic, detailed, and achievable** for students in ${country}.  
- Avoid generic advice; focus on **data-driven insights**.  `;

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    max_tokens: 200,
  });

  return response.choices[0].message.content.trim();
}

module.exports = { getCareerSuggestions };
