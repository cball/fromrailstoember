---
title: Start with the URL
date: 2015-02-25 9:00am EST
number: 3
---

In Rails, the Router maps URLs directly to a controller action. We have a file in Rails called routes.rb that contains these mappings and determines our URL structure (HTTP Method, whether they are nested, parameters, etc).

Ember works a little bit differently. In the Ember Router (router.js), we don’t have to worry about HTTP methods. Parameters and nested URLs are dealt with in a similar way to Rails, but in Ember the Router maps URLs to a Route, NOT a Controller.

~~~ruby
# Rails
# GET /photos

# config/routes.rb
resources :photos

# app/controllers/photos_controller.rb
class PhotosController < ApplicationController
  def index
    @photos = Photo.all
  end
end
~~~

~~~javascript
// Ember
// GET /photos

// app/router.js
this.resource('photos');

// app/routes/photos.js
import Ember from 'ember';

export default Ember.Route.extend({
  model: function() {
    return this.store.find('photo');
  }
});
~~~

Make your application's URLs a first class citizen. Always start with the URL by adding it to the Ember Router, or using the Ember generators to do it for you. We'll discuss generators in later tips, but for now just know they are similar in concept to Rails generators. URLs drive application state, and as a result application decisions. Pay attention to them.
