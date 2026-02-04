export const FUNCTION_NAMES = {
  oauthStart: "oauthStart",
  disconnectPlatform: "disconnectPlatform",
  createPost: "createPost",
  updateVariant: "updateVariant",
  submitForReview: "submitForReview",
  approvePost: "approvePost",
  schedulePost: "schedulePost",
  driveImportStart: "driveImportStart",
  driveList: "driveList"
};

export const USE_FUNCTIONS = import.meta.env.VITE_USE_FUNCTIONS === "true";
export const FUNCTIONS_REGION = import.meta.env.VITE_FUNCTIONS_REGION || "us-central1";
