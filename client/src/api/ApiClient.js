// import queryString                   from 'query-string';
import errorHandler                 from './error-handler';

// const POLLING_HEADER_NAME = 'X-Polling';

export default class ApiClient {
    constructor ({ prefix = '', apiUrl, errorsHandler } = {}) {
        this.prefix = prefix;
        this.apiUrl = apiUrl;
        this.token = '';
        this.lang = '';
        this.onServerTimeReceive = () => {};
        this.errorsHandler = errorHandler;
    }

    async get (url, params) {
        return this.request({
            url,
            params,
            method: 'GET'
        });
    }

    async post (url, payload = {}) {
        return this.request({
            url,
            method : 'POST',
            body   : payload
        });
    }

    async put (url, payload = {}) {
        return this.request({
            url,
            method : 'PUT',
            body   : payload
        });
    }

    async patch (url, payload = {}) {
        return this.request({
            url,
            method : 'PATCH',
            body   : payload
        });
    }

    async delete (url, payload = {}) {
        return this.request({
            url,
            method : 'DELETE',
            body   : payload
        });
    }

    async request ({ url, method, params = {}, body }) {
        // if (!this.token) this.token = localStorage && localStorage.getItem('token');
        // if (!this.lang) this.lang = localStorage && localStorage.getItem('language') || 'en';

        const query = Object.keys(params).length
            ? `?${new URLSearchParams(params).toString()}`
            : '';

        const response = await fetch(
            `${this.apiUrl}${this.prefix}${url}${query}`,
            {
                method,
                headers: {
                    'Content-Type': 'application/json'
                    // 'Cache-Control' : 'no-cache',
                    // pragma          : 'no-cache',
                    // ...(this.lang ? { 'Accept-Language': this.lang } : {}),
                },
                // credentials : 'include',
                body: method !== 'GET'
                    ? JSON.stringify(body)
                    : undefined
            }
        );

        const json = await response.json();

        // const serverTime = response.headers.get('X-Server-Timestamp');

        // if (serverTime) this.onServerTimeReceive(serverTime);

        if (response.status !== 200) throw this.errorsHandler(json, response.status, url);

        return json;
    }
}