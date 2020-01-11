#!/bin/bash

set -e

# Install the Cloud Foundry CLI
# Use the URL to get the latest Debian 64 bit installer
wget https://cli.run.pivotal.io/stable?release=debian64 -qO temp.deb && sudo dpkg -i temp.deb

rm temp.deb

# Login
cf api https://api.ng.bluemix.net
cf login -u apikey -p $DEPLOY_KEY -o improving-teams -s staging

# Get App name automatically from the name field in manifest.yml
APP=$(grep -e 'name:' manifest.yml | awk '{first = $1; $1 = ""; gsub(/^[ \t]+|[ \t]+$/, ""); print $0}')

# Start Blue Green Deploy
set -x
# Add CF Blue Green Plugin
# Install https://github.com/bluemixgaragelondon/cf-blue-green-deploy
cf add-plugin-repo CF-Community https://plugins.cloudfoundry.org
cf install-plugin blue-green-deploy -r CF-Community -f

# Deploy
cf blue-green-deploy "$APP" -f manifest.yml

# Cleanup
rm manifest.yml

# Logout
cf logout
