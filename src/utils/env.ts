export function validateEnv(): {
  TWITCH_CLIENT_ID: string | undefined;
  TWITCH_CLIENT_SECRET: string | undefined;
} {
  const requiredEnvVars = {
    TWITCH_CLIENT_ID: process.env.TWITCH_CLIENT_ID,
    TWITCH_CLIENT_SECRET: process.env.TWITCH_CLIENT_SECRET,
  };

  console.log("Environment Variables:");
  Object.entries(requiredEnvVars).forEach(([key, value]) => {
    if (!value) {
      console.error(`Missing required environment variable: ${key}`);
    } else {
      // Only log the first few characters of sensitive values
      const isSensitive = key.includes("SECRET");
      const displayValue = isSensitive
        ? `${value.substring(0, 4)}...${value.substring(value.length - 4)}`
        : value;
      console.log(`${key}: ${displayValue}`);
    }
  });

  return requiredEnvVars;
}
