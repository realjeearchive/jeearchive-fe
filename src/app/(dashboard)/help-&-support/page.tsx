import type { Metadata } from "next";
import HelpSupportContent from "@/components/helpSupport/HelpSupportContent";

export const metadata: Metadata = {
  title: "Help & Support - JEE Archive",
  description: "Get help with JEE Archive. Find FAQs, contact support, report bugs, and join our community.",
  robots: {
    index: false,
    follow: false,
  },
};

const HelpAndSupport = () => {
  return <HelpSupportContent />;
};

export default HelpAndSupport;