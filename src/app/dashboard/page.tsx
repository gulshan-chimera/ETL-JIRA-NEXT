"use client";

import { useState, useEffect } from "react";
import { axiosInstance as axios } from "@/lib/axios";
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

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import type { ProjectType } from "@/types/project.type";
import type { IssueType } from "@/types/issue.type";

import { Header } from "../_components/header";
import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  RadialBar,
  RadialBarChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export default function DashboardPage() {
  const {
    data: projectsResponse,
    loading: projectLoading,
    error: projectError,
  } = useFetch<{
    projects: ProjectType[];
    total: number;
    page: number;
    limit: number;
  }>({
    url: "/etl/projects",
    defaultState: { projects: [], total: 0, page: 1, limit: 100 },
  });

  //project data
  const projectsData = projectsResponse.projects;
  const [selectedProject, setSelectedProject] = useState<ProjectType | null>(
    null
  );

  // issues of selected project
  const [issues, setIssues] = useState<IssueType[]>([]);
  const [selectedIssueId, setSelectedIssueId] = useState<string | null>(null);

  // fetch issues when project changes
  useEffect(() => {
    if (!selectedProject) return;
    const fetchIssues = async () => {
      try {
        const res = await axios.get<{ issues: IssueType[] }>(
          `etl/projects/${selectedProject.id}/issues`
        );
        setIssues(res.data.issues);
      } catch (err) {
        console.error("failed to fetch issues:", err);
        setIssues([]);
      }
    };
    fetchIssues();
  }, [selectedProject]);

  // Count issues by status
  const statusData = [
    {
      status: "Done",
      count: issues.filter((i) => i.status === "Done").length,
      fill: "#0a963dff",
    },
    {
      status: "Other",
      count: issues.filter((i) => i.status !== "Done").length,
      fill: "#9c6403ff",
    },
  ];

  // Count issues per assignee
  const assigneeData = Object.entries(
    issues.reduce((acc: Record<string, number>, issue) => {
      const assignee = issue.assignee ?? "Unassigned";
      acc[assignee] = (acc[assignee] || 0) + 1;
      return acc;
    }, {})
  ).map(([assignee, count]) => ({ assignee, count }));

  if (projectLoading) return <p>Loading...</p>;
  if (projectError) return <p>Error in fetching Project data</p>;
  if (!projectsData) return <p>No project Data</p>;

  return (
    <div style={{ padding: "2rem" }}>
      <Header />

      {/* select project */}
      <div className='flex gap-4 mt-6 mb-6'>
        <Select
          value={selectedProject?.key}
          onValueChange={(value) => {
            //find by project key
            const proj = projectsData.find((p) => p.key === value);
            if (proj) {
              //project data into selected project
              setSelectedProject(proj);
              setSelectedIssueId(null);
            }
          }}
        >
          <SelectTrigger className='w-[220px]'>
            <SelectValue placeholder='Select a Project' />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Projects</SelectLabel>
              {projectsData.map((project) => (
                <SelectItem key={project.id} value={project.key}>
                  {project.name} - {project.id}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>

        {/* select issue */}
        <Select
          value={selectedIssueId ?? ""}
          onValueChange={(value) => setSelectedIssueId(value)}
          disabled={!selectedProject || issues.length === 0}
        >
          <SelectTrigger className='w-[220px]'>
            <SelectValue placeholder='Select an Issue' />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Issues</SelectLabel>
              {issues.map((issue) => (
                <SelectItem key={issue.id} value={issue.id}>
                  {issue.key} - {issue.id}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <div>
        <div className='flex gap-6 mt-6'>
          {/*Radial Chart */}
          <Card className='flex-1'>
            <CardHeader>
              <CardTitle>Status Chart</CardTitle>
              <CardDescription>{selectedProject?.name}</CardDescription>
            </CardHeader>
            <CardContent className='flex justify-center'>
              <RadialBarChart
                width={300}
                height={300}
                data={statusData}
                startAngle={90}
                endAngle={-270}
                innerRadius={20}
                outerRadius={100}
              >
                <Tooltip
                  content={({ payload }) => {
                    if (!payload || payload.length === 0) return null;
                    const data = payload[0].payload;
                    return (
                      <div className='bg-black text-white px-2 py-1 rounded text-sm'>
                        {data.status}: {data.count}
                      </div>
                    );
                  }}
                />

                <RadialBar dataKey='count' background>
                  <LabelList
                    dataKey='status'
                    position='insideStart'
                    className='fill-white font-bold'
                  />
                </RadialBar>
              </RadialBarChart>
            </CardContent>
            <CardFooter>Total issues: {issues.length}</CardFooter>
          </Card>

          {/* Bar Chart */}
          <Card className='flex-1'>
            <CardHeader>
              <CardTitle>{selectedProject?.name}</CardTitle>
              <CardDescription>({selectedProject?.key})</CardDescription>
            </CardHeader>
            <CardContent>
              <BarChart
                width={500}
                height={300}
                margin={{ top: 20 }}
                data={assigneeData}
              >
                <CartesianGrid strokeDasharray='3 3' vertical={false} />
                <XAxis dataKey='assignee' />
                <YAxis />
                <Tooltip />
                <Bar dataKey='count' fill='#201d61ff' radius={8} />
              </BarChart>
            </CardContent>
            <CardFooter className='flex-col items-start gap-2 text-sm'>
             
              <div className='text-muted-foreground leading-none'>
                {selectedProject?.key}
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
