import { cosineSimilarity } from "./similarity";
import { askTogether } from "./askTogether";
import policyData from "./policy_embeddings.json" assert { type: "json" };


async function getQuestionEmbedding(question: any) {
  const res = await fetch("https://api.together.xyz/v1/embeddings", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer tgp_v1_pjfoAWVVjlXc_oKoAgFN7Ysy7FqWwcyZvBY7te2S5BE`,
    },
    body: JSON.stringify({
      model: "BAAI/bge-large-en-v1.5",
      input: [question],
    }),
  });

  const data = await res.json(); 
  return data?.data?.[0]?.embedding || null;
}

export async function RAG(question: string) {
  const questionEmbedding = await getQuestionEmbedding(question);

  if (!questionEmbedding) {
    console.error("❌ Failed to get embedding.");
    return;
  }

  // Score chunks by similarity
  const scored = policyData.map((entry) => ({
    ...entry,
    score: cosineSimilarity(questionEmbedding, entry.embedding),
  }));

  // Sort by score descending
  const topChunks = scored
    .sort((a, b) => b.score - a.score)
    .slice(0, 2) // take top 2 chunks
    .map((entry) => entry.text)
    .join("\n");

  // Ask LLM with top context
  const answer = await askTogether(topChunks, question);
  return answer;
}