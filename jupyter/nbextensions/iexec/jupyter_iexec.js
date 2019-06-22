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
            $('<link/>')
            .attr({
                rel: 'stylesheet',
                type: 'text/css',
                href: requirejs.toUrl('./nbextensions/iexec/jupyter_iexec.css')
            })
            .appendTo('head');

            function split(str) {
                var i = str.indexOf(".");

                if(i > 0)
                    return str.slice(0, i);
                else
                    return str;     
            }

            var storeSession = function(callback) {

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

            var loadOutputAndSession = async function (cell, output) {
                cell.set_input_prompt('$');

                cell.output_area.handle_output({
                    header: {
                        msg_type: "stream"
                    },
                    content : {
                        text: output,
                        name: "iexec"
                    }
                });

                var loc = [
                "import dill",
                "dill.load_session('globalsave.pkl')",
                "import os",
                "os.remove('globalsave.pkl')"
                ];
                var code = loc.join('\n');
                Jupyter.notebook.kernel.execute(code);
            }

            var handler_upload = async function () {
                storeSession(async function(session) {

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

                    await setupContracts();
                    var hash = await pinJSONToIPFS(obj);

                    sendJobToIexec(hash, cell, (job_output) => {
                        loadOutputAndSession(cell, job_output)
                        removePinFromIPFS(hash);
                    });
                    cell.clear_output();
                });
            }

            var handler_reload = async function() {
                var cell = Jupyter.notebook.get_selected_cell();
                cell.clear_output();

                await setupContracts();

                let deals = await getAccountDeals();

                var toinsert = cell.output_area.create_output_area();
                var subarea = $('<div/>').addClass('output_subarea previous_tasks');
                for(var i=0; i<deals.deals.length; i++) {
                    let taskid = await getTaskId(deals.deals[i].dealid);
                    let executionDate = new Date(deals.deals[i].blockTimestamp);
                    subarea.append(
                        $("<a>")
                        .attr("href", "#")
                        .css('white-space', 'pre')
                        .attr("taskid", taskid)
                        .text("Task Id: "+taskid+" - Executed "+executionDate.toLocaleString()+'\n')
                        .click(function (e) {
                            loadResult($(this).attr("taskid"), (output) => {
                                $('.previous_tasks').remove();
                                var outputArea = cell.output_area.create_output_area();
                                var subarea = $('<div/>').addClass('output_subarea').attr('id', taskid);
                                subarea.append(
                                    $("<span>")
                                    .text('Reload of Task Id: ')
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
                                outputArea.append(subarea);
                                cell.output_area._safe_append(outputArea);
                                cell.expand_output();
                                loadOutputAndSession(cell, output);
                            });
                        })
                        );
                }
                toinsert.append(subarea);
                cell.output_area._safe_append(toinsert);
                cell.expand_output();
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

            var full_action_name_upload = Jupyter.actions.register(action_upload, action_name_upload, prefix_upload);
            var full_action_name_reload = Jupyter.actions.register(action_reload, action_name_reload, prefix_reload);

            Jupyter.toolbar.add_buttons_group([full_action_name_upload, full_action_name_reload]);
        }

        return {
            load_ipython_extension: load_ipython_extension
        };
    });