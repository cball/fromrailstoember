---
title: Feel at Home with ember-cli
date: 2015-03-30 8:00am EST
number: 7
---

ember-cli is the command line interface for Ember. It handles running a development server, tests, build tooling, generators and more.

You’re used to something similar with the CLI provided by Rails, so many of the commands will be familiar.READMORE

Example CLI commands include:

~~~bash
# Rails
rails new myapp
rails server
rails generate model user
rails destroy model user
rake test or rspec spec
~~~

~~~bash
# Ember
ember new myapp
ember server
ember generate model user
ember destroy model user
ember test
~~~

### Generators
Like in Rails, generators exist to help you get started and follow conventions. If you use them, you won’t have to think about where a file should go, what it should be named, or worry about what things like `export default` mean right away.

Additionally, the generators will create a placeholder unit test for each generated item. Don’t forget to replace the placeholder tests with real ones!

### Tests
Running `ember test` will build your application and run your test suite using PhantomJS. Specific tests can be run with the `--filter` option. Most of the time, this command is used on a CI server.

There is also a browser-based test runner which can be used by navigating to `http://localhost:4200/tests`. This runner is faster than using `ember test` since file changes are compiled on-the-fly instead of building the entire suite from scratch on each test run. The browser-based runner provides a preview of the app during integration tests, which can be very helpful for tracking down test failures. This means no more calls to `save_and_open_screenshot` when debugging! It also provides a dropdown and text search if you need to run specific tests.

During development, it can be very helpful to keep two tabs open; one for your app and the other to run your tests.

### Additional Features
- **livereload** is a plugin used by ember-cli during development. It reloads the browser window every time a file is saved. If you’ve used guard with Rails, it works in a similar way. One great side benefit of livereload is that it forces you towards the “Ember Way” of using URLs to drive application state.
- **Http Mocks** give you the ability to completely mock out your API during development so you can focus on the front-end and avoid context switching. Http Mocks can be created using the generators: `ember g http-mock <endpoint name>`.
- **Addons** can be created using `ember addon my-addon`. Ember Addons are similar to Ruby Gems, and are useful for packaging up code for reuse in other projects. See [Ember Observer](http://emberobserver.com) for a scored, categorized list of Ember Addons.


As you might expect, you can run `ember help` or `ember help <command>` to get more information on any of the available commands in ember-cli. 