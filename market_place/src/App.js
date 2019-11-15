import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Web3 from 'web3';
import marketPlace from './abi/MarketPlace.json'

class App extends Component {

  constructor(props) {
    super(props)
    this.state = { account: '' }
  }

  componentWillMount() {

 
    this.loadBlockchainData()
  }

  async loadBlockchainData() {
    const web3 = new Web3(Web3.givenProvider)
    const accounts = await web3.eth.getAccounts()
    this.setState({ account: accounts[0] })

    const networkId = await web3.eth.net.getId()
    const networkData = marketPlace.networks[networkId]

    if(networkData) {
      const contrat = new web3.eth.Contract(marketPlace.abi, networkData.address)
     // const demandes = await contrat.methods.getDemandes().call()
      console.log(await contrat.methods.demandes("0x6b7eb67f41dcaae38dfa61eba0bd37dc4ab91d5f").call())
     
    }else {
      window.alert('MarketPlace contract not deployed to detected network id:',networkId)
      }
  }

 

  render() {
    return (
      <div className="container">
        <h1>Hello, World!</h1>
        <p>Your account: {this.state.account}</p>
      </div>
    );
  }
}

export default App;
