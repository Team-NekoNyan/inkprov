import React from "react";
import ProjectCard from "../ProjectCard";

const ProjectsPage: React.FC = () => {
  // Placeholder completed projects data
  const completedProjects = [
    {
      id: "1",
      title: "The Midnight Garden",
      description:
        "A mystical tale of a garden that only appears at midnight, where reality and magic intertwine.",
      genre: "Fantasy",
      contributors: [
        "Alice Smith",
        "Bob Johnson",
        "Carol White",
        "David Brown",
      ],
      dateCompleted: new Date("2024-03-15"),
    },
    {
      id: "2",
      title: "Echoes of Tomorrow",
      description:
        "Five writers explore a future where technology and humanity find new ways to coexist.",
      genre: "Science Fiction",
      contributors: [
        "Emma Davis",
        "Frank Wilson",
        "Grace Lee",
        "Henry Miller",
        "Isabel Chen",
      ],
      dateCompleted: new Date("2024-03-10"),
    },
    {
      id: "3",
      title: "The Last Train Home",
      description:
        "A collaborative mystery set on a train where each passenger holds a piece of the puzzle.",
      genre: "Mystery",
      contributors: ["James Wright", "Kelly Thompson", "Liam O'Connor"],
      dateCompleted: new Date("2024-03-08"),
    },
    {
      id: "4",
      title: "Seasons of Change",
      description:
        "A heartwarming story about community and growth, told through the eyes of different residents.",
      genre: "Drama",
      contributors: [
        "Maria Rodriguez",
        "Noah Parker",
        "Olivia Kim",
        "Paul Chen",
      ],
      dateCompleted: new Date("2024-03-01"),
    },
  ];

  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='flex justify-between items-center mb-8'>
        <div>
          <h1 className='text-3xl font-bold text-primary-text'>
            Completed Stories
          </h1>
          <p className='text-secondary-text mt-2'>
            Browse and read collaborative stories created by our community
          </p>
        </div>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {completedProjects.map((project) => (
          <ProjectCard key={project.id} projectData={project} />
        ))}
      </div>
    </div>
  );
};

export default ProjectsPage;
