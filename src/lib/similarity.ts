export function cosineSimilarity(vecA:any, vecB:any) {
  const dotProduct = vecA.reduce((sum:any, a:any, i:any) => sum + a * vecB[i], 0);
  const magnitudeA = Math.sqrt(vecA.reduce((sum:any, a:any) => sum + a * a, 0));
  const magnitudeB = Math.sqrt(vecB.reduce((sum:any, b:any) => sum + b * b, 0));
  return dotProduct / (magnitudeA * magnitudeB);
}
