import axios        from 'axios';

import cfg          from '../config';
import { getCSRF }  from '../utils';

const http = axios.create({
    baseURL: cfg.apiBaseUrl,
    headers: {
        'X-Requested-With'  : 'XMLHttpRequest',
        'Content-Type'      : 'application/json',
        'Accept'            : 'application/json',
        'X-CSRF-TOKEN'      : getCSRF()
    }
});

export default http;
