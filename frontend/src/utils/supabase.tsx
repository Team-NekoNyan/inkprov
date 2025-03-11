import { createClient } from "@supabase/supabase-js";

// local .env variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "";
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY || "";

// Create a single supabase client for interacting with your database
export const supabase = createClient(supabaseUrl, supabaseKey);

// Helper functions for authentication
export const signUp = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  return { data, error };
};

export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  return { data, error };
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

export const getCurrentUser = async () => {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
};

export const getSession = async () => {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  return session;
};

// Function to fetch tags from Supabase
export const getTags = async () => {
  const { data, error } = await supabase.from("tags").select("*").order("name");

  if (error) {
    console.error("Error fetching tags:", error);
    return [];
  }

  return data;
};
