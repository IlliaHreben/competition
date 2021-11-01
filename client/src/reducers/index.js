import { combineReducers } from 'redux';
import errors              from './errors.js';
import competitions        from './competitions';

export default combineReducers({
    errors,
    competitions
});
