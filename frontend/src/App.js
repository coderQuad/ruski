import logo from './logo.svg';
import './App.css';
import { request, gql } from 'graphql-request';

const query = gql`
{
    users {
      name
      handle
      elo
      id
      friends {
        name
        handle
      }
    }
  }
`

request('http://localhost:4000/graphql', query).then((data) => console.log(data));

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
