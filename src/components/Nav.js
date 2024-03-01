import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import auth from './firebase';
import { setUserLogout } from '../redux/createUser';
import Logo from "../img/logo.ico"
import axios from 'axios';
import { db } from './firebase';
import { toast } from 'react-toastify';

const Nav = () => {
  const isLoggedIn = useSelector((state) => state.isLoggedIn)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [data, setData] = useState([])
  const [searchKey, setSearchKey] = useState('')
  const [searchData, setSearchData] = useState([])

  const user_email = useSelector((state) => state.user)

  // Toast //
  const addedToWatchlistToast = (symbol) => toast.success(`${symbol} added to your watchlist`, { position: "top-center", autoClose: 2000 });
  const alreadytInWatchlistToast = (symbol) => toast.info(`${symbol} is already in watchlist`, { position: "top-center", autoClose: 2000 });
  const pleaseLoginToast = () => toast.warning(`Please login to use watchlist`, { position: "top-center", autoClose: 3000 });

  const fetchData = async () => {
    const options = {
      method: 'GET',
      url: 'https://latest-stock-price.p.rapidapi.com/any',
      headers: {
        'X-RapidAPI-Key': 'dcc8f03615msh25cee0082bd2ef6p14964ajsn2a631d7bf3cb',
        'X-RapidAPI-Host': 'latest-stock-price.p.rapidapi.com'
      }
    };

    try {
      const response = await axios.request(options);
      setData(response.data)
      setSearchData(response.data.map((item) => item.symbol))
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  const onLogout = () => {
    signOut(auth)
    dispatch(setUserLogout());
    navigate("/")
  }

  const searchResultClick = (symbol) => {
    navigate(`/stock/${symbol}`)
  }

  // Add to Watchlist
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


  return (
    <>

      {/* Latest Price Slider */}
      <div className="bg-dark w-100 px-3 pt-1">
        <marquee width="100%" direction="left" behavior="scroll" scrollamount="4">
          {data.map((item) => (
            item.change > 0 ? (<>
              <span className='text-light fw-bold '>
                &nbsp;
                {item.symbol}&nbsp;
              </span>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-caret-up-fill text-success" viewBox="0 0 16 16">
                <path d="m7.247 4.86-4.796 5.481c-.566.647-.106 1.659.753 1.659h9.592a1 1 0 0 0 .753-1.659l-4.796-5.48a1 1 0 0 0-1.506 0z" />
              </svg>
              <span className='text-success fw-semibold'>
                {parseFloat(item.change).toFixed(2)}( {item.pChange}% )
                &nbsp;&nbsp;&nbsp;
              </span>
            </>) : (<>
              <span className='text-light fw-bold'>
                &nbsp;
                {item.symbol}&nbsp;
              </span>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-caret-down-fill text-danger" viewBox="0 0 16 16">
                <path d="M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z" />
              </svg>
              <span className='text-danger fw-semibold'>
                {parseFloat(item.change).toFixed(2)}( {item.pChange}% )
                &nbsp;&nbsp;&nbsp;
              </span>
            </>)

          ))}
        </marquee>

      </div>

      {/* NavBar */}
      <nav className='nav nav-light py-2 bg-white justify-content-between border-bottom border-3 border-warning'>

        <div className="d-flex">
          {/* Logo */}
          <h4 className='mx-4 pt-2 text-warning'>
            <img src={Logo} width="40" height="37" alt='logo' />
            &nbsp;n-Invest
          </h4>

          {/* Nav Links */}
          <div className="nav nav-underline ms-2 me-5 pt-1">
            <li className='me'>
              <Link to="/" className="nav-link link-dark fw-semibold " title="Home" data-bs-toggle="tooltip" data-bs-placement="right" data-bs-original-title="Home">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-house-door-fill" viewBox="0 0 20 20">
                  <path d="M6.5 14.5v-3.505c0-.245.25-.495.5-.495h2c.25 0 .5.25.5.5v3.5a.5.5 0 0 0 .5.5h4a.5.5 0 0 0 .5-.5v-7a.5.5 0 0 0-.146-.354L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293L8.354 1.146a.5.5 0 0 0-.708 0l-6 6A.5.5 0 0 0 1.5 7.5v7a.5.5 0 0 0 .5.5h4a.5.5 0 0 0 .5-.5" />
                </svg>
                Home
              </Link>
            </li>

            <li className='nav-item'>
              <Link to="/market" className="nav-link link-dark fw-semibold" data-bs-toggle="tooltip" data-bs-placement="right" data-bs-original-title="Market" title="Market" >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-graph-up" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M0 0h1v15h15v1H0zm14.817 3.113a.5.5 0 0 1 .07.704l-4.5 5.5a.5.5 0 0 1-.74.037L7.06 6.767l-3.656 5.027a.5.5 0 0 1-.808-.588l4-5.5a.5.5 0 0 1 .758-.06l2.609 2.61 4.15-5.073a.5.5 0 0 1 .704-.07" />
                </svg>
                Market
              </Link>
            </li>

            <li className='nav-item'>
              <Link to="/crypto" className="nav-link link-dark fw-semibold" title="Crypto" data-bs-toggle="tooltip" data-bs-placement="right" data-bs-original-title="Crypto">
                <svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 36 36">
                  <path d="M16 32C7.163 32 0 24.837 0 16S7.163 0 16 0s16 7.163 16 16-7.163 16-16 16zm5.002-22.145l.81-3.241-2.596-.646-.643 2.575a8.277 8.277 0 00-1.298-.323l.644-2.575L15.323 5l-.81 3.241c-2.983.542-5.509 2.737-6.28 5.823s.426 6.206 2.804 8.08l-.81 3.242 2.596.646.643-2.575a8.277 8.277 0 001.298.323l-.644 2.575 2.596.645.81-3.241a7.974 7.974 0 005.2-3.385l-2.847-.708a5.373 5.373 0 01-5.134 1.43c-2.866-.712-4.62-3.572-3.917-6.387s3.599-4.519 6.466-3.806a5.357 5.357 0 013.86 3.667l2.846.708a7.947 7.947 0 00-2.998-5.423z" />
                </svg>
                Crypto
              </Link>
            </li>

            <li className='nav-item'>
              <Link to="/news" className="nav-link link-dark fw-semibold" title="News" data-bs-toggle="tooltip" data-bs-placement="right" data-bs-original-title="News">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-newspaper" viewBox="0 0 20 20">
                  <path d="M0 2.5A1.5 1.5 0 0 1 1.5 1h11A1.5 1.5 0 0 1 14 2.5v10.528c0 .3-.05.654-.238.972h.738a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 1 1 0v9a1.5 1.5 0 0 1-1.5 1.5H1.497A1.497 1.497 0 0 1 0 13.5zM12 14c.37 0 .654-.211.853-.441.092-.106.147-.279.147-.531V2.5a.5.5 0 0 0-.5-.5h-11a.5.5 0 0 0-.5.5v11c0 .278.223.5.497.5z" />
                  <path d="M2 3h10v2H2zm0 3h4v3H2zm0 4h4v1H2zm0 2h4v1H2zm5-6h2v1H7zm3 0h2v1h-2zM7 8h2v1H7zm3 0h2v1h-2zm-3 2h2v1H7zm3 0h2v1h-2zm-3 2h2v1H7zm3 0h2v1h-2z" />
                </svg>
                News
              </Link>
            </li>

            <li className='nav-item'>
              <Link to="/watchlist" className="nav-link link-dark  fw-semibold" title="Watchlist" data-bs-toggle="tooltip" data-bs-placement="right" data-bs-original-title="Watchlist">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-card-list" viewBox="0 0 20 20">
                  <path d="M14.5 3a.5.5 0 0 1 .5.5v9a.5.5 0 0 1-.5.5h-13a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5zm-13-1A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h13a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2z" />
                  <path d="M5 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 5 8m0-2.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5m0 5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5m-1-5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0M4 8a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0m0 2.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0" />
                </svg>
                Watchlist
              </Link>
            </li>

            <li className='nav-item'>
              <Link to="/portfolio" className="nav-link link-dark fw-semibold" title="Portfolio" data-bs-toggle="tooltip" data-bs-placement="right" data-bs-original-title="Portfolio">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-briefcase-fill" viewBox="0 0 20 20">
                  <path d="M6.5 1A1.5 1.5 0 0 0 5 2.5V3H1.5A1.5 1.5 0 0 0 0 4.5v1.384l7.614 2.03a1.5 1.5 0 0 0 .772 0L16 5.884V4.5A1.5 1.5 0 0 0 14.5 3H11v-.5A1.5 1.5 0 0 0 9.5 1zm0 1h3a.5.5 0 0 1 .5.5V3H6v-.5a.5.5 0 0 1 .5-.5" />
                  <path d="M0 12.5A1.5 1.5 0 0 0 1.5 14h13a1.5 1.5 0 0 0 1.5-1.5V6.85L8.129 8.947a.5.5 0 0 1-.258 0L0 6.85z" />
                </svg>
                Portfolio
              </Link>
            </li>
          </div>


          {/* Button trigger modal Search */}
          <div className='pt-2'>
            <button type="button" className="btn border border-dark" data-bs-toggle="modal" data-bs-target="#searchModal">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-search m-0 p-0" viewBox="0 0 16 16">
                <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0" />
              </svg>
              <span className="text-secondary">
                &nbsp;&nbsp; Search Stocks, Indices etc.
              </span>
            </button>
          </div>

          {/* Modal Search Pop Up */}
          <div className="modal fade" id="searchModal" tabIndex="-1" role="dialog" aria-labelledby="searchModalLabel" aria-hidden="true">
            <div className="modal-dialog" role="document">
              <div className="modal-content">
                <div className="p-0 text-end">

                  <button type="button" className="btn p-0 m-1 border-0" data-bs-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">
                      <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" class="bi bi-x-circle text-secondary" viewBox="0 0 16 16">
                        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
                        <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708" />
                      </svg>
                    </span>
                  </button>

                </div>
                {/* Modal Search Pop Up Body*/}
                <div className="modal-body">

                  <div className="input-group mb-3">
                    <input type="text" className="form-control border-dark focus-ring focus-ring-dark" onChange={(e) => { setSearchKey(e.target.value) }} data-autofocus="true" placeholder="&nbsp; Search Stocks, Indices etc." aria-label="Recipient's username" aria-describedby="button-addon2" />
                    <button class="btn btn-dark pt-0" type="button">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-search" viewBox="0 0 16 16">
                        <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0" />
                      </svg>
                    </button>
                  </div>

                  <div className="conatiner">
                    {searchKey !== '' ? (searchData.filter((val) => {
                      return val.includes(searchKey.toUpperCase())
                    }).map((item) => (<>
                      <div className='d-flex justify-content-between border-bottom'>
                        <button
                          className='btn border-0'
                          onClick={() => searchResultClick(item)}
                          data-bs-dismiss="modal">
                          {item}
                        </button>
                        <span>
                          <button
                            type="button"
                            className='btn p-0 mx-2 border-0'
                            onClick={() => addToWatchlist(item)}
                            data-bs-toggle="tooltip"
                            title="Add To Watchlist">
                            <svg xmlns="http://www.w3.org/2000/svg"
                              width="20"
                              height="20"
                              fill="currentColor"
                              className="bi bi-plus-square-fill text-success"
                              viewBox="0 0 16 16">
                              <path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zm6.5 4.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3a.5.5 0 0 1 1 0" />
                            </svg>
                          </button>
                          <button
                            type="button"
                            className='btn p-0 mx-2 border-0'
                            onClick={() => navigate(`/portfolioAdd/${item}`)}
                            data-bs-toggle="tooltip"
                            title="Add To Portfolio"
                            data-bs-dismiss="modal">
                            <svg xmlns="http://www.w3.org/2000/svg"
                              width="20"
                              height="20"
                              fill="currentColor"
                              className="bi bi-briefcase-fill text-secondary"
                              viewBox="0 0 16 16">
                              <path d="M6.5 1A1.5 1.5 0 0 0 5 2.5V3H1.5A1.5 1.5 0 0 0 0 4.5v1.384l7.614 2.03a1.5 1.5 0 0 0 .772 0L16 5.884V4.5A1.5 1.5 0 0 0 14.5 3H11v-.5A1.5 1.5 0 0 0 9.5 1zm0 1h3a.5.5 0 0 1 .5.5V3H6v-.5a.5.5 0 0 1 .5-.5" />
                              <path d="M0 12.5A1.5 1.5 0 0 0 1.5 14h13a1.5 1.5 0 0 0 1.5-1.5V6.85L8.129 8.947a.5.5 0 0 1-.258 0L0 6.85z" />
                            </svg>
                          </button>
                        </span>
                      </div>
                    </>))) : (<>

                    </>)}
                  </div>

                </div>

              </div>
            </div>
          </div>


        </div>

        {/* Login Signup Controls */}
        <div className='pt-2'>
          {isLoggedIn === false ? (
            <>
              <div className="mx-2">
                <Link to="/login" className='btn btn-outline-warning text-dark mx-1'>Login</Link>
                <Link to="/signup" className='btn btn-outline-warning text-dark  mx-1'>SignUp</Link>
              </div>
            </>
          ) : (
            <>
              <div className="flex-shrink-0 dropdown mx-4">
                <a href="#" className="d-block link-dark text-decoration-none dropdown-toggle " id="dropdownUser" data-bs-toggle="dropdown" aria-expanded="false">

                  <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" className="bi bi-person-circle text-dark" viewBox="0 0 16 16">
                    <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0" />
                    <path fillRule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1" />
                  </svg>

                </a>
                <ul className="dropdown-menu text-small shadow" aria-labelledby="dropdownUser" >
                  <Link to="/profile" className='dropdown-item text-decoration-none text-dark'>Profile</Link>
                  <li><hr className="dropdown-divider" /></li>
                  <button onClick={() => { onLogout() }} className="dropdown-item">
                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" className="bi bi-box-arrow-right" viewBox="0 0 16 16">
                      <path fill-rule="evenodd" d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0z" />
                      <path fill-rule="evenodd" d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708z" />
                    </svg>
                    &nbsp;&nbsp;Logout
                  </button>
                </ul>
              </div>
            </>
          )}
        </div>
      </nav>
    </>
  )
}

export default Nav
