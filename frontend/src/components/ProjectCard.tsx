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
import { ProjectCardData } from "@/types/global";

interface ProjectCardDataProp {
  projectData: ProjectCardData;
}

// ProjectCards
const ProjectCard: React.FC<ProjectCardDataProp> = ({ projectData }) => {
  const navigate = useNavigate();

  return (
    <Card className='w-[350px] h-[250px] bg-background-card'>
      {/* header of card => Genre, Title, Contributors */}
      <CardHeader>
        <div className='flex justify-between items-center'>
          {/* TO DO change badge color based on genre, e.g. Horror = black background white text */}
          <Badge className={`genre-${projectData.genre.toLowerCase()}`}>
            {projectData.genre}
          </Badge>
          <div className='flex items-center gap-1'>
            <Users className='text-secondary-text p-0.5' />
            <span className='text-secondary-text text-sm'>
              {projectData.contributors.length}
            </span>
          </div>
        </div>
        <CardTitle className='text-primary-text text-left font-bold'>
          {projectData.title}
        </CardTitle>
      </CardHeader>
      <div className='bg-white'>
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
