// import config     from '../config';
import apiFactory from './api';
const config = {
    apiPrefix : 'api/v1/',
    apiUrl    : 'http://localhost:3000/'
};

export default apiFactory({
    apiPrefix : config.apiPrefix,
    apiUrl    : config.apiUrl
});
