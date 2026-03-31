import { Toaster } from "@/components/ui/sonner";
import { useEffect, useState } from "react";
import HomeView from "./views/HomeView";
import LiveScoringView from "./views/LiveScoringView";
import MatchHistoryView from "./views/MatchHistoryView";
import NewMatchView from "./views/NewMatchView";

export type View =
  | { name: "home" }
  | { name: "new-match" }
  | {
      name: "live-scoring";
      matchId: bigint;
      team1: string;
      team2: string;
      overs: number;
    }
  | { name: "history" };

export default function App() {
  const [view, setView] = useState<View>({ name: "home" });

  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground font-body">
      {view.name === "home" && (
        <HomeView
          onNewMatch={() => setView({ name: "new-match" })}
          onViewHistory={() => setView({ name: "history" })}
        />
      )}
      {view.name === "new-match" && (
        <NewMatchView
          onBack={() => setView({ name: "home" })}
          onMatchCreated={(id, team1, team2, overs) =>
            setView({ name: "live-scoring", matchId: id, team1, team2, overs })
          }
        />
      )}
      {view.name === "live-scoring" && (
        <LiveScoringView
          matchId={view.matchId}
          team1={view.team1}
          team2={view.team2}
          totalOvers={view.overs}
          onEnd={() => setView({ name: "history" })}
          onBack={() => setView({ name: "home" })}
        />
      )}
      {view.name === "history" && (
        <MatchHistoryView onBack={() => setView({ name: "home" })} />
      )}
      <Toaster richColors position="top-right" />
    </div>
  );
}
