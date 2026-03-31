import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Trophy } from "lucide-react";
import { motion } from "motion/react";
import { MatchResult, MatchStatus } from "../backend.d";
import { useGetAllMatches } from "../hooks/useQueries";

interface Props {
  onBack: () => void;
}

function resultLabel(
  result?: MatchResult,
  team1?: string,
  team2?: string,
): string {
  if (!result) return "Ongoing";
  if (result === MatchResult.draw) return "Draw";
  if (result === MatchResult.tied) return "Tied";
  if (result === MatchResult.team1Won) return `${team1} Won`;
  if (result === MatchResult.team2Won) return `${team2} Won`;
  return "Completed";
}

export default function MatchHistoryView({ onBack }: Props) {
  const { data: matches, isLoading } = useGetAllMatches();
  const sorted = [...(matches ?? [])].reverse();

  return (
    <div className="min-h-screen flex flex-col">
      <header className="px-6 py-5 flex items-center gap-4 border-b border-border">
        <Button
          data-ocid="history.cancel_button"
          variant="ghost"
          size="icon"
          onClick={onBack}
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="font-display font-bold text-xl uppercase tracking-tight">
          Match History
        </h1>
      </header>

      <main className="flex-1 px-6 py-8">
        <div className="max-w-xl mx-auto">
          {isLoading && (
            <div data-ocid="history.loading_state" className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-24 bg-card rounded-xl animate-pulse"
                />
              ))}
            </div>
          )}

          {!isLoading && sorted.length === 0 && (
            <div
              data-ocid="history.empty_state"
              className="text-center py-24 text-muted-foreground"
            >
              <Trophy className="w-14 h-14 mx-auto mb-5 opacity-20" />
              <p className="font-display font-bold text-xl uppercase tracking-wide">
                No matches yet
              </p>
              <p className="text-sm mt-2">
                Start a new match to see history here
              </p>
            </div>
          )}

          <div className="space-y-3">
            {sorted.map((match, i) => (
              <motion.article
                key={`${match.team1Name}-${match.team2Name}-${i}`}
                data-ocid={`history.item.${i + 1}`}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="glass-card rounded-xl p-5"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="font-display font-bold text-lg text-foreground truncate">
                      {match.team1Name} vs {match.team2Name}
                    </div>
                    <div className="text-muted-foreground text-sm mt-1 space-x-3">
                      <span>{Number(match.totalOvers)} overs</span>
                      <span>\u00b7</span>
                      <span>\ud83c\udfcf {Number(match.sixesCount)} sixes</span>
                      <span>\u00b7</span>
                      <span>RR {match.runRate.toFixed(2)}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 mt-3">
                      <div className="bg-muted rounded-lg px-3 py-2">
                        <div className="text-xs text-muted-foreground uppercase tracking-wide font-semibold mb-0.5">
                          {match.team1Name}
                        </div>
                        <div className="font-display font-bold text-foreground">
                          \u2014 / {Number(match.wickets1)}W
                        </div>
                      </div>
                      <div className="bg-muted rounded-lg px-3 py-2">
                        <div className="text-xs text-muted-foreground uppercase tracking-wide font-semibold mb-0.5">
                          {match.team2Name}
                        </div>
                        <div className="font-display font-bold text-foreground">
                          \u2014 / {Number(match.wickets2)}W
                        </div>
                      </div>
                    </div>
                  </div>
                  <Badge
                    variant={
                      match.status === MatchStatus.ongoing
                        ? "default"
                        : "secondary"
                    }
                    className={
                      match.status === MatchStatus.ongoing
                        ? "bg-pitch-green text-primary-foreground shrink-0"
                        : "shrink-0"
                    }
                  >
                    {match.status === MatchStatus.ongoing
                      ? "Live"
                      : resultLabel(
                          match.matchResult,
                          match.team1Name,
                          match.team2Name,
                        )}
                  </Badge>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
