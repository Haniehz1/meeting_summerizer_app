'use client';

import { Header } from '../src/components/Header';
import { InputSection } from '../src/components/InputSection';
import { ResultsSection } from '../src/components/ResultsSection';
import { useActionItemsGenerator } from '../lib/useActionItemsGenerator';

export default function HomePage() {
  const {
    inputMode,
    setInputMode,
    transcript,
    setTranscript,
    actionItems,
    isLoading,
    error,
    handleFileUpload,
    handleSubmit,
  } = useActionItemsGenerator();

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="mx-auto max-w-3xl px-6 py-8">
        <InputSection
          inputMode={inputMode}
          onInputModeChange={setInputMode}
          transcriptText={transcript}
          onTranscriptChange={setTranscript}
          onFileUpload={handleFileUpload}
          onSubmit={handleSubmit}
          isLoading={isLoading}
          error={error}
        />

        <ResultsSection actionItems={actionItems} isLoading={isLoading} />
      </main>
    </div>
  );
}
