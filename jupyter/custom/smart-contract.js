if(typeof web3 != 'undefined'){
    console.log("Using web3 detected from external source like Metamask")
    this.web3 = new Web3(web3.currentProvider);
}
else{
    this.web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
}

var abi = [ { "constant": false, "inputs": [ { "name": "submitTxHash", "type": "bytes32" }, { "name": "user", "type": "address" }, { "name": "stdout", "type": "string" }, { "name": "uri", "type": "string" } ], "name": "iexecSubmitCallback", "outputs": [ { "name": "", "type": "bool" } ], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "DAPP_PRICE", "outputs": [ { "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [ { "name": "param", "type": "string" } ], "name": "iexecSubmit", "outputs": [], "payable": true, "stateMutability": "payable", "type": "function" }, { "constant": true, "inputs": [], "name": "DAPP_NAME", "outputs": [ { "name": "", "type": "string" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "inputs": [ { "name": "_iexecOracleAddress", "type": "address" } ], "payable": false, "stateMutability": "nonpayable", "type": "constructor" }, { "anonymous": false, "inputs": [ { "indexed": false, "name": "submitTxHash", "type": "bytes32" }, { "indexed": true, "name": "user", "type": "address" }, { "indexed": false, "name": "stdout", "type": "string" }, { "indexed": false, "name": "uri", "type": "string" } ], "name": "IexecSubmitCallback", "type": "event" } ];
var address = "0x9c69bA8dF47bFA4652617B68fCD590CecF3C6eff";
var MyContract = web3.eth.contract(abi);
var ContractInstance = MyContract.at(address);

sendJob = function(ipfsAddress, cell) {

    ContractInstance.iexecSubmit("run.sh "+ipfsAddress, {
        gas: 100000,
        from: web3.eth.accounts[0],
        value: web3.toWei(0.002, 'ether'), 
    }, (err, result) => {
        if(err) {
            alert(err);
        }
        else {
            console.log("Sent transaction hash : " + result);

            executedCell = cell;
            txHash = result;

            job = {
                ipfsHash: ipfsAddress,
                cell: executedCell,
                txHash: txHash
            };

            jobArr.push(job);

            console.log(job);

            cell.set_input_prompt('*');
            cell.output_area.handle_output({
                header: {
                    msg_type: "stream"
                },
                content : {
                    text: "Transaction Hash : "+txHash+"\nCode sent to iExec.",
                    name: "iexec"
                }
            });
        }
    });
}

checkMetamaskConnected = function() {
    if(typeof web3.eth.accounts[0] === "undefined") {
        return false;
    }
    else {
        return true;
    }
}