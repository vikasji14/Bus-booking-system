import React from 'react'
import { GoogleLogin } from '@react-oauth/google';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";
import { ShowLoading, HideLoading } from "../redux/alertsSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { message } from "antd";
const GoogleLoginPage = () => {

    
    const navigate = useNavigate();
      const dispatch = useDispatch();
    const handleGoogleLogin = async (credentialResponse) => {
        dispatch(ShowLoading());
        const decoded = jwtDecode(credentialResponse?.credential);
        const GoogleRes = { email: decoded?.email, name: decoded?.name, profile: decoded?.picture };
        dispatch(HideLoading());
        console.log(GoogleRes);
        try {
            const response = await axios.post(`${process.env.REACT_APP_SERVER_URL}/api/auth/googleLogin`, GoogleRes, { withCredentials: true } );
            console.log("googel resp",response);
            if (response.data.success) {
                message.success(response.data.message);
                localStorage.setItem("token", response.data.data);
                localStorage.setItem("user_id", response.data.user._id);
                
                const idTrip = localStorage.getItem("idTrip");
                if (response.data.user.isAdmin === true) {
                    navigate("/admin/buses");
                  } else if (idTrip == null) {
                    navigate("/bookings");
                  } else if (idTrip !== null) {
                    // navigate(`/book-now/${idTrip}`);
                    navigate(`/easy-booking`)
                  }
            }
            else {
                message.error(response.data.message);
            }
        } catch (error) {
            dispatch(HideLoading());
                  message.error(error.message);
        } finally {
            dispatch(HideLoading());
        }
    }
    return (
        <>
            <GoogleOAuthProvider clientId={`${process.env.REACT_APP_GOOGLE_CLINET_ID}`}>
                <GoogleLogin
                    onSuccess={handleGoogleLogin}
                    onError={(error) => console.log('Login Failed:', error)}
                >
                    Sign in with Google
                </GoogleLogin>
            </GoogleOAuthProvider>
            {/* {isLoading && <Loader />} */}
        </>
    )
}

export default GoogleLoginPage