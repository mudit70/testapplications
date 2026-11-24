import OpenAI from "openai";

export const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

/** The client may not be configured: a nullable parameter. */
export async function structuredSearch(client: OpenAI | null, query: string) {
  if (!client) throw new Error("OpenAI is not configured");
  const completion = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: query }],
  });
  return completion.choices[0]?.message.content ?? "";
}
