import { createContext } from 'react';

const AuthContext = createContext({
    register        : () => {},
    login           : () => {},
    logout          : () => {},
    authenticated   : false,
    user            : null
});

export default AuthContext;
