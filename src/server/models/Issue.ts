import mongoose, { Schema } from "mongoose";

export interface IIssue extends mongoose.Document {
  id: string;
  key: string;
  projectKey: string;
  summary?: string;
  status?: any;
  priority?: any;
  assignee?: any;
  reporter?: any;
}

const IssueSchema = new Schema<IIssue>({
  id: { type: String, required: true },
  key: { type: String, required: true },
  projectKey: { type: String, required: true },
  summary: String,
  status: Schema.Types.Mixed,
  priority: Schema.Types.Mixed,
  assignee: Schema.Types.Mixed,
  reporter: Schema.Types.Mixed,
});

export default (mongoose.models.Issue as mongoose.Model<IIssue>) ||
  mongoose.model<IIssue>("Issue", IssueSchema);
