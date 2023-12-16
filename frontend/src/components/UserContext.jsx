import React from 'react';

/**
 * @classdesc Contexto de usuario
 */

const UserContext = React.createContext(null);

export default UserContext;

//Crear conexto, se pueden pasar datos a través del árbol de componentes sin tener que pasar
//props manualmente en cada nivel.