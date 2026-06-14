import { type ReactNode } from "react";

import { isMobile } from "@/helpers/isMobile";

interface PhoneScreenProps {
  children: ReactNode;
}

export default function PhoneScreen({ children }: PhoneScreenProps) {
  const mobile = isMobile();

  return (
    <div
      className={
        mobile
          ? "bg-phone-screen-background relative h-dvh max-h-dvh w-full max-w-full overflow-x-hidden"
          : "bg-phone-screen-background relative h-[80vh] w-full max-w-sm min-w-sm rounded-3xl"
      }
    >
      {children}
    </div>
  );
}
