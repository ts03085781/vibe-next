import React from "react";

export type FilterConfig = {
  label: string;
  key: string;
  options: { label: string; value: string }[];
};

export interface FilterPanelProps {
  config: FilterConfig[];
  selected: Record<string, string>;
  onSelect: (categoryKey: string, value: string) => void;
  onReset: () => void;
}

export default function FilterPanel({ config, selected, onSelect, onReset }: FilterPanelProps) {
  return (
    <div className="bg-white rounded-xl shadow p-6">
      <h2 className="text-xl font-bold mb-4 text-orange-600">漫畫大全 - 分類篩選</h2>
      <div className="space-y-4">
        {config.map(cat => (
          <div key={cat.key} className="flex items-center flex-wrap gap-2">
            <span className="w-20 text-gray-700 font-medium">按{cat.label}：</span>
            {cat.options.map(opt => (
              <button
                key={opt.value}
                className={`px-4 py-1 rounded border text-sm font-medium transition-colors
                  ${selected[cat.key] === opt.value ? "bg-orange-500 text-white border-orange-500" : "bg-white text-gray-700 border-gray-300 hover:bg-orange-50"}
                `}
                onClick={() => onSelect(cat.key, opt.value)}
              >
                {opt.label}
              </button>
            ))}
          </div>
        ))}
        <div className="flex gap-2 mt-4">
          <button
            className="border border-gray-300 px-4 py-1 rounded text-gray-700 hover:bg-gray-100"
            onClick={onReset}
          >
            重新篩選
          </button>
        </div>
      </div>
    </div>
  );
}
