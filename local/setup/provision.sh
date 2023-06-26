#!/bin/sh

echo ">> SET UP DOCKER!!!"
if [ -x "$(command -v docker)" ]; then
  echo "  SKIP"
else
  apt-get update
  apt-get install -y apt-transport-https ca-certificates curl software-properties-common
  curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
  add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"
  apt-get update
  apt-get install -y docker-ce
  systemctl enable docker
  systemctl start docker
  usermod -aG docker vagrant
  docker network create -d bridge dev-net
fi
echo "<< SET UP DOCKER!!!"

# Dev specified packages
apt-get install -y python3-pip
pip3 install --upgrade pip

cd "/vagrant/backend"
pip install -r __packages

echo "<< SET UP DEPENDENCIES!!!"
