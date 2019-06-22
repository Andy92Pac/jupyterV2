requirejs.config({
	paths: {
		'axios': 'https://cdnjs.cloudflare.com/ajax/libs/axios/0.19.0/axios.min',
		'notify': 'https://cdnjs.cloudflare.com/ajax/libs/notify/0.4.2/notify.min'
	}
});

define(
	[
	'axios',
	'notify',
	'custom/iexec'
	],
	function(axios, notify, iexec) {

		$.notify.addStyle('confirmation', {
			html: 
			"<div>" +
			"<div class='clearfix'>" +
			"<div class='title' data-notify-html='title'/>" +
			"<div class='buttons'>" +
			"<button class='no'>Cancel</button>" +
			"<button class='yes' data-notify-text='button'></button>" +
			"</div>" +
			"</div>" +
			"</div>"
		});

		jobArr = [];
		contracts = null;

		const pinataApiKey = 'ce93613695e675191648';
		const pinataSecretApiKey = '29e62e3c23f7c2af254b83d4572d6487279f8fba553f07de71bead0e2d12a241';

		pinJSONToIPFS = async (JSONBody) => {
			const url = `https://api.pinata.cloud/pinning/pinJSONToIPFS`;
			var response;
			try {
				response = await axios.post(
					url,
					JSONBody,
					{
						headers: {
							'pinata_api_key': pinataApiKey,
							'pinata_secret_api_key': pinataSecretApiKey
						}
					})
			} catch (error) {
				console.log(error);
			}
			
			let hash = response.data.IpfsHash;
			return hash;
		};

		removePinFromIPFS = async (pinToRemove) => {
			const url = `https://api.pinata.cloud/pinning/removePinFromIPFS`;
			const body = {
				ipfs_pin_hash: pinToRemove
			};
			var response;
			try {
				response = await axios.post(
					url,
					body,
					{
						headers: {
							'pinata_api_key': pinataApiKey,
							'pinata_secret_api_key': pinataSecretApiKey
						}
					})
				return response;
			} catch (error) {
				console.log(error);
				return false;
			}
		};

		setupContracts = async () => {
			if(contracts === null) {
				let ethProvider = await getEthProvider();
				contracts = getContracts(ethProvider);
			}
			return;
		}

		sendJobToIexec = async function (hash, cell, callback) {

			let workerpoolmaxprice = 100;
			let requester = web3.eth.accounts[0];
			let beneficiary = web3.eth.accounts[0];
			let volume = "1";
			let params = hash;
			let category = 4;
			let trust = "0";

			let order = initRequestOrder(
				workerpoolmaxprice,
				requester,
				beneficiary,
				volume,
				params,
				category,
				trust
				);

			let appOrderbook = await getAppOrderbook();
			let workerpoolOrderbook = await getWorkerpoolOrderbook(category.toString());

			let balance = await getAccountBalance(contracts, web3.eth.accounts[0]);
			if(workerpoolOrderbook.workerpoolOrders[0].order.workerpoolprice > balance.stake) {
				try {
					let missingAmount = workerpoolOrderbook.workerpoolOrders[0].order.workerpoolprice - balance.stake;

					await new Promise((resolve) => {
						$.notify({
							title: 'You have to deposit '+missingAmount+' nRLC to continue',
							button: 'Confirm'
						}, { 
							style: 'confirmation',
							autoHide: false,
							clickToHide: false
						});
						$(document).on('click', '.notifyjs-confirmation-base .no', function() {
							$(this).trigger('notify-hide');
							return;
						});
						$(document).on('click', '.notifyjs-confirmation-base .yes', async function() {
							$(this).trigger('notify-hide');
							await deposit(contracts, missingAmount);
							resolve();
						});
					})

				} catch (error) {
					console.log(error);
					return alert('Error during deposit, try resending job to iExec');
				}
			}

			$.notify('Sign the request order in metamask', 'info');
			let signedOrder = await signRequestOrder(contracts, order, web3.eth.accounts[0]);

			$.notify('Send the task in metamask', 'info');
			let deal = await makeADeal(contracts, appOrderbook.appOrders[0].order, workerpoolOrderbook.workerpoolOrders[0].order, signedOrder);

			await showDeal(contracts, deal.dealid);

			let taskid = await getTaskId(deal.dealid);

			var outputArea = cell.output_area.create_output_area();
			var subarea = $('<div/>').addClass('output_subarea').attr('id', taskid);
			subarea.append(
				$("<span>")
				.text('Task Id: ')
				);
			subarea.append(
				$("<a>")
				.attr("href", "#")
				.addClass('taskid')
				.text(taskid)
				.click(function (e) {
					window.open('https://explorer.iex.ec/kovan/task/'+taskid)
				})
				);
			subarea.append(
				$("<span>")
				.addClass('status')
				.text("\nStatus: Unset")
				);
			outputArea.append(subarea);
			cell.output_area._safe_append(outputArea);
			cell.expand_output();

			let task = await getTask(contracts, taskid);
			let res = await waitForResult(contracts, taskid, (status) => {
				var statusText;
				if (status == 0)
					statusText = 'Unset';
				else if (status == 1) 
					statusText = 'Active';
				else if (status == 2) 
					statusText = 'Revealing';
				else if (status == 3) 
					statusText = 'Completed';
				else if (status == 1) 
					statusText = 'Failed';
				$('#'+taskid+' .status').text("\nStatus: "+statusText);
			});

			if(res.status === 4) {
				$('#'+taskid+' .status').text("\nStatus: Failed");
				return alert('Task computation failed');
			}

			$('#'+taskid+' .status').text("\nStatus: Completed");
			$.notify('Sign in metamask to load the results', 'info');
			await loadResult(taskid, (output) => {
				subarea.append(
					$("<span>")
					.text(' ')
					);
				subarea.append(
					$("<a>")
					.attr("href", "#")
					.text("Download")
					.click(function (e) {
						downloadResult(taskid);
					})
					);

				callback(output);
			});
		}

		loadResult = async function (taskid, callback) {
			let result = await downloadResults(contracts, taskid, web3.eth.accounts[0]);
			await computeResult(result, (output) => callback(output));
		}

		downloadResult = async function (taskid) {
			let result = await downloadResults(contracts, taskid, web3.eth.accounts[0]);
			await downloadAsFile(result);
		}

		getAccountDeals = async function () {
			let deals = await getPreviousDeals(web3.eth.accounts[0]);
			return deals;
		}
	});
