var fs = require("fs");

fs.readFile("session.pkl", 'utf8', (errRead, res) => {
	if(errRead) {
		fs.writeFile("/home/node/app/export/consensus.iexec", errRead, (errWrite) => {
			if(errWrite) throw errWrite; 
			return console.log("consensus.iexec file saved");
			// throw errRead;
		});
	}
	else {
		var count;
		if(res) {
			count = res.split("\n").length;
		}
		else {
			count = 0;
		}
		
		fs.writeFile("/home/node/app/export/consensus.iexec", count, (errWrite) => {
			if(errWrite) throw errWrite; 
			return console.log("consensus.iexec file saved");
		});
	}
})