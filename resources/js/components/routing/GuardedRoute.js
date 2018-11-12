import React        from 'react';

import { 
    Route, 
    Redirect 
}                   from 'react-router-dom';

import AuthContext  from '../../contexts/auth';

export default ({ component, ...props }) => {
    const Component = component;

    return (
        <AuthContext.Consumer>
            {auth => (
                <Route {...props} render={props => (
                    auth.authenticated ?
                        <Component {...props} /> : <Redirect to="/login" />
                )} />
            )}
        </AuthContext.Consumer>
    );
}
