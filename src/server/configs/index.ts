import z from "zod";
import dotenv from "dotenv";

dotenv.config();

const envSchema = z.object({
  MONGO_URI: z.string(),
  JIRA_EMAIL: z.string(),
  JIRA_API_TOKEN: z.string(),
  JIRA_BASE_URL: z.string(),
  SESSION_PASSWORD: z.string().min(32),
});

const result = envSchema.safeParse(process.env);
if (!result.success) {
  console.error(result.error.format());
  throw new Error("Missing or invalid environment variables");
}

export default result.data;
