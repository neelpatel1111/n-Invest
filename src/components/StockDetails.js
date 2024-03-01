import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import JikaChartWidget from './jika/JikaChartWidget';
import axios from 'axios';
import JikaFunda from './jika/JikaFunda';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { db } from './firebase';
import { useSelector } from 'react-redux';

const StockDetails = () => {
  const { symbol } = useParams();
  const [overviewData, setOverviewData] = useState({});
  const [isOverview, setIsOverview] = useState(false);
  const user_email = useSelector((state) => state.user)
  const navigate = useNavigate()
  const isLoggedIn = useSelector((state) => state.isLoggedIn)

  // Toast //
  const addedToWatchlistToast = (symbol) => toast.success(`${symbol} added to your watchlist`, { position: "top-center", autoClose: 2000 });
  const alreadytInWatchlistToast = (symbol) => toast.info(`${symbol} is already in watchlist`, { position: "top-center", autoClose: 2000 });
  const pleaseLoginToast = () => toast.warning(`Please login to use watchlist`, { position: "top-center", autoClose: 3000 });

  // Fetch Data
  const fetchData = async () => {

    const options = {
      method: 'GET',
      url: 'https://nse-market.p.rapidapi.com/stock_metrics',
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
      setOverviewData(response.data)
      setIsOverview(true)
    } catch (error) {
      console.error(error);
    }

  }

  // Add to watchlist
  const addToWatchlist = (symbol) => {

    if (isLoggedIn === true) {

db.collection("users").where('email', '==', user_email)
  .get()
  .then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
      const watchlist = doc.data().watchlist.map((item) => item)
      if (watchlist.includes(symbol)) {
        alreadytInWatchlistToast(symbol)
      }
      else {
        watchlist.push(symbol)
        doc.ref.update({
          watchlist: watchlist
        })
        addedToWatchlistToast(symbol)
      }
    });
  })
  .catch((error) => { console.log(error) })

} else {
// if not logged in
pleaseLoginToast()
}



  }

  useEffect(() => {
    fetchData()
  }, []);

  useEffect(() => {
    fetchData()
  }, [symbol]);

  return (
    <>
      <div className='container m-auto mt-3 position-relative bg-white border rounded shadow-sm'>

        <ul class="nav nav-tabs m-2 my-4 ">

          <li class="nav-item">
            <a class="nav-link active" data-bs-toggle="pill" href="#overview">
              Overview
            </a>
          </li>

          <li class="nav-item">
            <a class="nav-link" data-bs-toggle="pill" href="#chart">
              Chart
            </a>
          </li>

          <li class="nav-item">
            <a class="nav-link" data-bs-toggle="pill" href="#fundamentals">
              Fundamentals
            </a>
          </li>

          {/* Add to watchlist Portfolio */}
          <span className='position-absolute end-0 mx-5'>
            <button
              type="button"
              className='btn p-0 mx-2 border-0'
              onClick={() => addToWatchlist(symbol)}
              data-bs-toggle="tooltip"
              title="Add To Watchlist">
              <svg xmlns="http://www.w3.org/2000/svg"
                width="25"
                height="25"
                fill="currentColor"
                className="bi bi-plus-square-fill text-success"
                viewBox="0 0 16 16">
                <path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zm6.5 4.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3a.5.5 0 0 1 1 0" />
              </svg>
            </button>
            <button
              type="button"
              className='btn p-0 mx-2 border-0'
              onClick={() => navigate(`/portfolioAdd/${symbol}`)}
              data-bs-toggle="tooltip"
              title="Add To Portfolio" >
              <svg xmlns="http://www.w3.org/2000/svg"
                width="25"
                height="25"
                fill="currentColor"
                className="bi bi-briefcase-fill text-secondary"
                viewBox="0 0 16 16">
                <path d="M6.5 1A1.5 1.5 0 0 0 5 2.5V3H1.5A1.5 1.5 0 0 0 0 4.5v1.384l7.614 2.03a1.5 1.5 0 0 0 .772 0L16 5.884V4.5A1.5 1.5 0 0 0 14.5 3H11v-.5A1.5 1.5 0 0 0 9.5 1zm0 1h3a.5.5 0 0 1 .5.5V3H6v-.5a.5.5 0 0 1 .5-.5" />
                <path d="M0 12.5A1.5 1.5 0 0 0 1.5 14h13a1.5 1.5 0 0 0 1.5-1.5V6.85L8.129 8.947a.5.5 0 0 1-.258 0L0 6.85z" />
              </svg>
            </button>
          </span>

        </ul>

        <div class="tab-content m-2">

          {/* Overview */}
          {isOverview === true ? (<>
            <div id="overview" class="tab-pane active m-2">
              <div className='my-3'>
                <h3>{overviewData.symbol}</h3>
              </div>
              <div className='container py-3 row border rounded fs-5'>

                <div className="col-4 px-3 rounded">
                  <div className='d-flex justify-content-between p-1'>
                    <span>Market Cap : </span><span>{(overviewData.marketCap).toLocaleString('en-IN')}</span>
                  </div>
                  <div className='d-flex justify-content-between p-1 bg-light rounded'>
                    <span>P/E : </span><span>{overviewData.forwardPE}</span>
                  </div>
                  <div className='d-flex justify-content-between p-1'>
                    <span>P/B : </span><span>{overviewData.priceToBook}</span>
                  </div>
                </div>

                <div className="col-4 px-3">
                  <div className='d-flex justify-content-between p-1'>
                    <span>Current Price : </span><span>Rs. {(overviewData.currentPrice).toLocaleString('en-IN')}</span>
                  </div>
                  <div className='d-flex justify-content-between p-1 bg-light rounded'>
                    <span>Debt To Equity : </span><span>{overviewData.debtToEquity}</span>
                  </div>
                  <div className='d-flex justify-content-between p-1'>
                    <span>EBITDA : </span><span>{(overviewData.ebitda).toLocaleString('en-IN')}</span>
                  </div>
                </div>

                <div className="col-4 px-3 rounded">
                  <div className='d-flex justify-content-between p-1'>
                    <span>Earnings Growth : </span><span>{overviewData.earningsGrowth}</span>
                  </div>
                  <div className='d-flex justify-content-between p-1 bg-light rounded'>
                    <span>Earnings Quarterly Growth : </span><span>{overviewData.earningsQuarterlyGrowth}</span>
                  </div>
                  <div className='d-flex justify-content-between p-1'>
                    <span>Revenue Growth : </span><span>{overviewData.revenueGrowth}</span>
                  </div>
                </div>

              </div>

              <div className='fs-4 my-2'>
                <div>
                  Recommendation : <span className='fw-semibold'> {overviewData.recommendationKey}</span>
                </div>
                <div>
                  Overall Risk : <span className='fw-semibold'> {overviewData.overallRisk}</span>
                </div>
              </div>

            </div>

          </>) : (<>
            <div className="d-flex justify-content-center my-5">
              <div className="spinner-border" role="status">
                <span className="sr-only"></span>
              </div>
            </div>
          </>)}

          {/* Chart */}
          <div id="chart" class="tab-pane fade">
            <JikaChartWidget symbol={symbol} />
          </div>

          {/* Fundamentals */}
          <div id="fundamentals" class="tab-pane fade">
            <JikaFunda symbol={symbol} />
          </div>

        </div>
      </div>
    </>
  )
}

export default StockDetails
