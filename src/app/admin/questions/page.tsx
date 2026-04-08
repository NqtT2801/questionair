import { prisma } from "@/lib/db";
import QuestionManager from "@/components/admin/QuestionManager";
import Link from "next/link";

export const dynamic = "force-dynamic";

async function getQuestions() {
  const questions = await prisma.question.findMany({
    orderBy: [{ phase: "asc" }, { group: "asc" }, { sortOrder: "asc" }],
  });
  return questions.map((q) => ({
    ...q,
    options: JSON.parse(q.options) as string[],
  }));
}

export default async function QuestionsPage() {
  const questions = await getQuestions();

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manage Questions</h1>
          <p className="text-sm text-gray-500 mt-1">{questions.length} questions total</p>
        </div>
        <div className="flex gap-3">
          <Link href="/admin" className="text-sm text-blue-600 hover:text-blue-800">
            Statistics
          </Link>
          <Link href="/" className="text-sm text-blue-600 hover:text-blue-800">
            Survey
          </Link>
        </div>
      </div>

      <QuestionManager initialQuestions={questions} />
    </div>
  );
}
