---
title: Take Time to Understand Promises
date: 2015-05-12 07:14 EST
number: 10
---

Promises are a JavaScript specific feature that don’t have a direct comparison in Rails. Promises are a way to deal with async behavior and can be thought of as an _eventual value_.

Ember makes heavy use of promises through the [RSVP.js](https://github.com/tildeio/rsvp.js/) library, so it helps to understand them.

### Using promises
Promises are most commonly used by chaining a `then` function after the promise. For example:

~~~js
let promise = new Ember.RSVP.Promise((resolve, reject) => {
  // do some stuff
  if (success) {
    resolve(thing);
  } else {
    // do other stuff
    reject(error);
  }
});

promise.then((thing) => {
  // do something with thing
}, (error) => {
  // log error
});
~~~

If the ES6 syntax of `let` or `=>` is new to you, check out [Babel](http://babeljs.io/docs/learn-es6/#enhanced-object-literals). Babel is available in every ember-cli project.
{: .image-annotation}

The `then` function can take 2 arguments; a function called on success and a function called on failure. Usually, you’ll want to use `catch` instead and only pass a success function to `then`. If `catch` is used, it will handle a rejected promise as well as any other errors similar to a JavaScript try/catch.

~~~js
promise.then((thing) => {
  // success
}).catch((error) => {
  // log error
});
~~~

Promises can also be chained:

~~~js
promise.then(thing) => {
  return new Ember.RSVP.Promise((resolve) => {
    let another = doStuff();
    resolve(another);
  });
}).then((another) => {
  // do something with another
}).catch((error) => {
  // log error
});
~~~

### Promises used in Ember
Most of the store methods in Ember return promises: `filter`, `find`, `fetch`, `fetchAll`, and `fetchById`.

Here’s an example using `find`:

~~~js
this.store.find('user', 1).then((user) => {
  console.log(user.get('name'));
}); 
~~~

Any model relationship marked as `async: true` will also return a promise, so you’ll need to access it in a similar way:

~~~js
// app/models/user.js
export default Ember.Model.extend({
  favoriteSongs: DS.hasMany('favoriteSong', { async: true }),
  pets: DS.hasMany('pet')
});

// app/models/song.js
export default Ember.Model.extend({
  album: DS.belongsTo('album', { async: true })
});

// app/controllers/user.js
export default Ember.Controller.extend({
  petNames: Ember.computed('model', function() {
    let pets = this.get('model.pets');

    return pets.mapBy('name');
  }
});

// app/routes/album-list.js
export default Ember.Route.extend({
  model() {
    let user = this.store.find('user', 1);

    return user.get('favoriteSongs').then((songs) => {
      return songs.mapBy('album');
    });
  }
});
~~~

If the ES6 syntax of `model()` is new to you, check out [Babel](http://babeljs.io/docs/learn-es6/#enhanced-object-literals). Babel is available in every ember-cli project.
{: .image-annotation}

### Using promises in model hooks

`model` and `afterModel` are special hooks in an Ember Route that make use of promises. Like in the previous example, if you return a promise in either of these hooks, Ember will pause the transition (wait to render the page) until they have resolved.

