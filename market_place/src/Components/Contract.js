import Web3 from 'web3';
import marketPlace from '../abi/MarketPlace.json';


class Contract {

    constructor() {
        this.account = '';
        this.contract = '';
        
    }

    async init() {
        const web3 = await new Web3(Web3.givenProvider)
        const accounts = await web3.eth.getAccounts()
        this.account = accounts[0]
        console.log(this.account)
      
        const networkId =  await web3.eth.net.getId()  
        const networkData = await marketPlace.networks[networkId]
        
        if(!this.account){
            window.alert('Set account please');
        }
        else if(!networkData) {
            window.alert('Cannot reach MarketPlace contract, check network id:',networkId)
        }else if(networkData && this.account) {
            this.contract = await new web3.eth.Contract(marketPlace.abi, networkData.address)          
        }

    }


    async payableMethodes (methodeName, val, args) {
        return await args === undefined ? this.contract.methods[methodeName]().send({'from' : this.account, 'value' : val}) 
                : this.contract.methods[methodeName].apply(null, args).send({'from' : this.account, 'value' : val})  
    }

    async sendMethodes (methodeName, args) {
        return await args === undefined ? this.contract.methods[methodeName]().send({'from' : this.account}) 
                : this.contract.methods[methodeName].apply(null, args).send({'from' : this.account})  
    }

    async callMethodes (methodeName, args) {
        return await args === undefined ? this.contract.methods[methodeName]().call({'from' : this.account})
                 : this.contract.methods[methodeName].apply(null, [args]).call({'from' : this.account})
    }
    


}

export default Contract;