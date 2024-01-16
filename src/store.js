import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './reducers';

// Create the Redux store using configureStore
const store = configureStore({
  reducer: rootReducer,
});

export default store;
