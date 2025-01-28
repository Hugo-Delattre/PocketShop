import { Button } from "../ui/button";

interface TableFooterActionProps {
  elementsCount: number;
  indexFirst: number;
  indexLast: number;
  canPreviousPage: boolean;
  canNextPage: boolean;
  pageSize: number;
  previousPage(): void;
  nextPage(): void;
  setPageSize(v: number): void;
}

export function TableFooterActions({
  elementsCount,
  indexFirst,
  indexLast,
  canPreviousPage,
  canNextPage,
  pageSize,
  previousPage,
  nextPage,
  setPageSize,
}: TableFooterActionProps) {
  return (
    <div className="mt-4">
      <div className="flex-2 flex justify-between items-center">
        <span>
          Elements from {indexFirst} to {indexLast} of {elementsCount}
        </span>
        <div className="flex items-center justify-end space-x-8">
          <div>
            <p className="inline">Show by</p>
            <select
              value={pageSize}
              onChange={(e) => setPageSize(Number(e.target.value))}
              className="border rounded p-1 ml-2 inline-block"
            >
              {[3, 5, 10, 20, 30, 40, 50].map((pageSize) => (
                <option key={pageSize} value={pageSize}>
                  {pageSize}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center justify-end gap-4 ">
            <Button
              variant="outline"
              size="sm"
              onClick={previousPage}
              disabled={!canPreviousPage}
            >
              Prev
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={nextPage}
              disabled={!canNextPage}
              className=""
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
