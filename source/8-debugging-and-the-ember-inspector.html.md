---
title: Debugging & the Ember Inspector
date: 2015-04-07 07:00 EST
number: 8
published: true
---

When things go wrong in an application, you need ways to debug the problem. Ember comes with a few tools that work like their Rails counterparts, and one additional tool that’s very powerful.READMORE

In Rails debugging is done using:

- `logger.debug` statements
- A debugger such as `pry` or `byebug`
- View helpers to dump object data into a view

In Ember debugging is done using:

- `console.log` statements
- The `debugger` command
- Template helpers to log messages or start a debugger
- The Ember Inspector

### Log Statements
Log statements are a way to quickly check the contents of a variable, or debug code without pausing execution.

~~~ruby
# Rails
Rails.logger.debug(@article)

# Ember
console.log(article);
~~~

These commands work the same way in both frameworks.

### Debuggers
In Rails, `pry` and `byebug` are debuggers installed as gems that can be used to pause execution and inspect the current state of the code. You use them by placing `binding.pry` or `byebug` in your code:

~~~ruby
# app/controllers/users_controller.rb
def show
  user = User.find(1)
  # example pry usage
  binding.pry
end

> user.first_name
# "Dave"
~~~

Because Ember is a client-side framework, we can use the debugger provided by the browser’s Developer Tools.

The Developer Tools debugger includes a callstack, step over/in/out navigation, variables that are currently in scope, and more.

The **“pause on uncaught exceptions”** setting in the debugger can be helpful to help catch errors as they happen. 

![Debugger Window](http://fromrailstoember.s3.amazonaws.com/debugging/debugger.png)
{: .more-margin}

Values can be set and manipulated in the console pane/window.

### View and Template Helpers
Rails provides view helpers that can be used to show the contents of an object on the page. Since the text is inserted into the final HTML output though, it can impact page layout.

~~~erb
<%= debug @article %>
<% # shows a YAML representation of article %>

my articles: <%= @articles.inspect %>
<% # shows the @articles array as a string %>
~~~

Because the Handlebars templates that you use in Ember only allow minimal logic, you don’t have access to the standard `console` or `debugger` commands. Instead, helpers are provided that wrap them. The output from these helpers is not rendered into the final HTML.

~~~handlebars
{{log "my articles:" articles}}
{{! shows info in the console using console.log }}
~~~

~~~handlebars
{{debugger}}
{{! starts a debugger session in the context of this template }}
{{! > get('article') }}
~~~

The [debugger helper documentation](http://emberjs.com/api/classes/Ember.Handlebars.helpers.html#method_debugger) gives more detail on how to use it.

### The (Amazing) Ember Inspector
The Ember Inspector gives you a real-time view into the state of an Ember application. It allows you to see what templates and routes are currently loaded, inspect models, components and controllers, check render performance, and more. It’s a huge win for debugging and developer productivity.

Click almost any item in the main pane, and a side pane will appear containing more information. Change a value in the side pane, and it will be immediately reflected in the app. Click `$E` next to an item to set it as `$E` in the console. You can then manipulate it or call methods to debug.

~~~javascript
$E.get('topItems.firstObject.name')
// > "Some Top Item’s Name"
~~~

Keep in mind that the Ember Inspector can be used on any Ember app, not just the one you’re working on. It can be a great way to see how an app is structured.

![Ember Inspector](http://fromrailstoember.s3.amazonaws.com/debugging/ember_inspector.png)

(the Ember Inspector running on skylight.io)
{: .image-annotation}


