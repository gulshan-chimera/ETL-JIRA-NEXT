export interface IssueType {
  expand: string;
  id: string;
  self: string;
  key: string;
  fields: JiraIssueFields;
}

export interface JiraIssueFields {
  statusCategoryChangeDate: string;
  issueType: JiraIssueType;
  components: any[];
  timeSpent: number | null;
  timeOriginalEstimate: number | null;
  project: JiraProjectRef;
  description: string | null;
  fixVersions: any[];
  aggregateTimeSpent: number | null;
  statusCategory: JiraStatusCategory;
  resolution: JiraResolution | null;
  timeTracking: Record<string, unknown>;
  security: any | null;
  attachment: any[];
  aggregateTimeEstimate: number | null;
  resolutionDate: string | null;
  workRatio: number;
  summary: string;
  issueRestriction: {
    issueRestrictions: Record<string, unknown>;
    shouldDisplay: boolean;
  };
  watches: JiraWatches;
  lastViewed: string | null;
  creator: JiraUser;
  subtasks: any[];
  created: string;
  customField_10020?: JiraSprint[];
  customField_10021?: any;
  reporter: JiraUser;
  aggregateProgress: JiraProgress;
  priority: JiraPriority;
  customField_10001?: any;
  labels: string[];
  customField_10016?: any;
  environment: string | null;
  customField_10019?: string;
  timeEstimate: number | null;
  aggregateTimeOriginalEstimate: number | null;
  versions: any[];
  dueDate: string | null;
  progress: JiraProgress;
  issueLinks: any[];
  votes: JiraVotes;
  comment: JiraCommentSection;
  assignee: JiraUser | null;
  workLog: JiraWorklogSection;
  updated: string;
  status: JiraStatus;
}
export interface JiraIssueType {
  self: string;
  id: string;
  description: string;
  iconUrl: string;
  name: string;
  subtask: boolean;
  avatarId?: number;
  entityId?: string;
  hierarchyLevel?: number;
}

export interface JiraProjectRef {
  self: string;
  id: string;
  key: string;
  name: string;
  projectTypeKey: string;
  simplified: boolean;
  avatarUrls: Record<string, string>;
}

export interface JiraStatusCategory {
  self: string;
  id: number;
  key: string;
  colorName: string;
  name: string;
}

export interface JiraResolution {
  self: string;
  id: string;
  description: string;
  name: string;
}

export interface JiraWatches {
  self: string;
  watchCount: number;
  isWatching: boolean;
}

export interface JiraUser {
  self: string;
  accountId: string;
  emailAddress?: string;
  avatarUrls: Record<string, string>;
  displayName: string;
  active: boolean;
  timeZone: string;
  accountType: string;
}

export interface JiraSprint {
  id: number;
  name: string;
  state: string;
  boardId: number;
  goal: string;
  startDate?: string;
  endDate?: string;
  completeDate?: string;
}

export interface JiraProgress {
  progress: number;
  total: number;
}

export interface JiraPriority {
  self: string;
  iconUrl: string;
  name: string;
  id: string;
}

export interface JiraVotes {
  self: string;
  votes: number;
  hasVoted: boolean;
}

export interface JiraCommentSection {
  comments: any[];
  self: string;
  maxResults: number;
  total: number;
  startAt: number;
}

export interface JiraWorklogSection {
  startAt: number;
  maxResults: number;
  total: number;
  worklogs: any[];
}

export interface JiraStatus {
  self: string;
  description: string;
  iconUrl: string;
  name: string;
  id: string;
  statusCategory: JiraStatusCategory;
}
