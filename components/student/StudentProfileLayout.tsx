import React from "react";

interface StudentProfileLayoutProps {
  bannerSrc?: string;
  avatarSrc?: string;
  name: string;
  lastName: string;
  children: React.ReactNode;
}

const StudentProfileLayout: React.FC<StudentProfileLayoutProps> = ({
  bannerSrc,
  avatarSrc,
  name,
  lastName,
  children,
}) => {
  return (
    <div className="min-h-screen w-full bg-brandazul-600">
      <div className="relative w-full h-48 md:h-64">
        <img
          src={bannerSrc}
          className="w-full h-full object-cover"
          alt="Banner"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-brandazul-600" />
      </div>

      <div className="relative z-10 flex flex-col items-center -mt-16 px-4">
        <img
          src={avatarSrc}
          alt="Profile"
          className="h-32 w-32 rounded-full border-4 border-brandrosado-800 shadow-lg shadow-brandmorado-700/50"
        />
        <h2 className="mt-4 text-2xl md:text-3xl text-white font-bold font-montserrat">
          {name} {lastName}
        </h2>
        <span className="mt-1 text-sm text-brandrosado-800 font-medium">
          Estudiante
        </span>
      </div>

      {children}
    </div>
  );
};

export default StudentProfileLayout;
