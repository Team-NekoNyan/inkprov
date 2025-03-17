import React, { useState, useEffect } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { settingsSchema } from "@/utils/formSchemas";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import {
  getUsername,
  getBio,
  getMatureContent,
  updateUsername,
  updateBio,
  updateMatureContent,
} from "@/utils/supabase";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Link } from "react-router-dom";
import { UserCircle } from "lucide-react";

const Settings: React.FC = () => {
  // Setting states
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // const [username, setUsername] = useState<string>("");
  // const [bio, setBio] = useState<string>("");
  const [bioCharCount, setBioCharCount] = useState<number>(0);
  const [matureContent, setMatureContent] = useState<boolean>(false);

  // Form Validation
  const form = useForm<z.infer<typeof settingsSchema>>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      username: "",
      bio: "",
      matureContent: false,
    },
  });

  useEffect(() => {
    // Fetch user data
    const userData = Promise.all([getUsername(), getBio(), getMatureContent()]);
    userData.then((res) => {
      let username = res[0][0].user_profile_name;
      if (username.includes("@")) {
        username = username.substring(0, username.indexOf("@"));
      }

      setUsername(username);
      const bioText = res[1][0].user_profile_bio;
      setBio(bioText);
      setBioCharCount(bioText ? bioText.length : 0);
      setMatureContent(res[2][0].user_profile_mature_enabled);

      // set form values after data is fetched
      form.reset({
        username: username,
        bio: bioText,
        matureContent: res[2][0].user_profile_mature_enabled,
      });
    });
  }, [form]);

  // Form Submission
  async function onSubmit(values: z.infer<typeof settingsSchema>) {
    // Update user data in database
    try {
      setIsLoading(true);
      if (values.username.length > 0) {
        await updateUsername(values.username);
        sessionStorage.setItem("username", values.username);
      }
      values.bio.length > 0 ? await updateBio(values.bio) : null;
      values.matureContent !== matureContent
        ? await updateMatureContent(values.matureContent)
        : null;
      toast.success("Successfully Saved Changes");
      setIsLoading(false);
    } catch (error) {
      toast.error(`${error}`);
      setIsLoading(false);
    }
  }

  // Handle bio text change
  const handleBioChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>,
    onChange: (value: string) => void
  ) => {
    const value = e.target.value;
    // Limit to 180 characters
    if (value.length <= 180) {
      onChange(value);
      setBioCharCount(value.length);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 max-w-3xl mx-auto"
      >
        <h2 className="text-3xl font-medium text-primary-text text-left mt-5">
          Settings
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-5 bg-background">
          {/* Left Column */}
          <div className="w-full max-w-xl space-y-8 bg-card p-8 rounded-lg border border-primary-border">
            <h3 className="text-2xl font-medium text-primary-text text-left mb-3">
              Profile Information
            </h3>
            <p className="text-sm text-tertiary-text text-left">
              Update your account settings
            </p>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col">
                {/* Username Input */}
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-primary-text text-left">
                        Username
                      </FormLabel>
                      <FormControl>
                        <Input
                          className="mt-1 block w-full rounded-md border border-primary-border bg-white px-4 py-2 text-primary-text shadow-sm focus:outline-none focus-visible:ring-1 focus-visible:ring-input-focus focus-visible:border-input-focus sm:text-sm"
                          placeholder="Username"
                          type="text"
                          {...field}
                        />
                      </FormControl>
                      {/* Form Error Message */}
                      <FormMessage className="text-left" />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex flex-col">
                {/* Bio Input */}
                <FormField
                  control={form.control}
                  name="bio"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-primary-text text-left">
                        Bio
                      </FormLabel>
                      <div className="flex flex-col">
                        <FormControl>
                          <Textarea
                            placeholder="Share a glimpse of your story with others."
                            className="mt-1 block w-full rounded-md border border-primary-border bg-white px-4 py-2 text-primary-text shadow-sm focus:outline-none focus-visible:ring-1 focus-visible:ring-input-focus focus-visible:border-input-focus sm:text-sm"
                            onChange={(e) => handleBioChange(e, field.onChange)}
                            value={field.value}
                            maxLength={180}
                          />
                        </FormControl>
                        <div className="text-xs text-tertiary-text text-right mt-1">
                          {bioCharCount}/180 characters
                        </div>
                      </div>
                      {/* Form Error Message */}
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Button
                className="bg-primary-button hover:bg-primary-button-hover cursor-pointer w-1/2"
                variant="default"
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="animate-spin" /> Saving Changes
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </div>
          </div>

          {/* Right Column */}
          <div className="w-full max-w-md space-y-8 bg-card p-8 rounded-lg border border-primary-border">
            <h3 className="text-2xl font-medium text-primary-text text-left mb-3">
              Preferences
            </h3>
            <p className="text-sm text-tertiary-text text-left">
              Manage your account preferences
            </p>
            <div className="text-primary-text space-y-8">
              {/* Allow Mature Content Switch */}
              <FormField
                control={form.control}
                name="matureContent"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between">
                    <FormLabel>Allow mature content</FormLabel>
                    <FormControl>
                      <Switch
                        className="data-[state=checked]:bg-primary-button cursor-pointer"
                        checked={matureContent}
                        onCheckedChange={async (checked) => {
                          field.onChange(checked);
                          setMatureContent(checked);
                          try {
                            await updateMatureContent(checked);
                            toast.success(
                              checked
                                ? "Mature content enabled"
                                : "Mature content disabled"
                            );
                          } catch (error: any) {
                            toast.error(`${error.message}`);
                            // Revert the switch if the update failed
                            field.onChange(!checked);
                            setMatureContent(!checked);
                          }
                        }}
                        aria-readonly
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              {/* Profile Preview Button (Temporary) */}
              <div className="border-t pt-6">
                <h4 className="text-lg font-medium mb-3">Development</h4>
                <p className="text-sm text-tertiary-text mb-4">
                  Preview pages in development
                </p>
                <Button
                  asChild
                  variant="outline"
                  className="w-full flex items-center justify-center gap-2"
                >
                  <Link to="/profile">
                    <UserCircle className="h-5 w-5" />
                    Preview Profile Page
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </Form>
  );
};

export default Settings;
