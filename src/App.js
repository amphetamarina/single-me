import SingleMe from './SingleMe';
import './App.css';
import { Route } from "wouter";


function App() {
  return (
    <div className="App">
      <Route path="/:arxvId">
          {({arxvId}) => <SingleMe url={ `/.netlify/functions/cors/?pdfId=${arxvId}`} />}
        </Route>
        <Route path="/">
          <p>
          Replace https://arxiv.org/pdf/2207.09238 with https://arxiv.marina.best/2207.09238, for example 
          </p>
        </Route>
    </div>
  );
}

export default App;
