import React from 'react';

interface TableColumn {
  label: string;
  key: string;
}

interface TableRow {
  [key: string]: React.ReactNode;
}

interface TableProps {
  columns: TableColumn[];
  rows: TableRow[];
}

const Table: React.FC<TableProps> = ({ columns, rows }) => {
  return (
    <div className="w-full overflow-x-auto">
      <div className="overflow-hidden min-w-full">
        <div className="grid grid-cols-12 p-4 text-sm font-medium bg-gradient-blue border-t border-b border-gray-200 gap-x-4 dark:bg-gray-800 dark:border-gray-700 dark:text-white">
          {columns.map((column) => (
            <div
              key={column.key}
              className={`flex text-white items-center justify-center ${
                column.key === 'actions'
                  ? 'col-span-3 sm:col-span-1'
                  : 'col-span-9 sm:col-span-8'
              }`}
            >
              {column.label}
            </div>
          ))}
        </div>
        {rows.map((row, index) => (
          <div
            key={index}
            className="grid grid-cols-12 px-4 py-5 text-sm text-gray-700 bg-white border-b border-gray-200 gap-x-4 dark:border-gray-700"
          >
            {columns.map((column) => (
              <div
                key={column.key}
                className={`flex items-center justify-center text-center ${
                  column.key === 'actions'
                    ? 'col-span-3 sm:col-span-1'
                    : 'col-span-9 sm:col-span-8'
                }`}
              >
                {column.key === 'actions' ? (
                  <div className="flex justify-center space-x-2">
                    {row[column.key]}
                  </div>
                ) : (
                  row[column.key]
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Table;
