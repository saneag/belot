import { PlayersSelectionContextProvider } from "@belot/components";
import { useFeatureToggle } from "@belot/hooks";

import { BackButton } from "@/components/backButton";
import ActionButtons from "@/components/players-selection/actionButtons";
import LoadPreviousGameButton from "@/components/players-selection/loadPreviousGameButton";
import MaxScoreSelector from "@/components/players-selection/maxScoreSelector";
import PlayersCount from "@/components/players-selection/playersCount";
import PlayersNames from "@/components/players-selection/playersNames";

export default function PlayersSelectionPage() {
  const isMaxScoreSelectorEnabled = useFeatureToggle("max-score-selector");

  return (
    <div className="flex h-full flex-1 items-center justify-center px-2.5">
      <BackButton />
      <div className="flex flex-col gap-3">
        <PlayersSelectionContextProvider>
          <PlayersCount />
          {isMaxScoreSelectorEnabled && <MaxScoreSelector />}
          <PlayersNames />
          <ActionButtons />
        </PlayersSelectionContextProvider>
        <LoadPreviousGameButton />
      </div>
    </div>
  );
}
