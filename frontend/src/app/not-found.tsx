import Link from "next/link";
import { Search } from "lucide-react";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 text-center">
      <div className="w-16 h-16 rounded-2xl border border-white/10 bg-white/[0.03] flex items-center justify-center text-[#d4a853] mb-8">
        <Search size={28} />
      </div>

      <p className="text-xs uppercase tracking-[0.4em] text-[#d4a853] mb-4">
        404 
      </p>

      <h1 className="text-4xl md:text-5xl font-serif mb-4">
        Page Not Found
      </h1>

      <p className="text-gray-400 text-sm max-w-md mb-10 leading-relaxed">
        The page you are looking for has either been moved or does not exist.
        If you believe this is an error, please contact support.
      </p>

      <div className="flex flex-col sm:flex-row items-center gap-4">
        <Link
          href="/"
          className="w-full sm:w-auto px-8 py-3.5 border border-white/10 text-gray-400 rounded-full text-xs uppercase tracking-widest hover:border-white/20 hover:text-white transition duration-300"
        >
          Return Home
        </Link>
        <Link
          href="/collection"
          className="w-full sm:w-auto px-8 py-3.5 bg-[#d4a853] text-black rounded-full text-xs uppercase tracking-widest font-medium hover:bg-[#e8c97a] transition duration-300"
        >
          Explore Collection
        </Link>
      </div>
    </main>
  );
}
