import React from 'react';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

interface Column {
  header: string;
  accessor: string;
}

interface TableProps {
  columns: Column[];
  data: any[];
  actionLabel?: string;
  onActionClick?: (row: any) => void;
  onDeleteClick?: (row: any) => void;
}



const TableUser: React.FC<TableProps> = ({ columns, data, actionLabel, onActionClick , onDeleteClick }) => {
  return (
    <div className="overflow-x-auto mt-4">
      <table className="min-w-full bg-white text-black">
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.accessor} className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs leading-4 text-black uppercase tracking-wider">
                {column.header}
              </th>
            ))}
            {onActionClick && <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs leading-4 text-black uppercase tracking-wider">Acciones</th>}
          </tr>
        </thead>
        <tbody className='text-black'>
          {data.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {columns.map((column) => {
                const value = column.accessor.split('.').reduce((acc, part) => acc && acc[part], row);
                return (
                  <td key={column.accessor} className="px-6 py-4 whitespace-no-wrap border-b border-gray-500">
                    {column.accessor === 'userProfile.profile_picture' ? (
                      <img src={value} alt="Profile" className="w-10 h-10 rounded-full" />
                    ) : column.accessor === 'User.userProfile.profile_picture' ? (
                      <img src={value} alt="Profile" className="w-10 h-10 rounded-full" />
                    )  : column.accessor === 'password' ? (
                      '**** ****'
                    ) : (
                      value
                    )}
                  </td>
                );
              })}
              
              {(onActionClick || onDeleteClick) && (
                <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-500">
                  {onActionClick && (
                    <button className="text-blue-500 hover:text-blue-700" onClick={() => onActionClick(row)}>
                      <PencilIcon className="h-5 w-5" />
                    </button>
                  )}
                  {onDeleteClick && (
                    <button className="ml-2 text-red-500 hover:text-red-700" onClick={() => onDeleteClick(row)}>
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  )}
                </td>
              )}

              
              
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TableUser;
