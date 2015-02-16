---
title: There is No More Page Reload
date: 2015-02-11 01:44 UTC
number: 2
---

In any server rendered framework, page reloads clear state. Your app might have sections that contain a lot of AJAX, but for the most part you start with a fresh state every time a user clicks a link. Not so with a client-side framework.

In Ember, Controllers are Singletons, which means they are long-lived and they are reused. When you click a link and go to another page, the controller is not torn down. It keeps all of of its current properties. If you load a different model into an Ember controller, the model is replaced, and the properties related to it are updated. The controller is still the same instance. This is more in line with a native Desktop application than a server rendered application.

Most of the time, this is good - imagine implementing something like a multi-step wizard. Because of the above behavior, a user could navigate to another page, hit the back button and be right back where they left off.

However, it's also good to keep this behavior in the back of your mind. Since Ember apps having long-running state, it's easier to run into visual bugs where incorrect (usually previous) state displays to the user.

You're also a bit more likely to run into memory issues. If you happen to have a memory leak somewhere in your app, it will impact user performance until they reload the page. We don't have the benefit of starting fresh with every request.

Remember, Ember Controllers are Singletons, just keep it in mind as you develop your app.