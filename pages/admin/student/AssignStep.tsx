// components/AssignStep.tsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';
import AssignStepTable from '../../../components/Admin/AssignStepTable';
import { getEnterprises } from '../../../services/enterpriseService';
import { Enterprise } from '../../../interfaces/Enterprise';
import Loader from '../../../components/Loader';

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
  const [columns] = useState<{ label: string, key: string }[]>([
    { label: 'DNI', key: 'dni' },
    { label: 'Password', key: 'password' }
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
      setRows(jsonData);
    };
    reader.readAsArrayBuffer(file);
  }, [file]);

  const handleAssign = () => {
    if (selectedCompanyState) {
      onNext(selectedCompanyState);
    } else {
      alert('Por favor, selecciona una empresa');
    }
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
        <h2 className="text-xl font-bold mb-4 text-center">Asignar Empresa</h2>
        <select
          className="mb-4 w-full"
          value={selectedCompanyState}
          onChange={(e) => setSelectedCompanyState(e.target.value)}
        >
          <option value="">Seleccione una empresa</option>
          {companies.map((company) => (
            <option key={company.enterprise_id} value={company.enterprise_id}>
              {company.name}
            </option>
          ))}
        </select>
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