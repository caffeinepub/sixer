import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronRight, History, Trophy, Zap } from "lucide-react";
import { motion } from "motion/react";
import { MatchResult, MatchStatus } from "../backend.d";
import { useGetAllMatches } from "../hooks/useQueries";

interface Props {
  onNewMatch: () => void;
  onViewHistory: () => void;
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

export default function HomeView({ onNewMatch, onViewHistory }: Props) {
  const { data: matches, isLoading } = useGetAllMatches();
  const recentMatches = matches?.slice(-3).reverse() ?? [];

  return (
    <div className="min-h-screen flex flex-col">
      <header className="relative overflow-hidden px-6 pt-16 pb-20 flex flex-col items-center text-center">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-b from-[oklch(0.08_0.02_145/80%)] to-background" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-pitch-green/10" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full border border-pitch-green/15" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] rounded-full border border-pitch-green/20" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative z-10 mb-4"
        >
          <span className="text-5xl">\ud83c\udfcf</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="relative z-10 font-display font-extrabold text-5xl md:text-7xl tracking-tighter uppercase text-foreground mb-4"
        >
          SIXER
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="relative z-10 text-muted-foreground uppercase tracking-widest text-sm md:text-base font-semibold mb-10 max-w-sm"
        >
          TRACK EVERY BALL.&nbsp; CELEBRATE EVERY SIX.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="relative z-10 flex flex-col sm:flex-row gap-3"
        >
          <Button
            data-ocid="home.primary_button"
            onClick={onNewMatch}
            size="lg"
            className="bg-pitch-green text-primary-foreground hover:bg-pitch-green/90 font-display font-bold text-lg px-8 uppercase tracking-wide shadow-glow-lg"
          >
            <Zap className="w-5 h-5 mr-2" />
            Start New Match
          </Button>
          <Button
            data-ocid="home.secondary_button"
            onClick={onViewHistory}
            variant="outline"
            size="lg"
            className="font-display font-semibold text-lg px-8 uppercase tracking-wide border-border"
          >
            <History className="w-5 h-5 mr-2" />
            Match History
          </Button>
        </motion.div>
      </header>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="grid grid-cols-3 gap-px bg-border mx-6 rounded-xl overflow-hidden mb-12"
      >
        {[
          { label: "Matches", value: matches?.length ?? 0 },
          {
            label: "Total Sixes",
            value: matches?.reduce((a, m) => a + Number(m.sixesCount), 0) ?? 0,
          },
          {
            label: "Completed",
            value:
              matches?.filter((m) => m.status === MatchStatus.completed)
                .length ?? 0,
          },
        ].map((stat) => (
          <div key={stat.label} className="bg-card py-5 text-center">
            <div className="font-display font-extrabold text-3xl text-pitch-green">
              {stat.value}
            </div>
            <div className="text-muted-foreground text-xs uppercase tracking-wider mt-1">
              {stat.label}
            </div>
          </div>
        ))}
      </motion.div>

      <main className="flex-1 px-6 pb-16">
        <div className="max-w-xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-bold text-xl uppercase tracking-tight text-foreground">
              Recent Matches
            </h2>
            <button
              type="button"
              data-ocid="home.link"
              onClick={onViewHistory}
              className="text-pitch-green text-sm font-semibold hover:underline flex items-center gap-1"
            >
              View all <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {isLoading && (
            <div data-ocid="home.loading_state" className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-20 bg-card rounded-xl animate-pulse"
                />
              ))}
            </div>
          )}

          {!isLoading && recentMatches.length === 0 && (
            <div
              data-ocid="home.empty_state"
              className="text-center py-16 text-muted-foreground"
            >
              <Trophy className="w-12 h-12 mx-auto mb-4 opacity-20" />
              <p className="font-display font-semibold uppercase tracking-wide">
                No matches yet
              </p>
              <p className="text-sm mt-1">Start your first match above</p>
            </div>
          )}

          <div className="space-y-3">
            {recentMatches.map((match, i) => (
              <motion.div
                key={`${match.team1Name}-${match.team2Name}-${i}`}
                data-ocid={`home.item.${i + 1}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * i }}
                className="glass-card rounded-xl p-4 flex items-center justify-between"
              >
                <div>
                  <div className="font-display font-bold text-foreground">
                    {match.team1Name} vs {match.team2Name}
                  </div>
                  <div className="text-muted-foreground text-sm mt-0.5">
                    \ud83c\udfcf {Number(match.sixesCount)} sixes
                    &nbsp;\u00b7&nbsp; {Number(match.totalOvers)} overs
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
                      ? "bg-pitch-green text-primary-foreground"
                      : ""
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
              </motion.div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

function Footer() {
  const year = new Date().getFullYear();
  const link = `https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`;
  return (
    <footer className="text-center py-6 text-muted-foreground text-xs border-t border-border">
      \u00a9 {year}.{" "}
      <a
        href={link}
        target="_blank"
        rel="noreferrer"
        className="hover:text-pitch-green transition-colors"
      >
        Built with \u2764\ufe0f using caffeine.ai
      </a>
    </footer>
  );
}
