import Container from 'react-bootstrap/Container';
import { useState, useEffect } from 'react';
//import Nav from 'react-bootstrap/Nav';
import Button from 'react-bootstrap/Button';
import Navbar from 'react-bootstrap/Navbar';
import 'bootstrap/dist/css/bootstrap.min.css';
import { GoogleLogin } from 'react-google-login';
import decode from 'jwt-decode';
import { useLocation } from 'react-router-dom';
function Unavbar() {
    const [isSignup, setIsSignup] = useState(false);
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('userProfile')));
    const location = useLocation();
    const googleSuccess = async (res) => {
        const result = res?.profileObj;
        const token = res?.tokenId;
        const user = { token, result };
        console.log(user);

        try {
            localStorage.setItem("userProfile", JSON.stringify({ user }));
            setIsSignup(true);
            return { authData: user };


        } catch (error) {
            console.log(error);
        }
    };

    const googleError = () => alert('Google Sign In was unsuccessful. Try again later');

    const logout = () => {
        localStorage.clear();
        setUser(null);
        window.location.reload();
        return { authData: null };
    };
    useEffect(() => {
        //console.log(user);
        if (user != null) {
            setIsSignup(true)
            const token = user.user.token;

            if (token) {
                const decodedToken = decode(token);

                if (decodedToken.exp * 1000 < new Date().getTime()) logout();
            }
        }
        else {
            setIsSignup(false)

        }

        setUser(JSON.parse(localStorage.getItem('userProfile')));
    }, [location]);


    return (
        <>
            <Navbar bg="primary" variant="dark">
                <Container>
                    <Navbar.Brand href="#home">Travelling Guide</Navbar.Brand>
                    <Navbar.Collapse className="justify-content-end">

                        {isSignup ? (<>
                            <Navbar>{user.user.result.email} </Navbar><Button variant="primary" fullwidth="true" onClick={logout}>

                                LOGOUT
                            </Button>
                        </>)
                            : (<GoogleLogin
                                clientId="40325422192-od8qbd4rsv3ekchvh2aatoerdqdhs6q4.apps.googleusercontent.com"
                                render={(renderProps) => (
                                    <Button variant="primary" fullwidth="true" onClick={renderProps.onClick} disabled={renderProps.disabled} >
                                        Google Sign In
                                    </Button>
                                )}
                                onSuccess={googleSuccess}
                                onFailure={googleError}
                                cookiePolicy="single_host_origin"
                            />)
                        }


                    </Navbar.Collapse>
                </Container>
            </Navbar>

        </>
    );
}

export default Unavbar;