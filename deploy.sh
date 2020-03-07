#!/bin/bash
# This shell script is prepared for deploying an application to Heroku through Travis
# It is triggered only commits to the master or develop branches. Pulls are ignored.
#
# The script is prepared for Python, change the TRAVIS_PYTHON_VERSION and DEPLOY_PYTHON_VERSION for your language.
#
# Note that it makes use of the following environmental variables from Travis:
# - TRAVIS_PULL_REQUEST: used to ignore pulls
# - TRAVIS_BRANCH: used to deploy only from the master branch
# - TRAVIS_PYTHON_VERSION: change this for the correct one for the language you are using
#
# And requires the following custom environmental variables:
# - DEPLOY_PYTHON_VERSION: used to indicate the version which will be used for deployment
# - HEROKU_APP: the name of the application on Heroku


# The Heroku gem is installed
#gem install heroku
#git remote add heroku git@heroku.com:$HEROKU_APP.git

# Sets up keys
#heroku keys:clear
#yes | heroku keys:add

# Pushes to Heroku. This is forced so it will work even if the app is running.
#yes | git push heroku master
#heroku login
echo "github email $GITHUB_EMAIL"
echo "github name: $GITHUB_NAME"

git config user.email "$GITHUB_EMAIL"
git config user.name "$GITHUB_NAME"


echo "Deploying site to $HEROKU_APP"
echo "Key: $HEROKU_API_KEY"
heroku git:remote -a $HEROKU_APP
git add .
git commit -am "deploying"
git push heroku master