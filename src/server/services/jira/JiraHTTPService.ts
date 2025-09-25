import axios from "axios";
import configs from "../../configs";

const JiraHTTPService = axios.create({
  baseURL: configs.JIRA_BASE_URL,
  headers: {
    Authorization: `Basic ${Buffer.from(
      `${configs.JIRA_EMAIL}:${configs.JIRA_API_TOKEN}`
    ).toString("base64")}`,
    Accept: "application/json",
  },
});

export default JiraHTTPService;
