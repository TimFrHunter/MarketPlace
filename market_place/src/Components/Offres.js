import React, { Component } from 'react';
import '../css/Offres.css';
import Converter from '../utils/converter';



class Offres extends Component {

  constructor(props) {
    super(props)
    this.state = { account : '', contract : '', demandes : '', popup : ''}

    //Constante, non variable
    this.demandeMapping = ["","Employeur","Remuneration","Jusqu'au","Description","Statut","Reputation minimum","Ayant Postulés"]
    this.demandeStatutMapping = ["Ouverture", "En cours", "Fermée"]
    this.postulantsMapping = ["", "Postulant", "Reputation"]

    this.postulants = []
    
  }

  async componentDidUpdate(prevProps){
    console.log('update')
   
    if (this.props !== prevProps || !this.state.demandes) {
      
      const {contract} = this.props
      const demandes = await contract.callMethodes('getAllDemandes');
      this.setState({ demandes : demandes, contract : contract })
    }
    
  }

  postuler(idx){
    this.state.contract.sendMethodes("postuler",[idx])
  }

  async callPostulants(demandesIdxByOwner){
    for(let idx of demandesIdxByOwner){
      this.postulants[idx] = await this.state.contract.callMethodes('getPostulantsByDemandesIndex',[idx]);
    }
  }

  selectionPostulant(indexDemande, postulantAddr){
    this.state.contract.sendMethodes("accepterOffre", [indexDemande, postulantAddr])

  }

  showPostulants(idx){
    if(idx === undefined)
      return '';
    
    let lis = [];  
    let demande = this.postulants[idx];
    let len = demande[0].length;
    for(let i = 0; i < len; i++){
      lis.push(<li  key={i}><span >{demande[1][i]}</span><span>Réputation : {demande[2][i]}</span>
      <button type="button"  onClick={() => this.selectionPostulant(idx, demande[0][i])}>Sélectionner</button></li>);
    }
    lis.push(<button className="annulerPopup" onClick={() => this.setState({ popup : ''})}>Annuler</button>)
   
    let popup = <div className="popup"><ul className="postulants">{lis}</ul></div>;
    this.setState({ popup : popup })
  }

  offres () {
    const {demandes} = this.state
   
    let res = [];
    let demandesIdxByOwner = [];
    const demandeMapping = this.demandeMapping 
    const demandeStatutMapping = this.demandeStatutMapping
    let statut = '';
    let lis = [];
    
    if(typeof demandes === "object"){
      for(let idx = 0;idx < demandes[0].length; idx++){
        let employeurAddr = ''; 
        lis = Object.keys(demandes).map( key => {
          let demande = demandes[key][idx]
          
          if(key === '0'){
            employeurAddr = demande;
            return <li key={key} className="postuler" onClick={() => this.postuler(idx)}>Postuler</li>
          }
          if(key === '2'){
            return  <li key={key}>{demandeMapping[key]} : {demande / 10**18} Ether</li>
          }
          if(key === '3'){
            const delay = new Date(parseInt(demande, 10));
            return  <li key={key}>{demandeMapping[key]} : {delay.getDate()+'/'+delay.getMonth()+'/'+delay.getFullYear()}</li>
          }
          if(key === '4'){
            
            return  <li className="description" key={key}>{demandeMapping[key]}  : {Converter.hex_to_ascii(demande)}</li>
          }
          if(key === '5'){
            statut = demande;
            return  <li key={key}>{demandeMapping[key]}  : {demandeStatutMapping[demande]}</li>
          }
          if(key === '7'){
            if(statut === '1' || statut === "2"){//En cours
              return <li key={key}>{demandeMapping[key]} : {demande} </li>
            }else{
              let accepter = '';
              if(employeurAddr === this.state.contract.account && demande > 0){
                accepter = <span className="showPostulants" onClick={() =>  this.showPostulants(idx) } >Selectionner un postulant</span>
                demandesIdxByOwner.push(idx);
              }
              return  <li key={key}>{demandeMapping[key]} : {demande} {accepter} </li>
            }
          }
          return  <li key={key}>{demandeMapping[key]} : {demande}</li> 
        });
        if(statut === '1'){
          lis[0] = <li key={0} className="postuler encours">En cours</li>
        }
        if(statut === '2'){
          lis[0] = <li key={0} className="postuler fermee">Fermée</li>
        }
        res.push(<span key={idx} className="list-type2"><h4 className="offresh4">Offre #{idx+1}</h4><ul>{lis}</ul></span>)
      }
    } 
    if(demandesIdxByOwner.length)
      this.callPostulants(demandesIdxByOwner);
    return res
    
  }

  render() {
    let {popup} = this.state;
    
    return (
      <div className="container">
        {popup}
        <h1 className="offresH1">Liste des offres</h1>
        <div>{this.offres()}</div>
      </div>
    );
  }
}

export default Offres;
