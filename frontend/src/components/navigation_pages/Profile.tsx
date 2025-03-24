import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { BookOpen, PenTool, Trophy } from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChalkboard } from "@fortawesome/free-solid-svg-icons";
import ProfileStoriesCard from "../ProfileStoriesCard";
import ProfileSkeleton from "../ProfileSkeleton";
import RewardTrophiesPage from "../user/RewardTrophiesPage";
import { ProjectsData } from "@/types/global";
import {
  getUserProfileData,
  updateProfilePicture,
  supabase,
} from "@/utils/supabase";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import ProfileSettings from "../ProfileSettings";
import UserSettings from "../UserSettings";
import { useTranslation } from "react-i18next";
import RedeemCode from "@/components/user/reward_subpages/RedeemCode";

const Profile: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();

  // Profile States
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [username, setUsername] = useState<string>("");
  const [bio, setBio] = useState<string>("");
  const [selectedProfilePicture, setSelectedProfilePicture] = useState<
    number | null
  >(null);
  const [profilepictureOptions, setProfilePictureOptions] = useState<string[]>(
    []
  );
  const [currentProfilePicture, setCurrentProfilePicture] = useState<
    string | null
  >(null);
  const [storiesCompleted, setStoriesCompleted] = useState<
    ProjectsData[] | null
  >([]);
  const [storiesInprogress, setStoriesInprogress] = useState<
    ProjectsData[] | null
  >([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [isInstructor, setIsInstructor] = useState<boolean>(false);

  // maybe future add also private toggle
  const [userPreference, setUserPreference] = useState<boolean>(false);

  // toggles between Edit Profile and and Redeem Code views on user info display card
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isRedeeming, setIsRedeeming] = useState<boolean>(false);

  const ITEMS_PER_PAGE = 6;

  useEffect(() => {
    const fetchProfileData = async () => {
      setIsLoading(true);
      try {
        // Single API call to get all user data
        const userData = await getUserProfileData();

        // Process username
        const userNameParts = userData.username.split("@")[0];
        const formattedUsername =
          userNameParts[0].toUpperCase() + userNameParts.substring(1);

        // Update all state
        setUsername(formattedUsername);
        setBio(userData.bio || "");
        setCurrentProfilePicture(userData.profilePicture);
        setProfilePictureOptions(userData.profilePictureOptions);
        setStoriesCompleted(userData.completedProjects);
        setStoriesInprogress(userData.inProgressProjects);
        setUserPreference(userData.matureContentEnabled);

        // Get instructor status
        if (user && user.id) {
          const { data: stats } = await supabase
            .from("user_gamification_stats")
            .select("is_cc_instructor")
            .eq("user_id", user.id)
            .single();

          setIsInstructor(!!stats?.is_cc_instructor);
        }
      } catch (error) {
        console.error("Error fetching profile data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfileData();
  }, [user]);

  const getInitials = () => {
    if (!user?.email) return "?";
    return user.email
      .split("@")[0]
      .split(".")
      .map((n: string) => n[0].toUpperCase())
      .join("");
  };

  return (
    <>
      {isLoading ? (
        <ProfileSkeleton />
      ) : (
        <div className=" mb-5 lg:flex lg:gap-2 lg:p-4 ">
          <section className="flex flex-col lg:h-150 w-[95%] md:w-[90%] lg:w-100 mx-auto bg-card rounded-lg border border-primary-border p-4">
            <div className="ml-auto ">
              <UserSettings userPreference={userPreference} />
            </div>
            <section className="flex space-y-5">
              <div>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <div className="relative group w-22 h-22 cursor-pointer">
                      <Avatar className="w-22 h-22 cursor-pointer">
                        <AvatarImage
                          src={
                            currentProfilePicture ||
                            user?.user_metadata?.avatar_url
                          }
                        />
                        <AvatarFallback className="bg-white border border-tab-active">
                          {getInitials()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="absolute inset-0 bg-background bg-opacity-30 flex items-center justify-center opacity-0 group-hover:opacity-60 transition-opacity duration-300 rounded-full">
                        <span className="text-primary-text text-sm font-bold">
                          {t("profile.header.profilePictureChange")}
                        </span>
                      </div>
                    </div>
                  </AlertDialogTrigger>
                  <AlertDialogContent className=" landscape:md:h-full landscape:lg:h-auto landscape:overflow-y-auto">
                    <AlertDialogHeader>
                      <AlertDialogTitle className="text-primary-text font-bold">
                        {t("profile.changeProfilePictureAlert.header.title")}
                      </AlertDialogTitle>
                      <AlertDialogDescription className="flex flex-col gap-4">
                        <div className="flex flex-wrap gap-4 justify-center">
                          {profilepictureOptions
                            .slice(
                              currentPage * ITEMS_PER_PAGE,
                              (currentPage + 1) * ITEMS_PER_PAGE
                            )
                            .map((url, index) => {
                              const actualIndex =
                                currentPage * ITEMS_PER_PAGE + index;
                              return (
                                <img
                                  key={actualIndex}
                                  src={url}
                                  alt={url.substring(url.lastIndexOf("/") + 1)}
                                  className={`w-32 h-32 rounded-full cursor-pointer transition-transform hover:scale-105 ${
                                    selectedProfilePicture === actualIndex
                                      ? "border-4 border-primary-button"
                                      : "border-2 border-transparent hover:border-primary-button/50"
                                  }`}
                                  onClick={() =>
                                    setSelectedProfilePicture(actualIndex)
                                  }
                                />
                              );
                            })}
                        </div>
                        {profilepictureOptions.length > ITEMS_PER_PAGE && (
                          <div className="flex justify-between items-center pt-4 border-t border-primary-border">
                            <Button
                              onClick={() =>
                                setCurrentPage((prev) => Math.max(0, prev - 1))
                              }
                              disabled={currentPage === 0}
                              variant="outline"
                              className="text-primary-text"
                            >
                              {t("profile.changeProfilePictureAlert.pagination.previous")}
                            </Button>
                            <span className="text-sm text-primary-text">
                              {t("profile.changeProfilePictureAlert.pagination.page")} {currentPage + 1} {t("of")}{" "}
                              {Math.ceil(
                                profilepictureOptions.length / ITEMS_PER_PAGE
                              )}
                            </span>
                            <Button
                              onClick={() =>
                                setCurrentPage((prev) =>
                                  Math.min(
                                    Math.ceil(
                                      profilepictureOptions.length /
                                        ITEMS_PER_PAGE
                                    ) - 1,
                                    prev + 1
                                  )
                                )
                              }
                              disabled={
                                currentPage >=
                                Math.ceil(
                                  profilepictureOptions.length / ITEMS_PER_PAGE
                                ) -
                                  1
                              }
                              variant="outline"
                              className="text-primary-text"
                            >
                              {t("profile.changeProfilePictureAlert.pagination.next")}
                            </Button>
                          </div>
                        )}
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel
                        className="cursor-pointer"
                        onClick={() => setSelectedProfilePicture(null)}
                      >
                       {t("cancel")}
                      </AlertDialogCancel>
                      <AlertDialogAction
                        disabled={selectedProfilePicture === null}
                        onClick={() => {
                          if (selectedProfilePicture !== null) {
                            setCurrentProfilePicture(
                              profilepictureOptions[selectedProfilePicture]
                            );
                            setSelectedProfilePicture(null);
                            updateProfilePicture(
                              profilepictureOptions[selectedProfilePicture]
                            );
                          }
                        }}
                        className="bg-primary-button hover:bg-primary-button-hover cursor-pointer"
                      >
                        {t("select")}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>

              <article className="flex flex-col justify-center">
                {!isEditing && (
                  <div className="flex items-center gap-2">
                    <h1 className="text-2xl font-bold text-primary-text">
                      {username}
                    </h1>
                    {isInstructor && (
                      <FontAwesomeIcon
                        icon={faChalkboard}
                        className="text-yellow-500"
                        size="lg"
                      />
                    )}
                  </div>
                )}

                {/* Completed Stories Tracker */}
                <div className="flex items-center ml-3 text-secondary-text">
                  <BookOpen size={20} />
                  <p className="ml-2 mb-1">
                    {storiesCompleted?.length} {t("profile.header.completedStories")}
                  </p>
                </div>
                {/* In Progress Stories Tracker */}
                <div className="flex items-center ml-3 text-secondary-text">
                  <PenTool size={20} />
                  <p className="ml-2 mb-1">
                    {storiesInprogress?.length}/5 {t("profile.header.inProgressStories")}
                  </p>
                </div>
              </article>
            </section>
            {/* Bio */}
            {!isEditing && (
              <section className="flex flex-col">
                <h3 className="text-xl font-bold text-primary-text text-left mb-1 ml-3">
                  {t("profile.header.aboutMe")}
                </h3>
                <p className="ml-3 text-secondary-text text-left">
                  {bio.length > 0 ? bio : "No Bio Written"}
                </p>
              </section>
            )}

            {!isEditing && (
              <Button
                onClick={() => setIsEditing(!isEditing)}
                className="self-center sm:self-start  mx-auto sm:mx-0 w-[90%] sm:w-[60%] md:w-[50%] lg:w-[90%] lg:self-center mt-6 bg-gray-100 text-black border border-gray-300 hover:bg-gray-200 cursor-pointer"
              >
                {t("profile.header.editProfile")}
              </Button>
            )}
            {/* handles displaying editing pane */}
            <div className="self-center sm:self-start mx-auto sm:mx-0 w-[90%] sm:w-[60%] lg:w-full">
              {isEditing && (
                <ProfileSettings
                  isEditing={isEditing}
                  setIsEditing={setIsEditing}
                  setBio={setBio}
                  setUsername={setUsername}
                />
              )}
            </div>

            {!isRedeeming && (
              <Button
                onClick={() => setIsRedeeming(!isRedeeming)}
                className="self-center sm:self-start  mx-auto sm:mx-0 w-[90%] sm:w-[60%] md:w-[50%] lg:w-[90%] lg:self-center mt-6 bg-gray-100 text-black border border-gray-300 hover:bg-gray-200 cursor-pointer"
              >
                Redeem Code
              </Button>
            )}
            {/* handles displaying redemption pane */}
            <div className="self-center sm:self-start mx-auto sm:mx-0 w-[90%] sm:w-[60%] lg:w-full">
              {isRedeeming && (
                <RedeemCode
                  isRedeeming={isRedeeming}
                  setIsRedeeming={setIsRedeeming}
                />
              )}
            </div>
          </section>

          {/* Profile Content - Main Tabs */}
          <Tabs
            defaultValue="stories"
            className="relative w-[95%] md:w-[90%] xl:w-[85%] mx-auto mt-5 lg:mt-0 lg:mb-10 gap-0 lg:flex-grow"
          >
            <TabsList className="p-0 absolute rounded-none rounded-t-lg grid grid-cols-2 bg-gray-300 z-10 h-10 shadow-none text-primary-text border !border-b-0 border-primary-border">
              <TabsTrigger
                value="stories"
                className="data-[state=active]:shadow-none border-b data-[state=active]:border-r border-primary-border
 data-[state=active]:text-primary-text data-[state=active]:bg-white cursor-pointer rounded-none rounded-t-lg h-full w-full data-[state=active]:!border-b-0"
              >
                <div className="flex items-center">
                  <BookOpen className="mr-2" size={18} />
                  {t("profile.tabs.yourStories")}
                </div>
              </TabsTrigger>
              <TabsTrigger
                value="gamification"
                className="data-[state=active]:shadow-none border-b data-[state=active]:border-l border-primary-border
 data-[state=active]:text-primary-text data-[state=active]:bg-white cursor-pointer rounded-none rounded-t-lg h-full w-full data-[state=active]:!border-b-0 "
              >
                <div className="flex items-center">
                  <Trophy className="mr-2" size={18} />
                  {t("profile.tabs.achievements")}
                </div>
              </TabsTrigger>
            </TabsList>

            {/* Your Stories Tab Content */}
            <TabsContent value="stories">
              <section className="w-full lg:min-h-full space-y-8 bg-card p-8 mt-[39px] rounded-lg rounded-tl-none border border-primary-border">
                <section className="flex flex-col">
                  <div className="flex items-center text-secondary-text">
                    <BookOpen />
                    <h3 className="text-xl font-bold text-primary-text text-left mb-1 ml-3">
                      {t("profile.stories.title")}
                    </h3>
                  </div>
                  <p className="ml-3 text-secondary-text text-left">
                    {t("profile.stories.subtitle")}
                  </p>
                </section>
                {/* Completed and In Progress Stories Tabs */}
                <Tabs defaultValue="completed">
                  <TabsList className="grid grid-cols-2 bg-tab-background">
                    <TabsTrigger
                      value="completed"
                      className="data-[state=active]:text-white data-[state=active]:bg-tab-active cursor-pointer"
                    >
                      {t("completed")}
                    </TabsTrigger>
                    <TabsTrigger
                      value="in-progress"
                      className="data-[state=active]:text-white data-[state=active]:bg-tab-active cursor-pointer"
                    >
                      {t("inProgress")}
                    </TabsTrigger>
                  </TabsList>
                  {/* Completed Stories Tab Content*/}
                  <TabsContent value="completed">
                    <section className="flex gap-4 flex-wrap">
                      {storiesCompleted == undefined ||
                      storiesCompleted?.length == 0 ? (
                        <div className="h-auto flex flex-col">
                          <p className="text-secondary-text font-medium mb-2">
                            {t("profile.empty.noCompleted")}
                          </p>
                          <Button
                            className="bg-primary-button hover:bg-primary-button-hover cursor-pointer"
                            variant="default"
                            onClick={() => navigate("/sessions/create")}
                          >
                            {t("startCreating")}
                          </Button>
                        </div>
                      ) : (
                        // Completed Stories Cards
                        storiesCompleted?.map((story) => (
                          <ProfileStoriesCard
                            selectedTab="completed"
                            genre={story.project_genre}
                            creationDate={story.created_at}
                            title={story.title}
                            collaborators={story.current_contributors_count}
                            wordCount={1051}
                            lastUpdated={story.updated_at}
                            publicStory={story.is_public}
                            storyId={story.id}
                            key={story.id}
                          />
                        ))
                      )}
                    </section>
                  </TabsContent>
                  {/* In Progress Stories Tab Content*/}
                  <TabsContent value="in-progress">
                    <section className="flex gap-4 flex-wrap">
                      {storiesInprogress == undefined ||
                      storiesInprogress?.length == 0 ? (
                        <div className="h-auto flex flex-col">
                          <p className="text-secondary-text font-medium mb-2">
                            {t("profile.empty.noInProgress")}
                          </p>
                          <Button
                            className="bg-primary-button hover:bg-primary-button-hover cursor-pointer"
                            variant="default"
                            onClick={() => navigate("/sessions/create")}
                          >
                            {t("startCreating")}
                          </Button>
                        </div>
                      ) : (
                        // In Progress Stories Cards
                        storiesInprogress?.map((story) => (
                          <ProfileStoriesCard
                            selectedTab="in-progress"
                            genre={story.project_genre}
                            creationDate={story.created_at}
                            title={story.title}
                            collaborators={story.current_contributors_count}
                            wordCount={1051}
                            lastUpdated={story.updated_at}
                            publicStory={story.is_public}
                            storyId={story.id}
                            key={story.id}
                          />
                        ))
                      )}
                    </section>
                  </TabsContent>
                </Tabs>
              </section>
            </TabsContent>

            {/* Gamification Tab Content */}
            <TabsContent value="gamification">
              <section className="w-full space-y-8 bg-card p-8 mt-[39px] rounded-lg rounded-tl-none border border-primary-border">
                <section className="flex flex-col">
                  <div className="flex items-center text-secondary-text">
                    <Trophy />
                    <h3 className="text-xl font-bold text-primary-text text-left mb-1 ml-3">
                      Gamification
                    </h3>
                  </div>
                  <p className="ml-3 text-secondary-text text-left mb-4">
                    Your achievements and progress
                  </p>
                </section>

                {/* Integrated RewardTrophiesPage component */}
                <RewardTrophiesPage />
              </section>
            </TabsContent>
          </Tabs>
        </div>
      )}
    </>
  );
};

export default Profile;
