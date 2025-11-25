import OpenAI from 'openai';
import type { ActionItem } from '@/types';

const SYSTEM_PROMPT =
  'You are a meeting assistant. Extract specific, actionable tasks from the transcript. Return a JSON array of objects with structure: { task: string, owner: string | null, deadline: string | null }. Only include clear action items. If none exist, return empty array.';

const openaiClient = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

export async function extractActionItems(transcript: string): Promise<ActionItem[]> {
  if (!openaiClient) {
    throw new Error('OPENAI_API_KEY is not configured.');
  }

  try {
    const completion = await openaiClient.chat.completions.create({
      model: 'gpt-4o-mini',
      temperature: 0.2,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: transcript },
      ],
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      throw new Error('Received empty response from OpenAI.');
    }

    return normalizeActionItems(content);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to contact OpenAI: ${error.message}`);
    }
    throw new Error('Failed to contact OpenAI.');
  }
}

function normalizeActionItems(content: string): ActionItem[] {
  const cleaned = content.replace(/```json|```/g, '').trim();

  let parsed: unknown;
  try {
    parsed = JSON.parse(cleaned);
  } catch {
    throw new Error('OpenAI returned an invalid JSON payload.');
  }

  if (!Array.isArray(parsed)) {
    throw new Error('OpenAI response did not contain an array of action items.');
  }

  const items: ActionItem[] = parsed
    .map((item) => {
      if (typeof item !== 'object' || item === null) {
        return null;
      }

      const task = 'task' in item && typeof item.task === 'string' ? item.task.trim() : '';
      const owner =
        'owner' in item && typeof item.owner === 'string' && item.owner.trim().length > 0
          ? item.owner.trim()
          : null;
      const deadline =
        'deadline' in item && typeof item.deadline === 'string' && item.deadline.trim().length > 0
          ? item.deadline.trim()
          : null;

      if (!task) {
        return null;
      }

      return { task, owner, deadline };
    })
    .filter((item): item is ActionItem => Boolean(item));

  return items;
}
