import { type ReactNode } from "react";

import { isMobile } from "@/helpers/isMobile";

interface PhoneScreenProps {
  children: ReactNode;
}

export default function PhoneScreen({ children }: PhoneScreenProps) {
  return (
    <div
      className={`${isMobile() ? "h-screen" : "h-[80vh]"} bg-phone-screen-background w-screen max-w-sm min-w-sm rounded-3xl`}
    >
      {children}
    </div>
  );
}
