pragma solidity 0.5.11;
pragma experimental ABIEncoderV2;
import './SafeMath.sol';


contract MarketPlace {

    enum State {Ouverture, Encours, Fermee}
    
    struct User {
        string username;
        uint reputation;
    }
    
    struct Demande {
        address employeur;
        uint remuneration;
        uint delay; // en seconde
        string description; // de la tache à faire
        State etat;
        uint minReputation;
        string employeurName;
    }
   
    uint index = 0;
    address owner; 
    mapping (address => User) users;
    mapping (address => bool) public blacklist;
    
    mapping(uint => Demande) public demandes;//Mapping de type Structure Demande
    mapping(uint => address[]) private postulants;//index Offre
    mapping(uint => address) public attributionOffres;// index offre => address executant
    mapping(address => mapping( uint => string) )  lienLivrable;//index Offre
    

    constructor() public{
        owner = msg.sender;
    }

    modifier isOwner {
        require(msg.sender == owner, "Vous n'etes pas le propiétaire du contrat");
        _;
    }
    modifier isInscrit {
        require(users[msg.sender].reputation >= 1, "Vous n'etes pas inscrit");
        _;
    }
    modifier isBlackListed {
        require(blacklist[msg.sender] == false, "Vous êtes blacklisté");
        _;
    }

    
    function inscription(string memory _username) public isBlackListed {  // Fonction d'inscription avec vérification de blacklist
        users[msg.sender].reputation = 1;  //Add user with username & reputation par defaut à 1
        users[msg.sender].username = _username ;
    }
    
    function updateBlacklist(address _user, bool _state) public isOwner{
        //Activation/Désactivation Blacklist
        blacklist[_user] = _state;
        users[_user].reputation = _state ? 0 : 1;// Si _state true alors reput à 0 
    }
    
    function ajouterDemande(uint  _delay, string memory  _description, uint   _minReputation) payable public isInscrit isBlackListed {// exemple de demande  [0,3600,"blabla",0,5,["0x14723A09ACff6D2A60DcdF7aA4AFf308FDDC160C","0x4B0897b0513fdC7C541B6d9D7E929C4e5364D2dB"]]
        
        demandes[index].remuneration = SafeMath.sub(msg.value, SafeMath.div(SafeMath.mul(msg.value,2), 100)) ;//on retire ces 2% de la remuneration // Du coup les ethers sont directement sur l'addr du contract
        demandes[index].delay = _delay;
        demandes[index].description = _description;
        demandes[index].etat = State.Ouverture;
        demandes[index].minReputation = _minReputation;
        demandes[index].employeur = msg.sender; 
        demandes[index].employeurName = users[msg.sender].username;
        index++;
    }
    //Plusieurs Structutures vers => des tableaux 
    function getAllDemandes() public view returns(address[] memory, string[] memory, uint[] memory, uint[] memory, string[] memory, State[] memory, uint[] memory, uint[] memory) {//Découpage de strucutre pour pouvoir la renvoyer
        address[] memory employeurs = new address[](index);
        uint[] memory remunerations = new uint[](index);
        uint[] memory delays = new uint[](index);
        string[] memory descriptions = new string[](index);
        State[] memory etats = new State[](index);
        uint[] memory minReputations = new uint[](index);
        string[] memory employeurNames = new string[](index);
        uint[] memory nbPostulants = new uint[](index);


        //remplissage
        for(uint i = 0; i < index; i++){// Index => address => à une Demande// Index(7) contient le total des Offfres == Demandes
            Demande memory demande = demandes[i]; // i = 0 demandes[demandesIndex[0]] // demandesIndex[0] = address
            employeurs[i] = demande.employeur;
            remunerations[i] = demande.remuneration;
            delays[i] = demande.delay;
            descriptions[i] = demande.description;
            etats[i] = demande.etat;
            minReputations[i] = demande.minReputation;
            employeurNames[i] = demande.employeurName;
            nbPostulants[i] = postulants[i].length ;
        }
        return (employeurs, employeurNames ,remunerations, delays, descriptions, etats, minReputations, nbPostulants);
    }
    
    function postuler(uint _indexDemande) public isInscrit isBlackListed{//recup l'adresse de l'offre(demande)
        require(users[msg.sender].reputation  >= demandes[_indexDemande].minReputation ,'Reputation insuffisante');
        postulants[_indexDemande].push(msg.sender);
    }
    
    function accepterOffre(uint _indexDemande,  address _addrCandidat) public {
        require(demandes[_indexDemande].employeur == msg.sender, 'Impossible d\'accepter une offre qui ne dispose pas de candidats');
        attributionOffres[_indexDemande] = _addrCandidat;
        demandes[_indexDemande].etat = State.Encours;
    }
    
    function livraison(uint _indexDemande,  string memory _lienLivrable) payable public  {
        require(attributionOffres[_indexDemande] == msg.sender, "Cette offre ne vous a pas été attribuée");
        lienLivrable[demandes[_indexDemande].employeur][_indexDemande] = _lienLivrable;
        users[msg.sender].reputation += 1;
        demandes[_indexDemande].etat = State.Fermee;
        msg.sender.transfer(demandes[_indexDemande].remuneration);//transfer au msg.sender(executant) sa remuneration qui est sotckée sur ce contrat
    }
    
    function getPostulantsByDemandesIndex(uint _indexDemande) public view returns(address[] memory, string[] memory, uint[] memory){
        address[] memory addrs = new address[](postulants[_indexDemande].length);
        uint[] memory reputations = new uint[](postulants[_indexDemande].length);
        string[] memory usernames = new string[](postulants[_indexDemande].length);
        
        for(uint i = 0; i < postulants[_indexDemande].length; i++){
            addrs[i] = postulants[_indexDemande][i];
            usernames[i] = users[postulants[_indexDemande][i]].username;
            reputations[i] = users[postulants[_indexDemande][i]].reputation;
        }
        return(addrs, usernames, reputations);
    }
    
    function getLienLivrables(uint _indexDemande) public view returns(string memory ){
        
        return lienLivrable[msg.sender][_indexDemande];
    }
    
    function getContractBalance() public view returns (uint256) {
        return address(this).balance;
    }
    
}