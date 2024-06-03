// app/page.tsx

import Image from "next/image";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-6 bg-gray-100">
      <section className="text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Welcome to EducaWeb
        </h1>
        <p className="text-lg text-gray-600 mb-6">
          Empowering EducaWeb with innovative solutions.
        </p>
        <button className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-500">
          Get Started
        </button>
      </section>
    </main>
  );
}
