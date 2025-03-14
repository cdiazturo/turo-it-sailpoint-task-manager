import { Configuration } from "sailpoint-api-client";

export function getSailpointConfig(): Configuration {
  return new Configuration({
    baseurl: process.env.SAILPOINT_BASE_URL,
    clientId: process.env.SAILPOINT_CLIENT_ID,
    clientSecret: process.env.SAILPOINT_CLIENT_SECRET,
  });
}
