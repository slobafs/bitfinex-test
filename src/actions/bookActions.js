export const ADD_TO_BOOK = 'ADD_TO_BOOK';
export const UPDATE_BOOK = 'UPDATE_BOOK';
export const SET_PRECISION = 'SET_PRECISION';

export const addToBook = (bids, asks) => ({
  type: ADD_TO_BOOK,
  payload: { bids, asks },
});

export const updateBook = (bookData) => ({
    type: UPDATE_BOOK,
    bookData,
  });

export const setPrecision = (precision) => ({
    type: SET_PRECISION,
    precision,
  });