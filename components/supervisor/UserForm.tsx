import React from "react";
import { useAuth } from "@/context/AuthContext";
import { useClassroomBySupervisor } from "@/hooks/useClassroom";
import { useCourseStudent } from "@/hooks/useCourseStudents";
import UserCreationTabs from "@/components/users/UserCreationTabs";

interface Props {
  roleId: number;
  onClose: () => void;
  onSuccess: () => void;
  maxUsersAllowed: number;
}

const UserForm: React.FC<Props> = ({ roleId, onClose, onSuccess, maxUsersAllowed }) => {
  const { user } = useAuth();
  const enterpriseId = Number((user as { enterprise_id?: number } | null)?.enterprise_id);
  const { classrooms } = useClassroomBySupervisor();
  const { courseStudent } = useCourseStudent();

  const classroomOptions = (classrooms as Array<Record<string, any>>).map((classroom) => ({
    id: Number(classroom.classroom_id),
    label: [classroom.code, classroom.Shift?.name, classroom.User?.userProfile?.first_name, classroom.User?.userProfile?.last_name].filter(Boolean).join(" · "),
  }));
  const courseOptions = courseStudent.map((item) => ({
    id: Number(item.course_id),
    name: item.Course?.name ?? `Curso ${item.course_id}`,
    image: item.Course?.image,
  }));

  return (
    <UserCreationTabs
      roleId={roleId}
      enterpriseId={enterpriseId}
      maxUsersAllowed={maxUsersAllowed}
      classrooms={classroomOptions}
      courses={courseOptions}
      onClose={onClose}
      onSuccess={onSuccess}
    />
  );
};

export default UserForm;
