import { combineReducers } from 'redux';
import bookReducer from './bookReducer';
import precisionReducer from './precisionReducer';

const rootReducer = combineReducers({
  book: bookReducer,
  precision: precisionReducer,
});

export default rootReducer;
