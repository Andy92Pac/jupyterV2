requirejs.config({
	paths: {
		'ipfs': 'https://cdn.jsdelivr.net/npm/ipfs/dist/index.min'
		//'ipfs': 'https://cdnjs.cloudflare.com/ajax/libs/ipfs/0.32.0/index.min'
	}
});

define(
	[
	'ipfs',
	'custom/smart-contract',
	'custom/iexec'
	],
	function(ipfs, contract, iexec) {

		jobArr = [];

		const node = new Ipfs({ repo: 'ipfs-' + Math.random() })

		node.once('ready', () => {
			console.log('Online status: ', node.isOnline() ? 'online' : 'offline')

			node.stop(function() { console.log("node stopped")});
		})
		

		storeToIpfs = function(code, callback) {

			if(node.isOnline()) {
				node.files.add(new node.types.Buffer(code), (err, filesAdded) => {
					if (err) {
						return console.error('Error - ipfs files add', err, res)
					}

					filesAdded.forEach((file) => {
						console.log('successfully stored', file.hash);
						catFromIpfs(file.hash);
						callback(file.hash);
					})
				})
			}

			else {
				node.start(() => {

					console.log('node started');

					node.files.add(new node.types.Buffer(code), (err, filesAdded) => {
						if (err) {
							return console.error('Error - ipfs files add', err, res)
						}

						filesAdded.forEach((file) => {
							console.log('successfully stored', file.hash);
							catFromIpfs(file.hash);
							callback(file.hash);
						})
					})
				})
			}
		}

		catFromIpfs = function(hash, callback) {
			node.files.cat(hash, function (err, data) {
				if (err) {
					return console.error('Error - ipfs files cat', err, res)
				}

				console.log(data.toString())
			})
		}

		getFromIpfs = function(hash, callback) {
			node.files.get(hash, function(err, file) {
				if (err) {
					return console.error('Error - ipfs files cat', err)
				}

				callback(file);
			});
		}

		getResultAndLoad = function(txHash, cell) {

			fetchResults(txHash, (job_output) => {
				cell.clear_output();
				cell.set_input_prompt('$');

				cell.output_area.handle_output({
					header: {
						msg_type: "stream"
					},
					content : {
						text: "Transaction Hash : " + txHash + "\n\n" + job_output,
						name: "iexec"
					}
				});

				var handle_output = function(output) {

					console.log("Transaction Hash : " + txHash + "\n\n" + output);

					console.log("done importing globalsave.pkl")	

				};

				var callbacks = {
					iopub : {
						output : handle_output,
					}
				}

				var loc = [
				"import dill",
				"dill.load_session('"+txHash+"')",
				"import os",
				"os.remove('"+txHash+"')"
				];
				var code = loc.join('\n');
				Jupyter.notebook.kernel.execute(code, callbacks);
			});
		}

		getResultAndDownload = function(txHash) {
			downloadResults(txHash);
		}


		hubInstance.WorkOrderCompleted({fromBlock:'latest'}, function(err, res) {

			console.log("WORKORDERCOMPLETED");
			console.log(res);

			var index = jobArr.map(function(e) { return e.woid; }).indexOf(res.args.woid);
			console.log(index);
			if (index == -1) {
				return;
			}

			if(err) {
				node.stop(function() { console.log("node stopped")});
				alert(err);
			}
			else {
				console.log(res);

				console.log(jobArr);

				var txHash = jobArr[index].txHash;

				if (jobArr.length == 1) {
					node.stop(function() { console.log("node stopped")});
				}

				var cell = jobArr[index].cell;

				jobArr.splice(index, 1);

				getResultAndLoad(txHash, cell);
			}
		});

		hubInstance.WorkOrderActivated({fromBlock:'latest'}, function(err, res) {

			console.log("WORKORDERACTIVATED");
			console.log(res);

			var index = jobArr.map(function(e) { return e.txHash; }).indexOf(res.transactionHash);
			console.log(index);

			jobArr[index].woid = res.args.woid;


		});
	}
	);

