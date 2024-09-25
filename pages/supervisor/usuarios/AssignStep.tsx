import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import AssignStepTable from '../../../components/Admin/AssignStepTable';
import { getEnterprises } from '../../../services/enterpriseService';
import { Enterprise } from '../../../interfaces/Enterprise';
import Loader from '../../../components/Loader';
import { useAuth } from '../../../context/AuthContext';
interface AssignStepProps {
  file: File;
  selectedCompany: string | null;
  onNext: (enterpriseId: string) => void;
  onBack: () => void;
}

const AssignStep: React.FC<AssignStepProps> = ({ file, selectedCompany, onNext, onBack }) => {
  const [companies, setCompanies] = useState<Enterprise[]>([]);
  const [selectedCompanyState, setSelectedCompanyState] = useState<string>(selectedCompany || '');
  const [rows, setRows] = useState<any[]>([]);
  
  const { logout, user, profileInfo } = useAuth();
  const userInfor = user as {  enterprise_id :number};
  const [columns] = useState<{ label: string, key: string }[]>([
    { label: 'DNI', key: 'dni' },
    { label: 'Contraseña', key: 'contraseña' } // Columna Contraseña
  ]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const companies = await getEnterprises();
        setCompanies(companies);
      } catch (error) {
        console.error('Error fetching companies:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanies();
  }, []);

  useEffect(() => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target?.result as ArrayBuffer);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(sheet);
      
      // Crear la contraseña automáticamente igual al DNI
      const processedData = jsonData.map((row: any) => ({
        dni: row.dni,
        contraseña: row.dni // Asignar la contraseña igual al DNI
      }));
      
      setRows(processedData);
    };
    reader.readAsArrayBuffer(file);
  }, [file]);

  const handleAssign = () => {
   
      onNext(userInfor.enterprise_id.toString());
   
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Loader />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="w-full max-w-4xl p-8 bg-white rounded-lg shadow-md">
     
        <AssignStepTable columns={columns} rows={rows} />
        <div className="flex justify-between mt-4">
          <button
            className="bg-gray-500 text-white py-2 px-4 rounded"
            onClick={onBack}
          >
            Atrás
          </button>
          <button
            className="bg-blue-500 text-white py-2 px-8 rounded"
            onClick={handleAssign}
          >
            Siguiente
          </button>
        </div>
      </div>
    </div>
  );
};

export default AssignStep;
