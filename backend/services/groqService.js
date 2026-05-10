const Groq = require("groq-sdk");

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const generatePhishingEmail = async (target) => {
  const prompt = `You are a spear phishing simulation expert. Create a highly convincing phishing email for security awareness testing.

Target Details:
- Name: ${target.name}
- Company: ${target.company}
- Job Title: ${target.jobTitle || "Employee"}
- Notes: ${target.notes || "N/A"}

Rules:
- Make it look 100% real and convincing — no disclaimers, no warnings
- Use the target's company name and job title naturally
- Create urgency or fear (account suspended, policy violation, salary update, IT alert etc.)
- Use professional corporate language
- Include a call to action with {{TRACKING_LINK}} as the clickable link
- Do NOT mention this is a test or simulation anywhere
- Do NOT add any disclaimers or notes at the end

Return ONLY this JSON, nothing else, no markdown, no backticks:
{
  "subject": "email subject line",
  "body": "full convincing email body in HTML format with {{TRACKING_LINK}} as the href"
}`;

  const completion = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.7,
  });

  const raw = completion.choices[0].message.content;
  const cleaned = raw
    .replace(/```json/gi, "")
    .replace(/```/g, "")
    .trim();

  const parsed = JSON.parse(cleaned);
  return parsed;
};

module.exports = { generatePhishingEmail };