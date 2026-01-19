'use client';

import React from 'react';
import Navbar from '@/components/Navbar';
import { useRouter } from 'next/router';
export default function DayDetailPage() {
  const router = useRouter();
  const { programId, dayId } = router.query;
  return (
    <div className="relative min-h-screen flex flex-col">
      <Navbar bgColor="bg-gradient-to-r from-blue-500 to-violet-500 opacity-90" />
      <main className="p-6 flex-grow pt-20">
        <button
          onClick={() => router.back()}
          className="mb-4 text-gray-600 hover:text-gray-800"
        >
          ← Volver a Días
        </button>

        <h1>
          Detalle del Día {dayId} del Programa {programId}
        </h1>
        {/* Contenido del día */}
      </main>
    </div>
  );
}
