import { NextApiRequest } from "next";
import { getAuth } from "@clerk/nextjs/server";

import { prismadb as db } from "@/lib/prismadb";

export const currentProfilePages = async (req: NextApiRequest) => {
  const { userId } = getAuth(req);

  if (!userId) {
    return null;
  }

  const profile = await db.profile.findUnique({
    where: {
      userId
    }
  });

  return profile;
}