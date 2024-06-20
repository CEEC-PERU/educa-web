import { useRouter } from 'next/router';
import Navbar from '../../components/Navbar';
import { useAuth } from '../../context/AuthContext';
import { Profile } from '../../interfaces/UserInterfaces';
import SidebarDrawer from '../../components/DrawerNavigation';
import { useCourseDetail} from '../../hooks/useCourseDetail';
import ProtectedRoute from '../../components/Auth/ProtectedRoute';
const CourseDetails = () => {

    const { logout, user, profileInfo } = useAuth();
  const router = useRouter();
  const { course_id } = router.query;
  //const { courseDetail, isLoading } = useCourseDetail(course_id);

  
  let name = '';
  let uri_picture = '';
  
  if (profileInfo) {
    const profile = profileInfo as Profile;
    name = profile.first_name;
    uri_picture = profile.profile_picture!;
  }

  return (
    <ProtectedRoute>
      <div className="relative z-10">
        <Navbar
          bgColor="bg-gradient-to-r from-brand-100 via-brand-200 to-brand-300"
          user={user ? { profilePicture: uri_picture } : undefined}
        />
        <SidebarDrawer />
      </div>
      {/* <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-brand-100 via-brand-200 to-brand-300 p-4">
      {/*
  
   {courseDetail.map(courseDetails => (
           
            <div>
              <p>{courseDetails.name}</p>
              <p>{courseDetails.description_short}</p>
              <p>{courseDetails.courseProfessor.full_name}</p>
             </div>
          ))}
      </div>
         */}
    </ProtectedRoute>
  );
}


export default CourseDetails;
