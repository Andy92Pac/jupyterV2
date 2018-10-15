DISCLAIMER : This tool is experimental and you may encounter errors while using it. It is currently only working with python 2.

# iExec Jupyter extension

This is a Jupyter extension allowing the use of iExec for heavy computing tasks.

# How does it works 

The process is the following :

1. The code of the selected cell, a pickle of the current session stored using the dump_session function from dill package and additionnal information about the session such as kernel version, packages needed, etc, are stored in a json file and the file is also sent to ipfs.
2. A transaction is sent in order to execute the computations using the iExec app.
3. The code run on iExec after the needed package have been installed and the resulting session is stored.
4. Once the execution is done, the result of the execution are recovered.
5. The output of the execution is set to the cell output and the session is loaded using the load_session function from the dill package.

# Docker

If you want a ready to use solution, you can also directly use the docker container 

```bash
docker pull andy92pac/jupyter_iexec
```

You can then simply run your jupyter notebook with the following command

```bash
docker run -ti --rm -p 8888:8888 andy92pac/jupyter_iexec
```

In order to be able to load the pickled session, you have to install the dill package. 

For that you should launch a terminal inside Jupyter : New > Terminal.

You then install the dill package using the command

```bash
pip2 install dill --user
```

You can install any package you want to use for your work using the same process.

See https://hub.docker.com/r/andy92pac/jupyter_iexec/

# Set up with existing Jupyter instance

First of, you'll need to have Metamask installed on your browser running your Jupyter notebook.
See https://metamask.io

In order to use the extension, you will need to first add the custom files.
The files custom.js, iexec.js and smart-contract.js need to be put in the custom directory of your local Jupyter server.
You can look up this link to have more details : http://jupyter-notebook.readthedocs.io/en/stable/examples/Notebook/JavaScript%20Notebook%20Extensions.html

Currently it is needed to add these two lines in your jupyter_notebook_config.py file :
```python
c.NotebookApp.token = ''
c.NotebookApp.disable_check_xsrf = True
```
See http://jupyter-notebook.readthedocs.io/en/stable/config.html

The last step is to install the iexec extension present in the jupyter_iexec directory.

You first need to install jupyter_contrib_nbextensions
```bash
pip install jupyter_contrib_nbextensions
jupyter contrib nbextension install
```
See https://github.com/ipython-contrib/jupyter_contrib_nbextensions

You then install the iexec extension
```bash
jupyter nbextension install iexec
jupyter nbextension enable iexec/jupyter_iexec
```

You can then run jupyter using the following command
```bash
jupyter notebook
```