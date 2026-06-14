import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";

import { ArrowLeft } from "lucide-react";

export const BackButton = () => {
  const navigate = useNavigate();

  return (
    <Button
      size="icon"
      variant="ghost"
      onClick={() => void navigate(-1)}
      className="absolute top-6.5 left-6.5 z-10"
    >
      <ArrowLeft className="size-6" />
    </Button>
  );
};
