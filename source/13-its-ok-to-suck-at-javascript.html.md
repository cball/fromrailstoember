---
title: It's OK to Suck at JavaScript
date: 2015-06-25 7:40 EST
number: 13
---

Many Rails developers do not have heavy JavaScript experience. In Rails, we typically build out a page and wire interactivity together with jQuery. When snippets of jQuery get unmanageable, we might make classes using something like CoffeeScript.READMORE

When moving to Ember (or any JavaScript framework) for the front-end, you need to understand some JavaScript functions and patterns, especially if you've never used a JavaScript framework before. The goal of this tip is to help introduce and clarify some of those functions and patterns you'll come across using Ember. And if you feel like you suck at JavaScript right now, don't worry. Ember's conventions and strong community will help you level up.


### Most Ember code you write defines properties on an object
When defining things like a `model` hook in a route, adding a default value in a component, or adding actions, keep in mind you're just adding properties that will be available on instances of that object.

These properties can be values or functions. Here are a few examples:

~~~js
export default Ember.Route.extend({
  model() {},
  someProp: 'foo',
  anotherProp: Ember.computed('someProp', function() {}),

  actions: {
    saveUser() {}
  }
});
~~~

`model()` and `saveUser()` are shorthands for `model: function()` and `saveUser: function()`. See [Babel](http://babeljs.io/docs/learn-es2015/#enhanced-object-literals) .
{: .image-annotation}

### Almost everything else involves functions
In addition to writing properties that are functions, you'll also write stand-alone functions.

It is good practice to break long functions into smaller utility functions, just like you would break long Ruby methods into smaller ones. Functions are often placed in `app/utils`. They can also be placed in the same file as an Ember object, just outside of the object definition.

If you'd like to group multiple functions into one file, just export them by name.

~~~js
// example utility function
// app/utils/do-stuff.js
export function doStuff() {
  // do stuff
}
~~~

~~~js
// example function inside route file
// app/routes/some-route.js
export default Ember.Route.extend({
  actions: {
    doStuff(stuff) {
      calculateStuff(stuff);
    }  
  }
});

function calculateStuff(stuff) {
  // do stuff
}
~~~

~~~js
// example utility function with named exports
// app/utils/calculations.js
export function sum(...args) {
  // sum them
}

export function multiply(...args) {
  // multiply them
}
~~~

To import a non-default export, use the curly brace syntax:

~~~js
import { sum, multiply } from '../../utils/calculations';
~~~

You can also change the name being imported:

~~~js
import { sum as addItUp } from '../utils/calculations';
~~~

### Understand this
The `this` keyword inside an Ember object's definition is somewhat similar to `self` in a Ruby class. In Ruby, `self` is implicit and therefore optional when calling instance methods.

~~~rb
class Thing
  def initialize
    # explicit self
    self.say_something

    # implicit self
    say_something
  end

  def say_something
    puts 'something'
  end
end
~~~

In Ember, `this` is required to call functions on the instance of an object.

~~~js
// app/models/thing.js
export default Ember.Object.extend({
  init() {
    this.saySomething();
  },

  saySomething() {
    console.log('something');
  }
})
~~~

By default, `this` will refer to the top level `Window` object. When inside of an Ember object, `this` will refer to an instance of that object.

#### Some JavaScript functions will change the scope of this
`map`, `filter`, and `forEach` are examples of functions that change the scope of `this` when iterating over items. When iterating, the scope of `this` will be the top level `Window` object, and will no longer refer to the Ember object you're working with.

~~~js
export default Ember.Component.extend({
  rankedThings: Ember.computed('things', function() {
    let things = this.get('things');
    things.filter(function(thing) {
      // error (this refers to Window)
      let coords = this.get('currentCoords');
      return this._isNearby(thing, coords);
    });
  }),

  _isNearby(thing, coords) {
    // check if thing is nearby
  }
});
~~~

To keep the scope of `this`, use the `=>` operator to define the function:

~~~js
things.filter((thing) => {
  let coords = this.get('currentCoords');
  return this._isNearby(thing, coords);
});
~~~

Only use `=>` when you need to keep the same outer context of `this`. `=>` is not a 1-to-1 replacement for `function`.
{: .image-annotation}

### Know what prototype is
You'll likely never use prototype directly, but it is helpful to understand it. Since JavaScript doesn't use traditional classes (though ES2015 classes [add it as a syntactic sugar](http://babeljs.io/docs/learn-es2015/#classes)), prototype is used to offer class-like functionality and inheritance. All objects have a prototype. Properties can be defined on an object's prototype, and all instances of that object will have those properties defined when they are created. Objects that inherit from each other get all of the properties of the parent's prototype. For example, `Ember.Object` defines `get` and `set`, and those properties are available on routes, components, controllers, and models because they all inherit from `Ember.Object`.

When you use `Ember.Route.extend()` or add a mixin to an object you are modifying the prototype for that object.

~~~js
// app/mixins/edible.js
import Ember from 'ember';

export default Ember.Mixin.create({
  isEdible: true
});

// app/models/fruit.js
import DS from 'ember-data';
import Edible from '../mixins/edible';

export default DS.Model.extend(Edible, {
  name: DS.attr('string');
});

// app/models/banana.js
import Fruit from './fruit';

export default Fruit.extend({
  name: 'banana'
});
~~~

If we create a new object and log it to the console, we can see all of the methods from `Ember.Object` as well as our `name` and `isEdible` properties.

~~~js
> console.log(Banana.create());

{
  // ...
  init: function () {},
  isDestroyed: false,
  isDestroying: false,
  isEdible: true,
  name: "banana",
  // ...
}
~~~



### What the heck are .apply and .call?
Both of these are used to invoke JavaScript functions, passing along the context for `this` as the first argument. The difference is that `call` takes a list of arguments and `apply` takes an array.

~~~js
// example usage of apply
export default Ember.Object.extend({
  things: [1, 2, 3, 4],

  smallestThing: Ember.computed('things.[]', function() {
    let things = this.get('things');
    return Math.min.apply(this, things);
  })
});


// example usage of call
function formattedMax() {
  let format = this.get('formatOption');
  let max = Math.max.call(this, arguments);

  return numeral(max).format(format);
}

let object = Ember.Object.create({
  formatOption: '0.0%'
});

formattedMax.call(object, 1, 3, 5);
~~~

`Apply` is typically used more often than `call`, but it is helpful to understand them both.


### How to call a dynamic function
In Ruby, you can call a dynamically named function using `send`. In JavaScript, you use bracket notation:

~~~js

// app/models/person.js
const AGE_GROUPS = [
  'child',
  'teenager',
  'adult'  
];

export default Ember.Object.extend({
  init() {
    this._super();
    let ageGroup = this.get('ageGroup');
    Ember.assert('bad age group', AGE_GROUPS.contains(ageGroup));
    this[`sayHi${ageGroup}`]();
  },

  sayHi() {
    waveHand();
    console.log('hi');
  },

  sayHiChild() {
    waveHand();
    console.log('hi child');
  }
});

// usage
let person = Person.create({
  ageGroup: 'child'
})
~~~

### Arguments to functions aren't required
JavaScript is more relaxed with function arguments than Ruby is with method arguments. In Ruby, the following will cause an error:

~~~rb
def say_something
  puts 'hi'
end

> say_something 'else'
# ArgumentError: wrong number of arguments (1 for 0)
~~~

JavaScript is perfectly happy being passed additional arguments, which can be accessed using the arguments keyword.

~~~js
function saySomething() {
  console.log(arguments);
}

> saySomething('else');
// [object Arguments] {
//   0: "else"
// }
~~~

In Ember, with the default jshint configuration, you will get a warning when defining unused variables. This is because arguments to functions should not be defined if they won't be used.

~~~js
export default Ember.Route.extend({
  model(params) {
    // this doesn't use params and will cause a jshint warning
    return this.store.find('user');
  }
});

export default Ember.Route.extend({
  model() {
    return this.store.find('user');
  }
})
~~~

It's ok if you feel like you suck at JavaScript right now. You'll be on your way to mastering it in no time.
