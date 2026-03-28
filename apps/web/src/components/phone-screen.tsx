import type { ReactNode } from "react";

import { isMobile } from "@/helpers/isMobile";

interface PhoneScreenProps {
  children: ReactNode;
}

export default function PhoneScreen({ children }: PhoneScreenProps) {
  return (
    <div
      className={`${isMobile() ? "h-screen" : "h-[80vh]"} w-full max-w-sm min-w-sm rounded-md bg-gray-200`}
    >
      {children}
    </div>
  );
}
