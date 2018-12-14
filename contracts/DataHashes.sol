pragma solidity ^0.4.18;

contract DataHashes {

  struct Company {
    uint id;
    address owner;
    bytes32 name;
  }

  address admin;

  uint public numCompanies;
  
  mapping (bytes32 => Company) public hashRegistry;
  mapping (address => Company) public companies;

  event NewCompanyRegistered(address _owner, uint _companyID);
  event NewDataHashRegisteredToCompany(address _owner, bytes32 _dataHash);

  function DataHashes() public {
    admin = msg.sender;
  }

  modifier adminOnly() {
    require(msg.sender == admin);
    _;
  }

  function registerNewCompany(address _owner, bytes32 _name) public adminOnly returns (uint companyID) {
    companyID = numCompanies++;
    companies[_owner].id = companyID;
    companies[_owner].owner = _owner;
    companies[_owner].name = _name;
    NewCompanyRegistered(_owner, companyID);
  }

  function registerDataHashToCompany(bytes32 _dataHash) public {
    hashRegistry[_dataHash] = companies[msg.sender];
    NewDataHashRegisteredToCompany(msg.sender, _dataHash);
  }

  function ownerOf(bytes32 dataHash) public constant returns (bytes32 companyName) {
    companyName = hashRegistry[dataHash].name;
    return companyName;
  }
}
