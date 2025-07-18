import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  Vote,
  BarChart3,
  Users,
  TrendingUp,
  Clock,
  RefreshCw,
} from "lucide-react";
import { supabase, hasValidCredentials } from "@/lib/supabase";
import { Database } from "@shared/database.types";
import { getDemoData } from "@/lib/demo-data";
import { DemoNotice } from "@/components/DemoNotice";

type Election = Database["public"]["Tables"]["elections"]["Row"];
type Position = Database["public"]["Tables"]["positions"]["Row"];
type Candidate = Database["public"]["Tables"]["candidates"]["Row"];

interface ElectionResults extends Election {
  positions: (Position & {
    candidates: (Candidate & {
      percentage: number;
    })[];
    totalVotes: number;
  })[];
  totalVotes: number;
}

const COLORS = ["#8b5cf6", "#06b6d4", "#10b981", "#f59e0b", "#ef4444"];

export default function Results() {
  const [elections, setElections] = useState<ElectionResults[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchResults();
    // Set up real-time updates
    const interval = setInterval(fetchResults, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchResults = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);

    try {
      if (!hasValidCredentials) {
        // Use demo data
        const demoData = getDemoData();
        const publishedElections = demoData.elections.filter(
          (e) => e.results_published,
        );

        const resultsData = publishedElections.map((election) => {
          const positions = demoData.positions
            .filter((p) => p.election_id === election.id)
            .map((position) => {
              const candidates = demoData.candidates
                .filter((c) => c.position_id === position.id)
                .sort((a, b) => b.vote_count - a.vote_count); // Sort by vote count

              const totalVotes = candidates.reduce(
                (sum, candidate) => sum + candidate.vote_count,
                0,
              );

              const candidatesWithPercentage = candidates.map((candidate) => ({
                ...candidate,
                percentage:
                  totalVotes > 0
                    ? Math.round((candidate.vote_count / totalVotes) * 100)
                    : 0,
              }));

              return {
                ...position,
                candidates: candidatesWithPercentage,
                totalVotes,
              };
            });

          const electionTotalVotes = positions.reduce(
            (sum, position) => sum + position.totalVotes,
            0,
          );

          return {
            ...election,
            positions,
            totalVotes: electionTotalVotes,
          };
        });

        setElections(resultsData);
        setLoading(false);
        setRefreshing(false);
        return;
      }

      // Fetch elections with published results
      const { data: electionsData, error: electionsError } = await supabase
        .from("elections")
        .select("*")
        .eq("results_published", true)
        .order("created_at", { ascending: false });

      if (electionsError) throw electionsError;

      const resultsData = await Promise.all(
        (electionsData || []).map(async (election) => {
          // Fetch positions for this election
          const { data: positions, error: positionsError } = await supabase
            .from("positions")
            .select("*")
            .eq("election_id", election.id);

          if (positionsError) throw positionsError;

          // Fetch candidates with vote counts for each position
          const positionsWithResults = await Promise.all(
            (positions || []).map(async (position) => {
              const { data: candidates, error: candidatesError } =
                await supabase
                  .from("candidates")
                  .select("*")
                  .eq("position_id", position.id)
                  .order("vote_count", { ascending: false });

              if (candidatesError) throw candidatesError;

              const totalVotes = (candidates || []).reduce(
                (sum, candidate) => sum + candidate.vote_count,
                0,
              );

              const candidatesWithPercentage = (candidates || []).map(
                (candidate) => ({
                  ...candidate,
                  percentage:
                    totalVotes > 0
                      ? Math.round((candidate.vote_count / totalVotes) * 100)
                      : 0,
                }),
              );

              return {
                ...position,
                candidates: candidatesWithPercentage,
                totalVotes,
              };
            }),
          );

          const electionTotalVotes = positionsWithResults.reduce(
            (sum, position) => sum + position.totalVotes,
            0,
          );

          return {
            ...election,
            positions: positionsWithResults,
            totalVotes: electionTotalVotes,
          };
        }),
      );

      setElections(resultsData);
    } catch (error) {
      console.error("Error fetching results:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    fetchResults(true);
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
              <Badge variant="outline">Results</Badge>
            </div>
            <Button
              variant="outline"
              onClick={handleRefresh}
              disabled={refreshing}
            >
              <RefreshCw
                className={`w-4 h-4 mr-2 ${refreshing ? "animate-spin" : ""}`}
              />
              Refresh
            </Button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <DemoNotice />

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Election Results</h1>
          <p className="text-gray-600 mt-2">
            Live results from published elections
          </p>
        </div>

        {elections.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No Published Results
              </h3>
              <p className="text-gray-600">
                Election results will appear here once published by
                administrators.
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
                    <div className="flex flex-col items-end space-y-2">
                      <Badge variant="default">Results Published</Badge>
                      <div className="flex items-center text-sm text-gray-600">
                        <Users className="w-4 h-4 mr-1" />
                        {election.totalVotes} total votes
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-8">
                    {election.positions.map((position) => (
                      <div key={position.id}>
                        <div className="flex justify-between items-center mb-6">
                          <h3 className="text-xl font-semibold">
                            {position.title}
                          </h3>
                          <div className="text-sm text-gray-600">
                            {position.totalVotes} votes cast
                          </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                          {/* Bar Chart */}
                          <div>
                            <h4 className="text-lg font-medium mb-4">
                              Vote Distribution
                            </h4>
                            <ResponsiveContainer width="100%" height={300}>
                              <BarChart data={position.candidates}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis
                                  dataKey="name"
                                  tick={{ fontSize: 12 }}
                                  interval={0}
                                  angle={-45}
                                  textAnchor="end"
                                  height={80}
                                />
                                <YAxis />
                                <Tooltip />
                                <Bar
                                  dataKey="vote_count"
                                  fill="#8b5cf6"
                                  radius={[4, 4, 0, 0]}
                                />
                              </BarChart>
                            </ResponsiveContainer>
                          </div>

                          {/* Pie Chart */}
                          <div>
                            <h4 className="text-lg font-medium mb-4">
                              Percentage Breakdown
                            </h4>
                            <ResponsiveContainer width="100%" height={300}>
                              <PieChart>
                                <Pie
                                  data={position.candidates}
                                  cx="50%"
                                  cy="50%"
                                  labelLine={false}
                                  label={({ name, percentage }) =>
                                    `${name}: ${percentage}%`
                                  }
                                  outerRadius={100}
                                  fill="#8884d8"
                                  dataKey="vote_count"
                                >
                                  {position.candidates.map((entry, index) => (
                                    <Cell
                                      key={`cell-${index}`}
                                      fill={COLORS[index % COLORS.length]}
                                    />
                                  ))}
                                </Pie>
                                <Tooltip />
                              </PieChart>
                            </ResponsiveContainer>
                          </div>
                        </div>

                        {/* Detailed Results */}
                        <div className="mt-6">
                          <h4 className="text-lg font-medium mb-4">
                            Detailed Results
                          </h4>
                          <div className="space-y-4">
                            {position.candidates.map((candidate, index) => (
                              <div
                                key={candidate.id}
                                className="flex items-center justify-between p-4 bg-white rounded-lg border"
                              >
                                <div className="flex items-center space-x-4">
                                  <div className="flex items-center space-x-2">
                                    <div className="text-lg font-bold text-gray-500">
                                      #{index + 1}
                                    </div>
                                    {index === 0 && (
                                      <Badge variant="default">Winner</Badge>
                                    )}
                                  </div>
                                  <div>
                                    <div className="font-semibold">
                                      {candidate.name}
                                    </div>
                                    {candidate.bio && (
                                      <div className="text-sm text-gray-600">
                                        {candidate.bio}
                                      </div>
                                    )}
                                  </div>
                                </div>
                                <div className="flex items-center space-x-4">
                                  <div className="text-right">
                                    <div className="font-semibold">
                                      {candidate.vote_count} votes
                                    </div>
                                    <div className="text-sm text-gray-600">
                                      {candidate.percentage}%
                                    </div>
                                  </div>
                                  <div className="w-32">
                                    <Progress
                                      value={candidate.percentage}
                                      className="h-2"
                                    />
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Last Updated */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <Clock className="w-4 h-4 inline mr-1" />
          Results update automatically every 30 seconds
        </div>
      </div>
    </div>
  );
}
