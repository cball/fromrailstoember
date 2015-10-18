---
title: Deploy it!
date: 2015-10-18 10:15 EST
tags:
number: 15
---

It's common for Rails developers new to Ember to get a little bit stuck when it comes time to deploy their applications. Because your application is split into two separate repositories (it is, right?) it can be hard to determine the best way to deploy them so that they work together.READMORE

Let's look at some common options we're used to in the Rails world and how to use them with Ember.

### The Heroku Deploy
Most of us are familiar with deploying our Rails applications to Heroku. Once setup, all you need to do is `git push heroku`.

Turns out, you can do this with Ember as well. There is a great buildpack for Heroku by Tony Coconate called [heroku-buildpack-ember-cli](https://github.com/tonycoco/heroku-buildpack-ember-cli).

By default, it will setup nginx with 4 workers to serve your Ember application. Like the proxy feature you might use during development of your Ember app (`ember s --proxy`), the buildpack is designed to proxy to another app for its API.

Your deployed application on Heroku will consist of two separate applications - one for your Ember app using the `heroku-buildpack-ember-cli` buildpack, and one for your API app using the standard Heroku Ruby buildpack.

#### Deploy it
To deploy an Ember app to Heroku, run `git push heroku` in the app's directory. 

### The Capistrano (scripted) Deploy
Capistrano has been used to deploy Rails apps for a long time, but can also be used to deploy your Ember app. If you're using a VPS or EC2, you might be using this method or some variation of it.

When using Capistrano, create a Gemfile in your Ember app's root, add the required Capistrano gem(s), and a `config/deploy.rb` file. Capistrano requires more up-front setup than other methods, but is more flexible. We won't go into detail here, but the important thing from an Ember perspective is to add the `ember build --environment production` command to your `deploy.rb` configuration.

#### Deploy it
To deploy a Capistrano configured Ember app, run `cap production deploy` in the app's directory.

### The ember-cli-deploy Deploy
[ember-cli-deploy](http://ember-cli.github.io/ember-cli-deploy/) is a method for deploying ember applications that uses configurable adapters to manage the deployment workflow. The default adapters run `ember build`, upload the fingerprinted and/minified assets to S3, and the contents of the generated `index.html` to Redis.

The back-end then serves the `index.html` content from Redis. Note that this deployment method requires a catchall (glob) route to properly route everything back to the Ember app:

~~~
# config/routes.rb
Rails.application.routes.draw do
  namespace :api do
    # api routes
  end

  # catchall route - send all other requests to the Ember app.
  get '*everything', to: 'frontend#index'
end
~~~

~~~
# app/controllers/frontend.rb
class FrontendController < ApplicationController
  def index
    redis = Redis.new
    index_from_redis = redis.get("<your-project-name>:current")
    render html: index_from_redis.html_safe
  end
end
~~~

Additional information and documentation can be found at [http://ember-cli.github.io/ember-cli-deploy](http://ember-cli.github.io/ember-cli-deploy/).

#### Deploy it
Deploy the Ember app with `ember deploy --environment production`. When you're ready to make the newly deployed revision live, use `ember deploy:activate`.

### Alternatives
The [ember-cli user guide](http://www.ember-cli.com/user-guide/#deployments) lists a few alternative approaches, like Azure Websites and Firebase Hosting.

[ember-cli-rails](https://github.com/thoughtbot/ember-cli-rails) is an alternative way to run and build Ember apps. This approach integrates ember-cli into Rails and uses the Asset Pipeline. When using ember-cli-rails, the back-end and front-end cannot be deployed independently. The README for the project goes into more detail on how to [deploy to Heroku](https://github.com/thoughtbot/ember-cli-rails#heroku). We recommend this approach mainly as a way to migrate Rails applications iteratively to Ember, but some teams do adopt it as their main workflow.