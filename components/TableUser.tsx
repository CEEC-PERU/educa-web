import React from 'react';
import { KeyIcon, PencilIcon, TrashIcon, TagIcon } from '@heroicons/react/24/outline';

interface Column {
  header: string;
  accessor: string;
}

interface TableProps {
  columns: Column[];
  data: any[];
  rowNumberOffset?: number;
  actionLabel?: string;
  onActionClick?: (row: any) => void;
  onDeleteClick?: (row: any) => void;
  onResetPassword?: (row: any) => void;
  onEditCampaign?: (row: any) => void;
}



const TableUser: React.FC<TableProps> = ({ columns, data, rowNumberOffset, actionLabel, onActionClick , onDeleteClick, onResetPassword, onEditCampaign }) => {
  return (
    <div className="relative z-10 isolate overflow-x-auto mt-4">
      <table className="min-w-full bg-white text-black">
        <thead>
          <tr>
            {rowNumberOffset !== undefined && <th className="w-12 px-2 py-3 border-b-2 border-gray-300 text-center text-xs leading-4 text-black uppercase tracking-wider">#</th>}
            {columns.map((column) => (
              <th key={column.accessor} className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs leading-4 text-black uppercase tracking-wider">
                {column.header}
              </th>
            ))}
            {(onActionClick || onDeleteClick || onResetPassword || onEditCampaign) && <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs leading-4 text-black uppercase tracking-wider">Acciones</th>}
          </tr>
        </thead>
        <tbody className='text-black'>
          {data.map((row, rowIndex) => {
            return (
            <tr key={rowIndex}>
              {rowNumberOffset !== undefined && <td className="w-12 px-2 py-4 text-center whitespace-no-wrap border-b border-gray-500">{rowNumberOffset + rowIndex + 1}</td>}
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
                    ) : column.accessor === 'product' ? (
                      row.product ? row.product.name : 'No asignado'
                    ) : (
                      value
                    )}
                  </td>
                );
              })}
              
              {(onActionClick || onDeleteClick || onResetPassword || onEditCampaign) && (
                <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-500">
                  {onActionClick && (
                    <button type="button" aria-label={actionLabel ?? 'Editar usuario'} className="relative z-10 text-blue-500 hover:text-blue-700" onClick={() => onActionClick(row)}>
                      <PencilIcon className="h-5 w-5" />
                    </button>
                  )}
                  {onResetPassword && <button type="button" aria-label="Generar clave temporal" title="Generar clave temporal" className="relative z-10 ml-2 text-amber-600 hover:text-amber-800" onClick={() => onResetPassword(row)}><KeyIcon className="h-5 w-5" /></button>}
                  {onEditCampaign && row.product && (
                    <button type="button" aria-label="Editar campana" title="Editar campana" className="relative z-10 ml-2 text-violet-600 hover:text-violet-800" onClick={() => onEditCampaign(row)}><TagIcon className="h-5 w-5" /></button>
                  )}
                  {onDeleteClick && (
                    <button type="button" aria-label="Eliminar usuario" className="relative z-10 ml-2 text-red-500 hover:text-red-700" onClick={() => onDeleteClick(row)}>
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  )}
                </td>
              )}

              
              
            </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default TableUser;
