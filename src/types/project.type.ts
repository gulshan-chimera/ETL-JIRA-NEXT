interface Issue {
  issueKey: string;
  summary: string;
  issueType: string;
  status: string;
  priority: string;
  assignee: string;
  created: string;
}

interface Project {
  projectId: string;
  projectKey: string;
  projectName: string;
  projectLead: string;
  issues: Issue[];
}

type IssueKey = "status" | "priority" | "assignee" | "issueType";
