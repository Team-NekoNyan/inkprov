// container component for WritingPage

"use client";

import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

// Sonner component for toast notifications
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Loader2 } from "lucide-react";
import {
  supabase,
  getCurrentUser,
  getProjectContributors,
  getProjectSnippets,
} from "../../utils/supabase";
import SnippetSkeleton from "../SnippetSkeleton";
import { Skeleton } from "@/components/ui/skeleton";
import { PenTool, Crown } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ProjectSnippet } from "@/types/global";

// Basic interfaces for our data
interface Project {
  id: string;
  title: string;
  description: string;
  max_snippets: number; // Renamed field to focus on snippet count rather than contributors
  current_contributors_count: number;
  is_completed: boolean;
  is_locked: boolean;
  locked_by?: string;
}

// Use the imported type instead of redefining it
// interface ProjectSnippet {
//   content: string;
//   creator_id: string;
//   sequence_number: number;
//   created_at: string;
//   creator?: {
//     user_profile_name: string;
//   };
// }

// Interface for contributor (imported from supabase utils)
interface Contributor {
  id: string;
  user_id: string;
  project_id: string;
  user_made_contribution: boolean;
  current_writer: boolean;
  joined_at?: string;
  last_contribution_at?: string;
  user?: {
    id: string;
    user_profile_name: string;
    avatar_url?: string;
  };
  user_is_project_creator: boolean;
}

const WritingEditor: React.FC = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();

  // State management
  const [project, setProject] = useState<Project | null>(null);
  const [isContributor, setIsContributor] = useState(false);
  const [isCurrentlyWriting, setIsCurrentlyWriting] = useState(false); // Renamed from isMyTurn
  const [content, setContent] = useState("");
  const [wordCount, setWordCount] = useState(0);
  const [previousSnippets, setPreviousSnippets] = useState<ProjectSnippet[]>(
    []
  );
  const [userData, setUserData] = useState<{ auth_id: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [contributors, setContributors] = useState<Contributor[]>([]);
  const [loadingContributors, setLoadingContributors] = useState(false);
  const [isProjectCreator, setIsProjectCreator] = useState(false);
  const [projectLocked, setProjectLocked] = useState(false);
  const [lockedBy, setLockedBy] = useState<string | null>(null);

  // Function to fetch contributors - simplified version
  const fetchContributors = async () => {
    if (!projectId) return;

    setLoadingContributors(true);
    try {
      console.log("Fetching contributors for project:", projectId);
      const contributorsData = await getProjectContributors(projectId);

      // Sort contributors by joined_at to ensure consistent display order
      const sortedContributors = [...contributorsData].sort(
        (a, b) =>
          new Date(a.joined_at || "").getTime() -
          new Date(b.joined_at || "").getTime()
      );

      setContributors(sortedContributors);

      // Check if current user is a contributor
      if (userData?.auth_id) {
        const myStatus = contributorsData.find(
          (c) => c.user_id === userData.auth_id
        );
        if (myStatus) {
          setIsContributor(true);
          setIsProjectCreator(myStatus.user_is_project_creator || false);
        }
      }
    } catch (error) {
      // Keeping error log as it's important for all functionality
      console.error("Failed to load contributors:", error);
    } finally {
      setLoadingContributors(false);
    }
  };

  // replaces the original code with a call to the supabase utility function
  const fetchSnippets = async () => {
    setIsRefreshing(true);
    try {
      const snippets = await getProjectSnippets(projectId);
      if (snippets) {
        // redundancy
        setPreviousSnippets(snippets);
      } else {
        setPreviousSnippets([]);
      }
    } catch (error) {
      console.error("Error fetching snippets:", error);
      toast.error("Failed to refresh snippets");
      setPreviousSnippets([]);
    } finally {
      setIsRefreshing(false);
    }
  };

  // Fetch project data and check lock status
  useEffect(() => {
    const fetchProjectData = async () => {
      try {
        // Get current user
        const user = await getCurrentUser();

        if (!user) {
          toast.error("Please log in to view this project");
          navigate("/login");
          return;
        }

        // Set user data directly from auth
        setUserData({ auth_id: user.id });

        // Fetch project details
        const { data: projectData, error: projectError } = await supabase
          .from("projects")
          .select("*")
          .eq("id", projectId)
          .single();

        if (projectError) throw projectError;

        // Cap max_snippets at 12 if a larger value is provided
        const cappedProjectData = {
          ...projectData,
          max_snippets: projectData.max_snippets
            ? Math.min(projectData.max_snippets, 12)
            : 12,
        };

        setProject(cappedProjectData);

        // Check if project is locked and by whom
        setProjectLocked(cappedProjectData.is_locked || false);
        setLockedBy(cappedProjectData.locked_by || null);

        // Check if user is currently writing
        setIsCurrentlyWriting(cappedProjectData.locked_by === user.id);

        // Check if user is a contributor
        const { data: contributorData } = await supabase
          .from("project_contributors")
          .select("*, user:user_id(*)")
          .eq("project_id", projectId)
          .eq("user_id", user.id)
          .single();

        setIsContributor(!!contributorData);
        setIsProjectCreator(contributorData?.user_is_project_creator || false);

        // Fetch project contributors
        await fetchContributors();

        // Fetch previous snippets
        await fetchSnippets();

        // Check if project has reached max snippets (using capped value)
        if (
          previousSnippets.length >= (cappedProjectData.max_snippets || 0) &&
          cappedProjectData.max_snippets > 0
        ) {
          // Mark project as completed if it's reached max snippets
          const { error: updateError } = await supabase
            .from("projects")
            .update({ is_completed: true })
            .eq("id", projectId);

          if (updateError) {
            console.error("Error marking project as completed:", updateError);
          }
        }
      } catch (error) {
        toast.error("Error loading project");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjectData();
  }, [projectId, navigate]);

  // Handle making a contribution - replacing handleJoin
  const handleStartContribution = async () => {
    try {
      const user = await getCurrentUser();
      if (!user) {
        toast.error("Please log in to contribute to this project");
        return;
      }

      // Check if project is completed
      if (project?.is_completed) {
        toast.error("This project is already completed");
        return;
      }

      // Check if max snippets has been reached
      if (
        project?.max_snippets &&
        previousSnippets.length >= project.max_snippets
      ) {
        toast.error("This project has reached its maximum number of snippets");
        return;
      }

      // Check if project is currently locked
      if (project?.is_locked) {
        toast.error(
          `Someone else is currently writing. Please try again later.`
        );
        return;
      }

      // Lock the project for this user
      const { error: lockError } = await supabase
        .from("projects")
        .update({
          is_locked: true,
          locked_by: user.id,
        })
        .eq("id", projectId);

      if (lockError) {
        console.error("Error locking project:", lockError);
        toast.error("Failed to start contribution. Please try again.");
        return;
      }

      // Update local state
      setProjectLocked(true);
      setLockedBy(user.id);
      setIsCurrentlyWriting(true);

      toast.success("You can now write your contribution!");
    } catch (error: any) {
      console.error("Start contribution error:", error);
      toast.error(
        `Failed to start contribution: ${error.message || "Unknown error"}`
      );
    }
  };

  // Modify handleSubmit to focus on snippets over contributors
  const handleSubmit = async () => {
    if (wordCount < 50 || wordCount > 100) {
      toast.error("Please write between 50 and 100 words");
      return;
    }

    try {
      if (!userData?.auth_id) {
        toast.error("User data not available. Please log in again.");
        return;
      }
      setIsSubmitting(true);

      // Add new snippet
      const { error: snippetError } = await supabase
        .from("project_snippets")
        .insert({
          project_id: projectId,
          creator_id: userData.auth_id,
          content,
          word_count: wordCount,
          sequence_number: previousSnippets.length + 1,
          created_at: new Date().toISOString(),
        });

      if (snippetError) {
        console.error("Error adding new snippet:", snippetError);
        toast.error(`Failed to submit contribution: ${snippetError.message}`);
        setIsSubmitting(false);
        return;
      }

      // Check if user is already a contributor
      const { data: existingContributor } = await supabase
        .from("project_contributors")
        .select("id")
        .eq("project_id", projectId)
        .eq("user_id", userData.auth_id);

      // If not already a contributor, add them
      if (!existingContributor || existingContributor.length === 0) {
        // Check if this user is the project creator
        const { data: projectData } = await supabase
          .from("projects")
          .select("creator_id")
          .eq("id", projectId)
          .single();

        const isProjectCreator = projectData?.creator_id === userData.auth_id;

        // Insert new contributor
        const { error: contributorError } = await supabase
          .from("project_contributors")
          .insert({
            project_id: projectId,
            user_id: userData.auth_id,
            joined_at: new Date().toISOString(),
            user_made_contribution: true,
            user_is_project_creator: isProjectCreator,
            last_contribution_at: new Date().toISOString(),
            current_writer: false, // No longer tracking current_writer
          });

        if (contributorError) {
          console.error("Error adding new contributor:", contributorError);
          // Continue execution even if this fails
        }

        // We no longer need to update current_contributors_count since we're focusing on snippets
        // But we'll keep the record for historical purposes
        const { error: updateError } = await supabase
          .from("projects")
          .update({
            current_contributors_count:
              (project?.current_contributors_count || 0) + 1,
          })
          .eq("id", projectId);

        if (updateError) {
          console.error(
            "Failed to update project contributor count:",
            updateError
          );
          // Continue execution even if this fails
        }
      } else {
        // Update existing contributor
        const { error: updateError } = await supabase
          .from("project_contributors")
          .update({
            user_made_contribution: true,
            last_contribution_at: new Date().toISOString(),
          })
          .eq("project_id", projectId)
          .eq("user_id", userData.auth_id);

        if (updateError) {
          console.error("Error updating contributor:", updateError);
          // Continue execution even if this fails
        }
      }

      // Check if project has reached max snippets
      if (
        project?.max_snippets &&
        previousSnippets.length + 1 >= project.max_snippets
      ) {
        // Mark project as completed
        const { error: completedError } = await supabase
          .from("projects")
          .update({
            is_completed: true,
            is_locked: false,
            locked_by: null,
          })
          .eq("id", projectId);

        if (completedError) {
          console.error("Error marking project as completed:", completedError);
        } else {
          toast.success("Project completed! This was the final contribution.");
        }
      } else {
        // Unlock the project
        const { error: unlockError } = await supabase
          .from("projects")
          .update({
            is_locked: false,
            locked_by: null,
          })
          .eq("id", projectId);

        if (unlockError) {
          console.error("Error unlocking project:", unlockError);
        }
      }

      // Refresh the data
      await fetchSnippets();
      await fetchContributors();

      // Update local state
      setProjectLocked(false);
      setLockedBy(null);
      setIsCurrentlyWriting(false);
      setIsContributor(true);

      // Signal that sessions page needs to refresh data
      sessionStorage.setItem("refreshSessions", "true");

      toast.success("Contribution submitted successfully!");
      setContent("");
      setWordCount(0);

      // Refresh project data
      const { data: refreshedProject } = await supabase
        .from("projects")
        .select("*")
        .eq("id", projectId)
        .single();

      if (refreshedProject) {
        setProject(refreshedProject);
      }
    } catch (error: any) {
      console.error("Submit contribution error:", error);
      toast.error(
        `Failed to submit contribution: ${error.message || "Unknown error"}`
      );

      // Attempt to unlock the project even if there was an error
      try {
        await supabase
          .from("projects")
          .update({
            is_locked: false,
            locked_by: null,
          })
          .eq("id", projectId);

        setProjectLocked(false);
        setLockedBy(null);
        setIsCurrentlyWriting(false);
      } catch (unlockError) {
        console.error(
          "Error unlocking project after failed submission:",
          unlockError
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Add a function to cancel writing
  const handleCancelWriting = async () => {
    if (!userData?.auth_id) return;

    try {
      // Unlock the project
      const { error: unlockError } = await supabase
        .from("projects")
        .update({
          is_locked: false,
          locked_by: null,
        })
        .eq("id", projectId)
        .eq("locked_by", userData.auth_id); // Make sure only the current locker can unlock

      if (unlockError) {
        console.error("Error unlocking project:", unlockError);
        toast.error("Failed to cancel. Please try again.");
        return;
      }

      // Update local state
      setProjectLocked(false);
      setLockedBy(null);
      setIsCurrentlyWriting(false);
      setContent("");
      setWordCount(0);

      toast.success(
        "Writing cancelled. The project is now available for others."
      );
    } catch (error: any) {
      console.error("Cancel writing error:", error);
      toast.error(`Failed to cancel: ${error.message || "Unknown error"}`);
    }
  };

  // Add a manual refresh function
  const handleManualRefresh = async () => {
    try {
      await fetchContributors();
      await fetchSnippets();

      // Refresh project data to get current lock status
      const { data: refreshedProject, error } = await supabase
        .from("projects")
        .select("*")
        .eq("id", projectId)
        .single();

      if (error) {
        console.error("Error refreshing project data:", error);
        return;
      }

      if (refreshedProject) {
        setProject(refreshedProject);
        setProjectLocked(refreshedProject.is_locked || false);
        setLockedBy(refreshedProject.locked_by || null);

        // Update writing status if the current user is the one writing
        if (userData?.auth_id) {
          setIsCurrentlyWriting(
            refreshedProject.locked_by === userData.auth_id
          );
        }
      }
    } catch (error) {
      console.error("Error during manual refresh:", error);
    }
  };

  // Handle word count
  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setContent(newContent);
    setWordCount(newContent.trim().split(/\s+/).filter(Boolean).length);
  };

  const handleDeleteProject = async () => {
    if (
      !window.confirm(
        "Are you sure you want to delete this project? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      const { error } = await supabase
        .from("projects")
        .delete()
        .eq("id", projectId);

      if (error) throw error;

      // Signal that sessions page needs to refresh data
      sessionStorage.setItem("refreshSessions", "true");

      toast.success("Project deleted successfully!");
      navigate("/sessions");
    } catch (error) {
      toast.error("Failed to delete project");
    }
  };

  const renderContributors = (contributors: Contributor[]) => {
    // Always sort contributors by join date for consistent display
    const sortedContributors = [...contributors].sort(
      (a, b) =>
        new Date(a.joined_at || "").getTime() -
        new Date(b.joined_at || "").getTime()
    );

    return sortedContributors.map((contributor) => (
      <div key={contributor.id} className="flex items-center gap-2">
        {contributor.user_is_project_creator && <Crown className="text-gold" />}
        <span
          className={`text-sm font-medium px-3 py-1 rounded-full ${
            contributor.user_is_project_creator
              ? "bg-orange-500 text-white"
              : "bg-secondary text-black"
          }`}
        >
          {contributor.user?.user_profile_name || "Unknown"}
        </span>
      </div>
    ));
  };

  return (
    <div className="container mx-auto py-8 px-4 pb-16 max-w-xl">
      <div className="mb-4">
        <Button
          variant="outline"
          onClick={() => navigate("/sessions")}
          className="text-sm"
        >
          Back to Sessions
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <span>{project?.title || "Loading..."}</span>
            <Button
              variant="outline"
              size="sm"
              onClick={handleManualRefresh}
              disabled={isSubmitting || isRefreshing || loadingContributors}
              className="ml-2"
            >
              {isRefreshing || loadingContributors ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Refresh"
              )}
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Project Description */}
          <div className="mb-6">
            {isLoading ? (
              <Skeleton className="h-4 w-3/4" />
            ) : (
              <div>
                <p className="text-secondary-text text-justify mb-2">
                  {project?.description}
                </p>
                {project?.max_snippets && (
                  <div className="mt-3">
                    <p className="text-sm text-primary-text">
                      <span className="font-medium">Contributions:</span>{" "}
                      {previousSnippets.length} / {project.max_snippets}
                      {project.is_completed && " (Completed)"}
                    </p>
                    <p className="text-xs text-secondary-text mt-1">
                      Each contribution: 50-100 words
                    </p>
                    <p className="text-xs text-secondary-text">
                      Estimated total story length: {project.max_snippets * 50}-
                      {project.max_snippets * 100} words
                    </p>
                    <p className="text-xs text-secondary-text mt-1 italic">
                      Note: Stories are limited to a maximum of 12 contributions
                    </p>
                  </div>
                )}
                {projectLocked &&
                  lockedBy &&
                  lockedBy !== userData?.auth_id && (
                    <p className="text-sm text-amber-500 mt-2 font-medium">
                      Someone is currently writing a contribution
                    </p>
                  )}
              </div>
            )}
          </div>

          {/* Previous Snippets */}
          <div className="mb-6 space-y-4">
            <h3 className="text-lg font-semibold">Story So Far:</h3>
            {isLoading ? (
              <>
                <SnippetSkeleton />
                <SnippetSkeleton />
              </>
            ) : isRefreshing ? (
              <>
                {previousSnippets.map((snippet) => (
                  <div
                    key={snippet.sequence_number}
                    className="p-4 bg-secondary rounded-lg opacity-50 transition-opacity"
                  >
                    <p>{snippet.content}</p>
                    <p className="text-sm text-secondary-text mt-2">
                      Contribution #{snippet.sequence_number} by{" "}
                      {snippet.creator?.user_profile_name || "Unknown"}
                    </p>
                  </div>
                ))}
                <SnippetSkeleton />
              </>
            ) : (
              previousSnippets.map((snippet) => (
                <div
                  key={snippet.sequence_number}
                  className="p-4 bg-secondary rounded-lg"
                >
                  <p>{snippet.content}</p>
                  <p className="text-sm text-secondary-text mt-2">
                    Contribution #{snippet.sequence_number} by{" "}
                    {snippet.creator?.user_profile_name || "Unknown"}
                  </p>
                </div>
              ))
            )}
          </div>

          {/* Contributors section - renamed */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">
              Authors who have contributed:
            </h3>
            {loadingContributors ? (
              <Skeleton className="h-10 w-full" />
            ) : contributors.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {renderContributors(contributors)}
              </div>
            ) : (
              <p className="text-secondary-text">
                No authors have contributed yet
              </p>
            )}
          </div>

          {/* Writing Area */}
          {isCurrentlyWriting ? (
            <>
              <div className="mb-4">
                <Textarea
                  value={content}
                  onChange={handleContentChange}
                  placeholder="Add your contribution (50-100 words)..."
                  className="min-h-[200px] mb-2"
                  disabled={isSubmitting}
                />
                <div className="flex justify-between items-center">
                  <span
                    className={
                      wordCount > 100 || wordCount < 50 ? "text-red-500" : ""
                    }
                  >
                    {wordCount} words
                  </span>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={handleCancelWriting}
                      disabled={isSubmitting}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleSubmit}
                      disabled={
                        wordCount > 100 || wordCount < 50 || isSubmitting
                      }
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        "Submit Contribution"
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="flex justify-center">
              <Button
                onClick={handleStartContribution}
                className="w-full max-w-md"
                disabled={
                  isLoading ||
                  projectLocked ||
                  project?.is_completed === true ||
                  (project?.max_snippets !== undefined &&
                    previousSnippets.length >= project.max_snippets)
                }
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Loading...
                  </>
                ) : project?.is_completed === true ||
                  (project?.max_snippets !== undefined &&
                    previousSnippets.length >= project.max_snippets) ? (
                  "Project Completed"
                ) : projectLocked ? (
                  "Someone is currently writing..."
                ) : (
                  "Make Contribution"
                )}
              </Button>
            </div>
          )}

          {/* Project creator actions */}
          {isProjectCreator && (
            <div className="flex justify-center mt-4">
              <Button
                className="bg-red-500 hover:bg-red-600 text-white"
                onClick={handleDeleteProject}
              >
                Delete Project
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default WritingEditor;
