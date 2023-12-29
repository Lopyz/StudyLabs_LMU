// utils/searchProjects.ts

type ProjectData = {
    id: string;
    title: string;
    username: string;
    grandTotalPoints: string;
    grandTotalAchievablePoints: string;
    timestamp: Date;
  };
  
  export const searchProjects = (
    projects: ProjectData[],
    query: string
  ): ProjectData[] => {
    if (!query) return projects;
  
    const lowerQuery = query.toLowerCase();
  
    return projects.filter((project) => {
      return (
        project.title.toLowerCase().includes(lowerQuery) ||
        project.username.toLowerCase().includes(lowerQuery) ||
        project.grandTotalPoints.toLowerCase().includes(lowerQuery) ||
        new Date(project.timestamp).toLocaleString().includes(lowerQuery)
      );
    });
  };
  