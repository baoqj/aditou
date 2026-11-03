/** Empty selections count as unanswered, just like empty text. */
export function hasAnswer(
  question: { response_type?: string },
  value: string,
): boolean {
  if (!value.trim()) return false;
  try {
    if (question.response_type === "multiple") {
      const items = JSON.parse(value);
      return Array.isArray(items) && items.some((v) => String(v ?? "").trim());
    }
    if (question.response_type === "matching") {
      const pairs = JSON.parse(value);
      return (
        !!pairs &&
        typeof pairs === "object" &&
        !Array.isArray(pairs) &&
        Object.values(pairs).some((v) => String(v ?? "").trim())
      );
    }
  } catch {
    return true;
  }
  return true;
}
