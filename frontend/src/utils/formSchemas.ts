import { z } from "zod";

const settingsSchema = z.object({
    username: z.string().min(1, { message: "Username is required" }),
    bio: z.string().optional(),
    matureContent: z.boolean()
  });

  export { settingsSchema };