import React from 'react';
import SidebarDrawer from '../../../components/student/DrawerNavigation';
import Navbar from '../../../components/Navbar';
import { useEvaluationUI } from '../../../hooks/ui/useEvaluationUI';
import { ClockIcon, DocumentTextIcon } from '@heroicons/react/24/solid';
import { CheckCheckIcon, ExpandIcon } from 'lucide-react';

const CertificationsList = () => {
  const { isDrawerOpen, toggleSidebar, userProfile } = useEvaluationUI();
  return (
    /*
    <div className="min-h-screen bg-gray-100">
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
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-200"></div>
          </div>
        </div>
      </div>
    </div>*/
    /*falta implementar hook para la lista de certificados */
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
                Mis Certificaciones
              </h1>
              <p className="text-gray-600 mt-2">
                Aquí puedes ver todas las certificaciones asignadas a ti.
              </p>
            </div>

            {/* cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <ClockIcon className="h-6 w-6 text-yellow-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">
                      Certificaciones Pendientes
                    </p>
                    <p className="text-2xl font-bold text-gray-900"></p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <CheckCheckIcon className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">
                      Certificaciones Completadas
                    </p>
                    <p className="text-2xl font-bold text-gray-900"></p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <ExpandIcon className="h-6 w-6 text-red-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">
                      Certificaciones Expiradas
                    </p>
                    <p className="text-2xl font-bold text-gray-900"></p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <DocumentTextIcon className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">
                      Total de Certificaciones
                    </p>
                    <p className="text-2xl font-bold text-gray-900"></p>
                  </div>
                </div>
              </div>
            </div>

            {/* listado de certificaciones */}
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CertificationsList;
