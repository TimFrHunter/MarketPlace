pragma solidity 0.5.11;
pragma experimental ABIEncoderV2;
import './SafeMath.sol';


contract MarketPlace {

    enum State {Ouverture, Encours, Fermee}

    struct User {
        string username;
        uint256 reputation;
    }
    
    struct Demande {
        uint remuneration;
        uint256 delay; // en seconde
        string description; // de la tache à faire
        State etat;
        uint256 minReputation;
        address[] candidats;//liste des candidats
    }
   
    address owner; 
    mapping (address => User) public users;
    mapping (address => bool) public blacklist;
    
    mapping(address => Demande) public demandes;//Mapping de type Structure Demande
    mapping(uint256 => address) private demandesIndex;// utiliser pour renvoyer le tableau entier
    uint256 index = 0;
    

    constructor() public{
        owner = msg.sender;
    }
   
    modifier minReputation{ // Réputation minimale de 1
        require(users[msg.sender].reputation >= 1);
        _;
    }
    
    function inscription(string memory _username) public {  // Fonction d'inscription avec vérification de blacklist
        //Check
        require(blacklist[msg.sender] == false, "Adresse bannie.");
        
        //Add user with username & reputation par defaut à 1
        users[msg.sender].reputation = 1; 
        users[msg.sender].username = _username ;
    }
    
    // Fonction pour Owner de blacklistage
    function updateBlacklist(address _user, bool _state) public {
        //Check
        require(msg.sender == owner, "Fonction accessible uniquement à l'owner.");
      
        //Activation/Désactivation Blacklist
        blacklist[_user] = _state;
        users[_user].reputation = _state ? 0 : 1;// Si _state true alors reput à 0 
      
    }
    
    function ajouterDemande(Demande memory _demande) payable public {// exemple de demande  [0,3600,"blabla",0,5,["0x14723A09ACff6D2A60DcdF7aA4AFf308FDDC160C","0x4B0897b0513fdC7C541B6d9D7E929C4e5364D2dB"]]
       
        require(users[msg.sender].reputation != 0,"Le demandeur ne s'est pas inscrit"); //renvoie 0 si le user n'est pas inscrit dans le mapping
        require(blacklist[msg.sender] == false, "Adresse bannie.");
        
        //2% remuneration
        _demande.remuneration = SafeMath.sub(msg.value, SafeMath.div(SafeMath.mul(msg.value,2), 100)) ;//on retire ces 2% de la remuneration // Du coup les ethers sont directement sur l'addr du contract
        
         //save demande
        demandes[msg.sender] = _demande;
        demandesIndex[index] = msg.sender;
        
        index++;
    }
    
    function getAllDemandes() public view returns(uint256[] memory, uint256[] memory, string[] memory, State[] memory, uint256[] memory, address[][] memory ) {//Découpage de strucutre pour pouvoir la renvoyer
        uint256[] memory remunerations = new uint256[](index);
        uint256[] memory delays = new uint256[](index);
        string[] memory descriptions = new string[](index);
        State[] memory etats = new State[](index);
        uint256[] memory minReputations = new uint256[](index);
        address[][] memory candidats = new address[][](index);
        
        for(uint256 i = 0; i < index; i++){
            Demande memory demande = demandes[demandesIndex[i]];
            remunerations[i] = demande.remuneration;
            delays[i] = demande.delay;
            descriptions[i] = demande.description;
            etats[i] = demande.etat;
            minReputations[i] = demande.minReputation;
            candidats[i] = demande.candidats;
        }
        return (remunerations, delays, descriptions, etats, minReputations, candidats);
        
    }
    
    function getContractBalance() public view returns (uint256) {
        return address(this).balance;
    }
    
}
