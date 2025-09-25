import mongoose, { Schema } from "mongoose";

export interface IProject extends mongoose.Document {
  id: string;
  key: string;
  name: string;
  avatarUrls?: Record<string, string>;
  projectTypeKey?: string;
  simplified?: boolean;
  style?: string;
  isPrivate?: boolean;
}

const ProjectSchema = new Schema<IProject>({
  id: { type: String, required: true },
  key: { type: String, required: true },
  name: { type: String, required: true },
  avatarUrls: { type: Schema.Types.Mixed },
  projectTypeKey: String,
  simplified: Boolean,
  style: String,
  isPrivate: Boolean,
});

export default (mongoose.models.Project as mongoose.Model<IProject>) ||
  mongoose.model<IProject>("Project", ProjectSchema);
