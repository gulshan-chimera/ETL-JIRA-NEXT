"use client";

import { useState } from "react";
import { axiosInstance as axios } from "@/lib/axios";
import { Header } from "./../../_components/header";
import { useFetch } from "@/lib/hooks/useFetch";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Bar, BarChart, XAxis } from "recharts";
import { TrendingUp } from "lucide-react";
import { CartesianGrid, LabelList } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { IssueType, ProjectType } from "../../../../types/models.type";

export const description = "A bar chart with a label";
const chartData = [
  { month: "January", desktop: 186 },
  { month: "February", desktop: 305 },
  { month: "March", desktop: 237 },
  { month: "April", desktop: 73 },
  { month: "May", desktop: 209 },
  { month: "June", desktop: 214 },
];

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

export default function DashboardPage() {
  const {
    data: projectsData,
    loading: projectLoading,
    error: projectError,
  } = useFetch<ProjectType[]>({ url: "/projects", defaultState: [] });

  const [selectedProject, setSelectedProject] = useState<ProjectType | null>(
    null
  );

  const [issues, setIssues] = useState<IssueType[]>([]);

  const [selectedKey, setSelectedKey] = useState<string>("");
  const [keyOptions, setKeyOptions] = useState<string[]>([]);

  const [issuesLoading, setIssuesLoading] = useState(false);

  const fetchIssues = async (selectedProject: ProjectType) => {
    setIssuesLoading(true);
    try {
      const res = await axios.get<IssueType[]>(
        `/projects/${selectedProject.key}/issues`
      );
      setIssues(res.data);

      if (res.data.length > 0) {
        const allowedKeys = [
          "status",
          "priority",
          "assignee",
          "reporter",
          "summary",
          "issueType",
        ];

        const issueKeys = Object.keys(res.data[0]);
        const filteredKeys = issueKeys.filter((key) =>
          allowedKeys.includes(key)
        );

        setKeyOptions(filteredKeys);
        if (!selectedKey && filteredKeys.length > 0) {
          setSelectedKey(filteredKeys[0]);
        }
      } else {
        setKeyOptions([]);
        setSelectedKey("");
      }
    } catch (err) {
      console.error("Failed to fetch issues:", err);
      setIssues([]);
      setKeyOptions([]);
    } finally {
      setIssuesLoading(false);
    }
  };

  if (issuesLoading || projectLoading) return <p>Loading...</p>;
  if (!projectsData) return <p>No project Data</p>;

  return (
    <div style={{ padding: "2rem" }}>
      <Header />

      <div className="flex gap-4 mt-6 mb-6">
        <Select
          value={selectedProject?.key}
          onValueChange={(value) => {
            const proj = projectsData.find((p) => p.key === value);
            if (proj) {
              setSelectedProject(proj);
              fetchIssues(proj);
            }
          }}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Project" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Select a Project</SelectLabel>
              {projectsData.map((project) => (
                <SelectItem key={project.id} value={project.key}>
                  {project.name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>

        <Select
          value={selectedKey}
          onValueChange={(value) => setSelectedKey(value)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select a key" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Select Key</SelectLabel>
              {keyOptions.map((keyOption) => (
                <SelectItem key={keyOption} value={keyOption}>
                  {keyOption.charAt(0).toUpperCase() + keyOption.slice(1)}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Card>
          <CardHeader>
            <CardTitle>Key -{selectedProject?.key} </CardTitle>
            <CardDescription>January - June 2024</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig}>
              <BarChart
                accessibilityLayer
                data={chartData}
                margin={{
                  top: 20,
                }}
              >
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  tickFormatter={(value) => value.slice(0, 3)}
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />
                <Bar dataKey="desktop" fill="var(--color-desktop)" radius={8}>
                  <LabelList
                    position="top"
                    offset={12}
                    className="fill-foreground"
                    fontSize={12}
                  />
                </Bar>
              </BarChart>
            </ChartContainer>
          </CardContent>
          <CardFooter className="flex-col items-start gap-2 text-sm">
            <div className="flex gap-2 leading-none font-medium">
              Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
            </div>
            <div className="text-muted-foreground leading-none">
              Showing total visitors for the last 6 months
            </div>
          </CardFooter>
        </Card>

        <Card>
          <div className="text-muted-foreground leading-none">
            {selectedKey === "summary" && (
              <ul>
                {issues.map((issue) => (
                  <li key={issue.id}>{issue.summary}</li>
                ))}
              </ul>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
