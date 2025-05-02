// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

contract EVault_Main {
    address public contractOwner;
    string public contractName;

    // forStoringNumberOfCasesFiled&Indexing
    uint256 public caseIdCounter = 1;
    // forKeepingACountOfTheNumberOfJudges
    uint256 public judgesCount = 0;
    uint256 public lawyerCount = 0;
    // index -> UID
    mapping(uint256 => uint256) internal judgeIndexUIDMapping;
    mapping(uint256 => uint256) internal LawyerIndexUIDMapping;

    struct LegalCase {
        uint256 UIDOfParty1;
        uint256 UIDOfParty2;
        uint256 filedOnDate;
        uint256[] associatedLawyers;
        uint256 associatedJudge;
        uint256 caseId;
        string caseSubject;
        string[] caseProgress;
        address[] caseProgressIssuer;
        string[] caseDocumentHash;
        address[] caseDocumentUploader;
    }

    struct Client {
        string name;
        string dateOfBirth;
        string nationality;
        string sex;
        string contactNumber;
        uint256 UID;
      
        uint256[] associatedCaseIds;
        address walletAddress;
    }

    struct Lawyer {
        string name;
        string dateOfBirth;
        string nationality;
        string sex;
        string contactNumber;
        uint256 UID;
   
        uint256[] associatedCaseIds;
        address walletAddress;
    }

    struct Judge {
        string name;
        string dateOfBirth;
        string nationality;
        string sex;
        string contactNumber;
        uint256 UID;
     
        uint256[] associatedCaseIds;
        address walletAddress;
    }

    // Array to keep track of all client UIDs
    uint256[] public allClientUIDs;
    // Counter for total number of clients
    uint256 public clientCount = 0;

    // storeAllTheClients
    mapping(uint256 => Client) public clients;

    // storeAlltheLegalCasesFiledInTheCourt
    mapping(uint256 => LegalCase) public legalCases;

    // Create a mapping to store lawyers
    mapping(uint256 => Lawyer) public lawyers;

    // Create a mapping to store judges
    mapping(uint256 => Judge) public judges;

    event ClientRegistered(uint256 UID);
    event CaseRegistered(uint256 caseId);
    event LawyerRegistered(uint256 UID);
    event JudgeRegistered(uint256 UID);

    constructor() {
        contractName = "EVault_Main";
        contractOwner = msg.sender;
    }

    modifier onlyOwner() {
        require(
            msg.sender == contractOwner,
            "Only the owner can call this function"
        );
        _;
    }

    // functionToRegisterANewClient
    function registerClient(
        string memory _name,
        string memory _dateOfBirth,
        string memory _nationality,
        string memory _sex,
        string memory _contactNumber,
        uint256 _UID,
      
        address _walletAddress
    ) external {
        require(bytes(_name).length > 0, "Name cannot be empty");
        require(
            bytes(_dateOfBirth).length > 0,
            "Date of Birth cannot be empty"
        );
        require(bytes(_nationality).length > 0, "Nationality cannot be empty");
        require(bytes(_sex).length > 0, "Sex cannot be empty");
        require(
            bytes(_contactNumber).length > 0,
            "Contact Number cannot be empty"
        );
        require(_UID > 0 && _UID <= 999999999999, "Invalid UID");

        uint256[] memory caseIds = new uint256[](0);

        clients[_UID] = Client({
            name: _name,
            dateOfBirth: _dateOfBirth,
           
            nationality: _nationality,
            sex: _sex,
            contactNumber: _contactNumber,
            UID: _UID,
         
            associatedCaseIds: caseIds,
            walletAddress: _walletAddress
        });

        // Add client UID to array and increment counter
        allClientUIDs.push(_UID);
        clientCount++;

        emit ClientRegistered(_UID);
    }

    // Function to get all registered clients
    function getAllClients() external view returns (uint256[] memory) {
        return allClientUIDs;
    }

    // functionToRegisterANewJudge
    function registerJudge(
        string memory _name,
        string memory _dateOfBirth,
       
        string memory _nationality,
        string memory _sex,
        string memory _contactNumber,
        uint256 _UID,
       
        address _walletAddress
    ) external onlyOwner {
        require(bytes(_name).length > 0, "Name cannot be empty");
        require(
            bytes(_dateOfBirth).length > 0,
            "Date of Birth cannot be empty"
        );
      
        require(bytes(_nationality).length > 0, "Nationality cannot be empty");
        require(bytes(_sex).length > 0, "Sex cannot be empty");
        require(
            bytes(_contactNumber).length > 0,
            "Contact Number cannot be empty"
        );
        require(_UID > 0 && _UID <= 999999999999, "Invalid UID");

        uint256[] memory caseIds = new uint256[](0); // Initialize the associatedCaseIds array

        judges[_UID] = Judge({
            name: _name,
            dateOfBirth: _dateOfBirth,
       
            nationality: _nationality,
            sex: _sex,
            contactNumber: _contactNumber,
            UID: _UID,
       
            associatedCaseIds: caseIds,
            walletAddress: _walletAddress
        });

        judgeIndexUIDMapping[judgesCount] = _UID;
        judgesCount++;

        emit JudgeRegistered(_UID);
    }

    // Function to register a new lawyer
    function registerLawyer(
        string memory _name,
        string memory _dateOfBirth,

        string memory _nationality,
        string memory _sex,
        string memory _contactNumber,
        uint256 _UID,
        
        address _walletAddress
    ) external {
        require(bytes(_name).length > 0, "Name cannot be empty");
        require(
            bytes(_dateOfBirth).length > 0,
            "Date of Birth cannot be empty"
        );
       
        require(bytes(_nationality).length > 0, "Nationality cannot be empty");
        require(bytes(_sex).length > 0, "Sex cannot be empty");
        require(
            bytes(_contactNumber).length > 0,
            "Contact Number cannot be empty"
        );
        require(_UID > 0 && _UID <= 999999999999, "Invalid UID");

        uint256[] memory caseIds = new uint256[](0); // Initialize the associatedCaseIds array

        lawyers[_UID] = Lawyer({
            name: _name,
            walletAddress: _walletAddress,
            dateOfBirth: _dateOfBirth,
           
            nationality: _nationality,
            sex: _sex,
            contactNumber: _contactNumber,
            UID: _UID,
          
            associatedCaseIds: caseIds
        });
        LawyerIndexUIDMapping[lawyerCount] = _UID;
        lawyerCount++;

        emit LawyerRegistered(_UID);
    }

    // Function to get lawyer details by UID
    function getLawyerDetailsByUID(
        uint256 _UID
    )
        external
        view
        returns (
            string memory name,
            string memory dateOfBirth,
 
            string memory nationality,
            string memory sex,
            string memory contactNumber,
            uint256 UID,
         
            uint256[] memory associatedCaseIds,
            address walletAddress
        )
    {
        Lawyer memory lawyer = lawyers[_UID];
        require(
            bytes(lawyer.name).length > 0,
            "Lawyer with this UID does not exist"
        );

        return (
            lawyer.name,
            lawyer.dateOfBirth,
          
            lawyer.nationality,
            lawyer.sex,
            lawyer.contactNumber,
            lawyer.UID,
      
            lawyer.associatedCaseIds,
            lawyer.walletAddress
        );
    }

    // Function to get Judge details by UID
    function getJudgeDetailsByUID(
        uint256 _UID
    )
        external
        view
        returns (
            string memory name,
            string memory dateOfBirth,
          
            string memory nationality,
            string memory sex,
            string memory contactNumber,
            uint256 UID,
        
            uint256[] memory associatedCaseIds,
            address walletAddress
        )
    {
        Judge memory judge = judges[_UID];
        require(
            bytes(judge.name).length > 0,
            "Judge with this UID does not exist"
        );

        return (
            judge.name,
            judge.dateOfBirth,
          
            judge.nationality,
            judge.sex,
            judge.contactNumber,
            judge.UID,
           
            judge.associatedCaseIds,
            judge.walletAddress
        );
    }

    // functionToViewClientInformation
    function getClientDetailsByUID(
        uint256 _UID
    )
        external
        view
        returns (
            string memory name,
            string memory dateOfBirth,
        
            string memory nationality,
            string memory sex,
            string memory contactNumber,
            uint256 UID,
            
            uint256[] memory associatedCaseIds,
            address walletAddress
        )
    {
        Client memory client = clients[_UID];
        require(
            bytes(client.name).length > 0,
            "Client with this UID does not exist"
        );

        return (
            client.name,
            client.dateOfBirth,
        
            client.nationality,
            client.sex,
            client.contactNumber,
            client.UID,
        
            client.associatedCaseIds,
            client.walletAddress
        );
    }
   function getRandomLawyerUID(uint256 _excludedLawyerUID) internal view returns (uint256) {
    // Get the count of lawyers
    uint256 _lawyerCount = getLawyerCount();

    // Ensure there are enough lawyers to select from
    require(_lawyerCount > 1, "Not enough lawyers to select from");

    // Create an array to store potential lawyer UIDs
    uint256[] memory potentialLawyers = new uint256[](_lawyerCount - 1);
    uint256 index = 0;

    // Collect lawyer UIDs excluding the specified lawyer
    for (uint256 i = 0; i < _lawyerCount; i++) {
        uint256 lawyerUID = getLawyerUIDAtIndex(i);
        if (lawyerUID != _excludedLawyerUID) {
            potentialLawyers[index] = lawyerUID;
            index++;
        }
    }

    // Generate a random index within the range of potential lawyers
    uint256 randomIndex = uint256(
        keccak256(abi.encodePacked(block.timestamp, _excludedLawyerUID))
    ) % potentialLawyers.length;

    // Retrieve the lawyer's UID using the generated index
    return potentialLawyers[randomIndex];
}

// Existing helper functions remain the same
function getLawyerCount() public view returns (uint256) {
    return lawyerCount;
}

function getLawyerUIDAtIndex(
    uint256 _index
) public view returns (uint256) {
    return LawyerIndexUIDMapping[_index];
}

    // function to add a legal case for two clients
    function registerLegalCase(
        uint256 _UIDOfParty1,
        uint256 _UIDOfParty2,
        string memory _caseSubject,
        uint256[] memory _associatedLawyers
    ) external {
        Client storage client1 = clients[_UIDOfParty1];
        Client storage client2 = clients[_UIDOfParty2];

        require(
            bytes(client1.name).length > 0 && bytes(client2.name).length > 0,
            "Both clients must exist"
        );

        // Validate that all provided lawyers exist
        for (uint256 i = 0; i < _associatedLawyers.length; i++) {
            require(
                bytes(lawyers[_associatedLawyers[i]].name).length > 0,
                "One or more lawyers do not exist"
            );
        }
        bool isExactlyTwoLawyers = _associatedLawyers.length == 2;

        // Increment the caseIdCounter and use it as the caseId
        uint256 _caseId = caseIdCounter;

        // Get a random judge UID
        uint256 selectedJudgeUID = getRandomJudgeUID();
        require(
            bytes(judges[selectedJudgeUID].name).length > 0,
            "Selected judge does not exist"
        );

        // Get a random lawyer for Party 2 (defendant)
        uint256 selectedLawyerForParty2 = getRandomLawyerUID(_associatedLawyers[0]);

        // Combine the provided lawyers with the randomly selected lawyer for Party 2
        uint256[] memory allAssociatedLawyers = new uint256[](_associatedLawyers.length + 1);
        for (uint256 i = 0; i < _associatedLawyers.length; i++) {
            allAssociatedLawyers[i] = _associatedLawyers[i];
        }
        allAssociatedLawyers[_associatedLawyers.length] = selectedLawyerForParty2;

        legalCases[_caseId] = LegalCase({
            UIDOfParty1: _UIDOfParty1,
            UIDOfParty2: _UIDOfParty2,
            filedOnDate: block.timestamp,
            associatedLawyers: allAssociatedLawyers,
            associatedJudge: selectedJudgeUID,
            caseId: _caseId,
            caseSubject: _caseSubject,
            caseProgress: new string[](0),
            caseProgressIssuer: new address[](0),
            caseDocumentHash: new string[](0),
            caseDocumentUploader: new address[](0)
        });

        // Adding initial status to the case progress list
        legalCases[_caseId].caseProgress.push("Case registered with E-Vault.");
        legalCases[_caseId].caseProgressIssuer.push(address(this));

        // Add the legal case to the clients' associatedCaseIds
        client1.associatedCaseIds.push(_caseId);
        client2.associatedCaseIds.push(_caseId);

        // Update the associatedCaseIds of the judge
        Judge storage judge = judges[selectedJudgeUID];
        judge.associatedCaseIds.push(_caseId);

        // Update associatedCaseIds of lawyers
        for (uint256 i = 0; i < allAssociatedLawyers.length; i++) {
            Lawyer storage lawyer = lawyers[allAssociatedLawyers[i]];
            lawyer.associatedCaseIds.push(_caseId);
        }

        // Increment the case counter AFTER successful registration
        caseIdCounter++;

        emit CaseRegistered(_caseId);
    }


    // Function to update the case progress by caseId
    function updateCaseProgressWithCaseId(
        uint256 _caseId,
        string memory _progress
    ) external returns (bool) {
        LegalCase storage legalCase = legalCases[_caseId];
        require(
            bytes(legalCase.caseSubject).length > 0,
            "Legal case with this caseId does not exist"
        );

        // Append the new status to the caseProgress array
        legalCase.caseProgress.push(_progress);
        legalCase.caseProgressIssuer.push(msg.sender);

        return true;
    }

    // Function to update case documents with caseId
    function updateCaseDocumentsWithCaseId(
        uint256 _caseId,
        string memory _ipfsHash
    ) external returns (bool) {
        LegalCase storage legalCase = legalCases[_caseId];
        require(
            bytes(legalCase.caseSubject).length > 0,
            "Legal case with this caseId does not exist"
        );

        // Append the IPFS hash and uploader address to the respective arrays
        legalCase.caseDocumentHash.push(_ipfsHash);
        legalCase.caseDocumentUploader.push(msg.sender);

        return true;
    }

    // function to get the filed legal cases for a client
    function getFiledLegalCasesForAClient(
        uint256 _UID
    ) external view returns (LegalCase[] memory) {
        Client memory client = clients[_UID];
        require(
            bytes(client.name).length > 0,
            "Client with this UID does not exist"
        );

        uint256[] memory caseIds = client.associatedCaseIds;
        // makingAnArrayOfStructObjects
        LegalCase[] memory filedCases = new LegalCase[](caseIds.length);

        for (uint256 i = 0; i < caseIds.length; i++) {
            filedCases[i] = legalCases[caseIds[i]];
        }

        return filedCases;
    }

    // function to get the filed legal cases for a lawyer
    function getFiledLegalCasesForALawyer(
        uint256 _UID
    ) external view returns (LegalCase[] memory) {
        Lawyer memory lawyer = lawyers[_UID];
        require(
            bytes(lawyer.name).length > 0,
            "Lawyer with this UID does not exist"
        );

        uint256[] memory caseIds = lawyer.associatedCaseIds;
        // makingAnArrayOfStructObjects
        LegalCase[] memory filedCases = new LegalCase[](caseIds.length);

        for (uint256 i = 0; i < caseIds.length; i++) {
            filedCases[i] = legalCases[caseIds[i]];
        }

        return filedCases;
    }

    // function to get the filed legal cases for a lawyer
    function getFiledLegalCasesForAJudge(
        uint256 _UID
    ) external view returns (LegalCase[] memory) {
        Judge memory judge = judges[_UID];
        require(
            bytes(judge.name).length > 0,
            "Lawyer with this UID does not exist"
        );

        uint256[] memory caseIds = judge.associatedCaseIds;
        // makingAnArrayOfStructObjects
        LegalCase[] memory filedCases = new LegalCase[](caseIds.length);

        for (uint256 i = 0; i < caseIds.length; i++) {
            filedCases[i] = legalCases[caseIds[i]];
        }

        return filedCases;
    }

    // function to update associated lawyers for a case
    function updateAssociatedLawyers(
        uint256 _caseId,
        uint256[] memory _lawyerUIDs
    ) external {
        // Verify case exists
        LegalCase storage legalCase = legalCases[_caseId];
        require(
            bytes(legalCase.caseSubject).length > 0,
            "Legal case with this caseId does not exist"
        );

        // Verify all lawyers exist
        for (uint256 i = 0; i < _lawyerUIDs.length; i++) {
            require(
                bytes(lawyers[_lawyerUIDs[i]].name).length > 0,
                "One or more lawyers do not exist"
            );
        }

        // Remove case from old lawyers' associatedCaseIds
        for (uint256 i = 0; i < legalCase.associatedLawyers.length; i++) {
            Lawyer storage oldLawyer = lawyers[legalCase.associatedLawyers[i]];
            uint256[] storage oldLawyerCases = oldLawyer.associatedCaseIds;
            
            // Find and remove the case ID
            for (uint256 j = 0; j < oldLawyerCases.length; j++) {
                if (oldLawyerCases[j] == _caseId) {
                    // Move the last element to this position and pop
                    oldLawyerCases[j] = oldLawyerCases[oldLawyerCases.length - 1];
                    oldLawyerCases.pop();
                    break;
                }
            }
        }

        // Add case to new lawyers' associatedCaseIds
        for (uint256 i = 0; i < _lawyerUIDs.length; i++) {
            Lawyer storage newLawyer = lawyers[_lawyerUIDs[i]];
            newLawyer.associatedCaseIds.push(_caseId);
        }

        // Update case's associated lawyers
        legalCase.associatedLawyers = _lawyerUIDs;
    }

    // function to view details of a legal case by caseId
    function getCaseDetailsByCaseId(
        uint256 _caseId
    )
        external
        view
        returns (
            uint256 UIDOfParty1,
            uint256 UIDOfParty2,
            uint256 filedOnDate,
            uint256[] memory associatedLawyers,
            uint256 associatedJudge,
            uint256 caseId,
            string memory caseSubject,
            string[] memory caseProgress,
            address[] memory caseProgressIssuer,
            string[] memory caseDocumentHash,
            address[] memory caseDocumentUploader
        )
    {
        LegalCase memory registeredLegalCase = legalCases[_caseId];
        require(
            bytes(registeredLegalCase.caseSubject).length > 0,
            "Legal case with this caseId does not exist"
        );

        return (
            registeredLegalCase.UIDOfParty1,
            registeredLegalCase.UIDOfParty2,
            registeredLegalCase.filedOnDate,
            registeredLegalCase.associatedLawyers,
            registeredLegalCase.associatedJudge,
            registeredLegalCase.caseId,
            registeredLegalCase.caseSubject,
            registeredLegalCase.caseProgress,
            registeredLegalCase.caseProgressIssuer,
            registeredLegalCase.caseDocumentHash,
            registeredLegalCase.caseDocumentUploader
        );
    }

    // Function to get a random judge UID
    function getRandomJudgeUID() internal view returns (uint256) {
        // Get the count of judges
        uint256 _judgesCount = getJudgesCount();

        // Generate a random index within the range of judges
        uint256 randomIndex = uint256(
            keccak256(abi.encodePacked(block.timestamp))
        ) % _judgesCount;

        // Retrieve the judge's UID using the generated index
        return getJudgeUIDAtIndex(randomIndex);
    }

    // Function to get the count of judges
    function getJudgesCount() public view returns (uint256) {
        return judgesCount;
    }

    // Function to retrieve judge's UID at a specific index
    function getJudgeUIDAtIndex(
        uint256 _index
    ) public view returns (uint256) {
        return judgeIndexUIDMapping[_index];
    }

    // LoginFunctionalities

    // login : client
    function loginAsAClient(uint256 _UID) external view returns (bool) {
        // Check if the client with the given UID exists in the clients mapping
        return bytes(clients[_UID].name).length > 0;
    }

    // login : lawyer
    function loginAsALawyer(uint256 _UID) external view returns (bool) {
        // Check if the lawyer with the given UID exists in the lawyers mapping
        return bytes(lawyers[_UID].name).length > 0;
    }

    // login : judge
    function loginAsAJudge(uint256 _UID) external view returns (bool) {
        // Check if the lawyer with the given UID exists in the lawyers mapping
        return bytes(judges[_UID].name).length > 0;
    }
}
