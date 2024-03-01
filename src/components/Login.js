import React from 'react'
import { useRef, useState } from 'react'
import { Link } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import auth from './firebase';
import { GoogleAuthProvider } from 'firebase/auth';
import { signInWithPopup } from 'firebase/auth';
import { useSelector, useDispatch } from 'react-redux'
import { setUserLogin } from '../redux/createUser'
import { useNavigate } from 'react-router-dom';
import { db } from '../components/firebase';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Login = () => {

  const user = useSelector((state) => state.user)
  const dispatch = useDispatch()
  const navigate = useNavigate();
  const email = useRef(null);
  const pass = useRef(null);
  const [loginFail, setLoginFail] = useState(false);
  const [showPassword, setShowPassword] = useState(false) // for eye toggle and input type change

  //toast
  const loginSuccessToast = () => toast.success('Logged in successfuly', { position: 'top-center' })
  const registerSuccessToast = () => toast.success('Registered successfuly', { position: 'top-center' })
  const fillAllDetails = () => toast.warning('Please fill all details', { position: 'top-center' })

  const onSubmit = (e) => {
    e.preventDefault();

    if (email.current.value !== '' || pass.current.value !== '') {
      signInWithEmailAndPassword(auth, email.current.value, pass.current.value)
        .then(async (res) => {
          dispatch(setUserLogin(res.user.email));
          setLoginFail(false)
          loginSuccessToast()
          navigate('/')
        })
        .catch((error) => {
          console.log(error)
          setLoginFail(true)
        });

    } else {
      fillAllDetails();
    }

  }

  const googleLogin = async (e) => {
    e.preventDefault();

    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);

      const user = result.user;

      db.collection("users").where('email', '==', user.email).get()
        .then(snapshot => {
          if (snapshot.empty) {
            // Document doesn't exist, add the new data
            db.collection("/users")
              .add({
                id: user.uid,
                name: user.displayName,
                email: user.email,
                password: null,
                watchlist: [],
                portfolio: []
              })
              .then((docRef) => {
                console.log("Document written with ID: ", docRef.id);
                registerSuccessToast()
                dispatch(setUserLogin(user.email));
                navigate("/")
              })
              .catch((error) => {
                console.error("Error adding document: ", error);
              });


          } else {
            // Document with the specified field value already exists
            loginSuccessToast()
            dispatch(setUserLogin(user.email));
            navigate("/")
          }
        })
        .catch(error => {
          console.error('Error querying document:', error);
        });

    } catch (err) {
      // Handle errors here.
      const errorMessage = err.message;
      console.log(errorMessage)
      const errorCode = err.code;
      console.log(errorCode)
    }
  }

  return (
    <>

      {loginFail === true ? (<>
        <div className='container m-auto w-25 mt-4 p-0'>
          <div className="alert alert-danger p-0 text-center border-0" id='logFailAlert' role="alert">
            Invalid Email or Password
          </div>
        </div>
      </>) : (<>
        <div className='container m-auto w-25 my-5'>

        </div>
      </>)}

      <div className='container mb-5 mx-auto p-3 w-25 bg-white border rounded shadow'>
        <h4 className='my-1'> Log in </h4>
        <hr />

        <form onSubmit={onSubmit}>

          <div className="form-group row my-2">
            <div className="col-12">
              <input 
              onFocus={() => setLoginFail(false)} 
              type="email" 
              ref={email} 
              className="form-control focus-ring focus-ring-light" 
              id="inputEmail" 
              placeholder="Email" />
            </div>
          </div>

          <div className="form-group row my-2">
            <div className="col-12  d-flex">
              <input onFocus={() => setLoginFail(false)}
                type={showPassword === true ? "text" : "password"}
                ref={pass}
                className="form-control rounded-0 rounded-start focus-ring focus-ring-light"
                id="inputPassword"
                placeholder="Password"
              />
              <button type="button"
                className='btn bg-light border border-start-0 rounded-0 rounded-end'
                onClick={() => setShowPassword(showPassword === true ? false : true)}>
                {showPassword === true ? (<>
                  {/* Open eye */}
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-eye-fill" viewBox="0 0 16 16">
                    <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0" />
                    <path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8m8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7" />
                  </svg>
                </>) : (<>
                  {/* Close eye */}
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-eye-slash-fill" viewBox="0 0 16 16">
                    <path d="m10.79 12.912-1.614-1.615a3.5 3.5 0 0 1-4.474-4.474l-2.06-2.06C.938 6.278 0 8 0 8s3 5.5 8 5.5a7 7 0 0 0 2.79-.588M5.21 3.088A7 7 0 0 1 8 2.5c5 0 8 5.5 8 5.5s-.939 1.721-2.641 3.238l-2.062-2.062a3.5 3.5 0 0 0-4.474-4.474z" />
                    <path d="M5.525 7.646a2.5 2.5 0 0 0 2.829 2.829zm4.95.708-2.829-2.83a2.5 2.5 0 0 1 2.829 2.829zm3.171 6-12-12 .708-.708 12 12z" />
                  </svg>
                </>)}

              </button>
            </div>

          </div>

          <div className="form-group row mt-3">
            <div className="col-sm-12">
              <button type="submit" className="btn btn-warning col-sm-12">Login</button>
            </div>
          </div>

        </form>

        <div className="form-group row my-2">
          <div className="col-sm-12">
            <button onClick={(e) => { googleLogin(e) }} className="btn btn-outline-dark col-sm-12">
              <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/2048px-Google_%22G%22_logo.svg.png" alt="img" height={20} width={20} className='me-2' />
              Continue with Google
            </button>
          </div>
        </div>

        <div className="form-group row my-2">
          <div className="col-sm-12 text-center">
            OR <br /> Don't have an account? <Link to="/signup"> Sign Up</Link>
          </div>
        </div>

      </div>
    </>
  )
}

export default Login
