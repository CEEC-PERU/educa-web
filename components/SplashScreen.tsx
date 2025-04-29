import React, { useEffect, useState } from 'react';

export default function SplashScreen() {
  const fullText = 'MentorMind';
  const [displayedText, setDisplayedText] = useState('');
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setDisplayedText((prev) => prev + fullText[index]);
      setIndex((prevIndex) => prevIndex + 1);
    }, 100);

    if (index >= fullText.length) {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [index]);

  return (
    <div className="fixed inset-0 bg-gradient-to-r from-brand-300 via-brandfucsia-900 to-blue-900 flex flex-col items-center justify-center z-50 transition-opacity duration-1000 ease-in-out">
      <img
        src="https://res.cloudinary.com/dk2red18f/image/upload/v1724273464/WEB_EDUCA/smxqc1j66tbr0dkrxbdt.png"
        alt="EducaWeb Logo"
        className="h-16 sm:h-20 animate-pulse"
      />
      <span className="text-white font-bold text-2xl sm:text-xl mt-2 font-mono tracking-wide">
        {displayedText}
        <span className="animate-pulse">|</span>
      </span>
    </div>
  );
}
