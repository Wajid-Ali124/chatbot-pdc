export async function askTogether(context:any, question:any) {
  const prompt = `Context:\n${context}\n\nQuestion: ${question}`;
  
  const res = await fetch("https://api.together.xyz/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer tgp_v1_pjfoAWVVjlXc_oKoAgFN7Ysy7FqWwcyZvBY7te2S5BE`,
    },
    body: JSON.stringify({
      model: "mistralai/Mistral-7B-Instruct-v0.1",
      messages: [
        { role: "system", content: "You are a helpful assistant for university admission queries." },
        { role: "user", content: prompt },
      ],
    }),
  });

  const data = await res.json();
  return data?.choices?.[0]?.message?.content || "No response.";
}
