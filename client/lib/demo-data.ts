import { Database } from "@shared/database.types";

type Election = Database["public"]["Tables"]["elections"]["Row"];
type User = Database["public"]["Tables"]["users"]["Row"];
type Position = Database["public"]["Tables"]["positions"]["Row"];
type Candidate = Database["public"]["Tables"]["candidates"]["Row"];

export const demoElections: Election[] = [
  {
    id: "demo-election-1",
    title: "Student Council Election 2024",
    description:
      "Annual student council election for the academic year 2024-2025",
    start_date: "2024-01-01T00:00:00Z",
    end_date: "2024-12-31T23:59:59Z",
    is_active: true,
    results_published: true,
    created_by: "demo-admin",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "demo-election-2",
    title: "Board of Directors Election",
    description: "Election for the board of directors positions",
    start_date: "2024-06-01T00:00:00Z",
    end_date: "2024-06-30T23:59:59Z",
    is_active: false,
    results_published: false,
    created_by: "demo-admin",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
];

export const demoUsers: User[] = [
  {
    id: "demo-admin",
    email: "admin@jaytec.com",
    voter_id: "ADMIN001",
    first_name: "Demo",
    last_name: "Administrator",
    role: "admin",
    is_verified: true,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "demo-user-1",
    email: "john@example.com",
    voter_id: "VOTER001",
    first_name: "John",
    last_name: "Doe",
    role: "voter",
    is_verified: true,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "demo-user-2",
    email: "jane@example.com",
    voter_id: "VOTER002",
    first_name: "Jane",
    last_name: "Smith",
    role: "voter",
    is_verified: false,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "demo-user-3",
    email: "mike@example.com",
    voter_id: "VOTER003",
    first_name: "Mike",
    last_name: "Johnson",
    role: "voter",
    is_verified: true,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "demo-user-4",
    email: "sarah@example.com",
    voter_id: "VOTER004",
    first_name: "Sarah",
    last_name: "Wilson",
    role: "voter",
    is_verified: true,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "demo-user-5",
    email: "voter@jaytec.com",
    voter_id: "VOTER005",
    first_name: "Demo",
    last_name: "Voter",
    role: "voter",
    is_verified: true,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
];

export const demoPositions: Position[] = [
  {
    id: "demo-position-1",
    election_id: "demo-election-1",
    title: "President",
    description: "Student body president for the academic year",
    max_votes: 1,
    created_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "demo-position-2",
    election_id: "demo-election-1",
    title: "Vice President",
    description: "Student body vice president",
    max_votes: 1,
    created_at: "2024-01-01T00:00:00Z",
  },
];

export const demoCandidates: Candidate[] = [
  {
    id: "demo-candidate-1",
    position_id: "demo-position-1",
    name: "Alice Johnson",
    bio: "Computer Science major with leadership experience",
    image_url: null,
    vote_count: 245,
    created_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "demo-candidate-2",
    position_id: "demo-position-1",
    name: "Bob Wilson",
    bio: "Business Administration student and debate team captain",
    image_url: null,
    vote_count: 189,
    created_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "demo-candidate-3",
    position_id: "demo-position-1",
    name: "Carol Davis",
    bio: "Environmental Science major and sustainability advocate",
    image_url: null,
    vote_count: 156,
    created_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "demo-candidate-4",
    position_id: "demo-position-2",
    name: "David Brown",
    bio: "Engineering student with student government experience",
    image_url: null,
    vote_count: 198,
    created_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "demo-candidate-5",
    position_id: "demo-position-2",
    name: "Emma Garcia",
    bio: "Psychology major and peer counselor",
    image_url: null,
    vote_count: 234,
    created_at: "2024-01-01T00:00:00Z",
  },
];

export const getDemoData = () => ({
  elections: demoElections,
  users: demoUsers,
  positions: demoPositions,
  candidates: demoCandidates,
});
