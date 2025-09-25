import JiraHTTPService from "./JiraHTTPService";

const getIssuesByProjectID = async (id: string) => {
  const response = await JiraHTTPService.get(
    `/rest/api/3/search?jql=project=${id}&maxResults=1000`
  );
  return response.data;
};

export default getIssuesByProjectID;
