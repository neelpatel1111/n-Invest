import React, { useState, useEffect } from 'react'
import axios from 'axios';
import { Link } from 'react-router-dom';
import crypto_alt_img from "../../img/cryptocurrency-coin-icon.png"

const CryptoAll = () => {
    const [serach_value, setSearch_value] = useState("");
    const [crypt_data, setCrypt_data] = useState([]);

    useEffect(() => {
        axios.get(`https://api.coincap.io/v2/assets`)
            .then((res) => { setCrypt_data(res.data.data) });
    });

    return (
        <div className="container m-auto mt-4 px-5 bg-white border rounded shadow-sm">
            <h3 className='text-dark my-3'>Cryptocurrencies</h3>
            <hr />
            <div>
                <input className="form-control w-50 border border-dark focus-ring focus-ring-dark" value={serach_value} onChange={(e) => { setSearch_value(e.target.value) }} placeholder='Search Here...' />
                <div className='table-responsive mt-3  shadow-sm'>
                    <table className='table table-bordered table-hover'>
                        <thead className='table-light text-center fw-semibold align-middle'>
                            <tr >
                                <th scope="col">Rank</th>
                                <th scope="col">Logo</th>
                                <th scope="col">Name</th>
                                <th scope="col">Symbol</th>
                                <th scope="col">Price ($ USD)</th>
                                <th scope="col">ChangeIn24Hr (%)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {crypt_data.filter((val) => {
                                return val.name.toLowerCase().includes(serach_value.toLowerCase());
                            }).map((item) => (

                                <tr className='text-center fw-semibold align-middle'>
                                    <td >
                                        {item.rank}
                                    </td>
                                    <td>
                                        <img
                                            src={`https://cryptologos.cc/logos/thumbs/${item.name.replace(/\s+/g, '-').toLowerCase()}.png`}
                                            onError={({ currentTarget }) => {
                                                currentTarget.onerror = null; // prevents looping
                                                currentTarget.src = crypto_alt_img
                                            }}
                                            height="50"
                                            width="50"
                                        />
                                    </td>
                                    <td>
                                        <Link
                                            to={`/crypto/${item.id}`}
                                            className='text-decoration-none'>
                                                {item.name}
                                        </Link>
                                    </td>
                                    <td>
                                        {item.symbol}
                                    </td>
                                    <td>
                                        {parseFloat(item.priceUsd).toFixed(3)}
                                    </td>
                                    <td className='p-0'>
                                        {item.changePercent24Hr > 0 ? (<>
                                            <div className="alert alert-success m-0 py-4 rounded-0">
                                                {parseFloat(item.changePercent24Hr).toFixed(3)}
                                            </div>
                                        </>) : (<>
                                            <div className="alert alert-danger m-0 py-4 rounded-0">
                                                {parseFloat(item.changePercent24Hr).toFixed(3)}
                                            </div>
                                        </>)}
                                    </td>

                                </tr>
                            ))}

                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default CryptoAll
