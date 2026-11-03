import { hasAnswer } from "../src/answers";
const norm = (s: string) =>
  s.normalize("NFKC").trim().toLocaleLowerCase().replace(/\s+/g, " ");
export function gradeAnswer(q: Record<string, any>, answer: string) {
  if (!hasAnswer(q, answer)) return { status: "incorrect", score: 0 };
  if (["drawing", "text", "observation", "oral"].includes(q.response_type))
    return { status: "pending_manual", score: null };
  let correct = norm(answer) === norm(q.answer);
  try {
    if (q.response_type === "multiple")
      correct =
        JSON.stringify(JSON.parse(answer).map(norm).sort()) ===
        JSON.stringify(JSON.parse(q.answer).map(norm).sort());
    if (q.response_type === "order")
      correct =
        JSON.stringify(JSON.parse(answer).map(norm)) ===
        JSON.stringify(JSON.parse(q.answer).map(norm));
    if (q.response_type === "matching") {
      const a = JSON.parse(answer),
        r = JSON.parse(q.answer);
      correct =
        Object.keys(a).length === Object.keys(r).length &&
        Object.keys(r).every(
          (k) => norm(String(a[k] || "")) === norm(String(r[k])),
        );
    }
    if (q.response_type === "numeric") {
      const a = answer.trim().replace(",", "."),
        r = q.answer.trim().replace(",", ".");
      correct =
        a !== "" &&
        r !== "" &&
        Number.isFinite(Number(a)) &&
        Number(a) === Number(r);
    }
  } catch {
    correct = false;
  }
  return { status: correct ? "correct" : "incorrect", score: correct ? 2 : 0 };
}
