import React, { useState } from 'react';

interface FilterSidebarProps {
  onFilterChange: (filters: any) => void;
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({ onFilterChange }) => {
  const [filters, setFilters] = useState<any>({
    coCertificados: [],
    contenidos: [],
    competencias: [],
    expertos: [],
    niveles: [],
    habilidades: [],
  });

  const handleCheckboxChange = (category: string, value: string) => {
    const updatedFilters = { ...filters };
    if (updatedFilters[category].includes(value)) {
      updatedFilters[category] = updatedFilters[category].filter((item: string) => item !== value);
    } else {
      updatedFilters[category].push(value);
    }
    setFilters(updatedFilters);
    onFilterChange(updatedFilters);
  };

  return (
    <div className="w-64  p-4 rounded-lg shadow-lg text-white border">
        <h3 className="font-semibold text-lg pb-3">Mejora tu búsqueda</h3>
      <div className="mb-4 divide-y">
      

        <h3 className="font-semibold text-lg bg-purple-950">Contenido</h3>
        <div className="flex flex-col ">
          <label className="inline-flex items-center ">
            <input
              type="checkbox"
              className="form-checkbox"
              onChange={() => handleCheckboxChange('coCertificados', 'Academia PNL')}
            />
            <span className="ml-2">Video Interactivo</span>
          </label>


          <label className="inline-flex items-center">
            <input
              type="checkbox"
              className="form-checkbox"
              onChange={() => handleCheckboxChange('coCertificados', 'AIacademIA')}
            />
            <span className="ml-2 ">Podcast</span>
          </label>
          {/* Add more checkboxes as needed */}
        </div>
      </div>
      
      <div className="mb-4 divide-y">
        <h3 className="font-semibold text-lg bg-purple-950 ">Categorias</h3>
        <div className="flex flex-col">
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              className="form-checkbox"
              onChange={() => handleCheckboxChange('contenidos', 'Artículo')}
            />
            <span className="ml-2">Habilidades Blandas</span>
          </label>
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              className="form-checkbox"
              onChange={() => handleCheckboxChange('contenidos', 'Curso')}
            />
            <span className="ml-2">Liderazgo</span>
          </label>
          {/* Add more checkboxes as needed */}
        </div>
      </div>
      
      {/* Repeat similar blocks for Competencias, Expertos, Niveles, and Habilidades */}
      
    </div>
  );
};

export default FilterSidebar;
