import { useRef, useState, useEffect } from 'react';
import { faCheck,faTimes,faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from '../api/axios';

const NAME_REGEX = /^[A-Za-z][A-z0-9-_]{3,23}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const REGISTER_URL = '/users/register';

const Register = () => {
  const nameRef = useRef();
  const errorRef = useRef();

  const [name,setName] = useState('');
  const [validName,setValidName] = useState(false);
  const [nameFocus,setNameFocus] = useState(false);

  const [password,setPassword] = useState('');
  const [validPwd,setValidPwd] = useState(false);
  const [pwdFocus,setPwdFocus] = useState(false);

  const [email,setEmail] = useState('');
  const [validEmail,setValidEmail] = useState(false);
  const [emailFocus,setEmailFocus] = useState(false);

  const [matchPwd,setMatchPwd] = useState('');
  const [validMatch,setValidMatch] = useState(false);
  const [matchFocus,setMatchFocus] = useState(false);

  const [errMsg, setErrMsg] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    nameRef.current.focus();
  },[])

  useEffect(() => {
    const result = NAME_REGEX.test(name);
    setValidName(result);
  },[name]);

  useEffect(() => {
    const result = EMAIL_REGEX.test(email);
    setValidEmail(result);
  },[email]);

  useEffect(() => {
    const result = PWD_REGEX.test(password);
    setValidPwd(result);
    const match = password === matchPwd;
    setValidMatch(match)
  },[password,matchPwd]);

  useEffect(() => {
    setErrMsg('');
  },[name,password,email,matchPwd]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const v1 = NAME_REGEX.test(name);
    const v2 = PWD_REGEX.test(password);
    const v3 = EMAIL_REGEX.test(email);

    if(!v1 || !v2 || !v3){
        setErrMsg("Invalid Entry");
        return;
    }
    try {
        const response = await axios.post(REGISTER_URL,JSON.stringify({name,password,email}),{
            headers: { 'Content-Type' : 'application/json'},
            withCredentials: true
        })
        console.log(response?.data);
        setSuccess(response?.data.success);
        setName('');
        setEmail('');
        setPassword('');
        setMatchPwd('');
    } catch (err) {
        if(!err?.response){
            setErrMsg('No server response');
        }else if(err.response?.status === 409){
            setErrMsg('Username token')
        }else{
            setErrMsg('Registration failed')
        }
        errorRef.current.focus();
    }
  }

  return (
    <>
        {
            success ? (
                <section>
                    <h1>Success!</h1>
                    <p>
                        <a href="/login">Sign In</a>
                    </p>
                </section>
            ) : (
                <section>
                    <p ref={errorRef} className={errMsg ? "errmsg" : "offscreen"} aria-live='assertive'>{errMsg}</p>
                    <h1>Register</h1>
                    <form onSubmit={handleSubmit}>
                        <label htmlFor="username">
                            Username:
                            <span className={validName ? "valid" : "hide"}>
                                <FontAwesomeIcon icon={faCheck} />
                            </span>
                            <span className={validName || !name ? "hide" : "invalid"}>
                                <FontAwesomeIcon icon={faTimes}/>
                            </span>
                        </label>
                        <input type="text" id='username' ref={nameRef} autoComplete='off' onChange={(e) => setName(e.target.value)} value={name} required aria-invalid={validName ? 'false' : 'true'} aria-describedby='uidnote' onFocus={() => setNameFocus(true)} onBlur={() => setNameFocus(false)} />
                        <p id="uidnote" className={nameFocus && name && !validName ? "instructions" : "offscreen"} >
                        <FontAwesomeIcon icon={faInfoCircle} />
                        4 to 24 characters. <br/>
                        Must begin with a letter. <br/>
                        Letters, number, underscores, hypens allowed.
                        </p>

                        <label htmlFor="email">Email:</label>
                        <input type="email" id='email' autoComplete='off' onChange={(e) => setEmail(e.target.value)} value={email} required aria-invalid={validEmail ? 'false' : true} aria-describedby='emailnote' onFocus={() => setEmailFocus(true)} onBlur={() => setNameFocus(false)}/>
                        <p id='emailnote' className={emailFocus && email && !validEmail ? "instructions": "offscreen"}>
                        <FontAwesomeIcon icon={faInfoCircle} />
                        Please provide a valid email address.</p>

                        <label htmlFor="password">
                        Password:
                        <FontAwesomeIcon icon={faCheck} className={validPwd ? "valid" : "hide"}/>
                        <FontAwesomeIcon icon={faTimes} className={validPwd || !password ? 'hide' : "invalid"} />
                        </label>
                        <input type="password" id='password' onChange={(e) => setPassword(e.target.value)}
                        value={password} required aria-invalid={validPwd ? "false": "true"} aria-describedby='pwdnote' onFocus={() => setPwdFocus(true)} onBlur={() => setPwdFocus(false)} />
                        <p id='pwnote' className={pwdFocus && !validPwd ? "instructions" : "offscreen"}>
                            <FontAwesomeIcon icon={faInfoCircle} />
                            8 to 24 characters.<br />
                            Must include uppercase and lowercase letters, a number and a special character.<br />
                            Allowed special characters: <span aria-label="exclamation mark">!</span> <span aria-label="at symbol">@</span> <span aria-label="hashtag">#</span> <span aria-label="dollar sign">$</span> <span aria-label="percent">%</span>
                        </p>   

                        <label htmlFor="confirm_pwd">
                            Confirm Password:
                            <FontAwesomeIcon icon={faCheck} className={validMatch && matchPwd ? "valid" : "hide"}/>
                            <FontAwesomeIcon icon={faTimes} className={validMatch || !matchPwd ? 'hide' : "invalid"} />
                        </label>
                        <input type="password" id='confirm_pwd' onChange={(e) => setMatchPwd(e.target.value)} value={matchPwd} required aria-invalid={validName ? 'false' : 'true'} aria-describedby='confirmnote' onFocus={() => setMatchFocus(true)} onBlur={() => setMatchFocus(false)} />
                        <p id="confirmnote" className={matchFocus && !validMatch ? "instructions" : "offscreen"} >
                        <FontAwesomeIcon icon={faInfoCircle} />
                        Must match the first password input field.
                        </p>
                        <button disabled={!validName || !validPwd || !validMatch ? true : false }>Sign up</button>
                    </form>
                    <p>
                    Already registered?<br />
                    <span className="line">
                        <a href="/login">Sign In</a>
                    </span>
                    </p>
                </section>
            )
        }
    </>
  )
}

export default Register