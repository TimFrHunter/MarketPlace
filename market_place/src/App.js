import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Web3 from 'web3';
import marketPlace from './abi/MarketPlace.json'

class App extends Component {

  constructor(props) {
    super(props)
    this.state = { account: '', demandes : '' }
  }

  componentDidMount() {
    this.loadBlockchainData()
  }

  async loadBlockchainData() {
    const web3 = new Web3(Web3.givenProvider)
    const accounts = await web3.eth.getAccounts()
   

    const networkId = await web3.eth.net.getId()
    const networkData = marketPlace.networks[networkId]

    if(networkData) {
      const contrat = new web3.eth.Contract(marketPlace.abi, networkData.address)
      const demandes = await contrat.methods.getAllDemandes().call()
      this.setState({ account: accounts[0], demandes : demandes })
    }else {
      window.alert('MarketPlace contract not deployed to detected network id:',networkId)
      }
  }

  renderOffres = () => {
    let {demandes} = this.state
    let res = []
    const demandeMapping = ["Remuneration","Durée","Description","Statut","Reputation minimum","Ayant Postulés"]
    const demandeStatutMapping = ["Ouverture", "Encours", "Fermee"]
    
    if(typeof demandes == 'object'){
      for(let idx = 0;idx < demandes[0].length; idx++){
        let lis = Object.keys(demandes).map( key => {
          let demande = demandes[key][idx]
          
          if(typeof demande == 'object'){
            let clients = demande.map(client => {
              return <li>{client}</li>
            })
            return <li className="lastLi">{demandeMapping[key]} : <ul>{clients}</ul></li>
          }
          if(key == 0){
            return  <li>{demandeMapping[key]} : {demande / 10**18} Ether</li>
          }
          if(key == 1){
            return  <li>{demandeMapping[key]} : {Math.floor(demande / 60)}H</li>
          }
          if(key == 3){
            return  <li>{demandeMapping[key]} : {demandeStatutMapping[demande]}</li>
          }
          return  <li>{demandeMapping[key]} : {demande}</li> 
        });
        res.push(<span className="list-type2"><h4 className="offresh4">Offre #{idx+1}</h4><ul>{lis}</ul></span>)
      
         
      }
    }
    return res
    
  }


  render() {
    let { account } = this.state
    return (
      <div className="container">
        <h1 className="offresH1">Liste d'offres</h1>
        <div>{this.renderOffres()}</div>
      </div>
    );
  }
}

export default App;
