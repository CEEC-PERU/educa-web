import React from "react";

const IndividualForm: React.FC = () => {
  return (
    <div className="bg-white p-8 shadow-xl rounded-3xl w-full max-w-md mx-auto">
      <form className="space-y-5">
        <div>
          <label className="block text-gray-700 font-semibold text-sm mb-1.5">
            Nombre completo
          </label>
          <input
            type="text"
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 transition-colors focus:outline-none focus:ring-2 focus:ring-brandrosa-800 focus:border-transparent"
            placeholder="Escribe tu nombre completo"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-semibold text-sm mb-1.5">
            Correo electrónico
          </label>
          <input
            type="email"
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 transition-colors focus:outline-none focus:ring-2 focus:ring-brandrosa-800 focus:border-transparent"
            placeholder="nombre@correo.com"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-semibold text-sm mb-1.5">
            Teléfono
          </label>
          <input
            type="text"
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 transition-colors focus:outline-none focus:ring-2 focus:ring-brandrosa-800 focus:border-transparent"
            placeholder="Número de contacto"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-semibold text-sm mb-1.5">
            Consultas
          </label>
          <textarea
            className="w-full h-28 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 resize-none transition-colors focus:outline-none focus:ring-2 focus:ring-brandrosa-800 focus:border-transparent"
            placeholder="Cuéntanos en qué podemos ayudarte"
          ></textarea>
        </div>

        <button
          type="submit"
          className="w-full bg-brandrosa-800 text-white font-semibold py-3 rounded-xl transition-colors hover:bg-brandfucsia-900"
        >
          Enviar
        </button>
      </form>
    </div>
  );
};

export default IndividualForm;
