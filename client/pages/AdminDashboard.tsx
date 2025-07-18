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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Vote,
  Users,
  BarChart3,
  Settings,
  Plus,
  Play,
  Pause,
  Eye,
  EyeOff,
  Calendar,
  Edit,
  Trash2,
  UserCheck,
  UserX,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase, hasValidCredentials } from "@/lib/supabase";
import { Database } from "@shared/database.types";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { getDemoData } from "@/lib/demo-data";
import { DemoNotice } from "@/components/DemoNotice";

type Election = Database["public"]["Tables"]["elections"]["Row"];
type User = Database["public"]["Tables"]["users"]["Row"];

export default function AdminDashboard() {
  return (
    <ProtectedRoute requireAdmin>
      <AdminDashboardContent />
    </ProtectedRoute>
  );
}

function AdminDashboardContent() {
  const { profile, signOut } = useAuth();
  const [elections, setElections] = useState<Election[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [createElectionOpen, setCreateElectionOpen] = useState(false);
  const [newElection, setNewElection] = useState({
    title: "",
    description: "",
    startDate: "",
    endDate: "",
  });

  useEffect(() => {
    fetchElections();
    fetchUsers();
  }, []);

  const fetchElections = async () => {
    try {
      if (!hasValidCredentials) {
        // Use demo data
        const demoData = getDemoData();
        setElections(demoData.elections);
        return;
      }

      const { data, error } = await supabase
        .from("elections")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setElections(data || []);
    } catch (error) {
      console.error("Error fetching elections:", error);
    }
  };

  const fetchUsers = async () => {
    try {
      if (!hasValidCredentials) {
        // Use demo data
        const demoData = getDemoData();
        setUsers(demoData.users);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase.from("users").select("*");

      if (error) throw error;
      setUsers(data || []);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching users:", error);
      setLoading(false);
    }
  };

  const createElection = async () => {
    try {
      if (!hasValidCredentials) {
        // Demo mode - simulate creation
        console.log("Demo mode: Election would be created:", newElection);
        setCreateElectionOpen(false);
        setNewElection({
          title: "",
          description: "",
          startDate: "",
          endDate: "",
        });
        return;
      }

      const { error } = await supabase.from("elections").insert({
        title: newElection.title,
        description: newElection.description,
        start_date: newElection.startDate,
        end_date: newElection.endDate,
        created_by: profile?.id || "",
      });

      if (error) throw error;

      setCreateElectionOpen(false);
      setNewElection({
        title: "",
        description: "",
        startDate: "",
        endDate: "",
      });
      fetchElections();
    } catch (error) {
      console.error("Error creating election:", error);
    }
  };

  const toggleElectionStatus = async (
    electionId: string,
    isActive: boolean,
  ) => {
    try {
      if (!hasValidCredentials) {
        console.log("Demo mode: Election status would be toggled");
        return;
      }

      const { error } = await supabase
        .from("elections")
        .update({ is_active: !isActive })
        .eq("id", electionId);

      if (error) throw error;
      fetchElections();
    } catch (error) {
      console.error("Error updating election status:", error);
    }
  };

  const toggleResultsPublication = async (
    electionId: string,
    isPublished: boolean,
  ) => {
    try {
      if (!hasValidCredentials) {
        console.log("Demo mode: Results publication would be toggled");
        return;
      }

      const { error } = await supabase
        .from("elections")
        .update({ results_published: !isPublished })
        .eq("id", electionId);

      if (error) throw error;
      fetchElections();
    } catch (error) {
      console.error("Error updating results publication:", error);
    }
  };

  const verifyUser = async (userId: string, isVerified: boolean) => {
    try {
      if (!hasValidCredentials) {
        console.log("Demo mode: User verification would be updated");
        return;
      }

      const { error } = await supabase
        .from("users")
        .update({ is_verified: !isVerified })
        .eq("id", userId);

      if (error) throw error;
      fetchUsers();
    } catch (error) {
      console.error("Error updating user verification:", error);
    }
  };

  const stats = [
    {
      title: "Total Elections",
      value: elections.length.toString(),
      icon: Vote,
      color: "text-blue-600",
    },
    {
      title: "Registered Users",
      value: users.length.toString(),
      icon: Users,
      color: "text-green-600",
    },
    {
      title: "Verified Voters",
      value: users.filter((u) => u.is_verified).length.toString(),
      icon: UserCheck,
      color: "text-purple-600",
    },
    {
      title: "Active Elections",
      value: elections.filter((e) => e.is_active).length.toString(),
      icon: BarChart3,
      color: "text-emerald-600",
    },
  ];

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
              <Badge variant="secondary">Admin</Badge>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Welcome, {profile?.first_name}
              </span>
              <Button variant="outline" onClick={signOut}>
                Logout
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <DemoNotice />

        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Admin Dashboard
            </h1>
            <p className="text-gray-600 mt-2">
              Manage elections, voters, and system settings
            </p>
          </div>
          <Dialog
            open={createElectionOpen}
            onOpenChange={setCreateElectionOpen}
          >
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Create Election
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Election</DialogTitle>
                <DialogDescription>
                  Set up a new election with candidates and voting periods.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Election Title</Label>
                  <Input
                    id="title"
                    value={newElection.title}
                    onChange={(e) =>
                      setNewElection({ ...newElection, title: e.target.value })
                    }
                    placeholder="e.g., Student Council Election 2024"
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={newElection.description}
                    onChange={(e) =>
                      setNewElection({
                        ...newElection,
                        description: e.target.value,
                      })
                    }
                    placeholder="Election description..."
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="startDate">Start Date</Label>
                    <Input
                      id="startDate"
                      type="datetime-local"
                      value={newElection.startDate}
                      onChange={(e) =>
                        setNewElection({
                          ...newElection,
                          startDate: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="endDate">End Date</Label>
                    <Input
                      id="endDate"
                      type="datetime-local"
                      value={newElection.endDate}
                      onChange={(e) =>
                        setNewElection({
                          ...newElection,
                          endDate: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
                <Button onClick={createElection} className="w-full">
                  Create Election
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Elections Management */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Elections</CardTitle>
            <CardDescription>
              Manage your elections, candidates, and voting periods
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {elections.map((election) => (
                <div
                  key={election.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex-1">
                    <h3 className="font-semibold">{election.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {election.description}
                    </p>
                    <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                      <span className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {new Date(
                          election.start_date,
                        ).toLocaleDateString()} -{" "}
                        {new Date(election.end_date).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge
                      variant={election.is_active ? "default" : "secondary"}
                    >
                      {election.is_active ? "Active" : "Inactive"}
                    </Badge>
                    {election.results_published && (
                      <Badge variant="outline">Results Published</Badge>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        toggleElectionStatus(election.id, election.is_active)
                      }
                    >
                      {election.is_active ? (
                        <Pause className="w-4 h-4" />
                      ) : (
                        <Play className="w-4 h-4" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        toggleResultsPublication(
                          election.id,
                          election.results_published,
                        )
                      }
                    >
                      {election.results_published ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </div>
              ))}
              {elections.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No elections created yet. Create your first election to get
                  started.
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* User Management */}
        <Card>
          <CardHeader>
            <CardTitle>User Management</CardTitle>
            <CardDescription>
              Verify voters and manage user accounts. All users are
              automatically assigned as voters. Admin roles must be manually
              assigned by administrators.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Voter ID</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      {user.first_name} {user.last_name}
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.voter_id}</TableCell>
                    <TableCell>
                      <Badge
                        variant={user.role === "admin" ? "default" : "outline"}
                      >
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={user.is_verified ? "default" : "secondary"}
                      >
                        {user.is_verified ? "Verified" : "Unverified"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => verifyUser(user.id, user.is_verified)}
                      >
                        {user.is_verified ? (
                          <UserX className="w-4 h-4" />
                        ) : (
                          <UserCheck className="w-4 h-4" />
                        )}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
