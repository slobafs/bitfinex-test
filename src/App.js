import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addToBook, setPrecision, updateBook } from './actions/bookActions';

const PRECISIONS = ['P0', 'P1', 'P2', 'P3', 'P4'];

const App = () => {
  const dispatch = useDispatch();
  const books = useSelector((state) => state.book);
  const precision = useSelector((state) => state.precision);
  
  useEffect(() => {
    const w = new WebSocket('wss://api-pub.bitfinex.com/ws/2');
    w.onopen = () => {
      let msg = JSON.stringify({
        event: 'subscribe',
        channel: 'book',
        symbol: 'tUSTUSD',
        prec: PRECISIONS[precision]
      });

      w.send(msg);
    };

    w.onmessage = ({ data }) => {
      const retrievedData = JSON.parse(data);
      
      if (Array.isArray(retrievedData) && retrievedData[1].length > 3) {
        
        const bids = [];
        const asks = [];
        retrievedData[1].forEach(element => {
          if (element[2] > 0) {
            bids.push(element);
          } else {
            asks.push(element);
          }
        });
        dispatch(addToBook(bids, asks));
      } else if ( retrievedData[1]?.length === 3) {
        dispatch(updateBook(retrievedData));
      }
    };

    return () => {
      w.close();
    };
  }, [dispatch, precision]);


  const increasePrecision = () => {
    dispatch(setPrecision(precision+1));
  }

  const decreasePrecision = () => {
    dispatch(setPrecision(precision-1));
  }

  const formatNumber = (number) => {
    const absNumber = Math.abs(number);
    const suffixes = ['', 'K', 'M', 'B', 'T']; // Add more suffixes if needed
  
    const significantDigits = 4; // Total number of significant digits
  
    // Convert to string and split into integer and decimal parts
    const parts = absNumber.toFixed(significantDigits - 1).split('.');
    let formattedNumber = parts[0];
  
    // Add leading zeros if needed
    while (formattedNumber.length < significantDigits - 1) {
      formattedNumber = '0' + formattedNumber;
    }
  
    // Add decimal point and decimal part
    formattedNumber += '.' + (parts[1] || '0').slice(0, 4 - significantDigits);
  
    const suffixIndex = Math.floor(Math.log10(absNumber) / 3);
  
    // Special case for numbers without decimal part
    if (absNumber % 1 === 0) {
      const formattedInteger = absNumber.toLocaleString();
      return number < 0 ? `-${formattedInteger}K` : `${formattedInteger}K`;
    }
  
    const formattedNumberWithSuffix = formattedNumber + suffixes[suffixIndex];
  
    return number < 0 ? `-${formattedNumberWithSuffix}` : formattedNumberWithSuffix;
  };

  return (
    <>
      <button disabled={precision === 0} onClick={decreasePrecision}>&larr;</button>
      <button disabled={precision === 4} onClick={increasePrecision}>&rarr;</button>
      <div style={{display: 'flex'}}>
          <table>
            <thead>
              <tr>
                <th>Count</th>
                <th>Amount</th>
                <th>Total</th>
                <th>Price</th>
              </tr>
            </thead>
            <tbody>
              {books.bids?.map((row, index) => (
                <tr key={index}>
                  <td>{row[1]}</td>
                  <td>{formatNumber(row[2])}</td>
                  <td>{formatNumber(row[0] * row[2])}</td>
                  <td>{row[0]}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <table>
            <thead>
              <tr>
                <th>Price</th>
                <th>Total</th>
                <th>Amount</th>
                <th>Count</th>
              </tr>
            </thead>
            <tbody>
              {books.asks?.map((row, index) => (
                <tr key={index}>
                  <td>{row[0]}</td>
                  <td>{formatNumber(row[0] * row[2])}</td>
                  <td>{formatNumber(row[2])}</td>
                  <td>{row[1]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        
      </div>
    </>
  );
};

export default App;
