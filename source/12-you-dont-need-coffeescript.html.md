---
title: You Don't Need CoffeeScript
date: 2015-06-04 9:00 EST
number: 12
---

Because CoffeeScript is installed by default in Rails, you might be tempted to use it in your Ember app. Unfortunately, CoffeeScript brings a few annoyances and can cause problems for Ember developers. If you instead use the features provided by ES6 (the next version of JavaScript), you probably won't even miss it.READMORE

### CoffeeScript Gotcha #1 - Implicit Returns

CoffeeScript, like Ruby, returns the last line of a function. This lets you avoid writing the word `return`. In Ember this can cause problems in actions. When a truthy value is returned in an action in Ember, it causes the action to bubble.

~~~coffee
# routes/application.coffee
ApplicationRoute = Ember.Route.extend
  actions:
    doSomething: ->
      @set 'something', 'done'
~~~

In this example, `@set` returns the Application Route instance, so it is considered truthy. As a result, the action will bubble up to the parent route until it is handled. If you do not want that behavior, you must add a return statement as the final line to avoid the implicit return.

~~~coffee
# routes/application.coffee
ApplicationRoute = Ember.Route.extend
  actions:
    doSomething: ->
      @set 'something', 'done'
      return
~~~

Here's the same action in JavaScript (using ES6 syntax):

~~~js
// routes/application.js
export default Ember.Route.extend({
  actions: {
    doSomething() {
      this.set('something', 'done');
    }
  }
});
~~~

### CoffeeScript Gotcha #2 - The code you debug is different than the code you write

When learning a framework, you're going to do a lot of debugging. If you write your app in CoffeeScript, the final source code that runs in the browser will be JavaScript. You'll have additional mental overhead converting between source and output while trying to trace down a bug.

By using JavaScript instead, you'll remove that additional overhead. The code you write is essentially the code you debug.

There is a long-standing [open issue](https://github.com/kimroen/ember-cli-coffeescript/issues/7) to provide CoffeeScript sourcemaps in ember-cli.
{: .image-annotation}

### CoffeeScript Gotcha #3 - Module imports and exports require more code

An ember application using ember-cli will make heavy use of ES6 modules. That means you'll have a lot of lines that look like this:

~~~js
import Ember from 'ember';

export default Ember.Route.extend();
~~~

CoffeeScript does not natively understand ES6 imports and exports, so you have to use backticks to escape them. Additionally, you must set the module as a variable before you export it:

~~~coffee
`import Ember from 'ember'`

ApplicationRoute = Ember.Route.extend()

`export default ApplicationRoute`
~~~

An additional addon [ember-cli-coffees6](https://github.com/alexspeller/ember-cli-coffees6) can be installed to allow you to write the standard syntax.
{: .image-annotation}


### ES6 equivalents to CoffeeScript Features

#### String Interpolation

A major gripe a lot of developers have about JavaScript (and one reason why they use CoffeeScript) is that JavaScript has no string interpolation. ES6 fixes that:

~~~js
// js version
'Hey ' + person.firstName + ','
~~~

~~~es6
// es6 version
`Hey ${person.firstName},`
~~~

#### Fat Arrows

Fat arrows are used in CoffeeScript to keep the outer context of `this` when defining functions. ES6 provides the same thing:

~~~coffee
# routes/people.coffee
people.map (person) =>
  thing = @get 'thing'
  person.doSomething(thing)
~~~

~~~js
// routes/people.js
people.map((person) => {
  let thing = this.get('thing');
  person.doSomething(thing);
});
~~~

#### Function Keyword Shorthand

There is no skinny arrow function in ES6, only the fat arrow. However, there is a function shortcut you can use when defining a property that contains a function (which you do frequently in Ember):

~~~coffee
# routes/application.coffee
ApplicationRoute = Ember.Route.extend
  model: (params) ->
    @store.find 'person', params
~~~

~~~js
// routes/application.js
export default Ember.Route.extend({
  model(params) {
    return this.store.find('person', params);
  }
});
~~~

#### Destructuring Assignment

The syntax for destructuring is almost identical in CoffeeScript and JavaScript. One use of destructuring is to set multiple variables to their corresponding property names from an object:

~~~coffee
# models/person.coffee
{ attr, hasMany } = DS

Person = DS.Model.extend(
  firstName: attr('string'),
  friends: hasMany('friend')
)

`export default Person`
~~~

~~~js
// models/person.js
let { attr, belongsTo } = DS;

export default DS.Model.extend({
  firstName: attr('string'),
  friends: hasMany('friend')
})
~~~

Due to some gotchas when using CoffeeScript and equivalent functions provided by ES6, you probably don't need it on your Ember project. In fact, you might not even miss it.

If you still really want to use CoffeeScript, there is an [addon](https://github.com/kimroen/ember-cli-coffeescript) to make it work with ember-cli.
{: .image-annotation}
