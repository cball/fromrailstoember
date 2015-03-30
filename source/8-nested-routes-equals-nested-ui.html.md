---
title: Nested Routes = Nested UI
date: 2015-03-22 10:30 EST
number: 8
published: false
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

When defining your routes in Ember, there is one very important thing to keep in mind. You should **only nest your routes if your UI is nested**.

Ember has powerful conventions around nested routes. One of those conventions is to render the template of a child route into the `outlet` of it’s parent. If you’re not yet familiar with outlets in Ember templates, they are similar to `yield` in Rails views.

This convention allows you to trivially create complicated nested layouts, that would require the use of `content_for` with a lot of manual management in Rails.

To illustrate how this works, here’s a simple UI for showing band’s albums:

![asdf](http://fromrailstoember.s3.amazonaws.com/nested-ui/nested-album-ui.gif)

Here’s how you might implement part of that in Ember:

~~~javascript
// config/router.js
App.Router.map(function() {
  this.resource('artist', { path: 'artists/:artist_id' }, function() {
    this.resource('albums', function() {
      this.resource('album', { path: '/:album_id' }, function() {});
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
    {{#link-to 'albums' tagName="li"}}
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
    {{#link-to 'album.index' album.id tagName="li"}}
      <img {{bind-attr src="album.image"}}/>
    {{/link-to}}
  {{/each}}
</ul>

{{! app/templates/album.hbs }}
<h4>Album info for {{model.name}}</h4>
~~~

Because the `album` route is a child of the `albums` route, which itself is a child of the `artist` route, all of these templates are rendered into the main outlet when viewing an album.

### Move routes top level if the UI isn’t nested.
Let’s say we don’t want to show the artist name and tab UI from above when viewing an album. To make that happen, move the `album` route to the top level in our router.

~~~javascript
// config/router.js
App.Router.map(function() {
  this.resource('artist', { path: 'artists/:artist_id' }, function() {
    this.resource('albums', function() {});
  });
  this.resource('album', { path: '/albums/:album_id' }, function() {});
});
~~~

Ember will render the `album` template into the `main` outlet, replacing the artist name and tab UI that is defined in the `artist` template.

If you still want to keep the URL nested, add another dynamic segment to the `album` route’s path option and pass the additional argument in the `link-to` call.

### Ember URLs and API URLs don’t need to match.
Keep in mind that all of this is completely independent from the URLs of your API resources. Even if your API URLs are nested, it does not necessarily mean that your Ember routes should be.

