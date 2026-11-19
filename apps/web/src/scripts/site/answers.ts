export interface Answer {
  keys: string[];
  text: string;
}

const plain = (text: string) =>
  text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");

const escapeRegExp = (text: string) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export function findAnswer(question: string, answers: Answer[]): string | null {
  const asked = plain(question);
  let best: string | null = null;
  let bestScore = 0;

  for (const answer of answers) {
    const score = answer.keys.filter((key) => new RegExp(`(^|[^a-z0-9])${escapeRegExp(plain(key))}`).test(asked)).length;
    if (score > bestScore) {
      best = answer.text;
      bestScore = score;
    }
  }

  return best;
}
