import Web3 from "web3";
import metaCoinArtifact from "../../build/contracts/ECerti.json";
var SHA256 = require("crypto-js/md5");
require('./script.js');
const App = {
  web3: null,
  account: null,
  meta: null,

  start: async function() {
    const { web3 } = this;

    try {
      // get contract instance
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = metaCoinArtifact.networks[networkId];
      this.meta = new web3.eth.Contract(
        metaCoinArtifact.abi,
        deployedNetwork.address,
      );

      // get accounts
      const accounts = await web3.eth.getAccounts();
      this.account = accounts[0];

      this.getIssuedCerti();
    } catch (error) {
      console.error("Could not connect to contract or chain.");
    }
  },

  getIssuedCerti: async function() {
     const{totalsupply}=this.meta.methods;
     const totalcount = await totalsupply().call();
     var indexes = [];
     const {indexs} = this.meta.methods;
     for(var i=0;i<totalcount;i++){
       const index = await indexs(i).call();
       indexes.push(index);
     }
     var allValue = [];
     const {viewCerti} = this.meta.methods;
     for(var i=0;i<totalcount;i++){
       const value = await viewCerti(indexes[i]).call();
       allValue.push(value);
     }
     var str = '';
     for(var i=0;i<totalcount;i++){
       str +='<h3>'+allValue[i][0]+'</h3>';
     }
     $('#Alldetails').html(str);
  },

  addCerit: async function() {
    var i = $('form').serializeArray();
    var ctext = SHA256(i[0].value+i[2].value).toString();
    const {addCerti} = this.meta.methods;
    var tx = await addCerti(i[0].value,i[1].value,i[2].value,i[3].value,ctext).send({from: this.account});
    console.log(tx);
    generate(i[0].value,i[2].value,i[3].value,this.account,tx.transactionHash,ctext);

  },

  setStatus: function(message) {
    const status = document.getElementById("status");
    status.innerHTML = message;
  },
};

window.App = App;

window.addEventListener("load", function() {
  if (window.ethereum) {
    // use MetaMask's provider
    App.web3 = new Web3(window.ethereum);
    window.ethereum.enable(); // get permission to access accounts
  } else {
    console.warn(
      "No web3 detected. Falling back to http://127.0.0.1:8545. You should remove this fallback when you deploy live",
    );
    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    App.web3 = new Web3(
      new Web3.providers.HttpProvider("http://127.0.0.1:8545"),
    );
  }

  App.start();
});
$('form').submit(function(event){
  event.preventDefault();
  App.addCerit()
});
