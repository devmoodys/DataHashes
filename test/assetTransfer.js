var dataHashes = artifacts.require("../contracts/DataHashes.sol");

contract("DataHashes", function(accounts) {
  it("...should store the value 89.", function() {
    return dataHashes
      .deployed()
      .then(function(instance) {
        dataHashesInstance = instance;

        return dataHashesInstance.set(89, { from: accounts[0] });
      })
      .then(function() {
        return dataHashesInstance.get.call();
      })
      .then(function(storedData) {
        assert.equal(storedData, 89, "The value 89 was not stored.");
      });
  });
});
