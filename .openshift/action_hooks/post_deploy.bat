echo $RAILS_ENV

cd $OPENSHIFT_REPO_DIR

bundle install --no-deployment

bundle exec rake assets:precompile