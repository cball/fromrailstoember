---
title: Routes Fetch Data
date: 2015-03-10 09:00 EST
number: 5
---

1. Always try to fetch data in the route, not the controller. Use the provided model hooks (model, afterModel).
1. Use routes to set up application state and pass it down to the controller. Use the `setupController` hook for this.
