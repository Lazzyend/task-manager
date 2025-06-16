import { Mocks } from "../mocks";
import { ProjectType } from "../components/Project/types";

export const getProjects = async (): Promise<ProjectType[]> => {
  const raw = localStorage.getItem("appState");
  const localData = raw ? JSON.parse(raw) : null;
  const projectsArray: ProjectType[] = localData?.projects?.items?.length
    ? localData.projects.items
    : Mocks;

  const mock = JSON.stringify({ projects: projectsArray });

  await new Promise((resolve) => setTimeout(resolve, 500));

  const data = JSON.parse(mock) as { projects: ProjectType[] };
  return data.projects;
};
