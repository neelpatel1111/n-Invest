import React, { useEffect, useState } from 'react'
import { db } from './firebase';
import { useSelector } from 'react-redux';

const Profile = () => {

    const user = useSelector((state) => state.user)
    const [uid, setUid] = useState()
    const [email, setEmail] = useState()
    const [name, setName] = useState()
    const [pass, setPass] = useState()
    const [conf_pass, setConf_pass] = useState('')
    const [showPassword, setShowPassword] = useState(false) // for eye toggle and input type change
    const [isGoogleAcc, setIsGoogleAcc] = useState(false)

    useEffect(() => {
        db.collection("users").where("email", "==", user)
            .get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {

                    setUid(doc.data().id)
                    setName(doc.data().name)
                    setEmail(doc.data().email)
                    setPass(doc.data().password)
                    if (doc.data().password === "") {
                        setIsGoogleAcc(true)
                    }

                });

            })
            .catch((error) => {
                console.log("Error getting documents: ", error);
            });

    }, []);

    const onSubmit = (e) => {
        e.preventDefault();

        if (name !== '' && email !== '' && pass !== '' && conf_pass !== '') {
            if (pass === conf_pass) {

                db.collection("users").where("id", "==", uid)
                    .get()
                    .then(function (querySnapshot) {
                        querySnapshot.forEach(function (doc) {

                            doc.ref.update({
                                name: name,
                                email: email,
                                password: pass
                            })
                        });

                        alert(`Data updated`)
                    })

            } else {
                alert(`Confirm Password does not match`)
            }

        } else {
            alert(`Please fill all the field`)
        }

    }

    return (
        <>
            <div className="container p-4 mt-5 bg-white border rounded">
                <h4>Profile</h4>
                <hr />
                <form onSubmit={onSubmit} >
                    <div className="form-group row m-1">
                        <label htmlFor="inputName" className="col-sm-2 col-form-label">Name</label>
                        <div className="col-sm-6">
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => { setName(e.target.value) }}
                                className="form-control focus-ring focus-ring-light"
                                id="inputName"
                                placeholder="Name"
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group row m-1">
                        <label htmlFor="inputEmail" className="col-sm-2 col-form-label">Email</label>
                        <div className="col-sm-6">
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => { setEmail(e.target.value) }}
                                className="form-control focus-ring focus-ring-light"
                                id="inputEmail"
                                placeholder="Email"
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group row m-1">
                        <label htmlFor="inputPassword" className="col-sm-2 col-form-label">Password</label>
                        <div className="col-sm-6 d-flex">
                            <input
                                type={showPassword === true ? "text" : "password"}
                                value={pass}
                                onChange={(e) => { setPass(e.target.value) }}
                                className="form-control rounded-0 rounded-start focus-ring focus-ring-light"
                                id="inputPassword"
                                placeholder={isGoogleAcc === true ? "You can't change the password of Google Acc." : "Confirm Password"}
                                required
                                disabled={isGoogleAcc} // Disable if user is using Google account
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
                        <div className="col-sm-6">
                            <input
                                type="password"
                                alue={conf_pass}
                                onChange={(e) => { setConf_pass(e.target.value) }}
                                className="form-control focus-ring focus-ring-light"
                                id="inputConfirmPassword"
                                placeholder={isGoogleAcc === true ? "You can't change the password of Google Acc." : "Confirm Password"}
                                required
                                disabled={isGoogleAcc} // Disable if user is using Google account
                            />
                        </div>
                    </div>

                    <div className="form-group row m-1">
                        <div className="col-sm-10 ">
                            <button type="submit" className="btn btn-warning">Update</button>
                        </div>
                    </div>
                </form>
            </div>
        </>
    )
}

export default Profile
