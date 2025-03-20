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
} from "@/components/ui";
import CardHeaderWithMature from "@/components/ui/CardHeaderWithMature";
import { CompletedStoriesData } from "@/types/global";
import { supabase } from "@/utils/supabase";
import { useAuth } from "@/contexts/AuthContext";

interface ProjectCardDataProp {
  projectData: CompletedStoriesData;
}

// ProjectCards
const ProjectCard: React.FC<ProjectCardDataProp> = ({ projectData }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isContributor, setIsContributor] = useState(false);
  const [isCreator, setIsCreator] = useState(false);

  // Check if user is a contributor of the story
  useEffect(() => {
    const checkContributorStatus = async () => {
      // check first if user exists, meaning authenticated and in session
      if (!user) return;

      // first check if is creator of the story
      if (user.id === projectData.creator_id) return setIsCreator(true);

      // Check if user is a contributor
      const { data: contributorData, error: contributorError } = await supabase
        .from("project_contributors")
        .select("*")
        .eq("project_id", projectData.id)
        .eq("user_id", user.id)
        .eq("user_made_contribution", true)
        .maybeSingle(); // this is for if can't find a project of user_id it will not return a error in the console log

      if (contributorError) {
        return;
      } else {
        // gives true user is in the project
        setIsContributor(!!contributorData);
      }
    };

    checkContributorStatus();
  }, [projectData, user]);

  const contributorsIcon = (
    <>
      <Users
        className={`p-0.5 ${
          isContributor || isCreator ? "text-green-600" : "text-secondary-text"
        }`}
      />
      <span className="text-secondary-text text-sm">
        {projectData.current_contributors_count}
      </span>
    </>
  );

  return (
    <Card className="w-[300px] h-[327px] bg-background-card ">
      {/* header of card => Genre, Title, Contributors */}
      <CardHeader className="flex-none space-y-3 h-[76px]">
        <CardHeaderWithMature
          genre={projectData.project_genre}
          isMatureContent={projectData.is_mature_content}
          rightContent={contributorsIcon}
        >
          <div className="flex flex-col gap-1">
            <CardTitle className="text-amber-900 text-left font-bold">
              {projectData.title}
            </CardTitle>
            <div className="flex items-center gap-2">
              <span className="text-sm text-secondary-text">started by:</span>
              <span className="text-sm font-medium">
                {isCreator
                  ? "You"
                  : projectData.users_ext.user_profile_name || "Anonymous"}
              </span>
            </div>
          </div>
        </CardHeaderWithMature>
      </CardHeader>
      <div className="bg-white h-[112px]">
        <CardDescription className="m-4 text-secondary-text text-center">
          {projectData.description}
        </CardDescription>
      </div>
      <CardFooter className="flex justify-between items-center">
        <span className="text-sm text-secondary-text">
          Completed: {new Date(projectData.updated_at).toLocaleDateString()}
        </span>
        <Button
          className="bg-primary-button hover:bg-primary-button-hover cursor-pointer"
          onClick={() =>
            navigate(`/projects/${projectData.id}/read`, {
              state: { project: projectData },
            })
          }
        >
          Read Story
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProjectCard;
