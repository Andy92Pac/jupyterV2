var fs = require("fs");

fs.readFile("session.pkl", 'utf8', (errRead, res) => {
	if(errRead) {
		fs.writeFile("consensus.iexec", errRead, (errWrite) => {
			if(errWrite) throw errWrite; 
			console.log("consensus.iexec file saved");
			throw errRead;
		});
	}
	var count = res.split("\n").length;
	fs.writeFile("consensus.iexec", count, (errWrite) => {
		if(errWrite) throw errWrite; 
		console.log("consensus.iexec file saved");
	});
})