import { useEffect, useState } from 'react';
import './App.css';
import CurrencyRow from './components/CurrencyRow';

const API_DOMAIN = 'https://free.currconv.com';
const API_KEY = '2b125cccf4d7a5151da9';

function App() {
  const [currencyOptions, setCurrencyOptions] = useState([]);
  const [fromCurrency, setFromCurrency] = useState();
  const [toCurrency, setToCurrency] = useState();
  const [exchangeRate, setExchangeRate] = useState();
  const [amount, setAmount] = useState(1);
  const [amountInFromCurrency, setAmmountInFromCurrency] = useState(true);

  let toAmount, fromAmount;
  if (amountInFromCurrency) {
    fromAmount = amount;
    toAmount = amount * exchangeRate;
  } else {
    toAmount = amount;
    fromAmount = amount / exchangeRate;
  }

  let usd, eur;

  useEffect(() => {
    function getExchangeRate(currency) {
      fetch(
        `${API_DOMAIN}/api/v7/convert?q=${currency}_UAH&compact=ultra&apiKey=${API_KEY}`
      )
        .then((res) => res.json())
        .then((data) => console.log(data));
    }
    usd = getExchangeRate('USD');
    eur = getExchangeRate('EUR');
  }, []);

  useEffect(() => {
    fetch(`${API_DOMAIN}/api/v7/currencies?apiKey=${API_KEY}`)
      .then((res) => res.json())
      .then((data) => {
        const firstDefaultCurrency = Object.keys(data.results)[8];
        const secondDefaultCurrency = Object.keys(data.results)[149];
        setCurrencyOptions([...Object.keys(data.results)]);
        setFromCurrency(firstDefaultCurrency);
        setToCurrency(secondDefaultCurrency);
      });
  }, []);

  useEffect(() => {
    if (fromCurrency != null && toCurrency != null) {
      fetch(
        `${API_DOMAIN}/api/v7/convert?q=${fromCurrency}_${toCurrency}&compact=ultra&apiKey=${API_KEY}`
      )
        .then((res) => res.json())
        .then((data) => setExchangeRate(data[Object.keys(data)[0]]));
    }
  }, [fromCurrency, toCurrency]);

  function handleFromAmountChange(e) {
    setAmount(e.target.value);
    setAmmountInFromCurrency(true);
  }

  function handleToAmountChange(e) {
    setAmount(e.target.value);
    setAmmountInFromCurrency(false);
  }

  return (
    <div className='App'>
      <h1>
        USD: ${usd} | EUR: ${eur}
      </h1>
      <h1>Currency Converter</h1>
      <CurrencyRow
        currencyOptions={currencyOptions}
        selectedCurrency={fromCurrency}
        onChangeCurrency={(e) => setFromCurrency(e.target.value)}
        onChangeAmount={handleFromAmountChange}
        amount={fromAmount}
      />
      <div className='equals'>=</div>
      <CurrencyRow
        currencyOptions={currencyOptions}
        selectedCurrency={toCurrency}
        onChangeCurrency={(e) => setToCurrency(e.target.value)}
        onChangeAmount={handleToAmountChange}
        amount={toAmount}
      />
    </div>
  );
}

export default App;
