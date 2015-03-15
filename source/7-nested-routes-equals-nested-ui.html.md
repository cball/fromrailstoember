---
title: Nested Routes = Nested UI
date: 2015-03-22 10:30 EST
number: 7
draft: true
---

1. Always try to fetch data in the route, not the controller. Use the provided model hooks (model, afterModel).
1. Use routes to set up application state and pass it down to the controller. Use the `setupController` hook for this.
