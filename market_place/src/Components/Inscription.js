import React, { Component } from 'react';
import '../css/Inscription.css';



class Inscription extends Component{
    constructor(props) {
        super(props);
        this.state = {username: '', contract : ''};   
    }


    async componentDidUpdate() {
        const {contract}  = this.props;
        if(!this.state.contract){
            this.setState({ contract :  contract })
        }
    }

    form = () => {
       return ( 
        <div className="subscribe-box"> 
            <h2>Inscription à notre MarketPlace</h2>
            <form onSubmit={this.save} className="subscribe">
            <input type="text" placeholder="Veuillez entrer votre nom d'utilisateur" onChange={this.changeUsername} minLength="3" autoComplete="off" required="required"/>
            <button type="submit"> <span>S'inscrire</span></button>
            </form>
        </div>
       );
    }

    changeUsername = event => {
        this.setState({username : event.target.value});
    }

    save = event => {
        if(event === undefined)
            return 1;
        event.preventDefault();
       // console.log(this.state)
        this.state.contract.sendMethodes('inscription', [this.state.username])
    }


    render(){
        return this.form();
    }
}

export default Inscription;