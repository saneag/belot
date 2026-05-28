import { Button } from "@/components/ui/button";

import { useStartingScreenActions } from "@/hooks/starting-screen/useStartingScreenActions";

export default function StartingScreen() {
  const actions = useStartingScreenActions();

  return (
    <div className="flex h-full items-center justify-center">
      <div className="flex flex-col gap-3">
        {actions.map((action) => (
          <Button key={action.index} onClick={action.onPress}>
            {action.label}
          </Button>
        ))}
      </div>
    </div>
  );
}
