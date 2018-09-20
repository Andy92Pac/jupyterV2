const IPFS = require('ipfs');
const node = new IPFS();
const fs = require('fs');
const curl = require('curlrequest');

var hash = process.argv[2];

function jsonEscape(str)  {
	return str.replace(/\n/g, "\\n").replace(/\r/g, "\\r").replace(/\t/g, "\\t");
}

node.on('ready', async () => {

	var data = await node.files.cat(hash);
	var str = data.toString();
	var obj = JSON.parse(str);

	var session_data = await node.files.cat(obj.session);
	var session_str = session_data.toString();
	session_str = jsonEscape(session_str);
	var session_obj = JSON.parse(session_str);

	fs.writeFileSync("/home/node/app/session.pkl", session_obj.content, session_obj.format)
	
	var setup_str = "";

	var py_version = "";
	if(obj.python_version == 3) {
		py_version = "3";
	}

	setup_str += "virtualenv -p /usr/bin/python" + py_version + " /home/node/app/ENV --system-site-packages";
	setup_str += "\n/home/node/app/ENV/bin/pip"+ py_version + " install -I pip-tools";
	setup_str += "\n/home/node/app/ENV/bin/pip"+ py_version + " install -I ipython[all]";

	var modules_python2 = ["__builtin__","__future__","__main__","_winreg","abc","aepack","aetools","aetypes","aifc","al","AL","anydbm","applesingle","argparse","array","ast","asynchat","asyncore","atexit","audioop","autoGIL","base64","BaseHTTPServer","Bastion","bdb","binascii","binhex","bisect","bsddb","buildtools","bz2","calendar","Carbon","Carbon.AE","Carbon.AH","Carbon.App","Carbon.Appearance","Carbon.CarbonEvents","Carbon.CarbonEvt","Carbon.CF","Carbon.CG","Carbon.Cm","Carbon.Components","Carbon.ControlAccessor","Carbon.Controls","Carbon.CoreFounation","Carbon.CoreGraphics","Carbon.Ctl","Carbon.Dialogs","Carbon.Dlg","Carbon.Drag","Carbon.Dragconst","Carbon.Events","Carbon.Evt","Carbon.File","Carbon.Files","Carbon.Fm","Carbon.Folder","Carbon.Folders","Carbon.Fonts","Carbon.Help","Carbon.IBCarbon","Carbon.IBCarbonRuntime","Carbon.Icns","Carbon.Icons","Carbon.Launch","Carbon.LaunchServices","Carbon.List","Carbon.Lists","Carbon.MacHelp","Carbon.MediaDescr","Carbon.Menu","Carbon.Menus","Carbon.Mlte","Carbon.OSA","Carbon.OSAconst","Carbon.Qd","Carbon.Qdoffs","Carbon.QDOffscreen","Carbon.Qt","Carbon.QuickDraw","Carbon.QuickTime","Carbon.Res","Carbon.Resources","Carbon.Scrap","Carbon.Snd","Carbon.Sound","Carbon.TE","Carbon.TextEdit","Carbon.Win","Carbon.Windows","cd","cfmfile","cgi","CGIHTTPServer","cgitb","chunk","cmath","cmd","code","codecs","codeop","collections","ColorPicker","colorsys","commands","compileall","compiler","compiler.ast","compiler.visitor","ConfigParser","contextlib","Cookie","cookielib","copy","copy_reg","cPickle","cProfile","crypt","cStringIO","csv","ctypes","curses","curses.ascii","curses.panel","curses.textpad","datetime","dbhash","dbm","decimal","DEVICE","difflib","dircache","dis","distutils","distutils.archive_util","distutils.bcppcompiler","distutils.ccompiler","distutils.cmd","distutils.command","distutils.command.bdist","distutils.command.bdist_dumb","distutils.command.bdist_msi","distutils.command.bdist_packager","distutils.command.bdist_rpm","distutils.command.bdist_wininst","distutils.command.build","distutils.command.build_clib","distutils.command.build_ext","distutils.command.build_py","distutils.command.build_scripts","distutils.command.check","distutils.command.clean","distutils.command.config","distutils.command.install","distutils.command.install_data","distutils.command.install_headers","distutils.command.install_lib","distutils.command.install_scripts","distutils.command.register","distutils.command.sdist","distutils.core","distutils.cygwinccompiler","distutils.debug","distutils.dep_util","distutils.dir_util","distutils.dist","distutils.emxccompiler","distutils.errors","distutils.extension","distutils.fancy_getopt","distutils.file_util","distutils.filelist","distutils.log","distutils.msvccompiler","distutils.spawn","distutils.sysconfig","distutils.text_file","distutils.unixccompiler","distutils.util","distutils.version","dl","doctest","DocXMLRPCServer","dumbdbm","dummy_thread","dummy_threading","EasyDialogs","email","email.charset","email.encoders","email.errors","email.generator","email.header","email.iterators","email.message","email.mime","email.parser","email.utils","encodings","encodings.idna","encodings.utf_8_sig","ensurepip","errno","exceptions","fcntl","filecmp","fileinput","findertools","fl","FL","flp","fm","fnmatch","formatter","fpectl","fpformat","fractions","FrameWork","ftplib","functools","future_builtins","gc","gdbm","gensuitemodule","getopt","getpass","gettext","gl","GL","glob","grp","gzip","hashlib","heapq","hmac","hotshot","hotshot.stats","htmlentitydefs","htmllib","HTMLParser","httplib","ic","icopen","imageop","imaplib","imgfile","imghdr","imp","importlib","imputil","inspect","io","itertools","jpeg","json","keyword","lib2to3","linecache","locale","logging","logging.config","logging.handlers","macerrors","MacOS","macostools","macpath","macresource","mailbox","mailcap","marshal","math","md5","mhlib","mimetools","mimetypes","MimeWriter","mimify","MiniAEFrame","mmap","modulefinder","msilib","msvcrt","multifile","multiprocessing","multiprocessing.connection","multiprocessing.dummy","multiprocessing.managers","multiprocessing.pool","multiprocessing.sharedctypes","mutex","Nav","netrc","new","nis","nntplib","numbers","operator","optparse","os","os.path","ossaudiodev","parser","pdb","pickle","pickletools","pipes","PixMapWrapper","pkgutil","platform","plistlib","popen2","poplib","posix","posixfile","pprint","profile","pstats","pty","pwd","py_compile","pyclbr","pydoc","Queue","quopri","random","re","readline","resource","rexec","rfc822","rlcompleter","robotparser","runpy","sched","ScrolledText","select","sets","sgmllib","sha","shelve","shlex","shutil","signal","SimpleHTTPServer","SimpleXMLRPCServer","site","smtpd","smtplib","sndhdr","socket","SocketServer","spwd","sqlite3","ssl","stat","statvfs","string","StringIO","stringprep","struct","subprocess","sunau","sunaudiodev","SUNAUDIODEV","symbol","symtable","sys","sysconfig","syslog","tabnanny","tarfile","telnetlib","tempfile","termios","test","test.support","textwrap","thread","threading","time","timeit","Tix","Tkinter","token","tokenize","trace","traceback","ttk","tty","turtle","types","unicodedata","unittest","urllib","urllib2","urlparse","user","UserDict","UserList","UserString","uu","uuid","videoreader","W","warnings","wave","weakref","webbrowser","whichdb","winsound","wsgiref","wsgiref.handlers","wsgiref.headers","wsgiref.simple_server","wsgiref.util","wsgiref.validate","xdrlib","xml","xml.dom","xml.dom.minidom","xml.dom.pulldom","xml.etree.ElementTree","xml.parsers.expat","xml.sax","xml.sax.handler","xml.sax.saxutils","xml.sax.xmlreader","xmlrpclib","zipfile","zipimport","zlib"];
	var modules_python3 = ["__future__","__main__","_dummy_thread","_thread","abc","aifc","argparse","array","ast","asynchat","asyncio","asyncore","atexit","audioop","base64","bdb","binascii","binhex","bisect","builtins","bz2","calendar","cgi","cgitb","chunk","cmath","cmd","code","codecs","codeop","collections","collections.abc","colorsys","compileall","concurrent","concurrent.futures","configparser","contextlib","copy","copyreg","cProfile","crypt","csv","ctypes","curses","curses.ascii","curses.panel","curses.textpad","datetime","dbm","dbm.dumb","dbm.gnu","dbm.ndbm","decimal","difflib","dis","distutils","distutils.archive_util","distutils.bcppcompiler","distutils.ccompiler","distutils.cmd","distutils.command","distutils.command.bdist","distutils.command.bdist_dumb","distutils.command.bdist_msi","distutils.command.bdist_packager","distutils.command.bdist_rpm","distutils.command.bdist_wininst","distutils.command.build","distutils.command.build_clib","distutils.command.build_ext","distutils.command.build_py","distutils.command.build_scripts","distutils.command.check","distutils.command.clean","distutils.command.config","distutils.command.install","distutils.command.install_data","distutils.command.install_headers","distutils.command.install_lib","distutils.command.install_scripts","distutils.command.register","distutils.command.sdist","distutils.core","distutils.cygwinccompiler","distutils.debug","distutils.dep_util","distutils.dir_util","distutils.dist","distutils.errors","distutils.extension","distutils.fancy_getopt","distutils.file_util","distutils.filelist","distutils.log","distutils.msvccompiler","distutils.spawn","distutils.sysconfig","distutils.text_file","distutils.unixccompiler","distutils.util","distutils.version","doctest","dummy_threading","email","email.charset","email.contentmanager","email.encoders","email.errors","email.generator","email.header","email.headerregistry","email.iterators","email.message","email.mime","email.parser","email.policy","email.utils","encodings","encodings.idna","encodings.mbcs","encodings.utf_8_sig","ensurepip","enum","errno","faulthandler","fcntl","filecmp","fileinput","fnmatch","formatter","fpectl","fractions","ftplib","functools","gc","getopt","getpass","gettext","glob","grp","gzip","hashlib","heapq","hmac","html","html.entities","html.parser","http","http.client","http.cookiejar","http.cookies","http.server","imaplib","imghdr","imp","importlib","importlib.abc","importlib.machinery","importlib.util","inspect","io","ipaddress","itertools","json","json.tool","keyword","lib2to3","linecache","locale","logging","logging.config","logging.handlers","lzma","macpath","mailbox","mailcap","marshal","math","mimetypes","mmap","modulefinder","msilib","msvcrt","multiprocessing","multiprocessing.connection","multiprocessing.dummy","multiprocessing.managers","multiprocessing.pool","multiprocessing.sharedctypes","netrc","nis","nntplib","numbers","operator","optparse","os","os.path","ossaudiodev","parser","pathlib","pdb","pickle","pickletools","pipes","pkgutil","platform","plistlib","poplib","posix","pprint","profile","pstats","pty","pwd","py_compile","pyclbr","pydoc","queue","quopri","random","re","readline","reprlib","resource","rlcompleter","runpy","sched","secrets","select","selectors","shelve","shlex","shutil","signal","site","smtpd","smtplib","sndhdr","socket","socketserver","spwd","sqlite3","ssl","stat","statistics","string","stringprep","struct","subprocess","sunau","symbol","symtable","sys","sysconfig","syslog","tabnanny","tarfile","telnetlib","tempfile","termios","test","test.support","textwrap","threading","time","timeit","tkinter","tkinter.scrolledtext","tkinter.tix","tkinter.ttk","token","tokenize","trace","traceback","tracemalloc","tty","turtle","turtledemo","types","typing","unicodedata","unittest","unittest.mock","urllib","urllib.error","urllib.parse","urllib.request","urllib.response","urllib.robotparser","uu","uuid","venv","warnings","wave","weakref","webbrowser","winreg","winsound","wsgiref","wsgiref.handlers","wsgiref.headers","wsgiref.simple_server","wsgiref.util","wsgiref.validate","xdrlib","xml","xml.dom","xml.dom.minidom","xml.dom.pulldom","xml.etree.ElementTree","xml.parsers.expat","xml.parsers.expat.errors","xml.parsers.expat.model","xml.sax","xml.sax.handler","xml.sax.saxutils","xml.sax.xmlreader","xmlrpc","xmlrpc.client","xmlrpc.server","zipapp","zipfile","zipimport","zlib"];

	var requirements_filtered = [];

	if(py_version == "") {
		for(var i=0; i<obj.packages.length; i++) {
			if(!modules_python2.includes(obj.packages[i]))
				requirements_filtered.push(obj.packages[i]);
		}
	}

	else {
		for(var i=0; i<obj.packages.length; i++) {
			if(!modules_python3.includes(obj.packages[i]))
				requirements_filtered.push(obj.packages[i]);
		}
	}

	if(obj.packages.length > 0) {

		var requirements = requirements_filtered.join('\n');

		fs.writeFileSync("/home/node/app/requirements.in", requirements);

		console.log("zer");
		setup_str += "\nexport LC_ALL=C.UTF-8\nexport LANG=C.UTF-8";
		setup_str += "\necho $LC_ALL\necho $LANG"
		setup_str += "\ncp /home/node/app/requirements.in /home/node/app/export/";
		setup_str += "\n/home/node/app/ENV/bin/pip-compile /home/node/app/requirements.in";
		setup_str += "\n/home/node/app/ENV/bin/pip"+ py_version +" install -r /home/node/app/requirements.txt";
	}


	setup_str += "\n/home/node/app/ENV/bin/python"+ py_version + " /home/node/app/script.py > /home/node/app/export/output" 


	var code = obj.code;
	code = "import dill\ndill.load_session('/home/node/app/session.pkl')\n" + code; 
	code += "\nfilename = '/home/node/app/export/globalsave.pkl'\ndill.dump_session(filename)";

	console.log(code);


	fs.writeFileSync("/home/node/app/setup_python.sh", setup_str);
	fs.writeFileSync("/home/node/app/script.py", code);

	console.log("The files were saved!");

	node.stop(() => {
		console.log("node stopped");
		process.exit(1);
	});

});

