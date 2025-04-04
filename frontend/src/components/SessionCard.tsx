import React from "react";
import { NotebookPen } from "lucide-react";
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
import { ProjectsData } from "@/types/global";
import { Skeleton } from "@/components/ui/skeleton";
import { formatRelative } from "date-fns";
import { enUS, ja } from "date-fns/locale";
import { useTranslation } from "react-i18next";

interface SessionCardDataProp {
  sessionData: ProjectsData;
}

// SessionCardSkeleton component
export const SessionCardSkeleton: React.FC = () => {
  return (
    <Card className="w-[350px] h-[250px] bg-background-card">
      <CardHeader>
        <div className="flex justify-between items-center">
          <Skeleton className="h-5 w-20" /> {/* Genre badge */}
          <div className="flex items-center gap-1">
            <Skeleton className="h-4 w-12" /> {/* Contributors count */}
          </div>
        </div>
        <div className="flex justify-between items-center">
          <Skeleton className="h-6 w-40" /> {/* Title */}
          <div className="flex items-center gap-2">
            <Skeleton className="h-8 w-8 rounded-full" /> {/* Avatar */}
          </div>
        </div>
      </CardHeader>
      <div className="bg-white">
        <div className="m-4">
          <Skeleton className="h-4 w-full mb-2" /> {/* Description line 1 */}
          <Skeleton className="h-4 w-3/4" /> {/* Description line 2 */}
        </div>
      </div>
      <CardFooter className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <Skeleton className="h-6 w-24" /> {/* Contributors text */}
          <div className="flex -space-x-2">
            <Skeleton className="h-6 w-6 rounded-full" />
            <Skeleton className="h-6 w-6 rounded-full" />
          </div>
        </div>
        <Skeleton className="h-10 w-full" /> {/* Button */}
      </CardFooter>
    </Card>
  );
};

const SessionCard: React.FC<SessionCardDataProp> = ({
  sessionData,
}): React.ReactElement => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const contributors = sessionData.project_contributors || [];
  const maxSnippets = sessionData.max_snippets;
  const currentUser = sessionData.creator;
  const currentSnippets = sessionData.current_snippets;

  const formattedDate = sessionData.created_at
    ? `${t("openSessions.card.time.created")} ${formatRelative(
        new Date(sessionData.created_at),
        new Date(),
        { locale: sessionStorage.getItem("lang") === "ja" ? ja : enUS }
      )}`
    : "";

  const isUserContributor =
    currentUser &&
    contributors.some(
      (contributor) => contributor.contributor_id === currentUser.auth_id
    );

  const snippetsIcon = (
    <>
      <NotebookPen className="text-secondary-text p-0.5" />
      <span
        className={`text-sm ${
          isUserContributor ? "text-green-500" : "text-secondary-text"
        }`}
      >
        {" "}
        {`${currentSnippets}/${maxSnippets}`}
      </span>
    </>
  );

  return (
    <Card
      className="w-[300px] h-[327px] bg-background-card cursor-pointer"
      onClick={() => navigate(`/writing/${sessionData.id}`)}
    >
      <CardHeader className="flex-none space-y-3 h-[76px]">
        <CardHeaderWithMature
          genre={sessionData.project_genre}
          isMatureContent={sessionData.is_mature_content}
          rightContent={snippetsIcon}
        >
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <CardTitle className="text-amber-900 text-left font-bold">
                {sessionData.title}
              </CardTitle>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-secondary-text">Started by: </span>
              <span className="text-sm font-medium">
                {sessionData.creator?.user_profile_name || t("anonymous")}
              </span>
            </div>
          </div>
        </CardHeaderWithMature>
      </CardHeader>
      <div className="bg-white h-[112px] overflow-hidden ">
        <CardDescription className="m-4 text-secondary-text text-center line-clamp-3">
          {sessionData.description}
        </CardDescription>
      </div>
      <CardFooter className="flex justify-between items-center">
        <span className="text-sm text-secondary-text">{formattedDate}</span>
        <Button
          className="bg-primary-button hover:bg-primary-button-hover cursor-pointer"
          onClick={() => navigate(`/writing/${sessionData.id}`)}
        >
          {t("openSessions.card.viewSession")}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SessionCard;
