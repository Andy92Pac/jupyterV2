FROM jupyter/scipy-notebook

RUN echo "c.NotebookApp.token = ''" >> /etc/jupyter/jupyter_notebook_config.py \
	&& echo "c.NotebookApp.disable_check_xsrf = True" >> /etc/jupyter/jupyter_notebook_config.py

RUN git clone https://github.com/Andy92Pac/jupyterV2.git

RUN mkdir -p ./.jupyter/custom/ \
	&& cp jupyterV2/jupyter/custom/custom.js jupyterV2/jupyter/custom/iexec.js jupyterV2/jupyter/custom/smart-contract.js ./.jupyter/custom

RUN pip install jupyter_contrib_nbextensions

RUN jupyter contrib nbextension install --user

RUN cd jupyterV2/jupyter/ \
	&& tree \
	&& jupyter nbextension install iexec --user

RUN jupyter nbextension enable iexec/jupyter_iexec

USER root

RUN sudo apt-get -y update \
	&& sudo apt-get -y install software-properties-common \
	&& sudo apt-add-repository -y universe \
	&& sudo apt-get -y update \
	&& sudo apt-get -y install python-pip

USER jovyan

RUN python2 -m pip install --upgrade pip

RUN python2 -m pip --version

RUN python2 -m pip install ipykernel --user
RUN python2 -m ipykernel install --user

RUN python2 -m pip install dill numpy scipy --user