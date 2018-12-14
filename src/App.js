import React, { Component } from "react";
import DataHashes from "../build/contracts/DataHashes.json";
import getWeb3 from "./utils/getWeb3";
// import bluebird from 'bluebird';
// bluebird.promisifyAll(getWeb3);
import "./css/oswald.css";
import "./css/open-sans.css";
import "./css/pure-min.css";
import "./App.css";

import CSVReader from "react-csv-reader";
import hashData from "./hasher";

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      storageValue: 0,
      moreStorage: 0,
      web3: null,
      dataSetter: [],
      dataOwner: [],
      csvError: false,
      newName: "",
      newAddress: "",
      newHashForCompany: "",
      ownerHashOfCo: "",
      ownerName: ""
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
      })
      .catch(() => {
        console.log("Error finding web3.");
      });
  }

  registerNewCompany = () => {
    const companyName = this.state.newName;
    const companyAddress = this.state.newAddress;
    const contract = require("truffle-contract");
    const dataHashes = contract(DataHashes);
    dataHashes.setProvider(this.state.web3.currentProvider);

    // Declaring this for later so we can chain functions on dataHashes.
    var dataHashInstance;

    // Get accounts.
    this.state.web3.eth.getAccounts((error, accounts) => {
      dataHashes.deployed().then(instance => {
        dataHashInstance = instance;
        return dataHashInstance
          .registerNewCompany(
            companyAddress,
            this.state.web3.fromAscii(companyName),
            { from: accounts[0], gas: 3000000 }
          )
          .then(() => {
            this.setState({ newName: "", newAddress: "" });
          })
          .catch(err => console.error(err));
      });
    });
  };

  setDataHashForCompany = () => {
    const dataHash = this.state.newHashForCompany;
    const contract = require("truffle-contract");
    const dataHashes = contract(DataHashes);
    dataHashes.setProvider(this.state.web3.currentProvider);

    // Declaring this for later so we can chain functions on dataHashes.
    var dataHashInstance;

    // Get accounts.
    this.state.web3.eth.getAccounts((error, accounts) => {
      dataHashes.deployed().then(instance => {
        dataHashInstance = instance;
        return dataHashInstance
          .registerDataHashToCompany(this.state.web3.fromAscii(dataHash), {
            from: accounts[0],
            gas: 3000000
          })
          .then(() => {
            this.setState({ newHashForCompany: "", dataSetter: [] });
          })
          .catch(err => console.error(err));
      });
    });
  };

  getOwnerOfDataHash = () => {
    const dataHash = this.state.ownerHashOfCo;
    const contract = require("truffle-contract");
    const dataHashes = contract(DataHashes);
    dataHashes.setProvider(this.state.web3.currentProvider);

    // Declaring this for later so we can chain functions on dataHashes.
    var dataHashInstance;

    // Get accounts.
    this.state.web3.eth.getAccounts((error, accounts) => {
      dataHashes.deployed().then(instance => {
        dataHashInstance = instance;
        return dataHashInstance
          .ownerOf(this.state.web3.fromAscii(dataHash), {
            from: accounts[0],
            gas: 3000000
          })
          .then(res => {
            console.log("res ", res);
            console.log("ownerName ", this.state.web3.toAscii(res));
            this.setState({ ownerName: this.state.web3.toAscii(res) });
          })
          .then(() => {
            this.setState({ newName: "", newAddress: "" });
          })
          .catch(err => console.error(err));
      });
    });
  };

  render() {
    console.log("===state ", this.state);
    return (
      <div className="App">
        <nav className="navbar pure-menu pure-menu-horizontal">
          <a href="#" className="pure-menu-heading pure-menu-link">
            Truffle Box
          </a>
        </nav>

        <main className="container">
          <form onSubmit={this.registerNewCompany}>
            <h1>Create Compay</h1>
            <label for="company-name">Name: </label>
            <input
              id="company-name"
              type="text"
              value={this.state.newName}
              onChange={e => this.setState({ newName: e.target.value })}
            />
            <label for="company-name">Address: </label>
            <input
              id="company-address"
              type="text"
              value={this.state.newAddress}
              onChange={e => this.setState({ newAddress: e.target.value })}
            />
            <button type="submit">Submit</button>
          </form>
          <br />
          <hr />
          <form onSubmit={this.setDataHashForCompany}>
            <h1>Set Data Hash</h1>
            <CSVReader
              onFileLoaded={(data, file) => {
                if (file.split(".")[1] !== "csv") {
                  console.log("===OwnerofSet", this.state);
                  this.setState({
                    dataSetter: [],
                    csvError: true
                  });
                } else {
                  this.setState(
                    {
                      dataSetter: data
                    },
                    function() {
                      let res = hashData(data);
                      this.setState({ newHashForCompany: res.hash });
                    }
                  );
                }
              }}
              onError={this.handleError}
            />
            <button type="submit">Submit</button>
          </form>
          <br />
          <hr />
          <form onSubmit={this.getOwnerOfDataHash}>
            <h1>Get Owner of Data Hash</h1>
            <CSVReader
              onFileLoaded={(data, file) => {
                console.log("===OwnerofHash", this.state);
                if (file.split(".")[1] !== "csv") {
                  this.setState({
                    dataOwner: [],
                    csvError: true
                  });
                } else {
                  this.setState(
                    {
                      dataOwner: data
                    },
                    function() {
                      let res = hashData(data);
                      this.setState({ ownerHashOfCo: res.hash });
                    }
                  );
                }
              }}
              onError={this.handleError}
            />
            <button type="submit">Submit</button>
          </form>
          <br />
          <hr />
        </main>
      </div>
    );
  }
}

export default App;
