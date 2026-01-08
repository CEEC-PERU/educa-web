import SidebarDrawer from '../../components/student/DrawerNavigation';
import Navbar from '../../components/Navbar';
import { Profile } from '../../interfaces/User/UserInterfaces';
import { useRouter } from 'next/router';
import Footer from '@/components/student/Footer';
import ProtectedRoute from '@/components/Auth/ProtectedRoute';
import { useAuth } from '@/context/AuthContext';
import ScreenSecurity from '@/components/ScreenSecurity';
import React, { useState, useEffect } from 'react';
import ScormPlayer from '@/components/student/ScormPlayer';

const ContenidoAdicionalIndex: React.FC = () => {
  const { logout, user, profileInfo } = useAuth();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const router = useRouter();
  let name = '';
  let uri_picture = '';

  if (profileInfo) {
    const profile = profileInfo as Profile;
    name = profile.first_name;
    uri_picture = profile.profile_picture!;
  }

  const toggleSidebar = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };
  return (
    <ProtectedRoute>
      <div>
        <ScreenSecurity />
        <div className="relative z-10 ">
          <Navbar
            bgColor="bg-gradient-to-r from-brand-100 via-brand-200 to-brand-300"
            borderColor="border border-stone-300"
            user={user ? { profilePicture: uri_picture } : undefined}
            toggleSidebar={toggleSidebar}
          />
          <SidebarDrawer
            isDrawerOpen={isDrawerOpen}
            toggleSidebar={toggleSidebar}
          />
          <div className="min-h-screen flex flex-col items-center justify-center  pt-10 pb-10">
            <div className="w-full max-w-screen-lg">
              <div className="flex flex-wrap gap-2">
                <h1>Contenido Adicional</h1>
                <ScormPlayer
                  contentId="scorm-content-123"
                  studentId="student-456"
                  scormUrl="https://example.com/path/to/scorm/content/index.html"
                />
              </div>
            </div>
          </div>
          <Footer />
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default ContenidoAdicionalIndex;
