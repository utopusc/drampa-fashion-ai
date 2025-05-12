import { ThemeProvider } from "@/components/theme-provider";
import { siteConfig } from "@/lib/config";
import Link from "next/link";
import { Geist } from "next/font/google";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`${geistSans.variable} min-h-screen bg-background`}>
      <div className="flex min-h-screen flex-col">
        <div className="flex min-h-screen flex-col">
          <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px] px-4 py-12">
            <div className="flex flex-col space-y-2 text-center">
              <Link href="/" className="mx-auto">
                <h1 className="text-2xl font-bold tracking-tight">
                  {siteConfig.name}
                </h1>
              </Link>
              <p className="text-sm text-muted-foreground">
                Enter your credentials to continue
              </p>
            </div>
            <div className="grid gap-6">
              {children}
            </div>
            <p className="text-center text-sm text-muted-foreground">
              By continuing, you agree to our{" "}
              <Link href="/terms" className="underline underline-offset-4 hover:text-primary">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="underline underline-offset-4 hover:text-primary">
                Privacy Policy
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 