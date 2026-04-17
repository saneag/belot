import type { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="overflow-hidden} flex h-screen items-center justify-center">{children}</div>
  );
};
