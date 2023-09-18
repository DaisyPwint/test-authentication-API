import {useEffect, useRef, useState} from 'react';
import axios from '../api/axios';
import useAuth from '../hook/useAuth';
import Users from './Users';
const LOGIN_URL = '/users/login';
let accessToken;

const Login = () => {
  const {setAuth} = useAuth();
  const userRef = useRef();
  const errorRef = useRef();

  const [email,setEmail] = useState('');
  const [password,setPassword] = useState('');
  const [errMsg,setErrMsg] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    userRef.current.focus();
  },[])

  useEffect(() => {
    setErrMsg('')
  },[email,password])

  const handleSubmit = async (e) => {
    e.preventDefault();
    try{
      const response = await axios.post(LOGIN_URL,JSON.stringify({
        email,password
      }),{
        headers: {'Content-Type': 'application/json'},
        withCredentials: true
      });
      console.log(JSON.stringify(response?.data));
      accessToken = response?.data.token;
      setAuth({email,password,accessToken});
      setSuccess(response?.data.success);
      setEmail('');
      setPassword('');
    }catch(err){
      if(!err?.response){
        setErrMsg('No Server Found')
      }else if(err.response?.status === 400){
        setErrMsg('Missing Username or Password')
      }else if(err.response?.status === 401){
        setErrMsg('Unauthorized');
      }else{
        setErrMsg('Login Failed');
      }
    }    
  }
  useEffect(() => {
    setAuth({ email, password, accessToken });
  }, [email, password, setAuth]);  

  return (
    <>
      {
        success ? (
          <section>
            <h1>You are logged in!</h1>
            <p>
              <Users/>
              <a href="/">Go to back Home</a>
            </p>
          </section>
        ) : (
          <section>
            <p ref={errorRef} className={errMsg ? 'errmsg' : 'offscreen'} aria-live='assertive'>{errMsg}</p>
            <h1>Sign In</h1>
            <form onSubmit={handleSubmit}>
              <label htmlFor="email">Email:</label>
              <input type="email" id='email' ref={userRef} autoComplete='off' onChange={(e) => setEmail(e.target.value)} required value={email} />

              <label htmlFor="password">Password:</label>
              <input type="password" id='password' onChange={(e) => setPassword(e.target.value)} required value={password} />
              <button>Sign In</button>
            </form>
            <p>Need an Account? <br/>
              <span className='line'>
                <a href="/register">Sign Up</a>
              </span>
            </p>
        </section>
         )
      } 
    </>
  )
}

export default Login