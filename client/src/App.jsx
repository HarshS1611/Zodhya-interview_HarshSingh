import Unavbar from './components/navbar';
import { BrowserRouter as Router } from 'react-router-dom';
import FormInput from './components/formInputs';
import './App.css';
import { useEffect, useState } from 'react';

const App = () => {
  const user = JSON.parse(localStorage.getItem('userProfile'));
  const [isSignup, setIsSignup] = useState(false);

  useEffect(() => {
    //console.log(user);
    if (user != null) {
      setIsSignup(true)
    }
    else {
      setIsSignup(false)

    }
  }, []);
  return (
    <Router>
      <Unavbar />
      {isSignup ? (<><FormInput />  </>) : (<>Sign up</>)}

    </Router>
  );
}

export default App;
