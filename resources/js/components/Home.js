import React            from 'react';

import { 
    Route, 
    Switch 
}                       from 'react-router-dom';

import GuardedRoute     from './routing/GuardedRoute';
import Login            from './auth/Login';
import Registration     from './auth/Registration';
import TasklistIndex    from './tasklist/TasklistIndex';
import TasklistShow     from './tasklist/TasklistShow';

export default () => (
    <Switch>
        <Route path="/login" component={Login} />
        <Route path="/register" component={Registration} />
        <GuardedRoute exact path="/" component={TasklistIndex} />
		<GuardedRoute path="/tasklist/:id" component={TasklistShow} />
    </Switch>
);
