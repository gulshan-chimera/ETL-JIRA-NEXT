export interface ProjectType {
  expand: string;
  self: string;
  id: string;
  key: string;
  name: string;
  avatarUrls: Record<string, string>;
  projectTypeKey: string;
  simplified?: boolean;
  style?: string;
  isPrivate: boolean;
  properties: Record<string, unknown>;
  entityId: string;
  uuid: string;
}
