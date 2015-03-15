---
title: You Already Understand Models
date: 2015-03-08 08:00 EST
number: 5
---

Models in Rails and models in Ember look pretty similar. The major difference is that models in Ember typically hold attribute information, relationship information, and a few computed properties. In Rails models often contain more logic.

In both frameworks, models:

* Define Relationships
* Coordinate Persistence
* Handle Validation Errors

In Rails, these responsibilities are handled by ActiveRecord and in Ember they are handled by Ember Data.

### Defining Relationships
When defining relationships in Ember models, you’ll follow a similar process to Rails:

~~~ruby
# Rails
# app/models/user.rb
class User < ActiveRecord::Base
  has_many :orders
  has_many :shirts, through: :orders
  belongs_to :account
  belongs_to :favorite_item, polymorphic: true
end
~~~

~~~javascript
// Ember
// app/models/user.js
import DS from 'ember-data';

export default DS.Model.extend({
  orders: DS.hasMany('order'),
  shirts: DS.hasMany('shirt'),
  account: DS.belongsTo('account', { async: true }),
  favoriteItem: DS.belongsTo('favoriteItem', { polymorphic: true }) 
});
~~~

Syntax differences aside, Ember Data supports most of the same relationship types that Rails does. The major difference is the usage of `async: true`, which tells Ember Data to fetch the data for the relationship (in this case Account) as a separate API call when it is needed. Without `async: true`, Ember Data would expect the Account JSON to be included in the User JSON payload.

Ember Data also has [other](http://emberjs.com/guides/models/defining-models/#toc_explicit-inverses) [ways](http://emberjs.com/guides/models/defining-models/#toc_reflexive-relation) to define more complicated relationships.

### Coordinating Persistence
In Rails, records are persisted to a database and in Ember records are persisted to an API. Technically, when calling `model.save()`, Ember Data uses an adapter to determine how to make the network request and serialize attributes to JSON. Since we’re focusing on models, let’s ignore that detail for now and compare how we would update a user’s name.

~~~ruby
# Rails
user = User.find(1)
user.update_attributes({ first_name: 'The', last_name: 'Dude' })
~~~

~~~javascript
// Ember
var user = this.store.find('user', 1);
user.setProperties({ firstName: 'The', lastName: 'Dude' });
user.save();
~~~

Just like in Rails, when `save()` is called, Ember Data knows if the record needs to be created or updated. If the record needs to be created, Ember Data will issue a **POST** request to the API with the relevant parameters from the record. If the record needs to be updated, a **PUT** request will be issued instead. 



### Handling Validation Errors

When calling `save()`, the server may return errors describing what went wrong. Ember Data provides support for these errors out of the box[^active-model-adapter]. Let’s look at how to log out error messages from a failed save of a user record:

[^active-model-adapter]: Errors are supported out of the box if you use the `ActiveModelAdapter` in your application. Since you’re coming from Rails and likely using it for your API, your app should use this adapter.

~~~ruby
# Rails
user = User.find(1)
user.first_name = nil
user.save()
# => false
user.errors.messages
# => {first_name:["can’t be blank"]}
~~~

~~~javascript
// Ember
var user = this.store.find('user', 1);
user.set('firstName', null);
user.save().catch(function() {
  var errors = user.get('errors.firstName');
  console.log(errors);
});
// [{attribute: "firstName", message: "can't be blank"}]
~~~

When Ember receives an error response (anything not in the 2xx range) from an API after calling `save()`, it will throw an error. This behavior is similar to calling `save!` in Rails. Chaining `catch()` on the end of `save()` will allow you to handle the error.
 
Models in Ember have many similarities and some minor differences to their Rails counterparts. As a Rails developer, you probably already understand them!

