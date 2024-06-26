import React from 'react';

interface FooterProps{
  footerText: string;
}

const Footter: React.FC<FooterProps> = ({ footerText = '2024 EducaWeb. Todos los derechos reservados.'}) => {
  return (
    <footer className=" bg-brand-100 via-brand-200 to-brand-300 text-white py-6">
      <div className="container mx-auto">
        <div className="flex justify-center items-center">
          <p className="text-center text-sm">&copy;  {footerText}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footter;
