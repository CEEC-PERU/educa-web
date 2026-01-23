import React, { useState, useEffect } from 'react';
import SidebarDrawer from '@/components/student/DrawerNavigation';
import Navbar from '@/components/Navbar';
import { useAuth } from '@/context/AuthContext';
import { useEvaluationUI } from '@/hooks/ui/useEvaluationUI';

const MyTrainingsPage: React.FC = () => {
  const { user } = useAuth();
  const userInfo = user as { id: number; enterprise_id: number };
  const { isDrawerOpen, toggleSidebar, userProfile } = useEvaluationUI();
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="relative z-10">
        <Navbar
          bgColor="bg-gradient-to-r from-brand-100 via-brand-200 to-brand-300"
          borderColor="border border-stone-300"
          user={
            userProfile.uri_picture
              ? { profilePicture: userProfile.uri_picture }
              : undefined
          }
          toggleSidebar={toggleSidebar}
        />
        <SidebarDrawer
          isDrawerOpen={isDrawerOpen}
          toggleSidebar={toggleSidebar}
        />
      </div>

      <div className="pt-16">
        <div
          className={`transition-all duration-300 ${
            isDrawerOpen ? 'lg:ml-64' : 'lg:ml-16'
          }`}
        >
          <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-800">
                Contenido de la capacitación
              </h1>
            </div>

            {/* lista de contenido */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyTrainingsPage;
