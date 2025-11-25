import type { ActionItem } from '../../types';

interface ActionItemCardProps {
  item: ActionItem;
  index: number;
}

export function ActionItemCard({ item, index }: ActionItemCardProps) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <span className="font-semibold text-gray-900">{index}.</span>
        <span>{item.owner ?? 'Unassigned'}</span>
      </div>
      <p className="mt-1 font-medium text-gray-900">{item.task}</p>
      {item.deadline && (
        <p className="text-sm text-gray-500">
          Deadline: <span className="font-medium text-gray-800">{item.deadline}</span>
        </p>
      )}
    </div>
  );
}
