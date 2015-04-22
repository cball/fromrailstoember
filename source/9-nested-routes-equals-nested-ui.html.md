---
title: Nested Routes = Nested UI
date: 2015-04-22 8:45 EST
number: 9
---

When defining routes in Rails, related resources are almost always grouped together by nesting them.

~~~ruby
# config/routes.rb
resources :artist do
  resources :albums do
    resources :album
  end
end
~~~

When defining your routes in Ember, there is one very important thing to keep in mind. You should **only nest your routes if your UI is nested**.READMORE

Ember has powerful conventions around nested routes. One of those conventions is to render the template of a child route into the `outlet` of it’s parent. If you’re not yet familiar with outlets in Ember templates, they are similar to `yield` in Rails views.

This convention allows you to trivially create complicated nested layouts, that would require the use of `content_for` with a lot of manual management in Rails.

To illustrate how this works, here’s a simple UI for showing band’s albums:

![asdf](http://fromrailstoember.s3.amazonaws.com/nested-ui/nested-album-ui.gif)

Here’s how you might implement part of that in Ember:

~~~javascript
// config/router.js
App.Router.map(function() {
  this.route('artist', { path: 'artists/:artist_id' }, function() {
    this.route('albums', function() {
      // since we passed a function, index is generated for us
      this.route('album', { path: '/:album_id' });
    });
  });
});
~~~

~~~handlebars
{{! app/templates/artist.hbs }}
<h2>{{model.name}}</h2>
<div>
  <!-- Nav tabs -->
  <ul class="nav nav-tabs">
    {{#link-to 'albums' tagName='li'}}
      <a href="#">Albums</a>
    {{/link-to}}
  </ul>

  <!-- Tab panes -->
  <div class="tab-content">
    <div class="tab-pane active">
      {{outlet}}
    </div>
  </div>
</div>

{{! app/templates/albums/index.hbs }}
<ul>
  {{#each model.albums as |album|}}
    {{#link-to 'album.index' album.id tagName='li'}}
      <img src={{album.image}}/>
    {{/link-to}}
  {{/each}}
</ul>

{{! app/templates/album.hbs }}
<h4>Album info for {{model.name}}</h4>
~~~

Because the `album` route is a child of the `albums` route, which itself is a child of the `artist` route, all of these templates are rendered when viewing an album.

![Templates](http://fromrailstoember.s3.amazonaws.com/nested-ui/templates.png)
{: .text-center}

(nested templates rendered when viewing the album route)
{: .image-annotation}

Since Ember automatically adds an `active` class to links when their corresponding route is active, our “Albums” tab will have the correct styling when viewing any route under it.

### Move routes up a level if the UI isn’t nested.
Let’s say we don’t want to show the artist name and tab UI from above when viewing an album. To make that happen, move the `album` route to the top level in the Router.

~~~javascript
// config/router.js
App.Router.map(function() {
  this.route('artist', { path: 'artists/:artist_id' }, function() {
    this.route('albums', function() {});
  });
  this.route('album', { path: '/albums/:album_id' }
});
~~~

By doing this, Ember will render the `album` template into the `default` outlet in the `application` template, replacing the artist name and tab UI that is defined in the `artist` template.

If you still want to keep the URL nested, add another dynamic segment for `artist_id` to the `album` route’s path option.


### Ember URLs and API URLs don’t need to match.
When deciding to nest routes, think of the Router as describing your interface rather than a URL structure.

Keep in mind that routes in Ember are completely independent from the URLs of API resources. Even if your API URLs are nested, it does not necessarily mean that your Ember routes should be.

