import React from "react";
import { Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Badge,
} from "@/components/ui";

interface ProjectCardData {
  projectData: {
    id: string;
    title: string;
    description: string;
    genre: string;
    contributors: string[];
    dateCompleted: Date;
    // reacts: react[] extended feature
  };
}

// ProjectCards
const ProjectCard: React.FC<ProjectCardData> = ({ projectData }) => {
  const navigate = useNavigate();

  return (
    <Card className='w-[350px] h-[250px] bg-background'>
      {/* header of card => Genre, Title, Contributors */}
      <CardHeader>
        <div className='flex justify-between items-center'>
          {/* TO DO change badge color based on genre, e.g. Horror = black background white text */}
          <Badge className='bg-indigo-100 text-indigo-800'>
            {projectData.genre}
          </Badge>
          <div className='flex items-center gap-1'>
            <Users className='text-secondary-text h-4 w-4' />
            <span className='text-secondary-text text-sm'>
              {projectData.contributors.length}
            </span>
          </div>
        </div>
        <CardTitle className='text-primary-text text-left font-bold'>
          {projectData.title}
        </CardTitle>
      </CardHeader>
      <div>
        <CardDescription className='m-4 text-secondary-text'>
          {projectData.description}
        </CardDescription>
      </div>
      <CardFooter className='flex justify-between items-center'>
        <span className='text-sm text-secondary-text'>
          Completed: {projectData.dateCompleted.toLocaleDateString()}
        </span>
        <Button
          className='bg-primary-button hover:bg-primary-button-hover'
          onClick={() => navigate(`/projects/${projectData.id}/read`)}
        >
          Read Story
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProjectCard;
