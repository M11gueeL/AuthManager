import React from 'react';

function App() {
  return (
    // Contenedor principal: Centra el contenido en la pantalla, ocupa toda la altura y ancho.
    // Utiliza un fondo degradado sutil para un aspecto moderno.
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-400 to-purple-600 p-4">
      {/* Tarjeta de contenido: Un contenedor con bordes redondeados, sombra y un fondo blanco. */}
      <div className="bg-white p-8 rounded-2xl shadow-xl transform transition-all duration-300 hover:scale-105
                  max-w-md w-full text-center border border-gray-200">
        {/* Título principal: Texto grande, negrita, con un color de texto atractivo y un ligero gradiente. */}
        <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 mb-4
                   leading-tight">
          ¡Hola Mundo!
        </h1>

        {/* Subtítulo o mensaje adicional: Texto más pequeño y sutil. */}
        <p className="text-lg text-gray-700 mb-6">
          En desarrollo.
        </p>

        {/* Botón interactivo: Estilo de botón moderno con gradiente, sombra y efecto hover. */}
        <button
          className="bg-gradient-to-r from-green-400 to-blue-500 text-white font-bold py-3 px-6 rounded-full
                     shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300
                     focus:outline-none focus:ring-4 focus:ring-blue-300 focus:ring-opacity-75"
        >
          Proximamente
        </button>
      </div>
    </div>
  );
}

export default App;
