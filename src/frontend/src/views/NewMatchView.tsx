import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Loader2 } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { useCreateMatch } from "../hooks/useQueries";

interface Props {
  onBack: () => void;
  onMatchCreated: (
    id: bigint,
    team1: string,
    team2: string,
    overs: number,
  ) => void;
}

export default function NewMatchView({ onBack, onMatchCreated }: Props) {
  const [team1, setTeam1] = useState("");
  const [team2, setTeam2] = useState("");
  const [overs, setOvers] = useState("20");
  const createMatch = useCreateMatch();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!team1.trim() || !team2.trim()) {
      toast.error("Both team names are required");
      return;
    }
    const oversNum = Number.parseInt(overs, 10);
    if (!oversNum || oversNum < 1 || oversNum > 50) {
      toast.error("Overs must be between 1 and 50");
      return;
    }
    try {
      const id = await createMatch.mutateAsync({
        team1Name: team1.trim(),
        team2Name: team2.trim(),
        totalOvers: BigInt(oversNum),
      });
      toast.success("Match created!");
      onMatchCreated(id, team1.trim(), team2.trim(), oversNum);
    } catch {
      toast.error("Failed to create match");
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="px-6 py-5 flex items-center gap-4 border-b border-border">
        <Button
          data-ocid="new-match.cancel_button"
          variant="ghost"
          size="icon"
          onClick={onBack}
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="font-display font-bold text-xl uppercase tracking-tight">
          New Match
        </h1>
      </header>

      <main className="flex-1 flex items-center justify-center px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="glass-card rounded-2xl p-8">
            <div className="text-center mb-8">
              <span className="text-4xl">🏏</span>
              <h2 className="font-display font-extrabold text-2xl uppercase tracking-tight mt-3">
                Setup Match
              </h2>
              <p className="text-muted-foreground text-sm mt-1">
                Enter team details to begin
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-1.5">
                <Label
                  htmlFor="team1"
                  className="text-xs uppercase tracking-wider font-semibold text-muted-foreground"
                >
                  Team 1 (Batting First)
                </Label>
                <Input
                  data-ocid="new-match.input"
                  id="team1"
                  value={team1}
                  onChange={(e) => setTeam1(e.target.value)}
                  placeholder="e.g. Mumbai Indians"
                  className="bg-muted border-border text-foreground placeholder:text-muted-foreground"
                  autoFocus
                />
              </div>

              <div className="space-y-1.5">
                <Label
                  htmlFor="team2"
                  className="text-xs uppercase tracking-wider font-semibold text-muted-foreground"
                >
                  Team 2
                </Label>
                <Input
                  data-ocid="new-match.textarea"
                  id="team2"
                  value={team2}
                  onChange={(e) => setTeam2(e.target.value)}
                  placeholder="e.g. Chennai Super Kings"
                  className="bg-muted border-border text-foreground placeholder:text-muted-foreground"
                />
              </div>

              <div className="space-y-1.5">
                <Label
                  htmlFor="overs"
                  className="text-xs uppercase tracking-wider font-semibold text-muted-foreground"
                >
                  Total Overs
                </Label>
                <Input
                  id="overs"
                  type="number"
                  min="1"
                  max="50"
                  value={overs}
                  onChange={(e) => setOvers(e.target.value)}
                  className="bg-muted border-border text-foreground placeholder:text-muted-foreground"
                />
              </div>

              <Button
                data-ocid="new-match.submit_button"
                type="submit"
                size="lg"
                disabled={createMatch.isPending}
                className="w-full bg-pitch-green text-primary-foreground hover:bg-pitch-green/90 font-display font-bold uppercase tracking-wide text-lg mt-2 shadow-glow"
              >
                {createMatch.isPending ? (
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                ) : null}
                {createMatch.isPending ? "Creating..." : "Start Match"}
              </Button>
            </form>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
