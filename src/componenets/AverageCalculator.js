import React, { useState } from 'react';
// import './App.css'; // Make sure App.css is in the same folder or adjust path

const API_MAP = {
  p: '/evaluation-service/primes',
  f: '/evaluation-service/fibo',
  e: '/evaluation-service/even',
  r: '/evaluation-service/rand'
};

const WINDOW_SIZE = 10;

// Replace with your actual token
const AUTH_HEADER = {
  Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiZXhwIjoxNzQ1MzA2ODg0LCJpYXQiOjE3NDUzMDY1ODQsImlzcyI6IkFmZm9yZG1lZCIsImp0aSI6ImM4NTMyOTBiLWY0MWUtNDRkNy05NTc5LWIzYjFlNTJmODgyOSIsInN1YiI6InZpZ25lc2hzdWRoYTIwMDVAZ21haWwuY29tIn0sImVtYWlsIjoidmlnbmVzaHN1ZGhhMjAwNUBnbWFpbC5jb20iLCJuYW1lIjoidmlnbmVzaCBzIiwicm9sbE5vIjoiNzI3NjIyYml0MTAxIiwiYWNjZXNzQ29kZSI6Imp0QnV6dSIsImNsaWVudElEIjoiYzg1MzI5MGItZjQxZS00NGQ3LTk1NzktYjNiMWU1MmY4ODI5IiwiY2xpZW50U2VjcmV0IjoibVJVWXV4Y014dHZrVkN2TSJ9.14Zb5oiS4pfhSh-vVUlVHVXI0w7C1TkccydcRdMSxnY'
};

const AverageCalculator = () => {
  const [prevWindow, setPrevWindow] = useState([]);
  const [currWindow, setCurrWindow] = useState([]);
  const [fetchedNumbers, setFetchedNumbers] = useState([]);
  const [average, setAverage] = useState(null);
  const [error, setError] = useState('');

  const fetchNumbers = async (type) => {
    const url = API_MAP[type];
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 500);

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...AUTH_HEADER
        },
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      const nums = data.numbers || [];

      setFetchedNumbers(nums);
      setError('');

      const uniqueNums = nums.filter(num => !currWindow.includes(num));
      const newWindow = [...currWindow, ...uniqueNums].slice(-WINDOW_SIZE);

      setPrevWindow([...currWindow]);
      setCurrWindow(newWindow);

      if (newWindow.length > 0) {
        const sum = newWindow.reduce((a, b) => a + b, 0);
        setAverage((sum / newWindow.length).toFixed(2));
      } else {
        setAverage(null);
      }

    } catch (err) {
      clearTimeout(timeoutId);
      console.error("Fetch error:", err);
      setError('Failed to fetch numbers (timeout or server error)');
    }
  };

  return (
    <div className="App">
      <div className="container">
        <h2>Average Calculator</h2>
        <div style={{ marginBottom: '10px' }}>
          <button onClick={() => fetchNumbers('p')}>Get Prime Numbers</button>
          <button onClick={() => fetchNumbers('f')}>Get Fibonacci Numbers</button>
          <button onClick={() => fetchNumbers('e')}>Get Even Numbers</button>
          <button onClick={() => fetchNumbers('r')}>Get Random Numbers</button>
        </div>

        {error && <p className="error">{error}</p>}

        <div>
          <p><strong>Numbers Fetched:</strong> {JSON.stringify(fetchedNumbers)}</p>
          <p><strong>Previous Window:</strong> {JSON.stringify(prevWindow)}</p>
          <p><strong>Current Window:</strong> {JSON.stringify(currWindow)}</p>
          <p><strong>Average:</strong> {average !== null ? average : 'N/A'}</p>
        </div>
      </div>
    </div>
  );
};

export default AverageCalculator;
