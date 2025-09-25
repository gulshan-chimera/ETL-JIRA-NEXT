"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { NavigationMenu } from "@/components/ui/navigation-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  CartesianGrid,
  Tooltip,
  LineChart,
  Line,
  YAxis,
} from "recharts";
import { TrendingUp } from "lucide-react";
import axios from "axios";

const keyOptions: IssueKey[] = ["status", "priority", "assignee", "issueType"];

// Component

export default function DashboardPage() {
  const [user, setUser] = useState<{ name: string } | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [selectedKey, setSelectedKey] = useState<IssueKey>(keyOptions[0]);

  const [loading, setLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get("/api/auth/profile", {
          withCredentials: true,
        });
        setUser(res.data.user);
      } catch (err) {
        console.error("Profile fetch failed", err);
        router.push("/");
      }
    };

    fetchProfile();
  }, [router]);
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await axios.get<Project[]>("/api/etl/projects");
        setProjects(res.data);

        if (res.data.length > 0) {
          setSelectedProject(res.data[0]);
        }
      } catch (err) {
        console.error("Failed to fetch projects:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post(
        "/api/auth/logout",
        {},
        {
          withCredentials: true,
        }
      );
      router.push("/");
    } catch (err) {
      console.error("Failed to logout", err);
    }
  };
  console.log("user", user);
  console.log("projects", projects);
  console.log("selectedProject", selectedProject);
  if (loading || !user || !selectedProject) return <p>Loading...</p>;

  // Chart data

  const chartData = selectedProject.issues.reduce<
    { label: string; count: number }[]
  >((acc, issue) => {
    const keyValue = issue[selectedKey] ?? "Unknown";
    const found = acc.find((x) => x.label === keyValue);
    if (found) found.count += 1;
    else acc.push({ label: keyValue, count: 1 });
    return acc;
  }, []);

  // Line chart
  const issuesOverTime = selectedProject.issues.reduce<Record<string, number>>(
    (acc, issue) => {
      acc[issue.created] = (acc[issue.created] || 0) + 1;
      return acc;
    },
    {}
  );

  const lineChartData = Object.entries(issuesOverTime).map(([date, count]) => ({
    date,
    issue: count,
  }));

  return (
    <div style={{ padding: "2rem" }}>
      <header className="w-full h-14 flex items-center justify-between px-6 bg-white border-b shadow-sm">
        <div className="text-xl font-semibold">Chart</div>
        <NavigationMenu />
        <div className="flex items-center gap-3">
          <Button size="sm" onClick={handleLogout}>
            Log Out
          </Button>
          <Avatar className="w-8 h-8">
            <AvatarImage src="/me.png" alt="user" />
            <AvatarFallback>
              {user?.name?.charAt(0)?.toUpperCase() ?? "?"}
            </AvatarFallback>
          </Avatar>
        </div>
      </header>

      <p className="mt-4">Welcome, {user.name}!</p>

      <div className="flex gap-4 mt-6 mb-6">
        {/* Project select */}
        <Select
          value={selectedProject.projectKey}
          onValueChange={(value) => {
            const proj = projects.find((p) => p.projectKey === value);
            if (proj) setSelectedProject(proj);
          }}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Project" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Select a Project</SelectLabel>
              {projects.map((project) => (
                <SelectItem key={project.projectId} value={project.projectKey}>
                  {project.projectName}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>

        {/* Key select */}
        <Select
          value={selectedKey}
          onValueChange={(value) => setSelectedKey(value as IssueKey)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select a key" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Select Key</SelectLabel>
              {keyOptions.map((k) => (
                <SelectItem key={k} value={k}>
                  {k.charAt(0).toUpperCase() + k.slice(1)}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      {/* Bar Chart */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Bar Chart - {selectedKey}</CardTitle>
          <CardDescription>{selectedProject.projectName}</CardDescription>
        </CardHeader>
        <CardContent>
          <BarChart
            width={600}
            height={300}
            data={chartData}
            margin={{ top: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="label" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#201d61ff" radius={8} />
          </BarChart>
        </CardContent>
      </Card>

      {/* Line Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Issues Created Over Time</CardTitle>
          <CardDescription>{selectedProject.projectName}</CardDescription>
        </CardHeader>
        <CardContent>
          <LineChart
            width={600}
            height={300}
            data={lineChartData}
            margin={{ top: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="issue"
              stroke="#8884d8"
              strokeWidth={2}
            />
          </LineChart>
        </CardContent>
        <CardFooter className="flex-col items-start gap-2 text-sm">
          <div className="flex gap-2 leading-none font-medium">
            Issues <TrendingUp className="h-4 w-4" />
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
