import SingleMe from './SingleMe';
import './App.css';
import { Route } from "wouter";


function App() {
  return (
    <div className="App">
      <Route path="/single-me/:arxvId">
          {({arxvId}) => <SingleMe url={ `https://arxiv.org/pdf/${arxvId}.pdf`} />}
        </Route>
    </div>
  );
}

export default App;
