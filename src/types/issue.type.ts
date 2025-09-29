export type IssueStatus = "To Do" | "In Progress" | "Done";

export interface IssueType {
  id: string;
  key: string;
  summary: string;
  status: IssueStatus;
  assignee: string | null;
  created: string;
  updated: string;
  projectId: string;
}
