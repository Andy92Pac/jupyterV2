define([
    'base/js/namespace',
    'jquery',
    'custom/custom'
    ], function(
        Jupyter,
        $,
        custom
        ) {
        function load_ipython_extension() {

            function split(str) {
                var i = str.indexOf(".");

                if(i > 0)
                    return str.slice(0, i);
                else
                    return str;     
            }


            var storeSession = function(callback) {

                if( !checkMetamaskConnected() ) {
                    alert("Connect to Metamask first");
                    return;
                } 

                var handle_output = function(output) {

                    console.log(output);

                    var sesPath = "";

                    var path = Jupyter.notebook.notebook_path;
                    var indexPath = path.lastIndexOf('/');
                    if (path.lastIndexOf('/') > -1) {
                        sesPath = path.slice(0, indexPath+1);
                    }

                    var url = "http://localhost:8888/api/contents/"+sesPath+"session.pkl";

                    $.get(url, function(res) {

                        console.log(res);

                        storeToIpfs(JSON.stringify(res), function(hash) {
                            callback(hash);

                            var code_callback = "import os\nos.remove('session.pkl')";
                            Jupyter.notebook.kernel.execute(code_callback, callbacks);

                        }); 
                    });

                    console.log("session stored");

                }

                var callbacks = {
                    iopub : {
                        output : handle_output,
                    }
                }

                var code = "from IPython.display import HTML\nimport dill\ndill.dump_session('session.pkl')\nprint('done')";

                Jupyter.notebook.kernel.execute(code, callbacks);
            }

            var handler = function () {

                storeSession(function(hash) {

                    var python_version;
                    if(Jupyter.notebook.kernel.name == "python2") {
                        python_version = 2;
                    }
                    else if(Jupyter.notebook.kernel.name == "python3") {
                        python_version = 3;
                    }
                    else {
                        alert("Unknown python version");
                    }


                    var cell = Jupyter.notebook.get_selected_cell();
                    var code = cell.get_text();

                    var cells = Jupyter.notebook.get_cells();
                    var full_code_arr = [];
                    full_code_arr.push(code);

                    for(var i=0; i < cells.length; i++) {
                        full_code_arr.push(cells[i].get_text());

                    }

                    var full_code = full_code_arr.join(' ');

                    var str = full_code.replace(/[\n\r]/g,' ');
                    var str = str.replace(/,/g, ' , ')
                    var arr = str.split(" ");

                    var packages = [];

                    for(var i=0; i<arr.length-1; i++) {
                        if(arr[i] == "import") {
                            if(i>=2) {
                                if (arr[i-2] != "from") {
                                    packages.push(split(arr[i+1]));
                                }
                            }
                            else {
                                packages.push(split(arr[i+1]));
                            }
                        }
                        if(arr[i] == "from") {
                            packages.push(split(arr[i+1]));
                        }
                    }

                    let unique_packages = [...new Set(packages)];

                    var obj = {
                        python_version: python_version,
                        packages: unique_packages,
                        code: code,
                        session: hash
                    };

                    var obj_str = JSON.stringify(obj);

                    storeToIpfs(obj_str, function(hash) {
                        sendJob(hash, cell);
                        cell.clear_output();
                    }); 

                });

            };

            var action = {
                icon: 'fa-cloud-upload',
                help    : 'Send job to iExec',
                help_index : 'zz',
                handler : handler
            };
            var prefix = 'jupyter_iexec';
            var action_name = 'submit-iexec';

            var full_action_name = Jupyter.actions.register(action, action_name, prefix);
            Jupyter.toolbar.add_buttons_group([full_action_name]);
        }

        return {
            load_ipython_extension: load_ipython_extension
        };
    });