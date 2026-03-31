import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

interface Props {
  matchId: bigint;
  team1: string;
  team2: string;
  totalOvers: number;
  onEnd: () => void;
  onBack: () => void;
}

type BallEvent = "dot" | "1" | "2" | "3" | "4" | "6" | "W" | "WD" | "NB";

interface InningsState {
  runs: number;
  wickets: number;
  balls: BallEvent[];
  sixes: number;
}

function newInnings(): InningsState {
  return { runs: 0, wickets: 0, balls: [], sixes: 0 };
}

function completedBalls(balls: BallEvent[]): number {
  return balls.filter((b) => b !== "WD" && b !== "NB").length;
}

function oversDisplay(legalBalls: number): string {
  const ov = Math.floor(legalBalls / 6);
  const bl = legalBalls % 6;
  return `${ov}.${bl}`;
}

function runRate(runs: number, legalBalls: number): string {
  if (legalBalls === 0) return "0.00";
  return ((runs / legalBalls) * 6).toFixed(2);
}

const BALL_COLORS: Record<BallEvent, string> = {
  dot: "bg-muted text-muted-foreground",
  "1": "bg-muted text-foreground",
  "2": "bg-muted text-foreground",
  "3": "bg-muted text-foreground",
  "4": "bg-blue-600 text-white",
  "6": "bg-pitch-green text-primary-foreground",
  W: "bg-destructive text-destructive-foreground",
  WD: "bg-yellow-600 text-white",
  NB: "bg-orange-600 text-white",
};

const BALL_LABELS: Record<BallEvent, string> = {
  dot: "\u2022",
  "1": "1",
  "2": "2",
  "3": "3",
  "4": "4",
  "6": "6",
  W: "W",
  WD: "Wd",
  NB: "Nb",
};

export default function LiveScoringView({
  team1,
  team2,
  totalOvers,
  onEnd,
  onBack,
}: Props) {
  const [innings, setInnings] = useState<1 | 2>(1);
  const [inn1, setInn1] = useState<InningsState>(newInnings());
  const [inn2, setInn2] = useState<InningsState>(newInnings());
  const [batsmen, setBatsmen] = useState<[string, string]>([
    "Batsman 1",
    "Batsman 2",
  ]);
  const [bowler, setBowler] = useState("Bowler 1");
  const [sixFlash, setSixFlash] = useState(false);
  const [matchEnded, setMatchEnded] = useState(false);

  const currentInn = innings === 1 ? inn1 : inn2;
  const setCurrentInn = innings === 1 ? setInn1 : setInn2;
  const legalBalls = completedBalls(currentInn.balls);
  const totalLegalBalls = totalOvers * 6;
  const isInningsOver =
    legalBalls >= totalLegalBalls || currentInn.wickets >= 10;

  function addBall(event: BallEvent) {
    if (isInningsOver || matchEnded) return;
    setCurrentInn((prev) => {
      const balls = [...prev.balls, event];
      let runs = prev.runs;
      let wickets = prev.wickets;
      let sixes = prev.sixes;
      if (event === "1") runs += 1;
      else if (event === "2") runs += 2;
      else if (event === "3") runs += 3;
      else if (event === "4") runs += 4;
      else if (event === "6") {
        runs += 6;
        sixes += 1;
      } else if (event === "WD") runs += 1;
      else if (event === "NB") runs += 1;
      else if (event === "W") wickets += 1;
      if (event === "6") {
        setSixFlash(true);
        setTimeout(() => setSixFlash(false), 600);
      }
      return { ...prev, runs, wickets, balls, sixes };
    });
  }

  function handleEndInnings() {
    if (innings === 1) {
      setInnings(2);
    } else {
      setMatchEnded(true);
    }
  }

  const totalSixes = inn1.sixes + inn2.sixes;

  const target = inn1.runs + 1;
  const inn2RunsNeeded = innings === 2 ? target - inn2.runs : 0;
  const inn2BallsLeft =
    innings === 2 ? totalLegalBalls - completedBalls(inn2.balls) : 0;
  const requiredRR =
    inn2BallsLeft > 0
      ? ((inn2RunsNeeded / inn2BallsLeft) * 6).toFixed(2)
      : "0.00";

  let resultText = "";
  if (matchEnded) {
    if (inn2.runs > inn1.runs) resultText = `${team2} won!`;
    else if (inn1.runs > inn2.runs) resultText = `${team1} won!`;
    else resultText = "Match tied!";
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="px-4 py-4 flex items-center gap-3 border-b border-border">
        <Button
          data-ocid="scoring.cancel_button"
          variant="ghost"
          size="icon"
          onClick={onBack}
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="flex-1 min-w-0">
          <h1 className="font-display font-bold text-lg uppercase tracking-tight truncate">
            {team1} vs {team2}
          </h1>
          <p className="text-muted-foreground text-xs">
            {innings === 1
              ? `${team1} batting`
              : `${team2} batting \u00b7 Target: ${target}`}
          </p>
        </div>
        <div className="flex items-center gap-1.5 bg-pitch-green/10 border border-pitch-green/30 rounded-full px-3 py-1">
          <span className="text-lg">\ud83c\udfcf</span>
          <AnimatePresence mode="wait">
            <motion.span
              key={totalSixes}
              initial={{ scale: 1.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="font-display font-extrabold text-pitch-green text-xl"
            >
              {totalSixes}
            </motion.span>
          </AnimatePresence>
          <span className="text-muted-foreground text-xs font-semibold">
            SIX{totalSixes !== 1 ? "ES" : ""}
          </span>
        </div>
      </header>

      <section className="px-4 py-6">
        <div className="glass-card rounded-2xl p-5 text-center relative overflow-hidden">
          <AnimatePresence>
            {sixFlash && (
              <motion.div
                key="flash"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.5 }}
                className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none"
              >
                <span className="text-7xl font-display font-extrabold text-pitch-green drop-shadow-lg">
                  SIX! \ud83c\udfcf
                </span>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="text-muted-foreground text-xs uppercase tracking-widest mb-1 font-semibold">
            {innings === 1 ? team1 : team2}
          </div>
          <div className="font-display font-extrabold text-6xl text-foreground">
            {currentInn.runs}
            <span className="text-muted-foreground text-3xl">
              /{currentInn.wickets}
            </span>
          </div>
          <div className="text-muted-foreground text-sm mt-1">
            {oversDisplay(legalBalls)} overs \u00b7 RR{" "}
            {runRate(currentInn.runs, legalBalls)}
          </div>

          {innings === 2 && (
            <div className="mt-2 text-xs font-semibold">
              <span className="text-muted-foreground">Need </span>
              <span className="text-pitch-green">
                {inn2RunsNeeded > 0 ? inn2RunsNeeded : 0} runs
              </span>
              <span className="text-muted-foreground">
                {" "}
                in {inn2BallsLeft} balls \u00b7 RRR{" "}
              </span>
              <span className="text-pitch-green">{requiredRR}</span>
            </div>
          )}
        </div>

        <div className="mt-3 flex items-center gap-2 overflow-x-auto py-1">
          <span className="text-muted-foreground text-xs font-semibold uppercase tracking-wide shrink-0">
            This over:
          </span>
          {currentInn.balls.slice(-6).map((b, i) => (
            <span
              key={`ball-${currentInn.balls.length - 6 + i}`}
              className={`shrink-0 w-7 h-7 rounded-full text-xs font-bold flex items-center justify-center ${BALL_COLORS[b]}`}
            >
              {BALL_LABELS[b]}
            </span>
          ))}
        </div>
      </section>

      <Separator className="mx-4" />

      <section className="px-4 py-4 space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label
              htmlFor="striker"
              className="text-xs uppercase tracking-wider text-muted-foreground font-semibold"
            >
              Striker
            </label>
            <Input
              id="striker"
              data-ocid="scoring.input"
              value={batsmen[0]}
              onChange={(e) => setBatsmen([e.target.value, batsmen[1]])}
              className="mt-1 bg-muted border-border text-foreground text-sm h-9"
            />
          </div>
          <div>
            <label
              htmlFor="nonstriker"
              className="text-xs uppercase tracking-wider text-muted-foreground font-semibold"
            >
              Non-Striker
            </label>
            <Input
              id="nonstriker"
              value={batsmen[1]}
              onChange={(e) => setBatsmen([batsmen[0], e.target.value])}
              className="mt-1 bg-muted border-border text-foreground text-sm h-9"
            />
          </div>
        </div>
        <div>
          <label
            htmlFor="bowler"
            className="text-xs uppercase tracking-wider text-muted-foreground font-semibold"
          >
            Bowler
          </label>
          <Input
            id="bowler"
            value={bowler}
            onChange={(e) => setBowler(e.target.value)}
            className="mt-1 bg-muted border-border text-foreground text-sm h-9"
          />
        </div>
      </section>

      <Separator className="mx-4" />

      {matchEnded && (
        <motion.div
          data-ocid="scoring.success_state"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mx-4 mt-4 bg-pitch-green/20 border border-pitch-green/40 rounded-xl p-4 text-center"
        >
          <div className="font-display font-extrabold text-2xl text-pitch-green uppercase tracking-tight">
            \ud83c\udfc6 {resultText}
          </div>
          <div className="text-muted-foreground text-sm mt-1">
            {team1}: {inn1.runs}/{inn1.wickets} &nbsp;\u00b7&nbsp; {team2}:{" "}
            {inn2.runs}/{inn2.wickets}
          </div>
          <Button
            data-ocid="scoring.primary_button"
            onClick={onEnd}
            className="mt-3 bg-pitch-green text-primary-foreground font-display font-bold uppercase tracking-wide shadow-glow"
          >
            View Match History
          </Button>
        </motion.div>
      )}

      {isInningsOver && !matchEnded && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-4 mt-4 bg-muted rounded-xl p-4 text-center"
        >
          <div className="font-display font-bold text-lg uppercase tracking-tight">
            Innings Over \u2014 {innings === 1 ? team1 : team2}:{" "}
            {currentInn.runs}/{currentInn.wickets}
          </div>
          {innings === 1 && (
            <div className="text-sm text-muted-foreground mt-1">
              {team2} needs {target} runs in {totalOvers} overs
            </div>
          )}
        </motion.div>
      )}

      {!matchEnded && (
        <section className="px-4 py-4 flex-1">
          <div className="grid grid-cols-4 gap-2 mb-2">
            {(["dot", "1", "2", "3"] as BallEvent[]).map((b) => (
              <button
                type="button"
                key={b}
                data-ocid="scoring.button"
                onClick={() => addBall(b)}
                disabled={isInningsOver}
                className="score-btn h-16 bg-muted hover:bg-accent text-foreground disabled:opacity-40"
              >
                {b === "dot" ? "0" : b}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-4 gap-2 mb-2">
            <button
              type="button"
              data-ocid="scoring.secondary_button"
              onClick={() => addBall("4")}
              disabled={isInningsOver}
              className="score-btn h-16 bg-blue-600/80 hover:bg-blue-600 text-white disabled:opacity-40"
            >
              4
            </button>
            <button
              type="button"
              data-ocid="scoring.toggle"
              onClick={() => addBall("6")}
              disabled={isInningsOver}
              className="score-btn col-span-2 h-16 bg-pitch-green hover:bg-pitch-green/90 text-primary-foreground text-2xl shadow-glow animate-pulse-green disabled:opacity-40"
            >
              \ud83c\udfcf SIX
            </button>
            <button
              type="button"
              data-ocid="scoring.delete_button"
              onClick={() => addBall("W")}
              disabled={isInningsOver}
              className="score-btn h-16 bg-destructive hover:bg-destructive/90 text-destructive-foreground disabled:opacity-40"
            >
              W
            </button>
          </div>
          <div className="grid grid-cols-2 gap-2 mb-4">
            <button
              type="button"
              onClick={() => addBall("WD")}
              disabled={isInningsOver}
              className="score-btn h-12 bg-yellow-600/80 hover:bg-yellow-600 text-white text-sm disabled:opacity-40"
            >
              WD (Wide)
            </button>
            <button
              type="button"
              onClick={() => addBall("NB")}
              disabled={isInningsOver}
              className="score-btn h-12 bg-orange-600/80 hover:bg-orange-600 text-white text-sm disabled:opacity-40"
            >
              NB (No Ball)
            </button>
          </div>

          <Button
            data-ocid="scoring.open_modal_button"
            onClick={handleEndInnings}
            variant="outline"
            className="w-full font-display font-semibold uppercase tracking-wide border-border"
          >
            {innings === 1 ? "End Innings \u2192" : "End Match"}
          </Button>
        </section>
      )}
    </div>
  );
}
