import JiraHTTPService from "./JiraHTTPService";

const getProjects = async () => {
  const response = await JiraHTTPService.get("/rest/api/3/project");
  return response.data;
};

export default getProjects;
