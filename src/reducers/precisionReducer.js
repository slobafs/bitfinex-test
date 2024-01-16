import { SET_PRECISION } from "../actions/bookActions";

const precisionReducer = (state = 0, action) => {
    switch (action.type) {
      case SET_PRECISION:
        return action.precision;
      default:
        return state;
    }
  };
  
  export default precisionReducer;