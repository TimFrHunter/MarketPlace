import React, { Component } from 'react';

class Livrable extends Component {

    constructor(props) {
      super(props)
      this.state = { contract: '', numero : '', lien : '', numeroRecuperer : '' }
    }

    componentDidUpdate(prevProps){
        if(this.props !== prevProps){
            this.setState({ contract : this.props.contract})
        }
    }

    form(){
        return (
            <div>
                <div className="subscribe-box"> 
                    <h2>Envoyer votre livrable</h2>
                    <form onSubmit={this.save} className="subscribe">
                        <input type="text" placeholder="Numéro de l'offre à livrer" onChange={this.changeNumero} autoComplete="off" required="required"/>
                        <input type="text" placeholder="Lien du livrable" onChange={this.changeLien} autoComplete="off" required="required"/>
                        <button type="submit"><span>Livrer</span></button>
                    </form>
                </div>    
                <div className="subscribe-box">
                    <h2>Récuperer votre livrable</h2>
                    <form onSubmit={this.saveRecuperer} className="subscribe">
                        <input type="text" placeholder="Numéro de l'offre à récuperer" onChange={this.changeNumeroRecuperer} autoComplete="off" required="required"/>
                        <button type="submit"><span>Récuperer</span></button>
                    </form>
                </div>
            </div>
        )
    }

    changeNumero = e =>{
        this.setState({numero : parseInt(e.target.value, 10) -1});
    }

    changeLien = e =>{
        this.setState({lien : e.target.value});
    }

    save = e => {
        if(e === undefined)
            return 1;
        e.preventDefault();
        this.state.contract.payableMethodes('livraison', 0 ,[this.state.numero, this.state.lien])
    }

    changeNumeroRecuperer = e => {
        this.setState({numeroRecuperer : parseInt(e.target.value, 10) -1});
    }

    saveRecuperer = async (e) => {
        if(e === undefined)
            return 1;
        e.preventDefault();
        
        let lienLivrable = await this.state.contract.callMethodes('getLienLivrables', [this.state.numeroRecuperer])
        alert(lienLivrable)
    }
    

    render(){
       
        return (
            this.form()
        );
    }
}
export default Livrable;