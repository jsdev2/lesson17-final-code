## Lesson 17 Final My Little Pony App Code

There are a few versions in this repository:

#### 1. 

The version we had at the end of class, very slightly cleaned up and with errors corrected.

#### 2. 

A version I made in which the code is broken down into functions (and some variable names are changed slightly). For me this is easier to read, partly because all of the functions fit on one screen. 

#### Bonus. 

A version I made based on #2, but storing state in a different way. 

Remember how in class we talked about how we were storing all the information about votes and weirdIds in closures, and setting event listeners for every message, which had access to the right vote count and the right weirdId, in a closure? 

Well, in this Bonus version, we're not making use of the fact that that stuff is stored in closures; instead we're storing it in two different places: 

- We're storing the main messages object with all the votes and messages, that we get from Firebase as global state, at the top level in a variable called "messages", just like we did with "articles" in the Feedr project. 
- We're storing the weirdId on each element in the DOM itself, as something called ah html "data attribute". In this case we're setting a "data-weird-id" attribute on each message `li`, which will contain the weirdId. 

Then we're using event delegation to set one listener each, for vote updating and message deletion, and when the listeners are triggered, we're extracting the weirdId from the "data-weird-id" attribute of the message element itself, then using that both to access the right message on the server, and to get information about the votes from the main state variable, "messages".

Both of these methods are equally good. I kind of prefer the closure one because it's simpler and shorter, and you ***already*** have the closed-over variables in place, so you might as well make use of that.

---

>___Note:___ In all of these, I did not correct the biggest variable naming mistake I made, which was to use the word `votes` instead of something like `voteCount`. 

>As we discovered in class, not only is the word `votes` frightful to read when combined with `span` to become `votesSpan`, but a bigger problem is that plural words typically imply a collection of items, whereas `votes` is just a number. 

>However, in the end, all these arguments were outweighed by the fact that I didn't want to change the property name in the database, in case you copied and pasted my new code into your apps, because that would have messed up your apps: your code would download previously created message objects and would be looking for the `voteCount` property but it wouldn't be there, so your app would probably render "voteCount: undefined" for every message object.

>I could, of course, have left comments in the code telling people to make sure to delete the `messages` portion of their database before running this, but that seemed cumbersome, and plus what if you ended up going back and forth between code using the old version and code using the new version? (You could of course create another database, which would solve that problem.)

>But you can see this gets complicated. I only bring it up because it's quite typical of the things developers have to think about once they have data stored on databases in production. It gets really tricky to change things when it would be complicated and/or problematic to wipe the database or make any major alterations to it. So people spend a lot of time thinking about how their data will be structured in the db, what everything will be called, and what the urls of the endpoints will be (especially for public APIs).
