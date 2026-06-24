"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCcw } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service in production
    console.error("Global Error Caught:", error);
  }, [error]);

  return (
    <html lang="en" className="h-full antialiased bg-black">
      <body className="min-h-full flex flex-col items-center justify-center p-6 text-white bg-black">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="mx-auto w-16 h-16 rounded-2xl flex items-center justify-center border border-red-500/20 bg-red-500/5 text-red-400">
            <AlertTriangle size={28} />
          </div>

          <div>
            <h1 className="text-2xl md:text-3xl font-serif text-white mb-2">
              Something went wrong
            </h1>
            <p className="text-sm text-gray-500">
              We encountered an unexpected error processing your request. Please
              refresh the page or return to the collection.
            </p>
          </div>

          <div className="pt-6 flex flex-col gap-3">
            <button
              onClick={() => reset()}
              className="flex items-center justify-center gap-2 w-full px-6 py-3.5 bg-[#d4a853] text-black rounded-full text-xs uppercase tracking-widest font-medium hover:bg-[#e8c97a] transition duration-300"
            >
              <RefreshCcw size={14} />
              Try Again
            </button>
            
            <Link
              href="/collection"
              className="flex items-center justify-center w-full px-6 py-3.5 border border-white/10 text-gray-400 rounded-full text-xs uppercase tracking-widest hover:border-white/20 hover:text-white transition duration-300"
            >
              Return to Collection
            </Link>
          </div>
        </div>
      </body>
    </html>
  );
}
