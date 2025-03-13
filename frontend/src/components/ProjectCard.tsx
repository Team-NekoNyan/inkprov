import React, { useState, useEffect } from "react";
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
import { ProjectsData } from "@/types/global";
import { supabase, getCurrentUser } from "@/utils/supabase";

interface ProjectCardDataProp {
  projectData: ProjectsData;
}

// ProjectCards
const ProjectCard: React.FC<ProjectCardDataProp> = ({ projectData }) => {
  const navigate = useNavigate();
  const [isContributor, setIsContributor] = useState(false);

  // Check if user is a contributor
  useEffect(() => {
    const checkContributorStatus = async () => {
      const user = await getCurrentUser();

      if (!user) return;

      // Get user's auth_id from users_ext
      const { data: userExtData, error: userExtError } = await supabase
        .from("users_ext")
        .select("id")
        .eq("user_email", user.email)
        .single();

      if (userExtError || !userExtData) return;

      // Check if user is a contributor
      const { data: contributorData, error: contributorError } = await supabase
        .from("project_contributors")
        .select("id")
        .eq("project_id", projectData.id)
        .eq("user_id", userExtData.id)
        .eq("user_made_contribution", true)
        .single();

      if (contributorError) return;

      // gives true user is in the project
      setIsContributor(!!contributorData);
    };

    checkContributorStatus();
  }, [projectData.id]);

  // const handleProjectAction = () => {
  //   if (projectData.is_completed) {
  //     navigate(`/projects/${projectData.id}/read`);
  //   } else {
  //     // Both contributor and non-contributor cases go to writing page
  //     navigate(`/writing/${projectData.id}`);
  //   }
  // };

  // const getButtonText = () => {
  //   if (projectData.is_completed) return "Read Story";
  //   if (isContributor) return "View Session";
  //   return "Join Session";
  // };

  return (
    <Card className="w-[350px] h-[250px] bg-background-card">
      {/* header of card => Genre, Title, Contributors */}
      <CardHeader>
        <div className="flex justify-between items-center">
          {/* TO DO change badge color based on genre, e.g. Horror = black background white text */}
          <Badge className={`genre-${projectData.project_genre.toLowerCase()}`}>
            {projectData.project_genre}
          </Badge>
          {/* probably horrible place to put this, need a better place to put thison the card */}
          {isContributor && <span>You Contributed</span>}
          <div className="flex items-center gap-1">
            <Users className="text-secondary-text p-0.5" />
            <span className="text-secondary-text text-sm">
              {projectData.total_contributors}
            </span>
          </div>
        </div>
        <CardTitle className="text-primary-text text-left font-bold">
          {projectData.title}
        </CardTitle>
      </CardHeader>
      <div className="bg-white">
        <CardDescription className="m-4 text-secondary-text">
          {projectData.description}
        </CardDescription>
      </div>
      <CardFooter className="flex justify-between items-center">
        <span className="text-sm text-secondary-text">
          Completed: {new Date(projectData.updated_at).toDateString()}
        </span>
        <Button
          className="bg-primary-button hover:bg-primary-button-hover"
          onClick={() => navigate(`/projects/${projectData.id}/read`)}
        >
          Read Story
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProjectCard;
