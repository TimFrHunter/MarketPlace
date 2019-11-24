import React, { Component } from 'react';
import Calendar from 'react-calendar';
import '../css/Demande.css';
import Converter from '../utils/converter';

class Demande extends Component {

    constructor(props) {
        super(props);
        this.state = {contract : '', description : '', delay : '', reputation : '', remuneration : '', date : new Date()}; 
    }

    componentDidUpdate(prevProps) {
        if (this.props !== prevProps) {
            this.setState({ contract :  this.props.contract })
        }
    }

  


    demande() {
        return (
            
            <div className="demande subscribe-box" > 
            <div className="calendarContainer">
                <Calendar onChange={this.changeDelay} value={this.state.date} />
            </div>
            <h2>Déposer l'offre à pourvoir</h2>
            <form onSubmit={this.save} className="subscribe">

                <input type="text" placeholder="Description de l'offre" onChange={this.changeDescription} minLength="3" autoComplete="off" required="required"/>
                <input  className="calendarToggle"  onClick={this.calendarToggle} type="text" placeholder="Date de fin" minLength="3" autoComplete="off" required="required"/>
                <input type="text" placeholder="Reputation minimum du candidat" onChange={this.changeReputation}  autoComplete="off" required="required"/>
                <input type="text" placeholder="Rémunération en ETHER" onChange={this.changeRemuneration}  autoComplete="off" required="required"/>
                
                <button type="submit"> <span>Déposer</span></button>
            </form>
        </div>
        )
    }

    calendarToggle = e => {
        const calendar = document.getElementsByClassName('calendarContainer')[0];
        if('block' === calendar.style.display){
            calendar.setAttribute("style", "display:none !important");
        }else{
            calendar.setAttribute("style", "display:block !important");
        }

    }
    changeDescription =  e => {
        this.setState({description :  e.target.value});
    }
    changeDelay = e => {
        const delay = new Date(e)
        const calendarToggle = document.getElementsByClassName('calendarToggle')[0];
        calendarToggle.setAttribute("value", delay.getDate()+'/'+delay.getMonth()+'/'+delay.getFullYear() );
        this.calendarToggle()
        this.setState({ delay : delay.getTime() }); // timestamp
    }
    changeReputation = e => {
        this.setState({ reputation : e.target.value});
    }
    changeRemuneration = e => {
        this.setState({ remuneration : e.target.value});
    }
    save = e => {
        if(event === undefined)
            return 1;
        event.preventDefault();
        this.state.contract.payableMethodes('ajouterDemande', parseInt(this.state.remuneration **18 ,10), [
            this.state.delay, 
            Converter.ascii_to_hexa(this.state.description),
            this.state.reputation
        ])
    }


    render() {
        return (
        <div>
            {this.demande()}
        </div> 
        )
    }
}

export default Demande