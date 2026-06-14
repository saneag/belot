import { Button } from "@/components/ui/button";

import { useStartingScreenActions } from "@/hooks/starting-screen/useStartingScreenActions";

export default function StartingPage() {
  const actions = useStartingScreenActions();

  return (
    <div className="flex h-full items-center justify-center">
      <div className="absolute top-1/6 flex flex-col items-center justify-center gap-3">
        <img
          src="/images/ic_launcher_no_bg.png"
          alt="Belot-score logo"
          width="100px"
          height="100px"
        />
        <h1 className="text-center text-4xl font-normal">Belot-score</h1>
      </div>
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
