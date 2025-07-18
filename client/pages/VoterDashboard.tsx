import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import {
  Vote,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  User,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase, hasValidCredentials } from "@/lib/supabase";
import { Database } from "@shared/database.types";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { getDemoData } from "@/lib/demo-data";
import { DemoNotice } from "@/components/DemoNotice";

type Election = Database["public"]["Tables"]["elections"]["Row"];
type Position = Database["public"]["Tables"]["positions"]["Row"];
type Candidate = Database["public"]["Tables"]["candidates"]["Row"];
type VoteRecord = Database["public"]["Tables"]["votes"]["Row"];

interface ElectionWithPositions extends Election {
  positions: (Position & {
    candidates: Candidate[];
  })[];
}

export default function VoterDashboard() {
  return (
    <ProtectedRoute>
      <VoterDashboardContent />
    </ProtectedRoute>
  );
}

function VoterDashboardContent() {
  const { profile, signOut } = useAuth();
  const [elections, setElections] = useState<ElectionWithPositions[]>([]);
  const [selectedCandidates, setSelectedCandidates] = useState<
    Record<string, string>
  >({});
  const [userVotes, setUserVotes] = useState<VoteRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchActiveElections();
    fetchUserVotes();
  }, [profile]);

  const fetchActiveElections = async () => {
    try {
      if (!hasValidCredentials) {
        // Use demo data
        const demoData = getDemoData();
        const activeElections = demoData.elections.filter((e) => e.is_active);

        const electionsWithPositions = activeElections.map((election) => {
          const positions = demoData.positions
            .filter((p) => p.election_id === election.id)
            .map((position) => ({
              ...position,
              candidates: demoData.candidates.filter(
                (c) => c.position_id === position.id,
              ),
            }));

          return {
            ...election,
            positions,
          };
        });

        setElections(electionsWithPositions);
        setLoading(false);
        return;
      }

      const { data: electionsData, error: electionsError } = await supabase
        .from("elections")
        .select("*")
        .eq("is_active", true)
        .order("created_at", { ascending: false });

      if (electionsError) throw electionsError;

      const electionsWithPositions = await Promise.all(
        (electionsData || []).map(async (election) => {
          const { data: positions, error: positionsError } = await supabase
            .from("positions")
            .select("*")
            .eq("election_id", election.id);

          if (positionsError) throw positionsError;

          const positionsWithCandidates = await Promise.all(
            (positions || []).map(async (position) => {
              const { data: candidates, error: candidatesError } =
                await supabase
                  .from("candidates")
                  .select("*")
                  .eq("position_id", position.id);

              if (candidatesError) throw candidatesError;

              return {
                ...position,
                candidates: candidates || [],
              };
            }),
          );

          return {
            ...election,
            positions: positionsWithCandidates,
          };
        }),
      );

      setElections(electionsWithPositions);
    } catch (error) {
      console.error("Error fetching elections:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserVotes = async () => {
    if (!profile?.id) return;

    try {
      if (!hasValidCredentials) {
        // Demo mode - simulate some votes
        setUserVotes([
          {
            id: "demo-vote-1",
            user_id: profile.id,
            candidate_id: "demo-candidate-1",
            position_id: "demo-position-1",
            election_id: "demo-election-1",
            created_at: new Date().toISOString(),
          },
        ]);
        return;
      }

      const { data, error } = await supabase
        .from("votes")
        .select("*")
        .eq("user_id", profile.id);

      if (error) throw error;
      setUserVotes(data || []);
    } catch (error) {
      console.error("Error fetching user votes:", error);
    }
  };

  const hasVotedForPosition = (positionId: string) => {
    return userVotes.some((vote) => vote.position_id === positionId);
  };

  const submitVotes = async (electionId: string) => {
    if (!profile?.id) return;

    setSubmitting(true);

    try {
      if (!hasValidCredentials) {
        // Demo mode - simulate vote submission
        console.log("Demo mode: Votes would be submitted:", selectedCandidates);
        await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate network delay
        await fetchUserVotes();
        setSelectedCandidates({});
        setSubmitting(false);
        return;
      }

      const election = elections.find((e) => e.id === electionId);
      if (!election) return;

      const votesToSubmit = election.positions
        .filter((position) => selectedCandidates[position.id])
        .map((position) => ({
          user_id: profile.id,
          candidate_id: selectedCandidates[position.id],
          position_id: position.id,
          election_id: electionId,
        }));

      const { error } = await supabase.from("votes").insert(votesToSubmit);

      if (error) throw error;

      // Update candidate vote counts
      for (const vote of votesToSubmit) {
        const { error: updateError } = await supabase.rpc("increment_vote", {
          candidate_id: vote.candidate_id,
        });
        if (updateError)
          console.error("Error updating vote count:", updateError);
      }

      await fetchUserVotes();
      setSelectedCandidates({});
    } catch (error) {
      console.error("Error submitting votes:", error);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Vote className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-gray-900">
                JayTec E-Voting
              </span>
              <Badge variant="outline">Voter</Badge>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <User className="w-4 h-4" />
                <span className="text-sm text-gray-600">
                  {profile?.first_name} {profile?.last_name}
                </span>
                {profile?.is_verified ? (
                  <Badge variant="default" className="text-xs">
                    Verified
                  </Badge>
                ) : (
                  <Badge variant="destructive" className="text-xs">
                    Unverified
                  </Badge>
                )}
              </div>
              <Button variant="outline" onClick={signOut}>
                Logout
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <DemoNotice />

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Voting Portal</h1>
          <p className="text-gray-600 mt-2">
            Cast your vote in active elections
          </p>
        </div>

        {!profile?.is_verified && (
          <Alert className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Your account is not verified. Please contact an administrator to
              verify your credentials before voting.
            </AlertDescription>
          </Alert>
        )}

        {elections.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Vote className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No Active Elections
              </h3>
              <p className="text-gray-600">
                There are currently no active elections. Check back later.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-8">
            {elections.map((election) => (
              <Card key={election.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-2xl">
                        {election.title}
                      </CardTitle>
                      <CardDescription className="mt-2">
                        {election.description}
                      </CardDescription>
                    </div>
                    <Badge variant="default">Active</Badge>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <span className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      Ends: {new Date(election.end_date).toLocaleDateString()}
                    </span>
                    <span className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {new Date(election.end_date).toLocaleTimeString()}
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {election.positions.map((position) => {
                      const hasVoted = hasVotedForPosition(position.id);

                      return (
                        <div
                          key={position.id}
                          className="border rounded-lg p-4"
                        >
                          <div className="flex justify-between items-center mb-4">
                            <h3 className="font-semibold text-lg">
                              {position.title}
                            </h3>
                            {hasVoted && (
                              <Badge variant="default">
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Voted
                              </Badge>
                            )}
                          </div>
                          {position.description && (
                            <p className="text-gray-600 mb-4">
                              {position.description}
                            </p>
                          )}

                          {hasVoted ? (
                            <Alert>
                              <CheckCircle className="h-4 w-4" />
                              <AlertDescription>
                                You have already voted for this position.
                              </AlertDescription>
                            </Alert>
                          ) : (
                            <RadioGroup
                              value={selectedCandidates[position.id] || ""}
                              onValueChange={(value) =>
                                setSelectedCandidates((prev) => ({
                                  ...prev,
                                  [position.id]: value,
                                }))
                              }
                              disabled={!profile?.is_verified}
                            >
                              <div className="grid gap-3">
                                {position.candidates.map((candidate) => (
                                  <div
                                    key={candidate.id}
                                    className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50"
                                  >
                                    <RadioGroupItem
                                      value={candidate.id}
                                      id={candidate.id}
                                    />
                                    <Label
                                      htmlFor={candidate.id}
                                      className="flex-1 cursor-pointer"
                                    >
                                      <div>
                                        <div className="font-medium">
                                          {candidate.name}
                                        </div>
                                        {candidate.bio && (
                                          <div className="text-sm text-gray-600 mt-1">
                                            {candidate.bio}
                                          </div>
                                        )}
                                      </div>
                                    </Label>
                                  </div>
                                ))}
                              </div>
                            </RadioGroup>
                          )}
                        </div>
                      );
                    })}

                    {profile?.is_verified &&
                      election.positions.some(
                        (p) => !hasVotedForPosition(p.id),
                      ) && (
                        <div className="flex justify-end pt-4">
                          <Button
                            onClick={() => submitVotes(election.id)}
                            disabled={
                              submitting ||
                              !election.positions.some(
                                (p) =>
                                  !hasVotedForPosition(p.id) &&
                                  selectedCandidates[p.id],
                              )
                            }
                            size="lg"
                          >
                            {submitting ? "Submitting..." : "Submit Votes"}
                          </Button>
                        </div>
                      )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
