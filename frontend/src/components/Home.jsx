import {Link} from 'react-router-dom';

const Home = () => {

  return (
    <div>
        <h1>Home</h1>
        <Link to="/register">Register</Link> &nbsp;
        <Link to="/login">Login</Link> &nbsp;
        <Link to="/users">All users</Link> <br /> <br />
    </div>
  )
}

export default Home