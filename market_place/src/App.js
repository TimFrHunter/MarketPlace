import React, { Component } from 'react';
import './App.css';
import Offres from './Components/Offres';
import Inscription from './Components/Inscription';
import Contract from './Components/Contract';
import Router from './Components/Router';
import Demande from './Components/Demande';
import Livrable from './Components/Livrable';

class App extends Component {

  constructor(props) {
    super(props)
    this.state = { contract: '' }
  }

  async componentDidMount() {
    
    let contract = new Contract();
    await contract.init();//charge les methodes en interne (web3js + networkId + MarketPlace )
    this.setState({ contract : contract});
  }
  

  render() {
    return (
      
        <Router 
          routeComponents={[ 
            {'path': '/livrable','component': <Livrable contract={this.state.contract} />}, 
            {'path': '/inscription','component': <Inscription contract={this.state.contract} />}, 
            {'path': '/demande','component': <Demande contract={this.state.contract} />}, 
            {'path': '/','component': <Offres contract={this.state.contract} />},
          ]}
        />
      
    );
  }
}

export default App;
