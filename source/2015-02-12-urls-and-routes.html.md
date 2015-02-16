---
title: URLs and Routes
date: 2015-02-12 01:44 UTC
number: 3
---

In Rails, the Router maps URLs directly to a controller action. We have a file in Rails called routes.rb that contains these mappings and determines our URL structure (HTTP Method, whether they are nested, parameters, etc).

Ember works a little bit differently. In the Ember Router, we don’t have to worry about HTTP methods. Parameters and nested URLs are dealt with in a similar way to Rails, but in Ember the Router maps URLs to a Route, NOT a Controller.

Rails:
URL -> Router -> Controller

Ember:
URL -> Router -> Route

Here are the top items to remember with regards to URLs and Routes:

1. Always start with the URL by adding it to the Ember Router, or using the Ember generators to do it for you. We'll discuss generators more in-depth later, but they are similar to Rails generators. In Ember, URLs drive application state, and as a result application decisions.
1. Always try to fetch data in the route, not the controller. Use the provided model hooks (model, afterModel).
1. Use routes to set up application state and pass it down to the controller. Use the `setupController` hook for this.
