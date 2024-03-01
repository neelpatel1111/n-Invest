import { React, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux'
import { db } from './firebase';
import Login from './Login';
import { Doughnut, Bar } from 'react-chartjs-2';
import { toast } from 'react-toastify';
import axios from 'axios';

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  plugins
} from 'chart.js/auto';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  plugins
)

const Portfolio = () => {

  const isLoggedIn = useSelector((state) => state.isLoggedIn)
  const user_email = useSelector((state) => state.user)
  const [portfolio, setPortfolio] = useState([])
  const [portfolioLoading, setPortfolioLoading] = useState(true);
  const navigate = useNavigate()

  // DATA for graphs
  const [chartdata, setChartdata] = useState({});
  const [chartdataReturns, setChartdataReturns] = useState({});
  const [chartLoading, setChartLoading] = useState(true);
  const [infoLoading, setInfoLoading] = useState(true);
  const [totalInvestment, setTotalInvestment] = useState(0)
  const [totalReturns, setTotalReturns] = useState(0)
  const [individualInvestment, setIndividualInvestment] = useState([]);

  // Toast //
  const removedFromWatchlistToast = (symbol) => toast.error(`${symbol} removed from your Portfolio`, { position: "top-center", autoClose: 2000 });

  // Portfolio DATA
  const getPortfolio = () => {
    db.collection("users").where('email', '==', user_email)
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          const p = doc.data().portfolio.map((item) => item)

          const updatePortfolio = async () => {
            const updatedPortfolio = await Promise.all(p.map(async (val) => {
              val.ltp = await getLTP(val.symbol);
              return val;
            }));
            setPortfolio(updatedPortfolio);
          }
          updatePortfolio();

          setPortfolio(p)
          setPortfolioLoading(false)
          console.log(portfolio)
        });

      })
  }

  // get LTP price
  const getLTP = async (symbol) => {

    const options = {
      method: 'GET',
      url: 'https://nse-market.p.rapidapi.com/stocks',
      params: {
        symbol: symbol
      },
      headers: {
        'X-RapidAPI-Key': 'dcc8f03615msh25cee0082bd2ef6p14964ajsn2a631d7bf3cb',
        'X-RapidAPI-Host': 'nse-market.p.rapidapi.com'
      }
    };

    try {
      const response = await axios.request(options);
      return Number(response.data.LastPrice)
    }
    catch (error) {
      console.error(error)
    }

  }

  // INFO DATA
  const getinfoData = () => {

    let total = 0;
    let pl = 0;
    let Individual = []
    for (let i = 0; i < portfolio.length; i++) {
      total += (portfolio[i].quantity * portfolio[i].avgBuyPrice)
      pl += ((portfolio[i].ltp - portfolio[i].avgBuyPrice) * portfolio[i].quantity)
      Individual.push({
        symbol: portfolio[i].symbol,
        invested: portfolio[i].quantity * portfolio[i].avgBuyPrice,
        returns: (portfolio[i].ltp - portfolio[i].avgBuyPrice) * portfolio[i].quantity
      })
    }

    setTotalInvestment(total)
    setTotalReturns(pl)
    setIndividualInvestment(Individual)
    setInfoLoading(false)
  }

  // CHART DATA for Invested amount
  const getChartData = () => {
    if (individualInvestment.length > 0) {
      const colors = generateRandomColors(individualInvestment.length);
      setChartdata({
        labels: individualInvestment.map((item) => item.symbol),
        datasets: [
          {
            data: individualInvestment.map((item) => item.invested),
            backgroundColor: colors
          },
        ]
      });
      setChartLoading(false);
    }
  }

  //geneartes random color for charts
  const generateRandomColors = (count) => {
    const colors = [];
    for (let i = 0; i < count; i++) {
      colors.push(`rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)},0.65)`);
    }
    return colors;
  }

  // CHART DATA for Returns
  const getChartDataReturns = () => {

    if (individualInvestment.length > 0) {

      const colors = generateRandomColors(individualInvestment.length);

      setChartdataReturns({
        labels: individualInvestment.map((item) => item.symbol),
        datasets: [
          {
            data: individualInvestment.map((item) => item.returns),
            backgroundColor: colors
          },
        ]
      });

      setChartLoading(false);
    }
  }

  // REMOVE FROM PORTFOLIO
  const removeFromPortfolio = (symbol) => {
    db.collection('users').where('email', '==', user_email)
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          const p = doc.data().portfolio.map((item) => item)
          const new_p = p.filter(val => val.symbol !== symbol)

          doc.ref.update({
            portfolio: new_p
          })

          getPortfolio()
          removedFromWatchlistToast(symbol)
         
        });
      })
      .catch((err) => console.log(err))

  }

  useEffect(() => {
    getPortfolio()
  }, [])

  useEffect(() => {
    getinfoData()
  }, [portfolio])

  useEffect(() => {
    getChartData()
    getChartDataReturns()
  }, [individualInvestment])

  return (
    <>

      {isLoggedIn === false ? (<><Login /></>) : (<>
        <div>


          <div className='container mt-4 px-5 bg-white border rounded shadow-sm'>

            <span className='d-flex justify-content-between my-3'>
              <h3 className=''>Portfolio</h3>
              <button
                className='btn btn-success'
                onClick={() => navigate('/portfolioAdd')}>
                <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" className="bi bi-plus" viewBox="0 0 16 17">
                  <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4" />
                </svg>
                Add
              </button>
            </span>
            <hr />
            <div className=''>
              {/*  Nav tabs  */}
              <ul className="nav nav-tabs">
                <li className="nav-item">
                  <a className="nav-link active" data-bs-toggle="tab" href="#menu1">Stocks</a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" data-bs-toggle="tab" href="#menu2">Breakdown</a>
                </li>

              </ul>

              {/*  Tab panes  */}
              <div className="tab-content">

                {/* Stocks */}
                <div className="tab-pane container active" id="menu1">
                  <div className='mt-3'>
                    {portfolioLoading === false ? (<>
                      <table className='table table-responsive table-bordered shadow-sm align-middle'>
                        <thead className='table-light'>
                          <tr>
                            <th>Stock</th>
                            <th>QTY</th>
                            <th>Avg Buy Price</th>
                            <th>LTP</th>
                            <th>Invested Amount</th>
                            <th>Current Value</th>
                            <th>P&L</th>
                            <th>Remove</th>
                          </tr>
                        </thead>
                        <tbody>
                          {portfolio.map((item) => (<>
                            <tr>
                              <td>{item.symbol}</td>
                              <td>{item.quantity}</td>
                              <td>{item.avgBuyPrice}</td>
                              <td>{item.ltp}</td>
                              <td>{(item.avgBuyPrice * item.quantity).toFixed(2)}</td>
                              <td>{(item.ltp * item.quantity).toFixed(2)}</td>
                              <td className='p-0'>
                                {(item.ltp - item.avgBuyPrice) > 0 ? (<>
                                  <div className="alert alert-success m-0 py-3 rounded-0">
                                    {((item.ltp - item.avgBuyPrice) * item.quantity).toFixed(2)} {' '}
                                    ({((item.ltp - item.avgBuyPrice) * item.quantity.toFixed(2) * 100 / (item.avgBuyPrice * item.quantity)).toFixed(2)}%)
                                  </div>
                                </>) : (<>
                                  <div className="alert alert-danger m-0 py-3 rounded-0">
                                    {((item.ltp - item.avgBuyPrice) * item.quantity).toFixed(2)} {' '}
                                    ({((item.ltp - item.avgBuyPrice) * item.quantity.toFixed(2) * 100 / (item.avgBuyPrice * item.quantity)).toFixed(2)}%)
                                  </div>
                                </>)}

                              </td>

                              <td>
                                <button
                                  type="button"
                                  onClick={() => removeFromPortfolio(item.symbol)}
                                  className='btn border-0'
                                  data-bs-toggle="tooltip"
                                  title="Remove From Portfolio">
                                  <svg xmlns="http://www.w3.org/2000/svg"
                                    width="20"
                                    height="20"
                                    fill="currentColor"
                                    className="bi bi-trash3-fill text-danger"
                                    viewBox="0 0 16 16">
                                    <path d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5m-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5M4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06m6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528M8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5" />
                                  </svg>
                                </button>
                              </td>
                            </tr>
                          </>))}
                        </tbody>
                      </table>
                    </>) : (<>
                      <div className="d-flex justify-content-center">
                        <div className="spinner-border" role="status">
                          <span className="sr-only"></span>
                        </div>
                      </div>
                    </>)}

                  </div>
                </div>

                {/* Breakdown */}
                <div className="tab-pane container fade" id="menu2">

                  {/* Invested Amount */}
                  <div className="container d-flex my-2 p-3 border rounded shadow-sm">

                    {/* Breakdown Chart - Invested amount */}
                    <div className='ps-4 m-0' style={{ width: 40 + '%' }}>
                      {chartLoading === true ? (<>
                        <div className="d-flex justify-content-center">
                          <div className="spinner-border" role="status">
                            <span className="sr-only"></span>
                          </div>
                        </div>
                      </>) : (<>
                        <Doughnut
                          data={chartdata}
                          options={{
                            plugins: {
                              legend: {
                                position: 'right'
                              }
                            }
                          }}

                        />
                      </>)}
                    </div>

                    {/* Breakdown Info - Invested amount */}
                    <div
                      className='border-start border-2 p-3 ps-4 pt-5'
                      style={{ width: 50 + '%' }} >

                      {infoLoading === true ? (<>
                        <div className="d-flex justify-content-center">
                          <div className="spinner-border" role="status">
                            <span className="sr-only"></span>
                          </div>
                        </div>
                      </>) : (<>
                        <h5>Total Investment: &#x20B9; {totalInvestment.toLocaleString('en-IN')} </h5>
                        <table className='table table-bordered align-middle shadow-sm'>
                          <thead className='align-middle table-light'>
                            <tr>
                              <th>Stock</th>
                              <th>Invested Amount</th>
                              <th>Per(%) of Total Investment</th>
                            </tr>
                          </thead>
                          <tbody>
                            {individualInvestment.map((item) => (<>
                              <tr>
                                <td> {item.symbol} </td>
                                <td> {item.invested.toLocaleString('en-IN')} </td>
                                <td> {(item.invested * 100 / totalInvestment).toFixed(2)} </td>
                              </tr>
                            </>))}

                          </tbody>
                        </table>

                      </>)}
                    </div>


                  </div>

                  {/* Profit */}
                  <div className="container d-flex my-2 p-3 border rounded shadow-sm">

                    {/* Breakdown Chart - Profit */}
                    <div className='pe-3 pt-5 m-0 ' style={{ width: 40 + '%' }}>
                      {chartLoading === true ? (<>
                        <div className="d-flex justify-content-center">
                          <div className="spinner-border" role="status">
                            <span className="sr-only"></span>
                          </div>
                        </div>
                      </>) : (<>
                        <Bar
                          data={chartdataReturns}
                          options={{
                            plugins: {
                              legend: {
                                display: false // Hide legend
                              }
                            }

                          }}
                        />
                      </>)}
                    </div>

                    {/* Breakdown Info - Profit*/}
                    <div
                      className='border-start border-2 p-3 ps-4 pt-5'
                      style={{ width: 50 + '%' }} >

                      {infoLoading === true ? (<>
                        <div className="d-flex justify-content-center">
                          <div className="spinner-border" role="status">
                            <span className="sr-only"></span>
                          </div>
                        </div>
                      </>) : (<>
                        <h5>Returns:  &#x20B9; {totalReturns.toLocaleString('en-IN')} ({((totalReturns * 100) / totalInvestment).toFixed(2)}%)</h5>
                        <table className='table table-bordered align-middle shadow-sm'>
                          <thead className='align-middle table-light '>
                            <tr>
                              <th>Stock</th>
                              <th>Returns</th>
                              <th>Returns(%)</th>
                              <th>Per(%) of Total Returns</th>
                            </tr>
                          </thead>
                          <tbody>
                            {individualInvestment.map((item) => (<>
                              <tr>
                                <td> {item.symbol} </td>
                                <td> {item.returns.toLocaleString('en-IN')} </td>
                                <td> {((item.returns * 100) / item.invested).toFixed(2)} </td>
                                <td> {((item.returns * 100) / totalReturns).toFixed(2)} </td>
                              </tr>
                            </>))}

                          </tbody>
                        </table>

                      </>)}
                    </div>

                  </div>

                </div>

              </div>
            </div>


          </div>
        </div>
      </>)}
    </>
  )
}

export default Portfolio
