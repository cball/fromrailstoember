---
title: Controllers are not Controllers
date: 2015-02-16 01:45 UTC
number: 4
---

Controllers in Rails and controllers in Ember have quite a few differences. In Rails, controllers are responsible for fetching data from your models. As a Rails developer, you’ve probably heard the phrase “fat models skinny controllers.” This mantra works great in the Rails ecosystem but is the opposite of what you’ll do in Ember.

In Ember, controllers are responsible for maintaining application state. Remember, the **route fetches data** and provides it to the controller. It is the controller’s responsibility to manage state after the hand-off.

Here’s a practical example:

``` javascript
// app/routes/some-route.js
export default Ember.Route.extend({
  model: function() {  
    return this.store.find('filter-option');
  }
});

// app/routes/some-controller.js
export default Ember.Controller.extend({
  filterSort: ['name'],
  sortedFilterOptions: Ember.computed.sort('model', 'filterSort'),

  actions: {
    setSelectedFilter: function(filter) {
      this.set('selectedFilter', filter);
    }
  }
});
```

This example fetches filter options from an API to populate a dropdown. The route fetches data via the `model` hook, which by default will set the returned value to a property called `model` on the controller.

From there, the controller takes the data and sorts it alphabetically by a `name` property to set things up for display. Our controller also has an action that will set a property called `selectedFilter`, keeping track of what the user has selected in the filter dropdown.