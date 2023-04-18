import { signInWithPopup } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { auth, provider } from '../firebase-config';


function Login({setIsAuth}) {
  
  const navigate = useNavigate();
  
  
  function signInWithGoogle() {
    signInWithPopup(auth, provider)
    .then(result => {
      localStorage.setItem('isAuth', true);
      
      setIsAuth(true);

      console.log(result);

      navigate('/userpage');
    })
  }
  
  
  return (
    <div className='login-card'>
      <p>Sign in with Google</p>
      <button onClick={signInWithGoogle}>Sign in with Google</button>
    </div>
  );
}

export default Login;