import { useState } from "react";

export default function Home() {
  const [text, setText] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleGenerate() {
    if (!text.trim()) return;
    setLoading(true);

    const response = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });

    const data = await response.json();
    setOutput(data.output);
    setLoading(false);
  }

  return (
    <div className="min-h-screen px-6 py-8 bg-gray-100 text-black">
      <h1 className="text-3xl font-bold mb-4">AI Sprint Summary Generator</h1>

      <textarea
        className="w-full h-64 p-3 border border-gray-300 rounded-lg focus:outline-none"
        placeholder="Paste Jira sprint notes, backlog items, or user stories..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <button
        onClick={handleGenerate}
        className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg disabled:bg-blue-300"
        disabled={loading}
      >
        {loading ? "Generating..." : "Generate Summary"}
      </button>

      {output && (
        <div className="mt-8 p-4 bg-white shadow rounded whitespace-pre-wrap">
          {output}
        </div>
      )}
    </div>
  );
}
