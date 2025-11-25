import { Check, Copy } from 'lucide-react';
import { useMemo, useState } from 'react';
import type { ActionItem } from '../../types';
import { ActionItemCard } from './ActionItemCard';

interface ResultsSectionProps {
  actionItems: ActionItem[];
  isLoading?: boolean;
}

export function ResultsSection({ actionItems, isLoading = false }: ResultsSectionProps) {
  const [copied, setCopied] = useState(false);

  const copyPayload = useMemo(() => {
    if (!actionItems.length) {
      return '';
    }

    return actionItems
      .map((item, index) => {
        const owner = item.owner ? ` (Owner: ${item.owner})` : '';
        const deadline = item.deadline ? ` (Deadline: ${item.deadline})` : '';
        return `${index + 1}. ${item.task}${owner}${deadline}`;
      })
      .join('\n');
  }, [actionItems]);

  const handleCopyAll = async () => {
    if (!copyPayload) return;

    await navigator.clipboard.writeText(copyPayload);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (isLoading) {
    return (
      <div className="mt-12 space-y-2">
        <div className="h-6 w-40 animate-pulse rounded bg-gray-100" />
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, idx) => (
            <div key={idx} className="h-16 animate-pulse rounded-lg bg-gray-100" />
          ))}
        </div>
      </div>
    );
  }

  if (!actionItems.length) {
    return (
      <div className="mt-12 text-center text-gray-500">
        Provide a transcript to generate action items.
      </div>
    );
  }

  return (
    <div className="mt-12 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-gray-900">Action Items</h2>
        <button
          onClick={handleCopyAll}
          disabled={!copyPayload}
          className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {copied ? (
            <>
              <Check className="h-4 w-4" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="h-4 w-4" />
              Copy All
            </>
          )}
        </button>
      </div>

      <div className="space-y-2">
        {actionItems.map((item, index) => (
          <ActionItemCard key={`${item.task}-${index}`} item={item} index={index + 1} />
        ))}
      </div>
    </div>
  );
}
