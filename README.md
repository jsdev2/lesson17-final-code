## Lesson 17 Final My Little Pony App Code

There are a couple of versions in this repository:

1. The version we had at the end of class, very slightly cleaned up and with errors corrected

2. A version I just made in which the code is broken down into functions (and some variable names are changed slightly). For me this is easier to read, partly because all of the functions fit on one screen. 

>___Note:___ I did not correct the biggest variable naming mistake I made, which was to use the word `votes` instead of something like `voteCount`. 

>As we discovered in class, not only is the word `votes` frightful to read when combined with `span` to become `votesSpan`, but a bigger problem is that plural words typically imply a collection of items, whereas `votes` is just a number. 

>However, in the end, all these arguments were outweighed by the fact that I didn't want to change the property name in the database, in case you copied and pasted my new code into your apps, because that would have messed up your apps: your code would download previously created message objects and would be looking for the `voteCount` property but it wouldn't be there, so your app would probably render "voteCount: undefined" for every message object.

>I could, of course, have left comments in the code telling people to make sure to delete the `messages` portion of their database before running this, but that seemed cumbersome, and plus what if you ended up going back and forth between code using the old version and code using the new version? (You could of course create another database, which would solve that problem.)

>But you can see this gets complicated. I only bring it up because it's quite typical of the things developers have to think about once they have data stored on databases in production. It gets really tricky to change things when it would be complicated and/or problematic to wipe the database or make any major alterations to it. So people spend a lot of time thinking about how their data will be structured in the db, what everything will be called, and what the urls of the endpoints will be (especially for public APIs).
