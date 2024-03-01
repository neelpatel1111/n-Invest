import { React, useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Market = () => {

  const [Data, setData] = useState([{
    change: null,
    dayHigh: null,
    dayLow: null,
    identifier: null,
    lastPrice: null,
    lastUpdateTime: null,
    open: null,
    pChange: null,
    perChange30d: null,
    perChange365d: null,
    previousClose: null,
    symbol: null,
    totalTradedValue: null,
    totalTradedVolume: null,
    yearHigh: null,
    yearLow: null
  }])
  const [sortedDataChangePer, setSortedDataChangePer] = useState([])
  const [Volume, setVolume] = useState([])
  const [indices, setIndices] = useState('NIFTY 50');
  const [currentIndices, setCurrentIndices] = useState(indices)
  const fetchData = async () => {

    const options = {
      method: 'GET',
      url: 'https://latest-stock-price.p.rapidapi.com/price',
      params: {
        Indices: indices
      },
      headers: {
        'X-RapidAPI-Key': 'dcc8f03615msh25cee0082bd2ef6p14964ajsn2a631d7bf3cb',
        'X-RapidAPI-Host': 'latest-stock-price.p.rapidapi.com'
      }
    };

    try {
      const response = await axios.request(options);
      setData(response.data)
      console.log('DATA', Data)
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    //sliced the 1st element as 1st element is index itself
    setSortedDataChangePer(Data.slice(1, Data.length).sort((a, b) => { return a.pChange - b.pChange; }))
    let temp = Data.slice();
    setVolume(temp.sort((a, b) => { return b.totalTradedVolume - a.totalTradedVolume; }))
  }, [Data]);

  const handleSelectedIndices = (e) => {
    e.preventDefault();
    setData([{
      change: null,
      dayHigh: null,
      dayLow: null,
      identifier: null,
      lastPrice: null,
      lastUpdateTime: null,
      open: null,
      pChange: null,
      perChange30d: null,
      perChange365d: null,
      previousClose: null,
      symbol: null,
      totalTradedValue: null,
      totalTradedVolume: null,
      yearHigh: null,
      yearLow: null
    }]);
    setSortedDataChangePer([]);
    setVolume([]);
    setCurrentIndices(indices);
    fetchData();
  }

  return (
    <>
      <div className="container bg-white p-3 mt-4 d-flex bg-white border rounded shadow-sm">
        <h5 className='mt-1'>Select Indice : &nbsp;&nbsp;</h5>
        <form onSubmit={handleSelectedIndices} className='d-flex'>
          <select value={indices} onChange={(e) => setIndices(e.target.value)} className="form-select align-top focus-ring focus-ring-dark border-dark" aria-label="Default select indices">
            <option value="NIFTY 50">NIFTY 50</option>
            <option value="NIFTY NEXT 50">NIFTY NEXT 50</option>
            <option value="NIFTY 200">NIFTY 200</option>
            <option value="NIFTY 500">NIFTY 500</option>
            <option value="NIFTY MIDCAP 50">NIFTY MIDCAP 50</option>
            <option value="NIFTY MIDCAP 100">NIFTY MIDCAP 100</option>
            <option value="NIFTY SMLCAP 50">NIFTY SMLCAP 50</option>
            <option value="NIFTY SMLCAP 100">NIFTY SMLCAP 100</option>
            <option value="NIFTY SMLCAP 250">NIFTY SMLCAP 250</option>
            <option value="NIFTY MIDSML 400">NIFTY MIDSML 400</option>
            <option value="NIFTY BANK">NIFTY BANK</option>
            <option value="NIFTY AUTO">NIFTY AUTO</option>
            <option value="NIFTY FINSRV25 50">NIFTY FINSRV25 50</option>
            <option value="NIFTY FIN SERVICE">NIFTY FIN SERVICE</option>
            <option value="NIFTY FMCG">NIFTY FMCG</option>
            <option value="NIFTY IT">NIFTY IT</option>
            <option value="NIFTY MEDIA">NIFTY MEDIA</option>
            <option value="NIFTY METAL">NIFTY METAL</option>
            <option value="NIFTY INFRA">NIFTY INFRA</option>
            <option value="NIFTY ENERGY">NIFTY ENERGY</option>
            <option value="NIFTY PHARMA">NIFTY PHARMA</option>
          </select>
          <input type="submit" className='btn btn-warning mx-1' value="Submit" />
        </form>
      </div>



      <div className='container-fluid bg-light'>

        <div className="container p-3 mt-4 bg-white border rounded shadow-sm">

          <div className="d-flex content-justify-start">

            <h3 className='ms-5'>{currentIndices}</h3>

            <span className='ms-3'>
              {Data[0].change !== undefined && Data[0].change > 0 ? (<>
                <span className='alert alert-success p-1 border-0'>
                  <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" className="bi bi-caret-up-fill text-success" viewBox="0 0 16 16">
                    <path d="m7.247 4.86-4.796 5.481c-.566.647-.106 1.659.753 1.659h9.592a1 1 0 0 0 .753-1.659l-4.796-5.48a1 1 0 0 0-1.506 0z" />
                  </svg>
                  <span className='text-success fs-5 fw-semibold'>
                    {parseFloat(Data[0].change).toFixed(2)} ({Data[0].pChange}%)
                  </span>
                </span>
              </>) : (<>
                <span className='alert alert-danger p-1 border-0'>
                  <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" className="bi bi-caret-down-fill text-danger" viewBox="0 0 16 16">
                    <path d="M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z" />
                  </svg>
                  <span className='text-danger fs-5 fw-semibold'>
                    {parseFloat(Data[0].change).toFixed(2)} ({Data[0].pChange}%)
                  </span>
                </span>
              </>)}
            </span>

            <div className='ms-5 fs-5'>
              <span class="badge text-bg-primary ms-4">LTP</span>&nbsp;
              {Data[0].lastPrice === null ? NaN : Data[0].lastPrice.toLocaleString('en-IN')}

              <span class="badge text-bg-primary ms-4">High</span>&nbsp;
              {Data[0].dayHigh === null ? NaN : Data[0].dayHigh.toLocaleString('en-IN')}

              <span class="badge text-bg-primary ms-4">Low</span>&nbsp;
              {Data[0].dayLow === null ? NaN : Data[0].dayLow.toLocaleString('en-IN')}
            </div>

          </div>

          {/* Divider */}
          <hr className='mx-5' />

          <div className='d-flex justify-content-around'>

            {/* TOP GAINERS NIFTY 50 */}
            <div className="card border border-success mx-2" style={{ width: 18 + 'rem' }}>
              <div className="card-header bg-success text-light fw-bold">
                Top Gainers
              </div>
              <ul className="list-group list-group-flush">

                {
                  sortedDataChangePer.slice(Data.length - 6, Data.length).reverse().map((item) => (
                    <>
                      {/* checking item is greater than 0 */}
                      {item.change > 0 ? (<>
                        <li className="list-group-item d-flex justify-content-between">
                          <span>
                            <Link
                              to={`/stock/${item.symbol}`}
                              className='btn p-0 m-0 border-0'>
                              {item.symbol}
                            </Link>
                          </span>
                          <span>
                            {item.pChange} %
                          </span>
                        </li>
                      </>) : (<></>)}
                    </>
                  ))
                }
              </ul>
            </div>

            {/* TOP LOOSERS NIFTY 50 */}

            <div className="card border border-danger mx-2" style={{ width: 18 + 'rem' }}>
              <div className="card-header bg-danger text-light fw-bold">
                Top Loosers
              </div>
              <ul className="list-group list-group-flush">

                {
                  sortedDataChangePer.slice(0, 5).map((item) => (
                    <>
                      {/* checking item is less than 0 */}
                      {item.change < 0 ? (<>
                        <li className="list-group-item d-flex justify-content-between">
                          <span>
                            <Link
                              to={`/stock/${item.symbol}`}
                              className='btn p-0 m-0 border-0'>
                              {item.symbol}
                            </Link>
                          </span>
                          <span>{item.pChange} %</span>
                        </li>
                      </>) : (<></>)}
                    </>
                  ))
                }
              </ul>
            </div>

            {/* Volumes NIFTY 50 */}

            <div className="card border border-secondary mx-2" style={{ width: 18 + 'rem' }}>
              <div className="card-header bg-secondary text-light fw-bold">
                High Volumes
              </div>
              <ul className="list-group list-group-flush">

                {
                  Volume.slice(1, 6).map((item) => (
                    <>
                      <li className="list-group-item d-flex justify-content-between">
                        <span>
                          <Link
                            to={`/stock/${item.symbol}`}
                            className='btn p-0 m-0 border-0'>
                              {item.symbol}
                          </Link>
                        </span>
                        <span>
                          {item.totalTradedVolume === null ? NaN : item.totalTradedVolume.toLocaleString('en-IN')}
                        </span>
                      </li>
                    </>
                  ))
                }
              </ul>
            </div>

          </div>



        </div>

      </div>

    </>
  )
}

export default Market
