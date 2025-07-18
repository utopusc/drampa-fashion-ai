import { fal } from "@fal-ai/client";

// Configure Fal.ai client
fal.config({
  credentials: process.env.NEXT_PUBLIC_FAL_AI_KEY || process.env.FAL_KEY,
});

export { fal };