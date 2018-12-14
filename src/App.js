import React, { Component } from "react";
import DataHashes from "../build/contracts/DataHashes.json";
import getWeb3 from "./utils/getWeb3";
// import bluebird from 'bluebird';
// bluebird.promisifyAll(getWeb3);
import "./css/oswald.css";
import "./css/open-sans.css";
import "./css/pure-min.css";
import "./App.css";

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      storageValue: 0,
      moreStorage: 0,
      web3: null
    };
  }

  componentWillMount() {
    // Get network provider and web3 instance.
    // See utils/getWeb3 for more info.

    getWeb3
      .then(results => {
        this.setState({
          web3: results.web3
        });

        // Instantiate contract once web3 provided.
        this.getCompanyList();
        this.getAssetsForCompany();
      })
      .catch(() => {
        console.log("Error finding web3.");
      });
  }

  registerNewCompany(companyName) {
    const contract = require("truffle-contract");
    const dataHashes = contract(DataHashes);
    dataHashes.setProvider(this.state.web3.currentProvider);

    // Declaring this for later so we can chain functions on dataHashes.
    var dataHashInstance;

    // Get accounts.
    this.state.web3.eth.getAccounts((error, accounts) => {
      dataHashes.deployed().then(instance => {
        dataHashInstance = instance;
        return dataHashInstance.registerNewCompany(
          accounts[0],
          this.state.web3.fromAscii(companyName),
          { from: accounts[0], gas: 3000000 }
        );
      });
    });
  }

  setDataHashForCompany(dataHash) {
    const contract = require("truffle-contract");
    const dataHashes = contract(DataHashes);
    dataHashes.setProvider(this.state.web3.currentProvider);

    // Declaring this for later so we can chain functions on dataHashes.
    var dataHashInstance;

    // Get accounts.
    this.state.web3.eth.getAccounts((error, accounts) => {
      dataHashes.deployed().then(instance => {
        dataHashInstance = instance;
        return dataHashInstance.registerDataHashToCompany(
          this.state.web3.fromAscii(dataHash),
          { from: accounts[0], gas: 3000000 }
        );
      });
    });
  }

  getOwnerOfDataHash(dataHash) {
    const contract = require("truffle-contract");
    const dataHashes = contract(DataHashes);
    dataHashes.setProvider(this.state.web3.currentProvider);

    // Declaring this for later so we can chain functions on dataHashes.
    var dataHashInstance;

    // Get accounts.
    this.state.web3.eth.getAccounts((error, accounts) => {
      dataHashes.deployed().then(instance => {
        dataHashInstance = instance;
        return dataHashInstance.ownerOf(this.state.web3.fromAscii(dataHash), {
          from: accounts[0],
          gas: 3000000
        }).then((res) => this.state.web3.toAscii(res));
      });
    });
  }

  render() {
    return (
      <div className="App">
        <nav className="navbar pure-menu pure-menu-horizontal">
          <a href="#" className="pure-menu-heading pure-menu-link">
            Truffle Box
          </a>
        </nav>

        <main className="container">
          <div className="pure-g">
            <div className="pure-u-1-1">
              <h1>Good to Go!</h1>
              <p>Your Truffle Box is installed and ready.</p>
              <h2>Smart Contract Example</h2>
              <p>
                If your contracts compiled and migrated successfully, below will
                show a stored value of 5 (by default).
              </p>
              <p>
                Try changing the value stored on <strong>line 59</strong> of
                App.js.
              </p>
              <p>The stored value is: {this.state.storageValue}</p>
              <p>The assets for company hello are: {this.state.moreStorage}</p>
            </div>
          </div>
        </main>
      </div>
    );
  }
}

export default App;
