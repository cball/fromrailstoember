---
title: Bring Your Ruby Refactoring Brain
date: 2015-08-16 8:00 EST
number: 14
---

Ruby/Rails introduced many of us to great refactoring patterns; most of which have been around much longer than the language itself. Refactoring code in Ember can be daunting if you've never done it before, but you'll find that many of these patterns still apply.READMORE

With all refactoring, you should ensure you have a good test suite in place. If not, you should create tests first to ensure the refactoring does not break anything.

Let's look at some refactoring patterns you might use in Ember.

### Replace long functions with many shorter ones
Logical blocks inside functions can be replaced with computed properties, stand-alone functions, or functions that are a property of the object you're working with. Which one to use completely depends on what you're refactoring.

Let's look at an example route in an application that handles adding friends from a suggested list.

~~~js
// app/routes/suggested-friends.js
const { service } = Ember.inject;

export default Ember.Route.extend({
  currentUser: service(),
  notificationService: service('notification'),

  actions: {
    addFriend(friend) {
      let me = this.get('currentUser');

      // show a message if already friends
      if (me.get('friends').contains(friend)) {
        this.get('notificationService').show('You are already pals.');
        return;
      } else {

        // add friend
        me.get('friends').pushObject(friend);
        me.save()
          .then(() => {
            // send a broadcast notification to everyone else
            let myName = me.get('fullName');
            let friendName = friend.get('fullName');
            let message = `${myName} and ${friendName} are friends.`;
            this.get('notificationService').broadcast(message);

            // update suggested friends
            this.store.findQuery('suggested-friend')
              .then((friends) => {
                this.controller.set('suggestedFriends', friends);
              });
          });
      }
    }
  }
});
~~~

We can break logical sections of `addFriend` into separate functions that clearly communicate their intent. When doing this, look for logical groupings and/or code comments.

~~~js
// app/routes/suggested-friends.js
const { service } = Ember.inject;

export default Ember.Route.extend({
  currentUser: service(),
  notificationService: service('notification'),

  actions: {
    addFriend(friend) {
      this.notifyIfAlreadyFriends(friend) || this.doAddFriend(friend);
    }
  },

  notifyIfAlreadyFriends(friend) {
    let me = this.get('currentUser');

    if (me.get('friends').contains(friend)) {
      this.get('notificationService').show('You are already pals.');
      return true;
    }
  },

  doAddFriend(friend) {
    let me = this.get('currentUser');
    me.get('friends').pushObject(friend);
    me.save()
      .then(() => {
        this.broadcastFriendNotification(friend);
        this.fetchSuggestedFriends();
      });
  },

  fetchSuggestedFriends() {
    this.store.findQuery('suggested-friend')
      .then((friends) => {
        this.controller.set('suggestedFriends', friends);
      });
  },

  broadcastFriendNotification(friend) {
    let me = this.get('currentUser');
    let message = friendNotificationMessage(me, friend);
    this.get('notificationService').broadcast(message);
  }
});

let friendNotificationMessage = function(friend1, friend2) {
  let friend1Name = friend1.get('fullName');
  let friend2Name = friend2.get('fullName');
  return `${friend1Name} and ${friend2Name} are friends.`
};
~~~

While this code ends up being a bit longer, the smaller functions make it easier to change and test.

### Use private functions
JavaScript does not have private functions, but as a convention, functions that are considered private are prefixed with an underscore. We can take the previous example one step further and mark functions that we don't want to called ouside of this controller as private.

~~~js
// app/routes/suggested-friends.js
const { service } = Ember.inject;

export default Ember.Route.extend({
  currentUser: service(),
  notificationService: service('notification'),

  actions: {
    addFriend(friend) {
      this._notifyIfAlreadyFriends(friend) ||
      this._doAddFriend(friend);
    }
  },

  _notifyIfAlreadyFriends(friend) {
    let me = this.get('currentUser');

    if (me.get('friends').contains(friend)) {
      this.get('notificationService').show('You are already pals.');
      return true;
    }
  },

  _doAddFriend(friend) {
    let me = this.get('currentUser');
    me.get('friends').pushObject(friend);
    me.save()
      .then(() => {
        this._broadcastFriendNotification(friend);
        this._fetchSuggestedFriends();
      });
  },

  _fetchSuggestedFriends() {
    this.store.findQuery('suggested-friend')
      .then((friends) => {
        this.controller.set('suggestedFriends', friends);
      });
  },

  _broadcastFriendNotification(friend) {
    let me = this.get('currentUser');
    let message = friendNotificationMessage(me, friend);
    this.get('notificationService').broadcast(message);
  }
});

let friendNotificationMessage = function(friend1, friend2) {
  let friend1Name = friend1.get('fullName');
  let friend2Name = friend2.get('fullName');
  return `${friend1Name} and ${friend2Name} are friends.`
};
~~~

### Use collaborator objects
We can continue our refactoring by creating a collaborator object to handle the responsibility of adding a friend.

~~~js
// app/utils/friend-adder.js
export default Ember.Object.extend({
  currentUser: null,
  notificationService: Ember.inject.service('notification'),

  addFriend(friend) {
    if (this._notifyIfAlreadyFriends(friend)) {
      return;
    }

    return this._doAddFriend(friend);
  },

  _notifyIfAlreadyFriends(friend) {
    let me = this.get('currentUser');

    if (friend.isFriendOf(me)) {
      this.get('notificationService').show('You are already pals.');
      return true;
    }
  },

  _doAddFriend(friend) {
    let me = this.get('currentUser');
    me.get('friends').pushObject(friend);

    return _saveUserAndNotify();
  },

  _saveUserAndNotify() {
    let savePromise = me.save();
    savePromise
      .then(() => {
        this._broadcastFriendNotification(friend);
      });

    return savePromise;
  },

  _broadcastFriendNotification(friend) {
    let me = this.get('currentUser');
    let message = friendNotificationMessage(me, friend)
    this.get('notificationService').broadcast(message);
  }
});

let friendNotificationMessage = function(friend1, friend2) {
  let friend1Name = friend1.get('fullName');
  let friend2Name = friend2.get('fullName');
  return `${friend1Name} became friends with ${friend2Name}`;
};
~~~

~~~js
// app/routes/suggested-friends.js
import FriendAdder from '../utils/friend-adder';

export default Ember.Route.extend({
  currentUser: Ember.inject.service(),

  actions: {
    addFriend(friend) {
      let adder = FriendAdder.create({
        currentUser: this.get('currentUser')
      });

      if (adder.addFriend(friend)) {
        this._fetchSuggestedFriends(friend);
      }
    }
  },

  _fetchSuggestedFriends() {
    this.store.findQuery('suggested-friend')
      .then((friends) => {
        this.controller.set('suggestedFriends', friends);
      });
  }
});
~~~

### Replace temporary variables with functions
Let's assume we have a new requirement to sort suggested friends in a different way than the API returns it. We first implement this with a temporary variable called `sortedFriends`:

~~~js
// app/routes/suggested-friends.js
export default Ember.Route.extend({
  // ...

  _fetchSuggestedFriends() {
    this.store.findQuery('suggested-friend')
      .then((friends) => {
        let sortedFriends = friends.sort((a, b) => {
          // some complicated sort with many lines
        });
        this.controller.set('suggestedFriends', friends);
      });
  },

  // ...
});
~~~

We can replace that temporary variable with a function:

~~~js
// app/routes/suggested-friends.js
export default Ember.Route.extend({
  // ...

  _fetchSuggestedFriends() {
    this.store.findQuery('suggested-friend')
      .then((friends) => {
        this.controller.set('suggestedFriends', sortFriends(friends));
      });
  },

  // ...
});

let sortFriends = function(friends) {
  return friends.sort((a, b) => {
    // some complicated sort with many lines
  });
}
~~~

### Replace conditionals with polymorphism
Conditionals (if and case statements) can usually be replaced with polymorphism. Let's assume we have to show different messages based on a user preference. We might first implement this with a switch statement:

~~~js
// app/utils/friend-adder.js
export default Ember.Object.extend({
  // ...
});

let friendNotificationMessage = function(friend1, friend2) {
  let friend1Name = friend1.get('fullName');
  let friend2Name = friend2.get('fullName');

  let preference = friend1.get('friendMessagePreference');

  let message;
  switch (preference) {
    case 'no':
      break;
    case 'friends':
      message = `${friend1Name} and ${friend2Name} are now friends.`;
      break;
    default:
      message = `${friend1Name} became friends with ${friend2Name}`;  
  }

  return message;
};
~~~

To make this better, lets extract a collaborator object and call a function in that object based on the preference that was set.

~~~js
// app/utils/friend-messages.js
export default {
  allMessage(friend1Name, friend2Message) {
    return `${friend1Name} became friends with ${friend2Name}`;  
  },

  friendsMessage(friend1Name, friend2Name) {
    return `${friend1Name} and ${friend2Name} are now friends`;  
  },

  noMessage() {
    return;
  }
}
~~~

~~~js
// app/utils/friend-adder.js
import friendMessages from './friend-messages.js';

export default Ember.Object.extend({
  // ...
});

let friendNotificationMessage = function(friend1, friend2) {
  let friend1Name = friend1.get('fullName');
  let friend2Name = friend2.get('fullName');
  let preference = friend1.get('friendMessagePreference');

  let func = friendMessages[`${preference}Message`] || function() {};
  return func.call(friend1Name, friend2Name)
};
~~~

We'll assume that the `notificationService` will not broadcast an empty message.

### Use page objects in tests
An example acceptance test for our behavior so far might look like this:

~~~js
// tests/acceptance/add-suggested-friend.js
import Ember from 'ember';
import { module, test } from 'qunit';
import startApp from 'friends/tests/helpers/start-app';

module('Acceptance | Add Suggested Friend', {
  beforeEach: function() {
    this.application = startApp();
  },

  afterEach: function() {
    Ember.run(this.application, 'destroy');
  }
});

test('visiting /friends/suggested', function(assert) {
  visit('/friends/suggested');

  click('.friend:contains(Friend Name) a:contains("Add")');

  andThen(function() {
    assert.equal(currentURL(), '/friends', 'adding suggested friend should show friend page');
    assert.equal(find('.friend:contains(Friend Name)').length, 1, 'Friend Name should be on the page');
  });
});
~~~

We can extract the details of this test into two page objects which encapsulate the details of their pages.

~~~js
// tests/helpers/suggested-friends-page.js
export default {
  url() {
    return '/friends/suggested';
  },

  visit() {
    return visit(this.url());
  },

  addFriend(friendName) {
    click(`.friend:contains(${friendName}) a:contains('Add')`);
  }
}
~~~

~~~js
// tests/helpers/friends-page.js
export default {
  url() {
    return '/friends';
  },

  visit() {
    return visit(this.url());
  },

  hasFriendOnPage(friendName) {
    friend = find(`.friend:contains(${friendName}`);
    return friend.length === 1;
  }
}
~~~

Which simplifies our test and makes it clearer:

~~~js
// tests/acceptance/add-suggested-friend.js
//...
import friendsPage from '../helpers/friends-page';
import suggestedFriendsPage from '../helpers/suggested-friends-page';

//...

test(`visiting ${suggestedFriendsPage.url()}`, function(assert) {
  suggestedFriendsPage.visit();
  suggestedFriendsPage.addFriend('Dave Grohl');

  andThen(function() {
    let hasFriendOnPage = friendsPage.hasFriendOnPage('Dave Grohl');

    assert.equal(currentURL(), friendsPage.url(), 'adding suggested friend should show friend page');
    assert.ok(hasFriendOnPage, 'Dave Grohl should be on the page');
  });
});
~~~

### Extract shared code
Let's assume in our refactoring, we realize we've made a generic component that we could use in another app, or that other developers might want to take advantage of.

In Rails, we would probably move this code into `lib/library_name` where it could be easily extracted into a gem.

In Ember, we can do the same process with addons. There are actually two types of addons in Ember; standard addons and in-repo-addons. In-repo-addons provide a standard structure inside of `lib/addon-name`, much like we might do in Rails manually.

To get started, use the generator:

~~~bash
> ember g in-repo-addon friend-adder

installing in-repo-addon
installing lib
  create lib/.jshintrc
  create lib/friend-adder/index.js
  create lib/friend-adder/package.json
~~~

Move the code you want to extract into the addon folder, or generate new files by passing the `-ir` option.

~~~bash
> ember g component friend-button -ir friend-adder

installing component
  create lib/friend-adder/addon/components/friend-button.js
  create lib/friend-adder/addon/templates/components/friend-button.hbs
installing component-test
  create tests/integration/components/friend-button-test.js
installing component-addon
  create lib/friend-adder/app/components/friend-button.js
~~~

Once the addon is ready, you can copy the code from lib/friend-adder into a newly generated addon.

As an alternative, you can also use a standalone addon and the functionality provided by [npm link](https://docs.npmjs.com/cli/link).
