import { Button } from "./Button";

interface PaginationProps {
  current: number;
  total: number;
  onChange: (page: number) => void;
}

export const Pagination = ({ current, total, onChange }: PaginationProps) => {
  const pages = Math.ceil(total / 10);
  
  return (
    <div className="flex items-center justify-between mt-8">
      <span className="text-gray-600">Page {current} of {pages}</span>
      <div className="space-x-2">
        {Array.from({ length: pages }, (_, i) => (
          <Button
            key={i}
            variant={current === i + 1 ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => onChange(i + 1)}
          >
            {i + 1}
          </Button>
        ))}
      </div>
    </div>
  );
};
