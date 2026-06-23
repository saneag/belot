import { WIN_SCORE_OPTIONS } from "@belot/constants";
import { useMaxScoreSelection } from "@belot/hooks";
import { useLocalization } from "@belot/localizations";

import { Button } from "@/components/ui/button";

export default function MaxScoreSelector() {
  const label = useLocalization("players.maxScore.label");
  const { maxScore, handleMaxScoreChange } = useMaxScoreSelection();

  return (
    <div className="flex flex-col gap-2.5">
      <span className="text-center text-lg">{label}</span>
      <div className="flex justify-center gap-2.5">
        {WIN_SCORE_OPTIONS.map((option) => (
          <Button
            key={option}
            variant={maxScore === option ? "default" : "outline"}
            className="px-4"
            onClick={() => handleMaxScoreChange(option)}
            data-testid={`max-score-button-${option}`}
          >
            {option}
          </Button>
        ))}
      </div>
    </div>
  );
}
