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


                    var sesPath = "";

                    var path = Jupyter.notebook.notebook_path;
                    var indexPath = path.lastIndexOf('/');
                    if (path.lastIndexOf('/') > -1) {
                        sesPath = path.slice(0, indexPath+1);
                    }

                    var url = "http://localhost:8888/api/contents/"+sesPath+"session.pkl";

                    $.get(url, function(res) {
                        var code_callback = "import os\nos.remove('session.pkl')";
                        Jupyter.notebook.kernel.execute(code_callback, callbacks);

                        callback(res);
                    });

                }

                var callbacks = {
                    iopub : {
                        output : handle_output,
                    }
                }

                var code = "from IPython.display import HTML\nimport dill\ndill.dump_session('session.pkl')\nprint('done')";

                Jupyter.notebook.kernel.execute(code, callbacks);
            }

            window.exec = async function(orderId) {

                var order = await getOrderByIdFromSmartContract(orderId);

                storeSession(function(session) {

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
                        session: session
                    };

                    var obj_str = JSON.stringify(obj);

                    storeToIpfs(obj_str, function(hash) {
                        console.log(hash);

                        sendJob(hash, order, cell);
                        cell.clear_output();
                    }); 

                });
            }

            var handler_upload = async function () {

                var w = window.open("", "popupWindow", "width=700, height=400, scrollbars=yes");
                var $w = $(w.document.body);

                var orders = await getOrdersFromApi();

                var myTable="<table><tr><td style='width: 100px; color: red;'>Category</td>";
                myTable+="<td style='width: 100px; color: red; text-align: right;'>Trust</td>";
                myTable+="<td style='width: 100px; color: red; text-align: right;'>Price</td>";
                myTable+="<td style='width: 100px; color: red; text-align: right;'>Volume</td>";
                myTable+="<td style='width: 100px; color: red; text-align: right;'>Workerpool</td></tr>";

                myTable+="<tr><td style='width: 100px;                   '>---------------</td>";
                myTable+="<td     style='width: 100px; text-align: right;'>---------------</td>";
                myTable+="<td     style='width: 100px; text-align: right;'>---------------</td>";
                myTable+="<td     style='width: 100px; text-align: right;'>---------------</td>";
                myTable+="<td     style='width: 100px; text-align: right;'>---------------</td></tr>";

                for (var i=0; i<orders.length; i++) {
                    myTable+="<tr><td style='width: 100px;'>" + orders[i].category + "</td>";
                    myTable+="<td style='width: 100px; text-align: right;'>" + orders[i].trust + "</td>";
                    myTable+="<td style='width: 100px; text-align: right;'>" + orders[i].value + "</td>";
                    myTable+="<td style='width: 100px; text-align: right;'>" + orders[i].volume + "</td>";
                    myTable+="<td style='width: 100px; text-align: right;'>" + orders[i].workerpool + "</td>";
                    myTable+="<td><button onclick='window.opener.exec("+orders[i].marketorderIdx+"); self.close()'>Select</button></td></tr>";
                }  
                myTable+="</table>";

                $w.html(myTable);

            }

            var handler_reload = function() {
                var cell = Jupyter.notebook.get_selected_cell();
                if(cell.output_area.outputs.length == 0) {
                    return alert("You have to select a cell that executed a job previously");
                }
                var txt = cell.output_area.outputs[0].text;
                if(txt == undefined) {
                    return alert("You have to select a cell that executed a job previously");
                }
                txt = txt.split("\n")[0];
                var txHashStartIndex = txt.indexOf("0x");
                if(txHashStartIndex == -1) {
                    return alert("You have to select a cell that executed a job previously");
                }
                var txHash = txt.substring(txHashStartIndex, txt.length);

                var url = "http://localhost:8888/api/contents/.iexec";

                $.get(url, function(res) {
                    var obj = JSON.parse(res.content);
                    var index = obj.map(function(e) { return e.txHash; }).indexOf(txHash);
                    if (index == -1) { return alert("No work found for this transaction hash : " + txHash); }
                    if(obj[index].uri) {
                        getResultAndLoad(obj[index].uri, cell);
                    }
                    else {
                        getResultAndLoad(obj[index].txHash, cell);
                    }
                }).fail(() => {
                    return alert("No .iexec file found");
                });
            }

            var handler_download = function() {
                var cell = Jupyter.notebook.get_selected_cell();
                if(cell.output_area.outputs.length == 0) {
                    return alert("You have to select a cell that executed a job previously");
                }
                var txt = cell.output_area.outputs[0].text
                if(txt == undefined) {
                    return alert("You have to select a cell that executed a job previously");
                }
                txt = txt.split("\n")[0];
                var txHashStartIndex = txt.indexOf("0x");
                if(txHashStartIndex == -1) {
                    return alert("You have to select a cell that executed a job previously");
                }
                var txHash = txt.substring(txHashStartIndex, txt.length);

                var url = "http://localhost:8888/api/contents/.iexec";

                $.get(url, function(res) {
                    var obj = JSON.parse(res.content);
                    var index = obj.map(function(e) { return e.txHash; }).indexOf(txHash);
                    if (index == -1) { return alert("No work found for this transaction hash : " + txHash); }
                    if(obj[index].uri) {
                        getResultAndDownload(obj[index].uri);
                    }
                    else {
                        getResultAndDownload(obj[index].txHash);
                    }
                }).fail(() => {
                    return alert("No .iexec file found");
                });
            }

            var action_upload = {
                icon: 'fa-cloud-upload',
                help    : 'Send job to iExec',
                help_index : 'zz',
                handler : handler_upload
            };
            var prefix_upload = 'jupyter_iexec_upload';
            var action_name_upload = 'submit-iexec';

            var action_reload = {
                icon: 'fa-refresh',
                help    : 'Reload iExec result',
                help_index : 'zz',
                handler : handler_reload
            };
            var prefix_reload = 'jupyter_iexec_reload';
            var action_name_reload = 'reload-iexec';

            var action_download = {
                icon: 'fa-download',
                help    : 'Download iExec result',
                help_index : 'zz',
                handler : handler_download
            };
            var prefix_download = 'jupyter_iexec_download';
            var action_name_download = 'download-iexec';

            var full_action_name_upload = Jupyter.actions.register(action_upload, action_name_upload, prefix_upload);
            var full_action_name_reload = Jupyter.actions.register(action_reload, action_name_reload, prefix_reload);
            var full_action_name_download = Jupyter.actions.register(action_download, action_name_download, prefix_download);

            Jupyter.toolbar.add_buttons_group([full_action_name_upload, full_action_name_reload, full_action_name_download]);
        }

        return {
            load_ipython_extension: load_ipython_extension
        };
    });