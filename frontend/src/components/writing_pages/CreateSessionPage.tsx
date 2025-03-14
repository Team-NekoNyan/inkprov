import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import { User } from "@supabase/supabase-js";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";

// Initializes supabase client
import { supabase, getTags, getCurrentUser } from "../../utils/supabase";

// Defines Project interface
interface Project {
  id?: number;
  title: string;
  description: string;
  creator_id: string; // This will be the auth_id from users_ext
  created_at: string;
  is_public: boolean;
  is_mature_content: boolean;
  project_genre: string;
  max_contributors: number;
}

// Defines ProjectSnippet interface
interface ProjectSnippet {
  id?: number;
  project_id: number;
  content: string;
  creator_id: string;
  created_at: string;
  word_count: number;
  sequence_number: number;
}

// Defines Tag interface
interface Tag {
  id: number;
  name: string;
}

const CreateSession: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user: authUser } = useAuth();
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [genre, setGenre] = useState<string>("");
  const [isPublic, setIsPublic] = useState<boolean>(true);
  const [isMatureContent, setIsMatureContent] = useState<boolean>(false);
  const [maxContributors, setMaxContributors] = useState<number>(5);
  const [tags, setTags] = useState<Tag[]>([]);
  const [wordCount, setWordCount] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);

  const MAX_DESCRIPTION_LENGTH = 280;

  // Check authentication on mount
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    setUser(authUser);
  }, [isAuthenticated, navigate, authUser]);

  // Get the current user and tags on component mount
  useEffect(() => {
    const initialize = async () => {
      // Fetch user using getCurrentUser
      const currentUser = await getCurrentUser();
      setUser(currentUser);

      if (!currentUser) {
        toast.error("Authentication Required", {
          description: "You must be logged in to create a new session.",
        });
        navigate("/login");
        return;
      }

      // Fetch tags
      const tagData = await getTags();
      if (!tagData || tagData.length === 0) {
        toast.error("Failed to load genres", {
          description: "Could not load genre options. Please try again.",
        });
      }
      setTags(tagData);
    };

    initialize();
  }, [navigate]);

  //* Handles content change (word count)
  const handleContentChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ): void => {
    const newContent = e.target.value;
    setContent(newContent);

    // Count words (split by whitespace, previous method invalid)
    const words = newContent.trim() ? newContent.trim().split(/\s+/) : [];
    setWordCount(words.length);
  };

  // Handle description change with character limit
  const handleDescriptionChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const newDescription = e.target.value;
    if (newDescription.length <= MAX_DESCRIPTION_LENGTH) {
      setDescription(newDescription);
    }
  };

  // Handles form submission
  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error("Title Required", {
        description: "Please provide a title for your project.",
      });
      return;
    }

    if (!description.trim()) {
      toast.error("Description Required", {
        description: "Please provide a description for your project.",
      });
      return;
    }

    if (!genre.trim()) {
      toast.error("Genre Required", {
        description: "Please select a genre for your project.",
      });
      return;
    }

    if (wordCount < 50 || wordCount > 100) {
      toast.error("Invalid Word Count", {
        description: `Please write between 50 to 100 words. Current count: ${wordCount}`,
      });
      return;
    }

    if (!user) {
      toast.error("Authentication Required", {
        description: "You must be logged in to create a new session.",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      if (!user?.id) {
        throw new Error("User ID not found");
      }

      // Inserts project into the 'projects' table
      const newProject: Project = {
        title,
        description,
        creator_id: user.id,
        created_at: new Date().toISOString(),
        is_public: isPublic,
        is_mature_content: isMatureContent,
        project_genre: genre,
        max_contributors: maxContributors,
      };

      const { data: projectData, error: projectError } = await supabase
        .from("projects")
        .insert([newProject])
        .select()
        .single();

      if (projectError) {
        throw projectError;
      }

      // Inserts the first snippet into project_snippets
      const newSnippet: ProjectSnippet = {
        project_id: projectData.id,
        content,
        creator_id: user.id,
        created_at: new Date().toISOString(),
        word_count: wordCount,
        sequence_number: 1,
      };

      const { error: snippetError } = await supabase
        .from("project_snippets")
        .insert([newSnippet]);

      if (snippetError) {
        throw snippetError;
      }

      // Insert the project creator into the project_contributors table
      const { error: contributorError } = await supabase
        .from("project_contributors")
        .insert([
          {
            project_id: projectData.id,
            user_id: user.id,
            user_is_project_creator: true,
            joined_at: new Date().toISOString(),
          },
        ]);

      if (contributorError) {
        throw contributorError;
      }

      toast.success("Session Created", {
        description: "Your writing session has been created successfully!",
      });

      // Redirect to the sessions list
      navigate("/sessions");
    } catch (error: any) {
      toast.error("Creation Failed", {
        description:
          error.message || "Failed to create session. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = (): void => {
    navigate("/sessions");
  };

  return (
    <div className="container mx-auto py-8 max-w-2xl pb-16">
      <div className="mb-4 flex justify-start">
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
          <CardTitle>Create New Writing Session</CardTitle>
          <CardDescription>
            Start a new collaborative writing session. Each participant can
            contribute up to 100 words, with a maximum of 5 participants.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-medium">
                Session Title
              </label>
              <Input
                id="title"
                value={title}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setTitle(e.target.value)
                }
                placeholder="Enter session title"
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium">
                Description
              </label>
              <Textarea
                id="description"
                value={description}
                onChange={handleDescriptionChange}
                placeholder="Describe what this writing session is about..."
                className="min-h-[100px]"
                maxLength={MAX_DESCRIPTION_LENGTH}
                required
              />
              <div className="text-sm text-right">
                <span
                  className={
                    description.length === MAX_DESCRIPTION_LENGTH
                      ? "text-red-500"
                      : "text-secondary-text"
                  }
                >
                  {description.length}/{MAX_DESCRIPTION_LENGTH} characters
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="genre" className="text-sm font-medium">
                Genre
              </label>
              <Select value={genre} onValueChange={setGenre}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a genre" />
                </SelectTrigger>
                <SelectContent>
                  {tags.map((tag) => (
                    <SelectItem key={tag.id} value={tag.name}>
                      {tag.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-8">
              <div className="flex items-center space-x-2">
                <Switch
                  id="public"
                  checked={isPublic}
                  onCheckedChange={setIsPublic}
                />
                <Label htmlFor="public">Public Session</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="mature"
                  checked={isMatureContent}
                  onCheckedChange={setIsMatureContent}
                />
                <Label htmlFor="mature">Mature Content</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Label htmlFor="maxContributors">Max Contributors:</Label>
                <Select
                  value={maxContributors.toString()}
                  onValueChange={(value) => setMaxContributors(Number(value))}
                >
                  <SelectTrigger className="w-20">
                    <SelectValue placeholder="Max" />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5].map((num) => (
                      <SelectItem key={num} value={num.toString()}>
                        {num}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="content" className="text-sm font-medium">
                Your Contribution (50-100 words)
              </label>
              <Textarea
                id="content"
                value={content}
                onChange={handleContentChange}
                placeholder="Start the story here..."
                className="min-h-[200px]"
                required
              />
              <div className="text-sm text-right">
                <span
                  className={
                    wordCount > 100 || wordCount < 50
                      ? "text-red-500 font-bold"
                      : ""
                  }
                >
                  {wordCount}/100 words
                </span>
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={
                isSubmitting ||
                wordCount > 100 ||
                wordCount < 50 ||
                !title.trim() ||
                !description.trim() ||
                !genre
              }
            >
              {isSubmitting ? "Creating..." : "Create Session"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default CreateSession;
