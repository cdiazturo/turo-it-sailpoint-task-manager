import { Configuration } from "sailpoint-api-client";

export function getSailpointConfig(): Configuration {
  const baseUrl = process.env.SAIL_BASE_URL;
  const clientId = process.env.SAIL_CLIENT_ID;
  const clientSecret = process.env.SAIL_CLIENT_SECRET;

  if (!baseUrl || !clientId || !clientSecret) {
    throw new Error("Missing SailPoint environment variables");
  }

  return new Configuration();
}
