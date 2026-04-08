"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type QuestionRow = {
  id: number;
  key: string;
  phase: number;
  group: string;
  text: string;
  options: string[];
  correctOptionIndex: number;
  reason: string;
  isTrapped: boolean;
  isBet: boolean;
  sortOrder: number;
};

type QuestionManagerProps = {
  initialQuestions: QuestionRow[];
};

const EMPTY_QUESTION: Omit<QuestionRow, "id"> = {
  key: "",
  phase: 1,
  group: "TREATMENT",
  text: "",
  options: ["", "", ""],
  correctOptionIndex: 0,
  reason: "",
  isTrapped: false,
  isBet: false,
  sortOrder: 0,
};

export default function QuestionManager({ initialQuestions }: QuestionManagerProps) {
  const router = useRouter();
  const [questions, setQuestions] = useState(initialQuestions);
  const [editing, setEditing] = useState<QuestionRow | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState<Omit<QuestionRow, "id">>(EMPTY_QUESTION);
  const [saving, setSaving] = useState(false);
  const [filter, setFilter] = useState<string>("all");

  const filtered = filter === "all"
    ? questions
    : questions.filter((q) => {
        if (filter === "p1_treatment") return q.phase === 1 && q.group === "TREATMENT";
        if (filter === "p1_control") return q.phase === 1 && q.group === "CONTROL";
        if (filter === "p2") return q.phase === 2;
        if (filter === "p3") return q.phase === 3;
        return true;
      });

  const startEdit = (q: QuestionRow) => {
    setEditing(q);
    setCreating(false);
    setForm({
      key: q.key,
      phase: q.phase,
      group: q.group,
      text: q.text,
      options: [...q.options],
      correctOptionIndex: q.correctOptionIndex,
      reason: q.reason,
      isTrapped: q.isTrapped,
      isBet: q.isBet,
      sortOrder: q.sortOrder,
    });
  };

  const startCreate = () => {
    setEditing(null);
    setCreating(true);
    setForm({ ...EMPTY_QUESTION, options: ["", "", ""] });
  };

  const cancel = () => {
    setEditing(null);
    setCreating(false);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (creating) {
        const res = await fetch("/api/admin/questions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        if (!res.ok) throw new Error("Create failed");
      } else if (editing) {
        const res = await fetch(`/api/admin/questions/${editing.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        if (!res.ok) throw new Error("Update failed");
      }
      setEditing(null);
      setCreating(false);
      router.refresh();
      // Re-fetch questions
      const res = await fetch("/api/admin/questions");
      const data = await res.json();
      setQuestions(data);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this question?")) return;
    await fetch(`/api/admin/questions/${id}`, { method: "DELETE" });
    router.refresh();
    setQuestions(questions.filter((q) => q.id !== id));
  };

  const updateOption = (index: number, value: string) => {
    const newOptions = [...form.options];
    newOptions[index] = value;
    setForm({ ...form, options: newOptions });
  };

  const addOption = () => {
    setForm({ ...form, options: [...form.options, ""] });
  };

  const removeOption = (index: number) => {
    if (form.options.length <= 2) return;
    const newOptions = form.options.filter((_, i) => i !== index);
    setForm({
      ...form,
      options: newOptions,
      correctOptionIndex: form.correctOptionIndex >= newOptions.length ? 0 : form.correctOptionIndex,
    });
  };

  return (
    <div>
      {/* Filter bar */}
      <div className="flex gap-2 mb-4 flex-wrap items-center">
        {[
          { value: "all", label: "All" },
          { value: "p1_treatment", label: "Phase 1 Treatment" },
          { value: "p1_control", label: "Phase 1 Control" },
          { value: "p2", label: "Phase 2" },
          { value: "p3", label: "Phase 3 (Bet)" },
        ].map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`px-3 py-1 text-sm rounded-full border ${
              filter === f.value
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
            }`}
          >
            {f.label}
          </button>
        ))}
        <button
          onClick={startCreate}
          className="ml-auto px-4 py-1.5 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700"
        >
          + Add Question
        </button>
      </div>

      {/* Edit/Create form */}
      {(editing || creating) && (
        <div className="mb-6 p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
          <h3 className="font-semibold mb-3">{creating ? "New Question" : `Edit: ${editing!.key}`}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-gray-600">Key</label>
              <input
                value={form.key}
                onChange={(e) => setForm({ ...form, key: e.target.value })}
                className="w-full border rounded px-2 py-1 text-sm"
                placeholder="e.g. p1_t_q11"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-600">Question Text</label>
              <input
                value={form.text}
                onChange={(e) => setForm({ ...form, text: e.target.value })}
                className="w-full border rounded px-2 py-1 text-sm"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-600">Phase</label>
              <select
                value={form.phase}
                onChange={(e) => setForm({ ...form, phase: parseInt(e.target.value) })}
                className="w-full border rounded px-2 py-1 text-sm"
              >
                <option value={1}>1</option>
                <option value={2}>2</option>
                <option value={3}>3</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-600">Group</label>
              <select
                value={form.group}
                onChange={(e) => setForm({ ...form, group: e.target.value })}
                className="w-full border rounded px-2 py-1 text-sm"
              >
                <option value="TREATMENT">TREATMENT</option>
                <option value="CONTROL">CONTROL</option>
                <option value="ALL">ALL</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-600">Sort Order</label>
              <input
                type="number"
                value={form.sortOrder}
                onChange={(e) => setForm({ ...form, sortOrder: parseInt(e.target.value) || 0 })}
                className="w-full border rounded px-2 py-1 text-sm"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-600">Correct Option Index</label>
              <select
                value={form.correctOptionIndex}
                onChange={(e) => setForm({ ...form, correctOptionIndex: parseInt(e.target.value) })}
                className="w-full border rounded px-2 py-1 text-sm"
              >
                {form.options.map((_, i) => (
                  <option key={i} value={i}>
                    Option {i + 1}
                  </option>
                ))}
                <option value={-1}>None (bet question)</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="text-xs font-medium text-gray-600">Options</label>
              {form.options.map((opt, i) => (
                <div key={i} className="flex gap-2 mb-1">
                  <input
                    value={opt}
                    onChange={(e) => updateOption(i, e.target.value)}
                    className={`flex-1 border rounded px-2 py-1 text-sm ${
                      i === form.correctOptionIndex ? "border-green-500 bg-green-50" : ""
                    }`}
                    placeholder={`Option ${i + 1}`}
                  />
                  <button
                    onClick={() => removeOption(i)}
                    className="text-red-500 text-xs hover:text-red-700"
                    disabled={form.options.length <= 2}
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button onClick={addOption} className="text-xs text-blue-600 hover:text-blue-800 mt-1">
                + Add option
              </button>
            </div>
            <div className="md:col-span-2">
              <label className="text-xs font-medium text-gray-600">Reason</label>
              <textarea
                value={form.reason}
                onChange={(e) => setForm({ ...form, reason: e.target.value })}
                className="w-full border rounded px-2 py-1 text-sm"
                rows={2}
              />
            </div>
            <div className="flex gap-4">
              <label className="flex items-center gap-1 text-sm">
                <input
                  type="checkbox"
                  checked={form.isTrapped}
                  onChange={(e) => setForm({ ...form, isTrapped: e.target.checked })}
                />
                Trapped
              </label>
              <label className="flex items-center gap-1 text-sm">
                <input
                  type="checkbox"
                  checked={form.isBet}
                  onChange={(e) => setForm({ ...form, isBet: e.target.checked })}
                />
                Bet Question
              </label>
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-4 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save"}
            </button>
            <button
              onClick={cancel}
              className="px-4 py-1.5 bg-gray-200 text-gray-700 text-sm rounded-lg hover:bg-gray-300"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Question list */}
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-3 py-2 text-left">Key</th>
              <th className="border border-gray-300 px-3 py-2 text-center">Phase</th>
              <th className="border border-gray-300 px-3 py-2 text-left">Group</th>
              <th className="border border-gray-300 px-3 py-2 text-left">Question</th>
              <th className="border border-gray-300 px-3 py-2 text-left">Options</th>
              <th className="border border-gray-300 px-3 py-2 text-center">Correct</th>
              <th className="border border-gray-300 px-3 py-2 text-center">Flags</th>
              <th className="border border-gray-300 px-3 py-2 text-center">Order</th>
              <th className="border border-gray-300 px-3 py-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((q) => (
              <tr key={q.id} className="hover:bg-gray-50">
                <td className="border border-gray-300 px-3 py-2 font-mono text-xs">{q.key}</td>
                <td className="border border-gray-300 px-3 py-2 text-center">{q.phase}</td>
                <td className="border border-gray-300 px-3 py-2">
                  <span
                    className={`px-2 py-0.5 rounded text-xs font-medium ${
                      q.group === "TREATMENT"
                        ? "bg-blue-100 text-blue-800"
                        : q.group === "CONTROL"
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {q.group}
                  </span>
                </td>
                <td className="border border-gray-300 px-3 py-2 max-w-xs truncate">{q.text}</td>
                <td className="border border-gray-300 px-3 py-2 text-xs">
                  {q.options.map((o, i) => (
                    <span key={i} className={i === q.correctOptionIndex ? "font-bold text-green-700" : ""}>
                      {o}{i < q.options.length - 1 ? " | " : ""}
                    </span>
                  ))}
                </td>
                <td className="border border-gray-300 px-3 py-2 text-center text-xs">
                  {q.correctOptionIndex >= 0 ? q.options[q.correctOptionIndex] : "—"}
                </td>
                <td className="border border-gray-300 px-3 py-2 text-center">
                  {q.isTrapped && <span className="px-1.5 py-0.5 bg-red-100 text-red-700 text-xs rounded mr-1">Trap</span>}
                  {q.isBet && <span className="px-1.5 py-0.5 bg-purple-100 text-purple-700 text-xs rounded">Bet</span>}
                </td>
                <td className="border border-gray-300 px-3 py-2 text-center">{q.sortOrder}</td>
                <td className="border border-gray-300 px-3 py-2 text-center">
                  <button
                    onClick={() => startEdit(q)}
                    className="text-blue-600 hover:text-blue-800 text-xs font-medium mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(q.id)}
                    className="text-red-600 hover:text-red-800 text-xs font-medium"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
