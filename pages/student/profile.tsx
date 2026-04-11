import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/router";
import ProtectedRoute from "@components/Auth/ProtectedRoute";
import SidebarDrawer from "@components/student/DrawerNavigation";
import Navbar from "@components/Navbar";
import { Profile } from "@/interfaces/User/UserInterfaces";
import { useEnterprise } from "@/hooks/useEnterprise";
import StudentProfileLayout from "@components/student/StudentProfileLayout";

const StudentProfile: React.FC = () => {
  const { logout, user, profileInfo } = useAuth();
  const { enterprise, error, isLoading } = useEnterprise();
  const router = useRouter();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  let name = "",
    last_name = "",
    uri_picture = "",
    phone,
    email;
  let userInfo = { id: 0, dni: "" };

  if (user) {
    userInfo = user as { id: number; dni: string };
  }
  if (profileInfo) {
    const profile = profileInfo as Profile;
    name = profile.first_name;
    last_name = profile.last_name;
    uri_picture = profile.profile_picture!;
    phone = profile.phone;
    email = profile.email;
  }

  console.log("Profile", profileInfo);

  const handleEditClick = () => {
    router.push("/student/edit-profile");
  };

  const toggleSidebar = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  return (
    <ProtectedRoute>
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
      <StudentProfileLayout
        bannerSrc={enterprise?.enterprise.image_fondo}
        avatarSrc={uri_picture}
        name={name}
        lastName={last_name}
      >
        <div className="max-w-3xl mx-auto mt-8 mb-12 px-4">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 shadow-xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-white">Datos Personales</h3>
              <button
                onClick={handleEditClick}
                className="bg-brandm365-100 text-white text-sm px-5 py-2 rounded-full hover:bg-branda365-800 transition-colors"
              >
                Editar
              </button>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <p className="text-lg font-medium text-white">Nombres</p>
              <input
                id="nombres"
                type="text"
                value={name}
                readOnly
                className="mt-1 block w-full px-3 py-2 bg-transparent border-b border-white text-white placeholder-gray-400 focus:outline-none focus:ring-0 focus:border-white sm:text-sm"
              />
              <p className="text-lg font-medium text-white">Apellidos</p>
              <input
                id="apellidos"
                type="text"
                value={last_name}
                readOnly
                className="mt-1 block w-full px-3 py-2 bg-transparent border-b border-white text-white placeholder-gray-400 focus:outline-none focus:ring-0 focus:border-white sm:text-sm"
              />
              <p className="text-lg font-medium text-white">Email</p>
              <input
                id="email"
                type="text"
                value={email}
                readOnly
                className="mt-1 block w-full px-3 py-2 bg-transparent border-b border-white text-white placeholder-gray-400 focus:outline-none focus:ring-0 focus:border-white sm:text-sm"
              />
              <p className="text-lg font-medium text-white">Teléfono</p>
              <input
                id="phone"
                type="text"
                value={phone}
                readOnly
                className="mt-1 block w-full px-3 py-2 bg-transparent border-b border-white text-white placeholder-gray-400 focus:outline-none focus:ring-0 focus:border-white sm:text-sm"
              />
              <p className="text-lg font-medium text-white">Empresa</p>
              <input
                id="empresa"
                type="text"
                value={enterprise?.enterprise.name}
                readOnly
                className="mt-1 block w-full px-3 py-2 bg-transparent border-b border-white text-white placeholder-gray-400 focus:outline-none focus:ring-0 focus:border-white sm:text-sm"
              />
              <p className="text-lg font-medium text-white">DNI</p>
              <input
                id="dni"
                type="text"
                value={userInfo.dni}
                readOnly
                className="mt-1 block w-full px-3 py-2 bg-transparent border-b border-white text-white placeholder-gray-400 focus:outline-none focus:ring-0 focus:border-white sm:text-sm"
              />
            </div>
          </div>
        </div>
      </StudentProfileLayout>
    </ProtectedRoute>
  );
};
77;
export default StudentProfile;
