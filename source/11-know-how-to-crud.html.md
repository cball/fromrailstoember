---
title: Know how to CRUD
date: 2015-05-12 07:15 EST
number: 11
---

While there are some similarities to Rails, there a few differences to keep in mind when performing CRUD operations in Ember.

Let’s compare creating, updating and deleting a user in both frameworks.READMORE

### Creating a new User instance

~~~rb
# app/controllers/users_controller.rb
class UsersController < ApplicationController
  def new
    @user = User.new(first_name: 'The', last_name: 'Dude')
  end
end
~~~

~~~js
// app/routes/users/new.js
export default Ember.Route.extend({
  model() {
    return this.store.createRecord('user', {
      firstName: 'The',
      lastName: 'Dude'
    });
  }
});
~~~

If the ES6 syntax of `model()` is new to you, check out [Babel](http://babeljs.io/docs/learn-es6/#enhanced-object-literals). Babel is available in every ember-cli project.
{: .image-annotation}

In both cases, we create a new instance of a User but do not persist it. Persisting records to the database (or API) has some differences. In Rails we add a create action, create a new instance based on parameters that were passed, and then call `save` on it.

In Ember, we only need to add an action to our `users/new` route that saves the User record we're currently working with.

~~~rb
# app/controllers/users_controller.rb
class UsersController < ApplicationController
  
  # ...

  def create
    @user = User.new(user_params)
    if @user.save
      redirect_to(root_path)
    else
      render(:new)
    end
  end

  private

  def user_params
    params.require(:user).permit(:first_name, :last_name)
  end
end
~~~

~~~js
// app/routes/users/new.js
export default Ember.Route.extend({

  // ...

  actions: {
    saveUser(user) {
      user.save().then(() => {
        this.transitionTo('index');
      }).catch(() => {
        alert("couldn't save user.");
      });
    }
  }
}
~~~

If the ES6 syntax of `=>` is new to you, check out [Babel](http://babeljs.io/docs/learn-es6/#arrows). Babel is available in every ember-cli project.
{: .image-annotation}

### Updating user attributes

~~~ruby
# Rails
user.update_attributes(first_name: 'John', last_name: 'Wayne')
# => true
~~~

~~~js
// Ember
user.setProperties({ firstName: 'John', lastName: 'Wayne' });
// => <ember-app@model:user::ember901:2>
~~~

One key difference between `update_attributes` and `setProperties` is that `update_attributes` will automatically persist the record to the database, while `setProperties` will update the record immediately on the client but not attempt to save it.

We can verify this by checking the `isDirty` property, which is equivalent to the `changed?` method in Rails.

~~~js
// Ember
user.get('isDirty');
// => true
~~~

To actually save the record in Ember, we need to call `save`. Ember will make a PUT request to the API to persist the changes.

~~~js
// Ember
user.save();
~~~

### Rolling back changes
In Rails, we don't have to worry about removing new record instances if they shouldn't be persisted. In Ember, we do. For example, assume we have a new user form:

~~~rb
# app/controllers/users_controller.rb
class UsersController < ApplicationController
  def new
    @user = User.new email_list: true
  end

  def create
    @user = User.new(user_params)
    if @user.save
      redirect_to(root_path)
    else
      render(:new)
    end
  end

  private

  def user_params
    params.require(:user).permit(:email, :email_list)
  end

end
~~~

~~~erb
<% # app/views/users/new.html.erb %>
<%= form_for @user do |f| %>
  <%= f.email_field f.email %>
  <%= f.check_box f.email_list %> I want more email in my inbox.
  
  <div class="buttons">
    <%= f.submit_tag 'Join' %>
    <%= f.link_to 'Cancel', root_path %>
  </div>
<% end %>
~~~

If the _Cancel_ button is clicked, Rails will make a new request to the server, and the `@user` instance variable that was set in the `new` action will be discarded.

In [Tip #2](http://fromrailstoember.com/2-there-is-no-more-page-reload/), we learned that Ember applications are long-lived, and will not clear state when transitioning to a new route. To get the equivalent behavior in Ember, we need to discard changes if the _Cancel_ button is clicked.

Since we also need to discard changes when the user navigates elsewhere in the application (by clicking on a link for example), we should use the `willTransition` hook of the route along with `user.rollback`. Rollback will discard any changes on the client that have not been saved.

~~~js
// app/routes/users/new.js
export default Ember.Route.extend({
  model() {
    return this.store.createRecord('user', {
      email_list: true
    });
  },
  
  actions: {
    willTransition() {
      let user = this.controller.get('model');
      user.rollback();
    },

    createUser(user) {
      // handle save
    }

    cancel() {
      this.transitionTo('index');
    }
  }
});
~~~

If the ES6 syntax of `let` is new to you, check out [Babel](http://babeljs.io/docs/learn-es6/#let-const). Babel is available in every ember-cli project.
{: .image-annotation}

~~~hbs
{{! app/templates/users/new.hbs }}
<form {{action 'createUser' user on='submit'}}>
  {{input type="email" value=user.email}}
  {{input type="checkbox" checked=user.emailList}}

  <input type="submit" value="Join">
  <button {{action 'cancel'}}>Cancel</button>
</form>
~~~

### Deleting a user
To delete a record in Rails the `destroy` method is used. In Ember, the equivalent function is `destroyRecord`, which marks a record as deleted and immediately calls `save` on it. In case the destroy fails, it is a good idea to use `catch` along with `reload` to refresh the state of the model from the server.

~~~javascript
export default Ember.Route.extend({
  
  // ...

  actions: {
    deleteUser: function(user) {
      user.destroyRecord().then(() => {
        this.transitionTo('index');
      }).catch((reason) => {
        user.reload();
      });
    }
  }
});
~~~

Ember models also have a function called `deleteRecord`. Like `destroyRecord`, the record will be marked as deleted. The difference is that `save` will not be called afterwards. You can combine `deleteRecord` with `rollback` to get basic undo delete functionality in your application.


