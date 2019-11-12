pragma solidity 0.5.11;
pragma  experimental ABIEncoderV2;

contract MarketPlace {

    mapping (address => uint256) public reputations; // Adresse = utilisateur et uint256 = chiffre de la réputation
    mapping (address => string) public usernames; // Adresse = utilisateur et string = nom
    mapping (address => bool) public blacklist;
    address owner;
    
    enum State {Ouverture, Encours, Fermee}
    struct Demande {
        uint256 remuneration;
        uint256 delay; // en seconde
        string description; // de la tache à faire
        State etat;
        uint256 minReputation;
        address [] candidats;//liste des candidats
    }
    mapping(address => Demande) public demandes;//Mapping de type Structure Demande
    

    constructor() public{
        owner = msg.sender;
    }
    // Réputation minimale de 1
    modifier minReputation{
        require(reputations[msg.sender] >= 1);
        _;
    }
    // Fonction d'inscription avec vérification de blacklist
    function inscription(string memory _username) public {
        require(blacklist[msg.sender] == false, "Adresse bannie.");
        reputations[msg.sender] = 1; //reputation à 1; 
        usernames[msg.sender] = _username ;
    }
    // Fonction pour Owner de blacklistage
    function updateBlacklist(address _user, bool _state) public {
        require(msg.sender == owner, "Fonction accessible uniquement à l'owner.");
        blacklist[_user] = _state;
        if (_state == true){
            reputations[_user] = 0;
        } else {
            reputations[_user] = 1;
        }
    }
    
    function ajouterDemande(Demande memory _demande) payable public {// exemple de demande [0,3600,"blabla",0,5,[]]
        require(reputations[msg.sender] != 0,"Le demandeur ne s'est pas inscrit"); //renvoie 0 si le user n'est pas inscrit dans le mapping
        require(blacklist[msg.sender] == false, "Adresse bannie.");
        
        demandes[msg.sender] = _demande;
        uint deuxPourcent = msg.value * 2 / 100;//calcul les 2% de la remuneration
        demandes[msg.sender].remuneration = msg.value - deuxPourcent;//on retire ces 2% de la remuneration // Du coup les ethers sont directement sur le addr du contract, faudra les redonner par la suite
      
    }
    
    function getContractBalance() public view returns (uint256) {
        return address(this).balance;
    }
    
}
