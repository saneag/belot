import type { ReactElement, ReactNode } from "react";

import { TooltipProvider } from "@/components/ui/tooltip";

import { render } from "@testing-library/react";

export function renderWithTooltip(ui: ReactElement) {
  return render(<TooltipProvider>{ui}</TooltipProvider>);
}

export function renderWithProviders(ui: ReactNode) {
  return render(<TooltipProvider>{ui}</TooltipProvider>);
}
