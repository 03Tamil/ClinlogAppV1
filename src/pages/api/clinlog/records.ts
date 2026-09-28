// @ts-nocheck
import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { GraphQLClient } from "graphql-request";
import { clinlogDataQueryNew } from "helpersv2/queries";
import { nextAuthOptions } from "../auth/[...nextauth]";

/**
 * Server-side proxy for the Clinlog records query.
 *
 * Previously the page received CLINLOG_QUERY_TOKEN through getServerSideProps
 * and called the CMS directly from the browser. That exposed a privileged
 * token in the page HTML (__NEXT_DATA__) and let the browser choose which
 * clinics / collaborator to query. This route keeps the token on the server
 * and scopes every request to the signed-in user's own clinics and user id.
 */

const STAFF_GROUPS = [
  "Anaesthetic Staff",
  "MAS Overseer",
  "Anaesthetist",
  "Dentist",
  "External Dentist",
  "Laboratory Overseer",
  "Laboratory Technician",
  "Nurse",
  "Overseer",
  "Receptionist",
  "Treatment Coordinator",
];

const MAX_LIMIT = 500;

export const config = {
  api: {
    // Record batches can be several MB; don't warn/truncate.
    responseLimit: false,
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const session: any = await getServerSession(
    req,
    res,
    nextAuthOptions(req, res),
  );
  if (!session?.userId) {
    return res.status(401).json({ error: "Not signed in" });
  }
  if (!session.groups?.some((group: string) => STAFF_GROUPS.includes(group))) {
    return res.status(403).json({ error: "Forbidden" });
  }

  const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
  const offset = Math.max(0, Number(body?.offset) || 0);
  const limit = Math.min(MAX_LIMIT, Math.max(1, Number(body?.limit) || 100));

  // Only allow clinics the user actually belongs to.
  const allowedClinics: string[] = (session.locationIds ?? []).map(String);
  const requestedClinics: string[] = (body?.recordClinic ?? [])
    .filter(Boolean)
    .map(String);
  const recordClinic = requestedClinics.filter((id) =>
    allowedClinics.includes(id),
  );
  if (recordClinic.length === 0) {
    return res.status(200).json({ entries: [] });
  }

  try {
    const client = new GraphQLClient(process.env.NEXT_PUBLIC_ENDPOINT, {
      headers: { Authorization: process.env.CLINLOG_QUERY_TOKEN },
    });
    const craftStartedAt = Date.now();
    const data: any = await client.request(clinlogDataQueryNew, {
      offset,
      limit,
      recordClinic,
      collaboratorId: Number(session.userId),
    });
    const craftMs = Date.now() - craftStartedAt;
    // Visible in the browser's Network tab (Timing) so you can see how much of
    // each request is Craft vs. Next/network overhead.
    res.setHeader("Server-Timing", `craft;desc="Craft GraphQL";dur=${craftMs}`);
    if (process.env.NODE_ENV === "development") {
      console.info(
        `[api/clinlog/records] offset=${offset} limit=${limit} -> ${
          data?.entries?.length ?? 0
        } records in ${craftMs}ms`,
      );
      if (craftMs > 3000) {
        // Slow chunk: list the record ids so they can be inspected in Craft.
        console.warn(
          `[api/clinlog/records] slow chunk ids: ${(data?.entries ?? [])
            .map((entry: any) => entry?.id)
            .join(", ")}`,
        );
      }
    }
    res.setHeader("Cache-Control", "private, no-store");
    return res.status(200).json({ entries: data?.entries ?? [] });
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("[api/clinlog/records]", error);
    }
    return res.status(502).json({ error: "Failed to load Clinlog records" });
  }
}
