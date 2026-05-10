import type { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="flex h-dvh max-h-dvh items-center justify-center overflow-hidden">
      {children}
    </div>
  );
};
