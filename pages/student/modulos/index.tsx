import React, { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/router";
import CourseSidebar from "@components/student/CourseSidebar";
import { useAuth } from "@/context/AuthContext";
import AppLayout from "@/components/layouts/AppLayout";
import SessionViewer from "@components/student/SessionViewer";
import { Question, ModuleEvaluation } from "@/interfaces/StudentModule";
import { useModuleDetail } from "@hooks/useModuleDetail";
import { useCourseTime } from "@hooks/courses/useCourseTime";
import { CascadeResult } from "@hooks/useSessionProgress";
import LoadingIndicator from "@components/student/LoadingIndicator";

const Home = () => {
  const { user } = useAuth();
  const router = useRouter();
  const { course_id } = router.query;
  const userId = (user as { id: number } | null)?.id ?? 0;
  const courseIdNumber = Array.isArray(course_id)
    ? parseInt(course_id[0])
    : parseInt(course_id || "0");
  const { courseData, isLoading, error, refetch } =
    useModuleDetail(courseIdNumber);
  const [selectedModuleId, setSelectedModuleId] = useState<number | null>(null);
  const [selectedSession, setSelectedSession] = useState<{
    video?: string;
    questions?: Question[];
    session_id?: number;
    module_id?: number;
    progress?: number;
    isCompleted?: boolean;
  }>({});
  const [videoProgress, setVideoProgress] = useState<{ [key: string]: number }>(
    {},
  );
  const { createCourseTimeStart } = useCourseTime();
  const createCourseTimeStartRef = useRef(createCourseTimeStart);
  createCourseTimeStartRef.current = createCourseTimeStart;

  useEffect(() => {
    if (
      courseData &&
      courseData.length > 0 &&
      courseData[0].courseModules.length > 0
    ) {
      const firstModule = courseData[0].courseModules[0];

      if (firstModule.moduleSessions && firstModule.moduleSessions.length > 0) {
        const firstSession = firstModule.moduleSessions[0];
        const savedProgress = firstSession.usersessionprogress.find(
          (p) => p.user_id === userId,
        );

        setSelectedModuleId(firstModule.module_id);
        setSelectedSession({
          video: firstSession.video_enlace,
          session_id: firstSession.session_id,
          module_id: firstModule.module_id,
          progress: savedProgress?.progress ?? 0,
          isCompleted: savedProgress?.is_completed ?? false,
        });
      }
    }
  }, [courseData]);

  useEffect(() => {
    let timer = 0;
    const startTime = new Date();
    let interval: NodeJS.Timeout | null = null;
    let isPageVisible = true;
    let sent = false;

    const startTimer = () => {
      interval = setInterval(() => {
        if (isPageVisible) timer += 1;
      }, 1000);
    };

    const handleEndSession = () => {
      if (sent || !userId) return;
      sent = true;
      clearInterval(interval!);
      createCourseTimeStartRef.current({
        course_id: courseIdNumber,
        user_id: userId,
        startTime: startTime,
        endTime: new Date(),
        duration: timer,
      }).catch((error: any) =>
        console.error("Error al registrar el tiempo de inicio:", error),
      );
    };

    const handleVisibilityChange = () => {
      isPageVisible = document.visibilityState !== "hidden";
    };

    startTimer();

    window.addEventListener("beforeunload", handleEndSession);
    window.addEventListener("popstate", handleEndSession);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      handleEndSession();
      window.removeEventListener("beforeunload", handleEndSession);
      window.removeEventListener("popstate", handleEndSession);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [courseIdNumber, userId]);

  const handleSelect = (
    sessionName: string,
    evaluation?: ModuleEvaluation | Question[],
    moduleId?: number,
  ) => {
    setSelectedModuleId(moduleId || null);
    window.scrollTo({ top: 0, behavior: "smooth" });

    if (Array.isArray(evaluation)) {
      setSelectedSession({ questions: evaluation, module_id: moduleId });
    } else if (evaluation && "questions" in evaluation) {
      setSelectedSession({
        questions: evaluation.questions,
        module_id: moduleId,
      });
    } else {
      const module = courseData?.[0]?.courseModules.find((m) =>
        m.moduleSessions.some((s) => s.name === sessionName),
      );

      if (module) {
        const session = module.moduleSessions.find(
          (s) => s.name === sessionName,
        );

        if (session) {
          const savedProgress = session.usersessionprogress.find(
            (p) => p.user_id === userId,
          );

          setSelectedSession({
            video: session.video_enlace,
            session_id: session.session_id,
            module_id: moduleId,
            progress: savedProgress?.progress ?? 0,
            isCompleted: savedProgress?.is_completed ?? false,
          });
        }
      }
    }
  };

  const handleCascadeResult = useCallback(
    (result: CascadeResult) => {
      if (!selectedSession.session_id) return;

      setVideoProgress((prev) => ({
        ...prev,
        [selectedSession.session_id!]: result.sessionProgress,
      }));

      if (result.sessionProgress >= 100 && !selectedSession.isCompleted) {
        refetch();

        const modules = courseData?.[0]?.courseModules ?? [];
        let foundCurrent = false;

        for (const module of modules) {
          for (const session of module.moduleSessions) {
            if (foundCurrent) {
              const savedProgress = session.usersessionprogress.find(
                (p) => p.user_id === userId,
              );
              setSelectedModuleId(module.module_id);
              setSelectedSession({
                video: session.video_enlace,
                session_id: session.session_id,
                module_id: module.module_id,
                progress: savedProgress?.progress ?? 0,
                isCompleted: savedProgress?.is_completed ?? false,
              });
              window.scrollTo({ top: 0, behavior: "smooth" });
              return;
            }
            if (session.session_id === selectedSession.session_id) {
              foundCurrent = true;
            }
          }
        }
      }
    },
    [selectedSession, courseData, userId, refetch],
  );

  if (isLoading) {
    return <LoadingIndicator />;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!courseData || courseData.length === 0) {
    return <LoadingIndicator />;
  }

  const handleEvaluationFinish = () => {
    refetch();
  };

  return (
    <div className="flex flex-col h-screen">
      <div className="flex flex-grow flex-col lg:flex-row relative">
        <div className={`flex-1 p-4 lg:mr-96 z-0`}>
          <SessionViewer
            sessionVideo={selectedSession.video}
            sessionId={selectedSession.session_id}
            evaluationQuestions={selectedSession.questions}
            onCascadeResult={handleCascadeResult}
            videoProgress={selectedSession.progress ?? 0}
            sessionCompleted={selectedSession.isCompleted ?? false}
            selectedModuleId={selectedModuleId}
            moduleResults={courseData[0].courseModules.flatMap(
              (module) => module.ModuleResults,
            )}
            courseResults={courseData[0].CourseResults}
            onUpdated={handleEvaluationFinish}
          />
        </div>
        <CourseSidebar
          courseModules={courseData[0].courseModules}
          courseEvaluation={courseData[0].Evaluation}
          onSelect={handleSelect}
          videoProgress={videoProgress}
        />
      </div>
    </div>
  );
};

Home.getLayout = (page: React.ReactNode) => (
  <AppLayout noPadding>{page}</AppLayout>
);

export default Home;
