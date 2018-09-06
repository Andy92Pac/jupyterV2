#!/bin/bash

jupyter contrib nbextension uninstall
pip uninstall jupyter_contrib_nbextensions

jupyter nbextensions_configurator disable
rm -rf /usr/local/share/jupyter/nbextensions/iexec

pip install jupyter_contrib_nbextensions
jupyter contrib nbextension install

jupyter nbextension install nbextensions/iexec
jupyter nbextension enable iexec/jupyter_iexec

jupyter notebook
