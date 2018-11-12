import React, { 
    Component 
}                   from 'react';

import cfg          from '../../config';
import http         from '../../services/http';
import AuthContext  from '../../contexts/auth';
import { getCSRF }  from '../../utils';


export default class Auth extends Component {
    authCheck;

    constructor(props) {
        super(props);

        this.regenerateSession();
    }

    render() {
        const { authenticated, user } = this.state;

        return (
            <AuthContext.Provider value={{
                register        : this.register.bind(this),
                login           : this.login.bind(this),
                logout          : this.logout.bind(this),
                authenticated   : authenticated,
                user            : user,
            }}>
                {this.props.children}
            </AuthContext.Provider>
        );
    }

    regenerateSession() {
        const sessionData = sessionStorage.getItem(cfg.sessionDataKey);

        if (sessionData) {
            var { token, CSRF, user } = JSON.parse(atob(sessionData));

            if (token && CSRF && user) {
                this.setHeaders(token, CSRF);
                this.setAuthCheck();
    
                window.onunload = e => http.post('/logout');

                this.state = { authenticated: !!token, user: user };    
            }    
        }

        if (typeof token === 'undefined') {
            this.state = { authenticated: false, user: null };
        }
    }

    async register(data) {
        try {
            const res = await http.post('/register', JSON.stringify(data));

            this.storeCredentials(res.data);

            Promise.resolve(res.data);
        } catch (err) {
            const msg = err.response.status === 500 ? 'An error occurred' : err.response.data.message;

            return Promise.reject(msg);
        }
    }

    async login(data) {
        try {
            const res = await http.post('/login', JSON.stringify(data));

            if (!res.data.token) throw new Error();
            
            this.storeCredentials(res.data);
            window.onunload = e => http.post('/logout');

            return Promise.resolve(res);
        } catch (err) {
            return Promise.reject(err.response ? err.response.data.message : 'An error occurred');
        }
    }

    storeCredentials(data) {
        const CSRF = getCSRF();
        const sessionData = btoa(JSON.stringify(Object.assign(data, { CSRF: CSRF })));
        
        sessionStorage.setItem(cfg.sessionDataKey, sessionData);
        this.setHeaders(data.token, CSRF);
        this.setAuthCheck();

        this.setState({ authenticated: true, user: data.user });
    }

    logout() {
        http.post('/logout')

        sessionStorage.removeItem(cfg.sessionDataKey);
        this.unsetHeaders();

        location.reload();        
    }

    setHeaders(token, CSRF) {
        http.defaults.headers.common = { Authorization: `Bearer ${token}` };
        http.defaults.headers['X-CSRF-TOKEN'] = CSRF;
    }

    unsetHeaders() {
        delete http.defaults.headers['X-CSRF-TOKEN'];
        delete http.defaults.headers.common.Authorization;
    }

    setAuthCheck() {
        this.authCheck = http.interceptors.response.use(res => {
            return res;
        }, err => {
            if (err.response.status === 401) {
                this.logout();
            }
            return Promise.reject(err);
        });
    }
}
