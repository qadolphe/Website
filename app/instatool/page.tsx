import type { Metadata } from "next";
import InstaToolClient from "./insta-tool-client";

export const metadata: Metadata = {
  title: "InstaTool | EarlyOtter",
  description: "Private 3x3 Instagram grid slicer for EarlyOtter.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function InstaToolPage() {
  return <InstaToolClient />;
}