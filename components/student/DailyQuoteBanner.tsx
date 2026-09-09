import React from "react";
import { Quote as QuoteIcon } from "lucide-react";
import { useDailyQuote } from "../../hooks/content/useDailyQuote";

const DailyQuoteBanner: React.FC = () => {
  const { quote, isLoading } = useDailyQuote();

  return (
    <div className="relative w-full min-h-40 lg:min-h-48 overflow-hidden rounded-b-2xl border border-white/10 bg-white/5 backdrop-blur-sm">
      <QuoteIcon
        className="absolute top-4 left-4 h-10 w-10 text-brandrosado-800/30"
        aria-hidden="true"
      />

      <div className="flex flex-col items-center justify-start gap-3 pt-8 pb-16 px-6 text-center md:pt-10 md:pb-20 md:px-12">
        {isLoading ? (
          <div className="w-full max-w-md space-y-2">
            <div className="mx-auto h-4 w-5/6 rounded-full bg-white/10 animate-pulse" />
            <div className="mx-auto h-4 w-2/3 rounded-full bg-white/10 animate-pulse" />
          </div>
        ) : (
          quote && (
            <>
              <p className="max-w-md text-base italic text-white/90 line-clamp-3 md:text-lg">
                “{quote.content}”
              </p>
              <p className="text-sm text-white/60">
                — {quote.author}
                {quote.author_role ? `, ${quote.author_role}` : ""}
              </p>
            </>
          )
        )}
      </div>
    </div>
  );
};

export default DailyQuoteBanner;
