import type { Metadata } from "next";
import ProfileContent from "@/components/profile/ProfileContent";

export const metadata: Metadata = {
  title: "Profile - JEE Archive",
  description: "Manage your JEE Archive account settings. Update your profile, academic details, and contact information.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function ProfilePage() {
  return <ProfileContent />;
}