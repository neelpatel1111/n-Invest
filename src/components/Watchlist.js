import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import Login from './Login';
import { db } from './firebase';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const Watchlist = () => {

    const isLoggedIn = useSelector((state) => state.isLoggedIn)
    const user_email = useSelector((state) => state.user)
    const [watchlist, setWatchlist] = useState([]);
    const [LatestData, setLatestData] = useState([]);
    const [LatestDataLoading, setLatestDataLoading] = useState(true)
    const navigate = useNavigate();

    // Toast //
    const removedFromWatchlistToast = (symbol) => toast.error(`${symbol} removed from your watchlist`, { position: "top-center", autoClose: 2000 });

    // Get Watchlist
    const getWatchlist = () => {

        db.collection("users").where('email', '==', user_email)
            .get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    const watchlist = doc.data().watchlist.map((item) => item)
                    setWatchlist(watchlist)
                });
            })

    }

    // fetch Latest Data 
    const fetchData = async () => {

        for (let i = 0; i < watchlist.length; i++) {
            const options = {
                method: 'GET',
                url: 'https://nse-market.p.rapidapi.com/stocks',
                params: {
                    symbol: watchlist[i]
                },
                headers: {
                    'X-RapidAPI-Host': 'nse-market.p.rapidapi.com',
                    'X-RapidAPI-Key': 'dcc8f03615msh25cee0082bd2ef6p14964ajsn2a631d7bf3cb'
                }
            }

            try {
                const response = await axios.request(options);
                setLatestData(prevArray => [...prevArray, response.data])
                setLatestDataLoading(false)
            } catch (error) {
                console.error(error)
            }
        }

    }

    // Romove function
    const removeFromWatchlist = (symbol) => {
        db.collection('users').where('email', '==', user_email)
            .get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    const watchlist = doc.data().watchlist.map((item) => item)
                    const new_watchlist = watchlist.filter(val => val !== symbol)

                    doc.ref.update({
                        watchlist: new_watchlist
                    })

                    removedFromWatchlistToast(symbol)
                    setLatestData([])
                    getWatchlist()
                });
            })
            .catch((err) => console.log(err))
    }

    // Refresh function
    const refresh = () => {
        // reset the LATEST DATA ARRAY
        setLatestData([])
        getWatchlist()
        console.log("Refreshed")
    }

    useEffect(() => {
        setLatestData([])
        getWatchlist()
        console.log("Initial effect")
    }, []);

    useEffect(() => {
        fetchData()
        console.log("watchlist effect")
    }, [watchlist]);

    return (
        <>

            {isLoggedIn === false ? (<>
                <Login />
            </>) : (
                <>

                    <div className="container mt-4 px-5 bg-white border rounded shadow-sm">
                        <div className="d-flex justify-content-between my-3">
                            <div className=''>
                                <h3 className='text-dark'>Watchlist</h3>
                            </div>
                            <div className=''>
                                <button className='btn btn-secondary p-1'
                                    onClick={refresh}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-arrow-clockwise" viewBox="0 0 16 16">
                                        <path fill-rule="evenodd" d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2z" />
                                        <path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        <hr />

                        <div className='table-responsive'>
                            <table class="table table-bordered shadow-sm">
                                <thead className="table-light">
                                    <tr>
                                        <th scope="col">Name</th>
                                        <th scope="col">LTP</th>
                                        <th scope="col">Change</th>
                                        <th scope="col">1 Month</th>
                                        <th scope="col">52 Weeks</th>
                                        <th scope="col">Remove</th>
                                        <th scope="col">Portfolio</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {LatestDataLoading === false ? (<>
                                        {LatestData.map((item) => (<>
                                            <tr>

                                                {/* SYMBOL */}
                                                <td>
                                                    <Link
                                                        to={`/stock/${item.Symbol}`}
                                                        className='text-decoration-none'>
                                                        {item.Symbol}
                                                    </Link>
                                                </td>

                                                {/* LTP */}
                                                <td>
                                                    {item.LastPrice}
                                                </td>

                                                {/* CHANGE */}
                                                <td>
                                                    {item.Change > 0 ? (<>
                                                        <span className='text-success'>
                                                            +{item.Change} ({item.PercentChange}%)
                                                        </span>
                                                    </>) : (<>
                                                        <span className='text-danger'>
                                                            {item.Change} ({item.PercentChange}%)
                                                        </span>
                                                    </>)}

                                                </td>

                                                {/* 1 MONTH */}
                                                <td>
                                                    <img src={item.Chart30dPath} alt='img' /> &nbsp;
                                                    {item.PercentChange30d > 0 ? (<>
                                                        <span className='text-success'>
                                                            +{item.PercentChange30d}%
                                                        </span>
                                                    </>) : (<>
                                                        <span className='text-danger'>
                                                            {item.PercentChange30d}%
                                                        </span>
                                                    </>)}
                                                </td>

                                                {/* 52 WEEKS */}
                                                <td>
                                                    <img src={item.Chart365dPath} alt='img' /> &nbsp;
                                                    {item.PercentChange365d > 0 ? (<>
                                                        <span className='text-success'>
                                                            +{item.PercentChange365d}%
                                                        </span>
                                                    </>) : (<>
                                                        <span className='text-danger'>
                                                            {item.PercentChange365d}%
                                                        </span>
                                                    </>)}
                                                </td>

                                                <td>
                                                    <button
                                                        type="button"
                                                        onClick={() => removeFromWatchlist(item.Symbol)}
                                                        className='btn border-0'
                                                        data-bs-toggle="tooltip"
                                                        title="Remove From Watchlist">
                                                        <svg xmlns="http://www.w3.org/2000/svg"
                                                            width="20"
                                                            height="20"
                                                            fill="currentColor"
                                                            class="bi bi-trash3-fill text-danger"
                                                            viewBox="0 0 16 16">
                                                            <path d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5m-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5M4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06m6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528M8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5" />
                                                        </svg>
                                                    </button>
                                                </td>

                                                <td>
                                                    <button
                                                        type="button"
                                                        className='btn p-0 mx-2 border-0'
                                                        onClick={() => navigate(`/portfolioAdd/${item.Symbol}`)}
                                                        data-bs-toggle="tooltip"
                                                        title="Add To Portfolio">
                                                        <svg xmlns="http://www.w3.org/2000/svg"
                                                            width="20"
                                                            height="20"
                                                            fill="currentColor"
                                                            className="bi bi-briefcase-fill text-success"
                                                            viewBox="0 0 16 16">
                                                            <path d="M6.5 1A1.5 1.5 0 0 0 5 2.5V3H1.5A1.5 1.5 0 0 0 0 4.5v1.384l7.614 2.03a1.5 1.5 0 0 0 .772 0L16 5.884V4.5A1.5 1.5 0 0 0 14.5 3H11v-.5A1.5 1.5 0 0 0 9.5 1zm0 1h3a.5.5 0 0 1 .5.5V3H6v-.5a.5.5 0 0 1 .5-.5" />
                                                            <path d="M0 12.5A1.5 1.5 0 0 0 1.5 14h13a1.5 1.5 0 0 0 1.5-1.5V6.85L8.129 8.947a.5.5 0 0 1-.258 0L0 6.85z" />
                                                        </svg>
                                                    </button>
                                                </td>

                                            </tr>
                                        </>))}
                                    </>) : (<>
                                        <tr className='text-center'>
                                            <td colspan='7'>
                                                <div className="d-flex justify-content-center">
                                                    <div className="spinner-border" role="status">
                                                        <span className="sr-only"></span>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    </>)}
                                </tbody>
                            </table>
                        </div>

                    </div>

                </>
            )}
        </>
    )
}

export default Watchlist
