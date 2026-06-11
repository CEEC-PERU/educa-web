import { useState } from "react";
import { useCourseStudent } from "../../hooks/useCourseStudents";
import { useProgressDistribution } from "../../hooks/useProgressDistribution";
import { useCourseTimeAverage } from "../../hooks/useCourseTimeAverage";
import {
  useTop,
  useAverageTime,
} from "../../hooks/dashboard/useDashboardCorporative";
import AppLayout from "../../components/layouts/AppLayout";
import type { NextPageWithLayout } from "../../types/next";
import {
  ProgressDistributionChart,
  CourseTimeChart,
  TopAdvisorsChart,
  AverageTimeChart,
  DailyParticipationChart,
  SatisfactionChart,
  NPSChart,
} from "../../components/dashboard/charts";
import SurveyModal from "../../components/survey/SurveyModal";
import CourseSelect from "../../components/dashboard/CourseSelect";

const SupervisorDashboard: NextPageWithLayout = () => {
  const { courseStudent, isLoading, error } = useCourseStudent();
  const [selectedCourse, setSelectedCourse] = useState<number | undefined>(
    undefined,
  );
  const { distributionData } = useProgressDistribution(selectedCourse);
  const { courseTimeData } = useCourseTimeAverage(selectedCourse);
  const { topRanking } = useTop(selectedCourse);
  const { averagetime } = useAverageTime();

  return (
    <>
      <SurveyModal />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="col-span-full">
          <CourseSelect
            courses={courseStudent}
            isLoading={isLoading}
            error={error}
            value={selectedCourse}
            onChange={setSelectedCourse}
          />
        </div>

        <ProgressDistributionChart data={distributionData} />
        <CourseTimeChart data={courseTimeData} />
        <TopAdvisorsChart data={topRanking} />
        <AverageTimeChart data={averagetime} />
        <DailyParticipationChart data={[]} />
        <SatisfactionChart data={[]} />
        <NPSChart data={[]} />
      </div>
    </>
  );
};

SupervisorDashboard.getLayout = (page) => <AppLayout>{page}</AppLayout>;

export default SupervisorDashboard;
