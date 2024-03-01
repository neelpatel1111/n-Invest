import React from 'react'
import { useRef, useState } from 'react'
import { v4 as uuidV4 } from 'uuid';
import auth from "../components/firebase"
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { db } from '../components/firebase';
import { toast } from 'react-toastify';

const Signup = () => {

  const navigate = useNavigate();
  const userId = uuidV4();
  const name = useRef(null);
  const email = useRef(null);
  const pass = useRef(null);
  const conf_pass = useRef(null);
  const [showPassword, setShowPassword] = useState(false) // for eye toggle and input type change

  // Toast
  const Pass_ConfirmPass_Toast = () => toast.warning(`Password and Confirm Password doesn't matched`, { position: "top-center", autoClose: 3000 });

  const onSubmit = (e) => {
    e.preventDefault();

    if (name.current.value !== '' || email.current.value !== '' || pass.current.value !== '' || conf_pass.current.value !== '') {

      if (pass.current.value !== conf_pass.current.value) {
        Pass_ConfirmPass_Toast();
      }
      else {

        createUserWithEmailAndPassword(auth, email.current.value, pass.current.value)
          .then(async (res) => {
            db.collection("users").add({
              id: userId,
              name: name.current.value,
              email: email.current.value,
              password: pass.current.value,
              watchlist: [],
              portfolio: []
            })
              .then((docRef) => {
                console.log("Document written with ID: ", docRef.id);
                alert("Registed Successfully")
                navigate("/login")
              })
              .catch((error) => {
                console.error("Error adding document: ", error);
              });

          })
          .catch((error) => {
            console.log(error)
          });


      }
    }

    else {
      alert("Please fill all fields")
    }

  }

  return (
    <div className='container m-auto p-3 my-5 w-50 bg-white border rounded shadow'>
      <h4 className='m-1'>Sign Up</h4>
      <hr />
      <form onSubmit={onSubmit} >

        <div className="form-group row m-1">
          <label htmlFor="inputName" className="col-sm-2 col-form-label">Name</label>
          <div className="col-sm-10">
            <input 
            type="text" 
            ref={name} 
            className="form-control focus-ring focus-ring-light" 
            id="inputName"
             placeholder="Name" 
             required />
          </div>
        </div>

        <div className="form-group row m-1">
          <label htmlFor="inputEmail" className="col-sm-2 col-form-label">Email</label>
          <div className="col-sm-10">
            <input type="email" 
            ref={email} 
            className="form-control focus-ring focus-ring-light" 
            id="inputEmail" 
            placeholder="Email" 
            required />
          </div>
        </div>

        <div className="form-group row m-1">
          <label htmlFor="inputPassword" className="col-sm-2 col-form-label">Password</label>
          <div className="col-sm-10 d-flex">
            <input
              type={showPassword === true ? "text" : "password"}
              ref={pass}
              className="form-control rounded-0 rounded-start focus-ring focus-ring-light"
              id="inputPassword"
              placeholder="Password"
              required
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

        <div className="form-group row m-1">
          <label htmlFor="inputConfirmPassword" className="col-sm-2 col-form-label"></label>
          <div className="col-sm-10">
            <input type="password" 
            ref={conf_pass} 
            className="form-control focus-ring focus-ring-light" 
            id="inputConfirmPassword" 
            placeholder="Confirm Password" 
            required />
          </div>
        </div>

        <div className="form-group row m-1">
          <label htmlFor="submit" className="col-sm-2 col-form-label"></label>
          <div className="col-sm-10 mt-3">
            <button type="submit" className="btn btn-warning">Sign Up</button>
          </div>
        </div>
      </form>

    </div>
  )
}

export default Signup
