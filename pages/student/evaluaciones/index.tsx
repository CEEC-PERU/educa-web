import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { DocumentTextIcon } from '@heroicons/react/24/solid';
import { ClockIcon, PlayIcon, CalendarIcon, ExpandIcon } from 'lucide-react';
import SidebarDrawer from '../../../components/student/DrawerNavigation';
import Navbar from '../../../components/Navbar';
import {
  ApiAssignment,
  ApiEvaluation,
  Evaluation,
} from '../../../interfaces/EvaluationModule/Evaluation';

// Hooks personalizados
import { useEvaluationsList } from '../../../hooks/resultado/useEvaluationList';
import { useEvaluationUI } from '../../../hooks/ui/useEvaluationUI';

import { formatDate , getStatusColor , canTakeEvaluation} from '../../../services/evaluationmodule/evaluation';

import { CheckCircleIcon } from '@heroicons/react/24/outline';
import { Profile } from '../../../interfaces/User/UserInterfaces';
import { useAuth } from '../../../context/AuthContext';

const EvaluationsList = () => {
    const { 
    evaluations, 
    loading, 
    error, 
    stats 
  } = useEvaluationsList();
    const { 
    isDrawerOpen, 
    toggleSidebar, 
    userProfile 
  } = useEvaluationUI();
 

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <ClockIcon className="h-4 w-4" />;
      case 'completed':
        return <CheckCircleIcon className="h-4 w-4" />;
      case 'overdue':
        return <ExpandIcon className="h-4 w-4" />;
      default:
        return null;
    }
  };


  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="relative z-10">
          <Navbar
            bgColor="bg-gradient-to-r from-brand-100 via-brand-200 to-brand-300"
            borderColor="border border-stone-300"
            user={userProfile.uri_picture ? { profilePicture: userProfile.uri_picture } : undefined}
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
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="relative z-10">
          <Navbar
            bgColor="bg-gradient-to-r from-brand-100 via-brand-200 to-brand-300"
            borderColor="border border-stone-300"
      user={userProfile.uri_picture ? { profilePicture: userProfile.uri_picture } : undefined}
            toggleSidebar={toggleSidebar}
          />
          <SidebarDrawer
            isDrawerOpen={isDrawerOpen}
            toggleSidebar={toggleSidebar}
          />
        </div>
        <div className="pt-16">
          <div className="container mx-auto px-4 py-8">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <h3 className="text-red-800 font-medium">
                Error al cargar evaluaciones
              </h3>
              <p className="text-red-600 text-sm mt-1">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Reintentar
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="relative z-10">
        <Navbar
          bgColor="bg-gradient-to-r from-brand-100 via-brand-200 to-brand-300"
          borderColor="border border-stone-300"
            user={userProfile.uri_picture ? { profilePicture: userProfile.uri_picture } : undefined}
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
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Mis Evaluaciones
              </h1>
              <p className="text-gray-600">
                Aquí puedes ver todas tus evaluaciones asignadas y su estado
                actual.
              </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <ClockIcon className="h-6 w-6 text-yellow-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">
                      Pendientes
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {evaluations.filter((e) => e.status === 'pending').length}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <CheckCircleIcon className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">
                      Completadas
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {
                        evaluations.filter((e) => e.status === 'completed')
                          .length
                      }
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <ExpandIcon className="h-6 w-6 text-red-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">
                      Vencidas
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {evaluations.filter((e) => e.status === 'overdue').length}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <DocumentTextIcon className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {evaluations.length}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Evaluations List */}
            <div className="space-y-6">
              {evaluations.map((evaluation) => (
                <div
                  key={evaluation.id}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200"
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-semibold text-gray-900">
                            {evaluation.title}
                          </h3>
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                              evaluation.status
                            )}`}
                          >
                            {getStatusIcon(evaluation.status)}
                            {evaluation.status === 'pending' && 'Pendiente'}
                            {evaluation.status === 'completed' && 'Completada'}
                            {evaluation.status === 'overdue' && 'Vencida'}
                          </span>
                        </div>
                        <p className="text-gray-600 mb-3">
                          {evaluation.description}
                        </p>
                        <p className="text-sm font-medium text-gray-700 mb-4">
                          Curso: {evaluation.course_name}
                        </p>
                        {evaluation.instructions && (
                          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                            <p className="text-sm text-blue-800">
                              <strong>Instrucciones:</strong>{' '}
                              {evaluation.instructions}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
                      <div className="flex items-center gap-2">
                        <ClockIcon className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600">
                          {evaluation.duration_minutes} minutos
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <DocumentTextIcon className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600">
                          {evaluation.total_points} puntos
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <CalendarIcon className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600">
                          Vence: {formatDate(evaluation.due_date)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">
                          Intentos: {evaluation.total_attempts}/
                          {evaluation.max_attempts}
                        </span>
                      </div>
                    </div>

                    {evaluation.status === 'completed' &&
                      evaluation.best_score && (
                        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                          <p className="text-sm text-green-800">
                            <strong>Mejor puntuación:</strong>{' '}
                            {evaluation.best_score}/{evaluation.total_points}{' '}
                            puntos (
                            {Math.round(
                              (evaluation.best_score /
                                evaluation.total_points) *
                                100
                            )}
                            %)
                          </p>
                        </div>
                      )}

                    <div className="flex items-center justify-between">
                      <div className="flex gap-3">
                        {canTakeEvaluation(evaluation) && (
                          <Link href={`/student/evaluaciones/${evaluation.id}`}>
                            <button className="inline-flex items-center gap-2 px-4 py-2 bg-brand-200 text-white rounded-lg hover:bg-brand-300 transition-colors duration-200 font-medium">
                              <PlayIcon className="h-4 w-4" />
                              Iniciar Evaluación
                            </button>
                          </Link>
                        )}

                        {evaluation.status === 'completed' && (
                          <Link
                            href={`/student/evaluaciones/historial/${evaluation.id}`}
                          >
                            <button className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200 font-medium">
                              <DocumentTextIcon className="h-4 w-4" />
                              Ver Resultados
                            </button>
                          </Link>
                        )}
                      </div>

                      {evaluation.status === 'overdue' && (
                        <div className="text-red-600 text-sm font-medium">
                          Evaluación vencida
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {evaluations.length === 0 && !loading && (
              <div className="text-center py-12">
                <DocumentTextIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No hay evaluaciones disponibles
                </h3>
                <p className="text-gray-600">
                  Cuando tengas evaluaciones asignadas, aparecerán aquí.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EvaluationsList;
