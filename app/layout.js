import { ClerkProvider } from "@clerk/nextjs";
import { Public_Sans } from "next/font/google";
import StyledComponentsRegistry from "@/lib/AntRegistry";
import "./globals.css";
import "@/styles/typography.css";
import QueryProvider from "@/lib/QueryProvider";

const publicSans = Public_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});
export const metadata = {
  title: "Tetherin",
  description: "Tetherin is a decentralized social network that allows you to connect with others without relying on a central authority.",
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  // Also supported by less commonly used
  // interactiveWidget: 'resizes-visual',
}

export default function RootLayout({ children }) {
  return (
    <ClerkProvider
      appearance={{
        signIn: {
          variables: { colorPrimary: "#F9AA11" },
        },
        signUp: {
          variables: { colorPrimary: "#F9AA11" },
        },
      }}
    >
      <html lang="en">
        <body className={publicSans.className}>
          <QueryProvider>
            <StyledComponentsRegistry>{children}</StyledComponentsRegistry>
          </QueryProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
