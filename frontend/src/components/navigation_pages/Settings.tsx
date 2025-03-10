import React from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/contexts/AuthContext";
import { useForm } from "react-hook-form";
import { settingsSchema } from "@/utils/formSchemas";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const Settings: React.FC = () => {
    const { user } = useAuth();

  // Get user's display name
  const getDisplayName = () => {
    if (user?.user_metadata?.full_name) return user.user_metadata.full_name;
    if (user?.email) return user.email.split("@")[0];
    return "User";
  };

  // Form Validation
  const form = useForm<z.infer<typeof settingsSchema>>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      username: getDisplayName(),
      bio: "",
      matureContent: false,
    },
  });

  // Form Submission
  function onSubmit(values: z.infer<typeof settingsSchema>) {
    try {
      console.log(values);
    } catch (error) {
      console.error("Form submission error", error);
    }
  }

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
                      <FormMessage  className="text-left"/>
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
                      <FormControl>
                        <Textarea
                          placeholder="Share a glimpse of your story with others."
                          className="mt-1 block w-full rounded-md border border-primary-border bg-white px-4 py-2 text-primary-text shadow-sm focus:outline-none focus-visible:ring-1 focus-visible:ring-input-focus focus-visible:border-input-focus sm:text-sm"
                          {...field}
                        />
                      </FormControl>
                      {/* Form Error Message */}
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Button
                className="bg-primary-button hover:bg-primary-button-hover cursor-pointer w-1/3"
                variant="default"
                type="submit">
                Save Changes
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
            <div className="text-primary-text">

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
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        aria-readonly
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </div>
        </div>
      </form>
    </Form>
  );
};

export default Settings;
