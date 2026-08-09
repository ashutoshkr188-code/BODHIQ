"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { Save, RefreshCw, Plus, Trash2, ChevronUp, ChevronDown } from "lucide-react";
import { ToastFromHook, useToast } from "@/features/dashboard/components/DashboardToast";
import { getAllFaqs, bulkReplaceFaqs } from "@/features/dashboard/api";

const Input = (p: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input {...p} className="w-full bg-[#0a0a0a] border border-white/8 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-[#d4a853]/40 transition placeholder:text-gray-700" />
);
const Textarea = (p: React.TextareaHTMLAttributes<HTMLTextAreaElement>) => (
  <textarea {...p} rows={3} className="w-full bg-[#0a0a0a] border border-white/8 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-[#d4a853]/40 transition placeholder:text-gray-700 resize-y" />
);
const Toggle = ({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) => (
  <label className="flex items-center gap-3 cursor-pointer">
    <div onClick={() => onChange(!checked)} className={`relative w-10 h-5 rounded-full transition-colors ${checked ? "bg-[#d4a853]" : "bg-white/10"}`}>
      <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${checked ? "translate-x-5.5" : "translate-x-0.5"}`} />
    </div>
    <span className="text-sm text-gray-300">{label}</span>
  </label>
);

interface FAQItem { id?: number; question: string; answer: string; order: number; enabled: boolean; }

export default function FAQsDashboard() {
  const { getToken } = useAuth();
  const { toast, show: showToast, hide: hideToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [items, setItems] = useState<FAQItem[]>([]);

  useEffect(() => {
    (async () => {
      const token = await getToken();
      if (!token) return;
      const data = await getAllFaqs(token).catch(() => []);
      setItems((data || []).sort((a: FAQItem, b: FAQItem) => a.order - b.order));
      setLoading(false);
    })();
  }, []);

  const addItem = () => setItems((prev) => [...prev, { question: "", answer: "", order: prev.length, enabled: true }]);
  const remove = (idx: number) => setItems((prev) => prev.filter((_, i) => i !== idx).map((s, i) => ({ ...s, order: i })));
  const update = (idx: number, key: string, value: any) => setItems((prev) => prev.map((s, i) => i === idx ? { ...s, [key]: value } : s));
  const move = (idx: number, dir: -1 | 1) => {
    const arr = [...items];
    const swapIdx = idx + dir;
    if (swapIdx < 0 || swapIdx >= arr.length) return;
    [arr[idx], arr[swapIdx]] = [arr[swapIdx], arr[idx]];
    setItems(arr.map((s, i) => ({ ...s, order: i })));
  };

  const save = async () => {
    if (items.some((i) => !i.question.trim() || !i.answer.trim())) {
      showToast("All FAQs must have a question and answer.", "error");
      return;
    }
    setSaving(true);
    try {
      const token = await getToken();
      if (!token) throw new Error("No token");
      const result = await bulkReplaceFaqs(token, items.map((i, idx) => ({ question: i.question, answer: i.answer, order: idx, enabled: i.enabled })));
      setItems(result.sort((a: FAQItem, b: FAQItem) => a.order - b.order));
      showToast("FAQs saved.", "success");
    } catch (e: any) {
      showToast(e.message, "error");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="animate-pulse h-64 bg-white/5 rounded-2xl" />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-serif text-white">FAQs</h1>
          <p className="text-sm text-gray-500 mt-1">Add, edit, reorder, and enable/disable FAQs.</p>
        </div>
        <button onClick={addItem} className="flex items-center gap-1.5 px-4 py-2 border border-[#d4a853]/30 text-[#d4a853] rounded-xl text-xs hover:bg-[#d4a853]/5 transition">
          <Plus size={13} /> Add FAQ
        </button>
      </div>

      <div className="space-y-3">
        {items.length === 0 && (
          <div className="text-center py-12 text-gray-600 text-sm bg-[#0d0d0d] border border-white/5 rounded-2xl">
            No FAQs yet. Click "Add FAQ" to create your first one.
          </div>
        )}
        {items.map((item, idx) => (
          <div key={idx} className="bg-[#0d0d0d] border border-white/5 rounded-2xl p-5 space-y-3">
            <div className="flex items-center gap-3 justify-between">
              <span className="text-xs text-gray-600 font-mono">#{idx + 1}</span>
              <Toggle checked={item.enabled} onChange={(v) => update(idx, "enabled", v)} label={item.enabled ? "Published" : "Hidden"} />
              <div className="flex items-center gap-1">
                <button onClick={() => move(idx, -1)} disabled={idx === 0} className="p-1 text-gray-600 hover:text-white disabled:opacity-30 transition"><ChevronUp size={13} /></button>
                <button onClick={() => move(idx, 1)} disabled={idx === items.length - 1} className="p-1 text-gray-600 hover:text-white disabled:opacity-30 transition"><ChevronDown size={13} /></button>
                <button onClick={() => remove(idx)} className="p-1 text-red-400/60 hover:text-red-400 transition"><Trash2 size={13} /></button>
              </div>
            </div>
            <Input
              value={item.question}
              onChange={(e) => update(idx, "question", e.target.value)}
              placeholder="FAQ question"
            />
            <Textarea
              value={item.answer}
              onChange={(e) => update(idx, "answer", e.target.value)}
              placeholder="FAQ answer (Markdown supported)"
            />
          </div>
        ))}
      </div>

      {items.length > 0 && (
        <div className="flex justify-end">
          <button onClick={save} disabled={saving} className="flex items-center gap-2 px-5 py-2 bg-[#d4a853] hover:bg-[#e8c97a] text-black text-xs uppercase tracking-widest font-semibold rounded-xl transition disabled:opacity-50">
            {saving ? <RefreshCw size={14} className="animate-spin" /> : <Save size={14} />}
            {saving ? "Saving…" : "Save {items.length} FAQs"}
          </button>
        </div>
      )}
      <ToastFromHook toast={toast} onClose={hideToast} />
    </div>
  );
}

