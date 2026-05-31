import type { Metadata } from "next";
import BookmarksPage from "@/components/bookmarks/BookmarksPage";

export const metadata: Metadata = {
  title: "Bookmarks - JEE Archive",
  description: "Your saved JEE practice questions. Review and practice bookmarked questions for JEE Main & Advanced.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function Page() {
  return <BookmarksPage />;
}