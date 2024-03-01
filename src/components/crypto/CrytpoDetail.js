import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Line } from "react-chartjs-2";
import { Chart as Chartjs, LineElement, CategoryScale, LinearScale, PointElement } from 'chart.js/auto';
import { Link } from 'react-router-dom';
import crypto_alt_img from "../../img/cryptocurrency-coin-icon.png"

Chartjs.register(
    LineElement,
    CategoryScale,
    LinearScale,
    PointElement
);

const CryptoDetail = () => {
    
    const { id } = useParams();
    const [chartdata, setChartdata] = useState({});
    const [loadingData, setLoadingData] = useState(true);
    const [loadingInfo, setloadingInfo] = useState(true);
    const [info, setInfo] = useState({});
    const [timeframe, setTimeframe] = useState('m15');

    const fetchData = async () => {
        try {
            const response = await axios.get(`https://api.coincap.io/v2/assets/${id}/history?interval=${timeframe}`);
            const data = response.data.data;

            if (data !== undefined && data.length > 0) {
                setChartdata({
                    labels: data.map((item) => new Date(item.date).toString().slice(4, 21)),
                    datasets: [
                        {
                            label: "Price(USD)",
                            data: data.map((item) => item.priceUsd),
                            borderWidth: 3,
                            borderColor: 'dodgerBlue',
                            backgroundColor:'#b5c4ff',
                            fill: 'start'
                        }
                    ]
                });
            }
        } catch (error) {
            console.log(error)
        } finally {
            setLoadingData(false);
        }
    };

    const fetchInfo = async () => {
        try {
            const response = await axios.get(`https://api.coincap.io/v2/assets/${id}`);
            const data = response.data.data;

            if (data !== undefined) {
                setInfo(data)
            }
        } catch (error) {
            console.log(error)
        } finally {
            setloadingInfo(false);
        }
    };

    useEffect(() => {
        fetchData();
        fetchInfo();
    }, []);

    useEffect(() => {
        fetchData();
    }, [timeframe]);

    return (
        <>
            <nav aria-label="breadcrumb">
                <ol className="breadcrumb ms-5 ps-5 mt-2">
                    <li className="breadcrumb-item">
                        <Link
                            to="/crypto"
                            className=' text-decoration-none'>
                            Crypto
                        </Link>
                    </li>
                    <li className="breadcrumb-item active" aria-current="page">
                        {info.name}
                    </li>
                </ol>
            </nav>

            <div className='container border rounded bg-white shadow-sm'>

                {loadingInfo ? (<>
                    <div class="d-flex justify-content-center">
                        <div class="spinner-border" role="status">
                            <span class="visually-hidden">Loading...</span>
                        </div>
                    </div>
                </>) : (<>
                    <div className='mt-3 p-2 row'>
                        <div className='col-lg-4 text-center align-middle'>
                            <img
                                src={`https://cryptologos.cc/logos/${info.name.replace(/\s+/g, '-').toLowerCase()}-${info.symbol.toLowerCase()}-logo.png`}
                                onError={({ currentTarget }) => {
                                    currentTarget.onerror = null; // prevents looping
                                    currentTarget.src = crypto_alt_img;
                                }}
                                height="200"
                                width="200"
                            />
                        </div>
                        <div className='col-lg-8'>
                            <h5><b className='text-secondary'>Name : </b>{info.name}</h5>
                            <h5><b className='text-secondary'>Symbol : </b>{info.symbol}</h5>
                            <h5><b className='text-secondary'>Market Cap.(USD) : </b>{parseFloat(info.marketCapUsd).toFixed(3)}</h5>
                            <h5><b className='text-secondary'>Current Price(USD) : </b>{parseFloat(info.priceUsd).toFixed(3)}</h5>
                            <h5><b className='text-secondary'>Chang 24hr(%) : </b>{parseFloat(info.changePercent24Hr).toFixed(3)}</h5>
                            <h5><b className='text-secondary'>Volume 24hr(USD) : </b>{parseFloat(info.volumeUsd24Hr).toFixed(3)}</h5>
                            <h5><b className='text-secondary'>Explore More : </b><a className='text-dark' href={`https://www.blockchain.com/explorer/assets/${info.symbol}`} target='_blank'>Click here...</a></h5>
                        </div>
                    </div>
                    <hr />
                </>)}

                <div className='m-2 mt-3'>

                    <div className='mt-5 ms-5'>
                        <h3 className='text-primary'>Chart of {info.name}</h3>
                    </div>

                    {loadingData ? (
                        <>
                            <div class="d-flex justify-content-center">
                                <div class="spinner-border" role="status">
                                    <span class="visually-hidden">Loading...</span>
                                </div>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className='p-2 m-auto border rounded shadow-sm' style={{ width: '90%' }}>

                                {/* //Timeline Controller */}

                                <div className='d-flex justify-content-end'>
                                    <h5 className='ms-3 pt-1'>Time Frame: {timeframe} &nbsp;</h5>
                                    <button className='btn btn-sm btn-primary mx-1' onClick={(e) => { setTimeframe('m15') }}>15m</button>
                                    <button className='btn btn-sm btn-primary mx-1' onClick={(e) => { setTimeframe('h1') }}>1h</button>
                                    <button className='btn btn-sm btn-primary mx-1' onClick={(e) => { setTimeframe('h6') }}>6h</button>
                                    <button className='btn btn-sm btn-primary mx-1' onClick={(e) => { setTimeframe('d1') }}>1d</button>
                                </div>
                                <Line
                                    data={chartdata}
                                    options={{
                                        elements: {
                                            point: {
                                                radius: 0
                                            }
                                        },
                                        plugins: {
                                            legend: {
                                                display: false
                                            }
                                        },
                                        hover: {
                                            mode: 'nearest',
                                            intersect: false
                                        },

                                        scales: {
                                            x: {
                                                grid: {
                                                    display: false,
                                                },
                                            },
                                            y: {
                                                grid: {
                                                    display: false,
                                                },
                                            },
                                        }
                                    }} />

                            </div>
                        </>
                    )}


                </div>

            </div>
        </>
    );
};

export default CryptoDetail;