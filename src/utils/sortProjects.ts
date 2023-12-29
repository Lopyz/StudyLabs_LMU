// utils/sortProjects.ts

type ProjectData = {
    id: string;
    title: string;
    username: string;
    filename: string;
    grandTotalPoints: string;
    grandTotalAchievablePoints: string;
    date: Date;
    timestamp: Date;
  };
  
  export const sortProjects = (projects: ProjectData[], sortOrder: string): ProjectData[] => {
    const sortedProjects = [...projects]; // Erstelle eine Kopie, um das Originalarray nicht zu verändern
  
    return sortedProjects.sort((a, b) => {
      if (sortOrder === 'low_to_high') {
        return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
      } else if (sortOrder === 'high_to_low') {
        return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
      } else {
        return 0; // Keine Sortierung, wenn die Sortierreihenfolge nicht bekannt ist
      }
    });
  };
  