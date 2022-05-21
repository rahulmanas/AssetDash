// import logo from './logo.svg';
import './App.css';
import React, {useEffect, useState} from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

// const getRandomColor = () => {
//     var letters = '0123456789ABCDEF'.split('');
//     var color = '#';
//     for (var i = 0; i < 6; i++ ) {
//         color += letters[Math.floor(Math.random() * 16)];
//     }
//     return color;
// }

// const myColors = (len) => {
//   const colors = [];
//   for(let i = 0; i < len; i++) {
//     colors.push(getRandomColor());
//   }
//   return colors;
// }

function PieChart({results}) {
  // const colors = myColors(results.length);
  const colors = ['#00876c',
    '#97bc86',
    '#bbce95',
    '#dddfa7',
    '#fff1bd',
    '#f8d79d',
    '#f2bc81',
    '#ed9f6b',
    '#72ab7a',
    '#e7815b',
    '#499972',
    '#df6153',
  ];
  const myLabels = results.map((item) => {
    return item.name
  });
  const data = {
    labels: myLabels,
    datasets: [
      {
        label: '# of Votes',
        data: results.map((data) => data.value),
        backgroundColor: colors,
        borderColor: colors,
        borderWidth: 1,
      },
    ]
  };
  const option = {
      plugins: {
        legend: {
          display: false
        }
    }
  }
  return (
    <>
      <div className="pieChart">
        <p className='portfolio'>Portfolio Chart</p>
        <Pie data={data} options={option}/>
      </div>
    </>
  )
}

function TableData({results}) {
  const sumOfValue = results.reduce((acc, curr) => acc + curr.value, 0);
  console.log(sumOfValue, "sumOfValue");
  return (
    <>
      {results && results.length > 0 ? results.map((data) => (
        <tr key={data.name}>
          <td>{data.name}</td>
          <td>{data.ticker}</td>
          <td>{((data.value / sumOfValue) * 100).toFixed(2)}%</td>
          <td>{data.value}</td>
        </tr>
      )) : <tr><td>No Data</td></tr>}
    </>
  )
}

function App() {
  const [holdings, setHoldings] = useState([]);
  const [computedResults, setComputedResults] = useState([]);
  const [query, setQuery] = useState("");
  const [options, setOptions] = useState("");

  useEffect(() => {
    fetch('mock_api.json').then(response =>  response.json()).then((json) => {
      console.log(json, "json data");
      json && json.holdings && json.holdings.length > 0 && json.holdings.map((data) => {
        return data.value = parseFloat(data.value.split("$")[1])
      })
      setHoldings(json.holdings);
    });
  }, []);

  useEffect(() => {
    const results = holdings && holdings.filter(holding => {
      if (query === '' && options === '') {
        return holding;
      } else if(query && options && (holding.type.toLowerCase().includes(options.toLowerCase()) && holding.name.toLowerCase().includes(query.toLowerCase()) )) {
        return holding;
      } else if(options && !query && holding.type.toLowerCase().includes(options.toLowerCase())) {
        return holding;
      } else if (query.toLowerCase() && !options && holding.name.toLowerCase().includes(query.toLowerCase())) {
        return holding;
      } else {
        return null;
      }
    });
    setComputedResults(results);
  }, [holdings, query, options]);

  const uniqueObjArray = [...new Map(holdings.map((item) => [item["type"], item])).values()];
  console.log(uniqueObjArray, "uniqueObjArray");

  const assetHoldings = uniqueObjArray.map((item) => {
    return item.type
  });

  console.log(assetHoldings, "assetHoldings");
  
  return (
    <div className="App container">
      <div className='headInfo'>
        <div className="headingTitle">AssetDash Portfolio Tracker</div>
        <i className="fa fa-user icon"></i>
        <input type="text" className='searchField' placeholder='Search By User ID' onChange={event => setQuery(event.target.value)} />
      </div>
      <div className='bodyInfo'>
        <div>
          <PieChart results={computedResults}/>
        </div>
        <div>
          <div className='topBar'>
            <p className='portfolio'>Portfolio Holdings</p>
            <select className='selectField' onChange={event => setOptions(event.target.value)}>
              <option value="">Select Asset Type</option>
              {assetHoldings.map((item) => {
                return <option className="options" key={item} value={item}>{item.split("_").join(" ").toUpperCase()}</option>
              })}
            </select>
          </div>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Ticker</th>
                <th>Percentage(%)</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              <TableData results={computedResults}  />
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default App;
