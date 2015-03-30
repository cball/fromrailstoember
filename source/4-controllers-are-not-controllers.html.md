---
title: Controllers Are Not Controllers
date: 2015-03-01 9:00am EST
number: 4
---

Controllers in Rails and controllers in Ember have quite a few differences. In Rails, controllers are responsible for fetching data from your models. As a Rails developer, you’ve probably heard the phrase “fat models skinny controllers.” This mantra works great in the Rails ecosystem but is the opposite of what you’ll do in Ember.

In Ember, the **route fetches data** and provides it to the controller. It is the controller’s responsibility to manage application state after the hand-off.

Here’s an example:

~~~ javascript
// app/routes/categories/index.js
export default Ember.Route.extend({
  model: function() {
    return this.store.find('category');
  }
});

// app/controllers/categories/index.js
export default Ember.Controller.extend({
  filterSort: ['name'],
  sortedCategories: Ember.computed.sort('model', 'filterSort'),

  actions: {
    setSelectedCategory: function(category) {
      this.set('selectedCategory', category);
    }
  }
});
~~~

This example fetches categories from an API. The route fetches data using the `model` hook, which by default will set the returned value to a property called `model` on the controller.

From there, the controller takes the data and computes a list of categories sorted alphabetically by `name`. When a user selects a category from our UI, we keep track of state by calling an action that saves the selected category as a property on the controller.
