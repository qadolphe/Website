"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import {
  feedbackViewerCookie,
  feedbackViewerSessionSeconds,
  feedbackViewerSessionToken,
  isFeedbackViewerPassword,
} from "@/lib/feedback-viewer-auth";

export async function signIn(formData: FormData) {
  const submitted = formData.get("password");
  if (typeof submitted !== "string" || !isFeedbackViewerPassword(submitted)) {
    redirect("/feedbackviewer?error=invalid");
  }

  const cookieStore = await cookies();
  cookieStore.set(feedbackViewerCookie, feedbackViewerSessionToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: feedbackViewerSessionSeconds,
    path: "/feedbackviewer",
  });
  redirect("/feedbackviewer");
}

export async function signOut() {
  const cookieStore = await cookies();
  cookieStore.set(feedbackViewerCookie, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 0,
    path: "/feedbackviewer",
  });
  redirect("/feedbackviewer");
}
