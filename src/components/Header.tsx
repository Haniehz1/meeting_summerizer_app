import { Sparkles } from 'lucide-react';

export function Header() {
  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="max-w-3xl mx-auto px-6 py-4 flex items-center gap-2">
        <Sparkles className="w-5 h-5 text-blue-600" />
        <h1 className="text-gray-900">Action Items AI</h1>
      </div>
    </header>
  );
}
