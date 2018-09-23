if(typeof web3 != 'undefined'){
	console.log("Using web3 detected from external source like Metamask")
	this.web3 = new Web3(web3.currentProvider);
}
else{
	this.web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
}

var dappAddress = "0x83511d280db9ea73855d3da7965bc9e30f00f7fa";

var marketplaceAddress = "0x9315a6Ae9a9842BcB5Ad8F5D43A4271d297088e2";
var marketplaceAbi = [{"constant":false,"inputs":[{"name":"_marketorderIdx","type":"uint256"},{"name":"_requester","type":"address"},{"name":"_workerpool","type":"address"}],"name":"consumeMarketOrderAsk","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_marketorderIdx","type":"uint256"}],"name":"getMarketOrderTrust","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_marketorderIdx","type":"uint256"}],"name":"existingMarketOrder","outputs":[{"name":"marketOrderExist","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_marketorderIdx","type":"uint256"}],"name":"getMarketOrderValue","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"m_orderBook","outputs":[{"name":"direction","type":"uint8"},{"name":"category","type":"uint256"},{"name":"trust","type":"uint256"},{"name":"value","type":"uint256"},{"name":"volume","type":"uint256"},{"name":"remaining","type":"uint256"},{"name":"workerpool","type":"address"},{"name":"workerpoolOwner","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_marketorderIdx","type":"uint256"}],"name":"getMarketOrderCategory","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_woid","type":"address"},{"name":"_stdout","type":"string"},{"name":"_stderr","type":"string"},{"name":"_uri","type":"string"}],"name":"workOrderCallback","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_marketorderIdx","type":"uint256"}],"name":"getMarketOrderWorkerpoolOwner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_marketorderIdx","type":"uint256"}],"name":"closeMarketOrder","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"m_orderCount","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"ASK_STAKE_RATIO","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_woid","type":"address"}],"name":"isCallbackDone","outputs":[{"name":"callbackDone","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_direction","type":"uint8"},{"name":"_category","type":"uint256"},{"name":"_trust","type":"uint256"},{"name":"_value","type":"uint256"},{"name":"_workerpool","type":"address"},{"name":"_volume","type":"uint256"}],"name":"createMarketOrder","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_marketorderIdx","type":"uint256"}],"name":"getMarketOrder","outputs":[{"name":"direction","type":"uint8"},{"name":"category","type":"uint256"},{"name":"trust","type":"uint256"},{"name":"value","type":"uint256"},{"name":"volume","type":"uint256"},{"name":"remaining","type":"uint256"},{"name":"workerpool","type":"address"},{"name":"workerpoolOwner","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[{"name":"_iexecHubAddress","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"name":"marketorderIdx","type":"uint256"}],"name":"MarketOrderCreated","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"marketorderIdx","type":"uint256"}],"name":"MarketOrderClosed","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"marketorderIdx","type":"uint256"},{"indexed":false,"name":"requester","type":"address"}],"name":"MarketOrderAskConsume","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"woid","type":"address"},{"indexed":false,"name":"requester","type":"address"},{"indexed":false,"name":"beneficiary","type":"address"},{"indexed":true,"name":"callbackTo","type":"address"},{"indexed":true,"name":"gasCallbackProvider","type":"address"},{"indexed":false,"name":"stdout","type":"string"},{"indexed":false,"name":"stderr","type":"string"},{"indexed":false,"name":"uri","type":"string"}],"name":"WorkOrderCallbackProof","type":"event"}];
var marketplaceContract = web3.eth.contract(marketplaceAbi);
var marketplaceInstance = marketplaceContract.at(marketplaceAddress);

var hubAddress = "0x12b92A17B1cA4Bb10B861386446B8b2716e58c9B";
var hubAbi = [{"constant":false,"inputs":[{"name":"_categoriesCreator","type":"address"}],"name":"setCategoriesCreator","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_woid","type":"address"},{"name":"_worker","type":"address"},{"name":"_amount","type":"uint256"},{"name":"_reputation","type":"bool"}],"name":"rewardForWork","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"m_contributionHistory","outputs":[{"name":"success","type":"uint256"},{"name":"failed","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_worker","type":"address"}],"name":"unregisterFromPool","outputs":[{"name":"unsubscribed","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_catId","type":"uint256"}],"name":"getCategoryWorkClockTimeRef","outputs":[{"name":"workClockTimeRef","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"appHub","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_name","type":"string"},{"name":"_description","type":"string"},{"name":"_workClockTimeRef","type":"uint256"}],"name":"createCategory","outputs":[{"name":"catid","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_amount","type":"uint256"}],"name":"withdraw","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_catId","type":"uint256"}],"name":"existingCategory","outputs":[{"name":"categoryExist","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_woid","type":"address"}],"name":"isWoidRegistred","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_datasetName","type":"string"},{"name":"_datasetPrice","type":"uint256"},{"name":"_datasetParams","type":"string"}],"name":"createDataset","outputs":[{"name":"createdDataset","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"STAKE_BONUS_MIN_THRESHOLD","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_marketorderIdx","type":"uint256"},{"name":"_workerpool","type":"address"},{"name":"_app","type":"address"},{"name":"_dataset","type":"address"},{"name":"_params","type":"string"},{"name":"_callback","type":"address"},{"name":"_beneficiary","type":"address"}],"name":"buyForWorkOrder","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"}],"name":"checkBalance","outputs":[{"name":"stake","type":"uint256"},{"name":"locked","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_description","type":"string"},{"name":"_subscriptionLockStakePolicy","type":"uint256"},{"name":"_subscriptionMinimumStakePolicy","type":"uint256"},{"name":"_subscriptionMinimumScorePolicy","type":"uint256"}],"name":"createWorkerPool","outputs":[{"name":"createdWorkerPool","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"m_scores","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_woid","type":"address"},{"name":"_user","type":"address"},{"name":"_amount","type":"uint256"}],"name":"unlockForWork","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"workerPoolHub","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"SCORE_UNITARY_SLASH","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"STAKE_BONUS_RATIO","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_worker","type":"address"}],"name":"evictWorker","outputs":[{"name":"unsubscribed","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_woid","type":"address"},{"name":"_user","type":"address"},{"name":"_amount","type":"uint256"}],"name":"lockForWork","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_woid","type":"address"}],"name":"claimFailedConsensus","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_worker","type":"address"}],"name":"getWorkerScore","outputs":[{"name":"workerScore","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_woid","type":"address"},{"name":"_worker","type":"address"},{"name":"_amount","type":"uint256"},{"name":"_reputation","type":"bool"}],"name":"seizeForWork","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"m_categoriesCount","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"marketplace","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_user","type":"address"},{"name":"_amount","type":"uint256"}],"name":"lockForOrder","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"rlc","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_worker","type":"address"}],"name":"registerToPool","outputs":[{"name":"subscribed","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_amount","type":"uint256"}],"name":"deposit","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_woid","type":"address"},{"name":"_stdout","type":"string"},{"name":"_stderr","type":"string"},{"name":"_uri","type":"string"}],"name":"finalizeWorkOrder","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"m_categoriesCreator","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_user","type":"address"},{"name":"_amount","type":"uint256"}],"name":"unlockForOrder","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"datasetHub","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"m_accounts","outputs":[{"name":"stake","type":"uint256"},{"name":"locked","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"m_woidRegistered","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_tokenAddress","type":"address"},{"name":"_marketplaceAddress","type":"address"},{"name":"_workerPoolHubAddress","type":"address"},{"name":"_appHubAddress","type":"address"},{"name":"_datasetHubAddress","type":"address"}],"name":"attachContracts","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"m_categories","outputs":[{"name":"catid","type":"uint256"},{"name":"name","type":"string"},{"name":"description","type":"string"},{"name":"workClockTimeRef","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_catId","type":"uint256"}],"name":"getCategory","outputs":[{"name":"catid","type":"uint256"},{"name":"name","type":"string"},{"name":"description","type":"string"},{"name":"workClockTimeRef","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_worker","type":"address"}],"name":"getWorkerStatus","outputs":[{"name":"workerPool","type":"address"},{"name":"workerScore","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_appName","type":"string"},{"name":"_appPrice","type":"uint256"},{"name":"_appParams","type":"string"}],"name":"createApp","outputs":[{"name":"createdApp","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"name":"woid","type":"address"},{"indexed":true,"name":"workerPool","type":"address"}],"name":"WorkOrderActivated","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"woid","type":"address"},{"indexed":false,"name":"workerPool","type":"address"}],"name":"WorkOrderClaimed","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"woid","type":"address"},{"indexed":false,"name":"workerPool","type":"address"}],"name":"WorkOrderCompleted","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"appOwner","type":"address"},{"indexed":true,"name":"app","type":"address"},{"indexed":false,"name":"appName","type":"string"},{"indexed":false,"name":"appPrice","type":"uint256"},{"indexed":false,"name":"appParams","type":"string"}],"name":"CreateApp","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"datasetOwner","type":"address"},{"indexed":true,"name":"dataset","type":"address"},{"indexed":false,"name":"datasetName","type":"string"},{"indexed":false,"name":"datasetPrice","type":"uint256"},{"indexed":false,"name":"datasetParams","type":"string"}],"name":"CreateDataset","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"workerPoolOwner","type":"address"},{"indexed":true,"name":"workerPool","type":"address"},{"indexed":false,"name":"workerPoolDescription","type":"string"}],"name":"CreateWorkerPool","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"catid","type":"uint256"},{"indexed":false,"name":"name","type":"string"},{"indexed":false,"name":"description","type":"string"},{"indexed":false,"name":"workClockTimeRef","type":"uint256"}],"name":"CreateCategory","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"workerPool","type":"address"},{"indexed":false,"name":"worker","type":"address"}],"name":"WorkerPoolSubscription","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"workerPool","type":"address"},{"indexed":false,"name":"worker","type":"address"}],"name":"WorkerPoolUnsubscription","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"workerPool","type":"address"},{"indexed":false,"name":"worker","type":"address"}],"name":"WorkerPoolEviction","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"woid","type":"address"},{"indexed":true,"name":"worker","type":"address"}],"name":"AccurateContribution","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"woid","type":"address"},{"indexed":true,"name":"worker","type":"address"}],"name":"FaultyContribution","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"owner","type":"address"},{"indexed":false,"name":"amount","type":"uint256"}],"name":"Deposit","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"owner","type":"address"},{"indexed":false,"name":"amount","type":"uint256"}],"name":"Withdraw","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"user","type":"address"},{"indexed":false,"name":"amount","type":"uint256"}],"name":"Reward","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"user","type":"address"},{"indexed":false,"name":"amount","type":"uint256"}],"name":"Seize","type":"event"}];
var hubContract = web3.eth.contract(hubAbi);
var hubInstance = hubContract.at(hubAddress);

var rlcAddress = "0xc57538846Ec405Ea25Deb00e0f9B29a432D53507";
var rlcAbi = [ { "constant": true, "inputs": [], "name": "name", "outputs": [ { "name": "", "type": "string" } ], "payable": false, "type": "function" }, { "constant": false, "inputs": [ { "name": "_spender", "type": "address" }, { "name": "_value", "type": "uint256" } ], "name": "approve", "outputs": [ { "name": "", "type": "bool" } ], "payable": false, "type": "function" }, { "constant": false, "inputs": [ { "name": "_to", "type": "address" }, { "name": "_value", "type": "uint256" } ], "name": "refill", "outputs": [ { "name": "", "type": "bool" } ], "payable": false, "type": "function" }, { "constant": true, "inputs": [], "name": "totalSupply", "outputs": [ { "name": "", "type": "uint256" } ], "payable": false, "type": "function" }, { "constant": false, "inputs": [ { "name": "_from", "type": "address" }, { "name": "_to", "type": "address" }, { "name": "_value", "type": "uint256" } ], "name": "transferFrom", "outputs": [ { "name": "", "type": "bool" } ], "payable": false, "type": "function" }, { "constant": true, "inputs": [], "name": "decimals", "outputs": [ { "name": "", "type": "uint8" } ], "payable": false, "type": "function" }, { "constant": true, "inputs": [], "name": "initialSupply", "outputs": [ { "name": "", "type": "uint256" } ], "payable": false, "type": "function" }, { "constant": false, "inputs": [ { "name": "_value", "type": "uint256" } ], "name": "burn", "outputs": [ { "name": "", "type": "bool" } ], "payable": false, "type": "function" }, { "constant": true, "inputs": [], "name": "version", "outputs": [ { "name": "", "type": "string" } ], "payable": false, "type": "function" }, { "constant": false, "inputs": [ { "name": "_giver", "type": "address" }, { "name": "_spender", "type": "address" }, { "name": "_value", "type": "uint256" } ], "name": "forceApprove", "outputs": [ { "name": "", "type": "bool" } ], "payable": false, "type": "function" }, { "constant": true, "inputs": [ { "name": "_owner", "type": "address" } ], "name": "balanceOf", "outputs": [ { "name": "balance", "type": "uint256" } ], "payable": false, "type": "function" }, { "constant": true, "inputs": [], "name": "owner", "outputs": [ { "name": "", "type": "address" } ], "payable": false, "type": "function" }, { "constant": true, "inputs": [], "name": "symbol", "outputs": [ { "name": "", "type": "string" } ], "payable": false, "type": "function" }, { "constant": false, "inputs": [ { "name": "_to", "type": "address" }, { "name": "_value", "type": "uint256" } ], "name": "transfer", "outputs": [ { "name": "", "type": "bool" } ], "payable": false, "type": "function" }, { "constant": false, "inputs": [ { "name": "_spender", "type": "address" }, { "name": "_value", "type": "uint256" }, { "name": "_extraData", "type": "bytes" } ], "name": "approveAndCall", "outputs": [], "payable": false, "type": "function" }, { "constant": true, "inputs": [], "name": "locked", "outputs": [ { "name": "", "type": "bool" } ], "payable": false, "type": "function" }, { "constant": true, "inputs": [ { "name": "_owner", "type": "address" }, { "name": "_spender", "type": "address" } ], "name": "allowance", "outputs": [ { "name": "remaining", "type": "uint256" } ], "payable": false, "type": "function" }, { "constant": false, "inputs": [ { "name": "_toburn", "type": "address" }, { "name": "_value", "type": "uint256" } ], "name": "forceBurn", "outputs": [ { "name": "", "type": "bool" } ], "payable": false, "type": "function" }, { "constant": false, "inputs": [ { "name": "newOwner", "type": "address" } ], "name": "transferOwnership", "outputs": [], "payable": false, "type": "function" }, { "inputs": [ { "name": "faucetAgent1", "type": "address" }, { "name": "faucetAgent2", "type": "address" }, { "name": "faucetAgent3", "type": "address" } ], "payable": false, "type": "constructor" }, { "anonymous": false, "inputs": [ { "indexed": true, "name": "from", "type": "address" }, { "indexed": true, "name": "to", "type": "address" }, { "indexed": false, "name": "value", "type": "uint256" } ], "name": "Transfer", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": true, "name": "owner", "type": "address" }, { "indexed": true, "name": "spender", "type": "address" }, { "indexed": false, "name": "value", "type": "uint256" } ], "name": "Approval", "type": "event" } ];
var rlcContract = web3.eth.contract(rlcAbi);
var rlcInstance = rlcContract.at(rlcAddress);

sendJob = async function(ipfsAddress, order, cell) {

	var balance = await checkBalance(web3.eth.accounts[0]);

	if(balance < order.value) {
		var amount = order.value - balance;
		var r = confirm("You have to deposit "+amount+" nRLC to continue");
		if (r != true) {
			return alert("Not enough nRLC on the account to continue");
		}
		await deposit(amount);
	}

	var params = '{"cmdline":"run.sh ' + ipfsAddress + '"}';
	var beneficiary = web3.eth.accounts[0];

	var args = [
	order.id,
	order.workerpool,
    dappAddress,
    '0x0000000000000000000000000000000000000000', // dataset
    params,
    '0x0000000000000000000000000000000000000000', // callback
    beneficiary,
    ]

    hubInstance.buyForWorkOrder(...args, {
    	gas: 1000000,
    	from: web3.eth.accounts[0],
    }, (err, result) => {
    	if(err) {
    		alert("Error trying to submit the transaction, open console to get more informations"); 
    		return console.error(err); 
    	}

    	console.log("Sent transaction hash : " + result);

    	executedCell = cell;
    	txHash = result;

    	job = {
    		ipfsHash: ipfsAddress,
    		cell: executedCell,
    		txHash: txHash,
    		woid: null
    	};

    	jobArr.push(job);

    	updateJobArr();

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

    });
}

deposit = function(amount) {
	return new Promise((resolve) => {
		rlcInstance.approve(hubAddress, amount, (err, res) => {
			if(err) {
				alert("Error trying to submit the transaction, open console to get more informations"); 
				return console.error(err); 
			}
			hubInstance.deposit(amount, (err, res) => {
				if(err) {
					alert("Error trying to submit the transaction, open console to get more informations"); 
					return console.error(err); 
				}
				resolve();
			});
		})
	})
}

checkBalance = async function(address) {
	return new Promise((resolve) => {
		hubInstance.checkBalance(address, (err, res) => {
			if(err) {
				alert("Error trying to submit the transaction, open console to get more informations"); 
				return console.error(err); 
			}
			resolve(res[0].toNumber());
		});
	})
}

getOrdersFromSmartContract = async function() {
	return new Promise((resolve) => {
		var orders = [];

		marketplaceInstance.m_orderCount.call((err, nb_order) => {

			for (let i = 100; i < nb_order.toNumber(); i++) {
				marketplaceInstance.getMarketOrder(i, (err, order) => {
					if(err) { console.error(err); }
					var o = {
						direction: order[0].toNumber(),
						category: order[1].toNumber(),
						trust: order[2].toNumber(),
						value: order[3].toNumber(),
						volume: order[4].toNumber(),
						remaining: order[5].toNumber(),
						workerpool: order[6].toString(),
						workerpoolOwner: order[7].toString(),
						id: i
					};

					if ( o.remaining > 0 && o.direction == 2) {
						orders.push(o);
					}

					if ( i == (nb_order.toNumber() - 1) ) {
						resolve(orders);
					}
				});
			}
		})
	})
}

getOrdersFromApi = async function() {
	return new Promise((resolve) => {
		var orders = [];
		var count = 0;
		for(var i=1; i<6; i++) {
			httpGetAsync("https://gateway.iex.ec/orderbook?chainID=42&category="+i, (res) => {

				obj = JSON.parse(res);
				if(obj.ok != true) { console.log("error"); }

				orders.push(...obj.orders);
				count++;

				if(count == 5) {
					resolve(orders);
				}
			})
		}
	})
}

httpGetAsync = function(theUrl, callback)
{
	var xmlHttp = new XMLHttpRequest();
	xmlHttp.onreadystatechange = function() { 
		if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
			callback(xmlHttp.responseText);
	}
    xmlHttp.open("GET", theUrl, true); // true for asynchronous 
    xmlHttp.send(null);
}

getOrderByIdFromSmartContract = async function(id) {
	return new Promise((resolve) => {
		marketplaceInstance.getMarketOrder(id, (err, order) => {
			if(err) { console.error(err); }
			var o = {
				direction: order[0].toNumber(),
				category: order[1].toNumber(),
				trust: order[2].toNumber(),
				value: order[3].toNumber(),
				volume: order[4].toNumber(),
				remaining: order[5].toNumber(),
				workerpool: order[6].toString(),
				workerpoolOwner: order[7].toString(),
				id: id
			};
			resolve(o);
		})
	})
}

checkMetamaskConnected = function() {
	if(typeof web3.eth.accounts[0] === "undefined") {
		return false;
	}
	else {
		return true;
	}
}