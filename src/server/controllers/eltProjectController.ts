// server/controllers/etlProjectController.ts
import { prismaEtl } from "../lib/prismaEtl";

/**
 * List projects (paginated)
 */
export async function getEtlProjects({ page = 1, limit = 100 } = {}) {
  const skip = (page - 1) * limit;
  const [projects, total] = await Promise.all([
    prismaEtl.project.findMany({
      skip,
      take: limit,
      orderBy: { name: "asc" },
    }),
    prismaEtl.project.count(),
  ]);
  return { projects, total, page, limit };
}

/**
 * Find project by id or by key (identifier)
 */
export async function getEtlProjectByIdentifier(identifier: string) {
  // If your Project.id is Int in DB, convert identifier -> Number here.
  const project = await prismaEtl.project.findFirst({
    where: { OR: [{ id: identifier }, { key: identifier }] },
  });
  return project;
}

/**
 * Get issues by project identifier (id or key)
 */
export async function getEtlIssuesByProjectIdentifier(
  identifier: string,
  { page = 1, limit = 200 } = {}
) {
  const project = await getEtlProjectByIdentifier(identifier);
  if (!project) return { issues: [], total: 0, page, limit, project: null };

  const skip = (page - 1) * limit;
  const [issues, total] = await Promise.all([
    prismaEtl.issue.findMany({
      where: { projectId: project.id },
      skip,
      take: limit,
      orderBy: { created: "desc" },
    }),
    prismaEtl.issue.count({ where: { projectId: project.id } }),
  ]);
  return { issues, total, page, limit, project };
}
