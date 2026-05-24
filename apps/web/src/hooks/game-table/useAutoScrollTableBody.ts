import { useEffect, useRef } from "react";
import type { RefObject } from "react";

interface UseAutoScrollTableBodyProps {
  rowsCount: number;
  scrollContainerRef: RefObject<HTMLDivElement | null>;
}

export default function useAutoScrollTableBody({
  rowsCount,
  scrollContainerRef,
}: UseAutoScrollTableBodyProps) {
  const lastRenderedRowsCountRef = useRef(0);

  useEffect(() => {
    if (rowsCount <= lastRenderedRowsCountRef.current) {
      lastRenderedRowsCountRef.current = rowsCount;
      return;
    }

    const scrollContainer = scrollContainerRef.current;

    if (scrollContainer) {
      scrollContainer.scrollTop = scrollContainer.scrollHeight;
    }

    lastRenderedRowsCountRef.current = rowsCount;
  }, [rowsCount, scrollContainerRef]);
}
