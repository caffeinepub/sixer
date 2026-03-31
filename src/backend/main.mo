import Map "mo:core/Map";
import Array "mo:core/Array";
import Iter "mo:core/Iter";
import Runtime "mo:core/Runtime";
import Order "mo:core/Order";
import List "mo:core/List";

actor {
  type BallType = {
    #runs : Nat; // 0-6 runs
    #wide;
    #noBall;
    #wicket;
  };

  type Ball = {
    ballType : BallType;
    batsman : Text;
    bowler : Text;
  };

  type MatchStatus = {
    #ongoing;
    #completed;
  };

  type MatchResult = {
    #team1Won;
    #team2Won;
    #tied;
    #draw;
  };

  type Match = {
    team1Name : Text;
    team2Name : Text;
    totalOvers : Nat;
    balls : [Ball];
    currentBatsmen : (Text, Text);
    currentBowler : Text;
    status : MatchStatus;
    ballsBowled : Nat;
    wickets1 : Nat;
    wickets2 : Nat;
    runRate : Float;
    requiredRunRate : ?Float;
    sixesCount : Nat;
    isFirstInning : Bool;
    matchResult : ?MatchResult;
  };

  module Match {
    public func compare(a : Match, b : Match) : Order.Order {
      switch (Text.compare(a.team1Name, b.team1Name)) {
        case (#equal) { Text.compare(a.team2Name, b.team2Name) };
        case other { other };
      };
    };
  };

  type CreateMatchArgs = {
    team1Name : Text;
    team2Name : Text;
    totalOvers : Nat;
  };

  let matches = Map.empty<Nat, Match>();
  var nextMatchId = 1;

  func getMatchInternal(id : Nat) : Match {
    switch (matches.get(id)) {
      case (null) { Runtime.trap("Match not found") };
      case (?match) { match };
    };
  };

  public query ({ caller }) func getMatch(id : Nat) : async Match {
    getMatchInternal(id);
  };

  public shared ({ caller }) func createMatch(args : CreateMatchArgs) : async Nat {
    let match : Match = {
      args with
      balls = [];
      currentBatsmen = ("", "");
      currentBowler = "";
      status = #ongoing;
      ballsBowled = 0;
      wickets1 = 0;
      wickets2 = 0;
      runRate = 0.0;
      requiredRunRate = null;
      sixesCount = 0;
      isFirstInning = true;
      matchResult = null;
    };
    let id = nextMatchId;
    matches.add(id, match);
    nextMatchId += 1;
    id;
  };

  public query ({ caller }) func getAllMatches() : async [Match] {
    matches.values().toArray().sort();
  };
};
