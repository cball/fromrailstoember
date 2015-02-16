---
title: Forget the Word “View”
date: 2015-02-16 05:37 UTC
number: 5
---

In Rails a view is typically written in erb. In Ember, these are called templates and are written in Handlebars.

When talking about html and rendering, always use the term template. Views are something entirely different and are essentially deprecated.

If you see tutorials online with `Ember.View.extend`, for the most part you can safely assume they are outdated. If you are working on a project that has views, you will want to rewrite them to be components. 
