import React from 'react';
const CompanyForm: React.FC = () => {
  return (
    <div className="bg-white p-6 shadow-lg rounded-3xl w-70">
      <form className="space-y-4 m-7">
        {/* Company Name */}
        <div className="pb-3">
          <label className="block text-gray-700 font-bold pb-2">Company Name</label>
          <input type="text" className="w-full p-2 border border-gray-300 rounded-full" placeholder="Company Name" />
        </div>

        {/* Email */}
        <div className="pb-3">
          <label className="block text-gray-700 font-bold pb-2">Email</label>
          <input type="email" className="w-full p-2 border border-gray-300 rounded-full" placeholder="Email" />
        </div>

        {/* Phone Number */}
        <div className="pb-3">
          <label className="block text-gray-700 font-bold">Phone Number</label>
          <input type="text" className="w-full p-2 border border-gray-300 rounded-full" placeholder="Phone Number" />
        </div>

        {/* Questions */}
        <div className="pb-3">
          <label className="block text-gray-700 font-bold pb-2">Questions</label>
          <textarea className="w-full h-50 p-2 border border-gray-300 rounded-full" placeholder="Write your questions here"></textarea>
        </div>

        {/* Submit Button */}
        <div>
          <button type="submit" className="w-full bg-[#8204E7] text-white p-3 rounded-full">Enviar</button>
        </div>
      </form>
    </div>
  );
};

export default CompanyForm;
