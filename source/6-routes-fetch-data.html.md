---
title: Routes Fetch Data
date: 2015-03-15 13:30 EST
number: 6
---

In Rails, controllers have the responsibility of fetching data with optional parameters defined from the URL. In Ember, this same responsibility falls to the route. READMORE

~~~ruby
# Rails
# config/routes.rb
Rails.application.routes.draw do
  resources :users              
end

# app/controllers/users_controller.rb
class UsersController < ApplicationController
  def show
    @user = User.find(params.id)
  end
end

~~~

~~~javascript
// Ember
// app/router.js
Router.map(function() {
  this.resource('user', { path: 'users/:user_id' });
});

// app/routes/user.js
export default Ember.Route.extend({
  model: function(params) {
    return this.store.find('user', params.user_id);
  }
});
~~~

**Routes in Ember fetch data** and then hand it off to a controller. Try to avoid fetching data in a controller; it’s the route’s responsibility to do so.

### Fetching Multiple Related Models
In Rails, because your code runs synchronously, you’re able to easily fetch data for multiple models in a controller where the second depends on the first:

~~~ruby
# Rails
# app/controllers/users_controller.rb
class UsersController < ApplicationController
  def show
    @user = User.find(1)
    @favorite_books = @user.books.where(favorite: true)
  end
end
~~~

In Ember, calls to `store.find` are asynchronous, so that approach will not work. Instead, you should use hooks defined on the route:

~~~javascript
// Ember
// app/routes/user.js
export default Ember.Route.extend({
  model: function() {
    return this.store.find('user', 1);
  },
  
  afterModel: function(model) {
    return model.get('favoriteBooks');
  }
});
~~~

There are a few reasons you might use the `afterModel` hook. One is to ensure the API call (and therefore the associated data) from the `model` hook is loaded. 

Another is to fetch additional data before finishing a transition. For example, let’s assume that we don’t want users to see a loading indicator while Ember is fetching favoriteBooks (an async relationship) from the API. Because Ember will wait until the `model` and `afterModel` hooks have resolved to finish a transition, we can be sure that they are loaded before the new template is rendered on the screen.