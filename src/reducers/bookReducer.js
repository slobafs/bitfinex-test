import { ADD_TO_BOOK, UPDATE_BOOK } from '../actions/bookActions';

const initialState = {};

const bookReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_TO_BOOK:
      const { bids, asks } = action.payload;
      return {
        ...state,
        bids, 
        asks
      };
    case UPDATE_BOOK:
      
      let newBids = [...state.bids];
      let newAsks = [...state.asks];
     
      // if amount is positive
      if (action.bookData[1][2]) {
        newBids = newBids.map((bid) => {
          if (bid[0] === action.bookData[1][0]) {
            bid = action.bookData[1];
          }
          return bid;
        });

        newAsks = newAsks.map((ask) => {
          if (ask[0] === action.bookData[1][0]) {
            ask = action.bookData[1];
          }
          return ask;
        });
      } else {
        newBids = newBids.filter((bid) => bid[0] !== action.bookData[1][0]);
        newAsks = newAsks.filter((ask) => ask[0] !== action.bookData[1][0]);
      }

      return {
        ...state,
        bids: newBids,
        asks: newAsks,
      };
    default:
      return state;
  }
};

export default bookReducer;
