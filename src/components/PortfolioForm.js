import { React, useEffect, useState } from 'react'
import { db } from './firebase'
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import Login from './Login';

const PortfolioForm = () => {

    const { symbol: id } = useParams();
    const [symbol, setSymbol] = useState(id);
    const [quantity, setQuantity] = useState(0);
    const [avgBuyPrice, setAvgBuyPrice] = useState(0);
    const [data, setData] = useState({});
    const user_email = useSelector((state) => state.user)
    const isLoggedIn = useSelector((state) => state.isLoggedIn)

    // Toast //
    const addedToPortfolioToast = () => toast.success(`${symbol} added to your portfolio`, { position: "top-center", autoClose: 2000 });
    const fillAllDetails = () => toast.error("Please Fill All Details", { position: "top-center", autoClose: 3000 });
    useEffect(() => {
        setData({
            symbol: symbol,
            quantity: quantity,
            avgBuyPrice: avgBuyPrice
        })
    }, [symbol, quantity, avgBuyPrice]);

    //Add to portfolio
    const onSubmit = (e) => {
        e.preventDefault();
        let isAlready = false;

        if (symbol !== '' && quantity !== 0 && avgBuyPrice !== 0) {
            setData({
                symbol: symbol,
                quantity: quantity,
                avgBuyPrice: avgBuyPrice
            })

            //firebase connection
            db.collection('users').where('email', '==', user_email)
                .get()
                .then((querySnapshot) => {
                    querySnapshot.forEach((doc) => {
                        const portfolio = doc.data().portfolio.map((item) => item)
                        portfolio.map((item) => {
                            if (item.symbol === symbol) {
                                isAlready = true;
                            }
                        })
                        if (isAlready === true) {
                            for (let i = 0; i < portfolio.length; i++) {
                                if (portfolio[i].symbol === data.symbol) {
                                    portfolio[i].quantity = portfolio[i].quantity + quantity;
                                    portfolio[i].avgBuyPrice = (portfolio[i].avgBuyPrice + avgBuyPrice) / 2;
                                }
                            }

                            console.log(portfolio)
                            doc.ref.update({
                                portfolio: portfolio
                            })
                            addedToPortfolioToast()
                        }
                        else {
                            portfolio.push(data)
                            doc.ref.update({
                                portfolio: portfolio
                            })
                            addedToPortfolioToast()
                        }

                    });
                })
                .catch((err) => console.log(err))

        }
        else {
            fillAllDetails();
        }
    }

    return (<>
        {isLoggedIn === true ? (<>
            <div className='container mt-4 px-5 bg-white border rounded shadow-sm'>

                <h3 className='text-dark my-3'>Add To Your Portfolio</h3>
                <hr />

                <div className="conatiner">

                    <form onSubmit={onSubmit} className='form'>

                        <div class="form-group col-md-6 m-2">
                            <label
                                for="symbol">
                                Symbol
                            </label>

                            <input
                                onChange={(e) => { setSymbol(e.target.value) }}
                                type="text"
                                class="form-control my-1"
                                id="symbol"
                                value={symbol}
                                placeholder="e.g. RELIACE, TATAMOTORS"
                                required
                            />
                        </div>

                        <div class="form-group col-md-6 m-2">
                            <label
                                for="quantity">
                                Quantity
                            </label>

                            <input
                                onChange={(e) => { setQuantity(Number(e.target.value)) }}
                                type="number"
                                class="form-control my-1"
                                id="quantity"
                                placeholder="e.g. 1, 23, 117"
                                min={1}
                                required
                            />
                        </div>

                        <div class="form-group col-md-6 m-2">
                            <label
                                for="avgBuyPrice">
                                Avg. Buy Price
                            </label>

                            <input
                                onChange={(e) => { setAvgBuyPrice(Number(e.target.value)) }}
                                type="number"
                                class="form-control my-1"
                                id="avgBuyPrice"
                                placeholder="e.g. 12.3, 45.00"
                                min={0}
                                step="0.01"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            class="btn btn-success m-2">
                            Add
                        </button>

                    </form>
                </div>

            </div>
        </>) : (<>
            <Login />
        </>)}

    </>)
}

export default PortfolioForm
