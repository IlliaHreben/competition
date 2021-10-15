// import config     from '../config';
import apiFactory from './api';
const config = {
    apiPrefix : '',
    apiUrl    : ''
};

export default apiFactory({
    apiPrefix : config.apiPrefix,
    apiUrl    : config.apiUrl
});
