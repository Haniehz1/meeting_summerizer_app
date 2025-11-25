'use client';

import { useCallback, useState } from 'react';
import type { ActionItem } from '@/types';

type InputMode = 'file' | 'text';

export interface ActionItemsGenerator {
  inputMode: InputMode;
  setInputMode: (mode: InputMode) => void;
  transcript: string;
  setTranscript: (value: string) => void;
  actionItems: ActionItem[];
  isLoading: boolean;
  error: string | null;
  handleFileUpload: (file: File) => void;
  handleSubmit: () => Promise<void>;
}

export function useActionItemsGenerator(): ActionItemsGenerator {
  const [inputMode, setInputMode] = useState<InputMode>('text');
  const [transcript, internalSetTranscript] = useState('');
  const [actionItems, setActionItems] = useState<ActionItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const setTranscript = useCallback(
    (value: string) => {
      internalSetTranscript(value);
      if (error) {
        setError(null);
      }
    },
    [error],
  );

  const handleFileUpload = useCallback(
    (file: File) => {
      if (file.type && file.type !== 'text/plain') {
        setError('Please upload a plain text (.txt) file.');
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result;
        if (typeof text === 'string') {
          setTranscript(text);
          setError(null);
        } else {
          setError('Could not read the selected file.');
        }
      };
      reader.onerror = () => setError('Could not read the selected file.');
      reader.readAsText(file);
    },
    [setTranscript],
  );

  const handleSubmit = useCallback(async () => {
    if (!transcript.trim()) {
      setError('Please provide a transcript before generating.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transcript }),
      });

      const payload = await response.json();

      if (!response.ok || !payload?.success) {
        const message = payload?.error ?? 'Unable to generate action items.';
        setError(message);
        setActionItems([]);
        return;
      }

      setActionItems(Array.isArray(payload.actionItems) ? payload.actionItems : []);
    } catch {
      setError('We could not generate action items. Please try again.');
      setActionItems([]);
    } finally {
      setIsLoading(false);
    }
  }, [transcript]);

  return {
    inputMode,
    setInputMode,
    transcript,
    setTranscript,
    actionItems,
    isLoading,
    error,
    handleFileUpload,
    handleSubmit,
  };
}
