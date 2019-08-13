# Streaming

In this chapter, we revisit our old friend, `FizzBuzz` and solve it using [`rxjs`]().  While we will use the same concepts, to mechanically pull apart the logic, we will be intruducing some ideas unique to `rxjs`.

- [Reactive Programming](#reactive-programming)
- [WTF Is A Stream?](#wtf-is-a-stream?)
- [Observables](#observables)
- [Async Operations](#async-operations)

## Reactive Programming

Let's put down our "functional" hats for a moment and talk about something _completely_ different (hyperbole aside).  

[`rxjs`](https://rxjs-dev.firebaseapp.com/) is a JavaScript library for [Reactive X](http://reactivex.io/) which is, as the name implies, a [reactive programming](https://en.wikipedia.org/wiki/Reactive_programming) framework.  That, dear reader, probably begs the question: "What is reactive programming?"

Good question!

Now, to be _completely transparent_, Reactive X is actually a "reactive extension" as you will quickly see that to indulge in this style of programming, you need... functions.  You need a litany of things to allow you to actual engage in "reactive programming" which are not going to just magically exist unless you, or someone very much like you, builds a library for it.

But let's not get _too_ far ahead of ourselves.  I should probably explain to you what is meant by "reactive programming."

A snarky answer would say "it's all in the name," which is true.  But that also doesn't illuminate reactive programming as a concept.

There are two overarching design goals that really inform _all_ reactive programming:
* __Data as a stream__, that is data being dealt with as a _series of events_ (this isn't quite right, but I will start here).
* __The propagation of changes__, which is to say: how do I tell everyone about _new_ data and, most importantly, how do I tell _new subscribers_ about _new data_.

And before you protest, functional programming is _part_ of reactive programming.  We will tie all these things together when we start solving some __toy problems__, but for now I want to step out of the world of __functional programming__ and help solidify a few things for you.

Forgetting "data as a stream," I want to talk about the latter point: propagation of changes.  This is such a common problem in _any_ streaming or message passing paradigm.

Now, another point that I must _hammer home_ (and I will do so again later) is that the notion of a "stream" in reactive programming is not tied to the concept of a "stream" as in HTML5 video or anything else that is I/O related.  This is a _very common_ misconception.  As soon as someone hears "stream" they immediately start thinking about web sockets or a myriad of other things.  While we can, and will, look at some I/O the reactive concept of a "data stream" is not at all tied to the source of said stream.  This will make more sense in the next section, but I want to get you away from that definition of a data stream.

Stepping back to what I alluded to earlier, with regards to the "propagation of changes" is sort of a larger problem in systems.

Let's say we have some entity A and A is listening to new data coming in from some message system.  This could be something like a [JMS Topic](https://docs.oracle.com/cd/E24902_01/doc.91/e24429/appx_topic_or_queue.htm) (where all subscribers get the same message) or it could just be a message system that pushes updates from some local collection (interesting, I wonder if this will come up again... in the next section?).  What do you do when some new subscriber, entity B wants to start subscribing to the data source?

The typical problem is that the new entity, B, needs to know about the state of the world (at least the state of the data source) when it starts listening to it.  This problem rears its head all over the place, from inter-system communication (like an [vector clock](https://en.wikipedia.org/wiki/Vector_clock) based distributed data store) to simple, local application message bus architectures (like various event bus implementations in the Java world).

The typical approach is that, somehow, the prior state (or an initial state plus diffs) must be pushed to the new subscriber.

Let's quit being abstract and write a little code to illustrate this.

Let's say that the data source for this little demonstration is some type of JSON object:

```js

interface IDataSource {
  count: number
  name: string
}

const dataSource: IDataSource = {
  count: 0,
  name: 'foo'
}
```

So the `count` value is being changed (or copied, because we are good FP programmers) and subscribers see updates.

Let's say we have a block of code that looks like this:

```js
interface IDataSource {
 count: number
 name: string
}

interface IDataSourceSubscribeCallback {
 (dataSource: IDataSource): void 
}

let dataSources: IDataSourceSubscribeCallback[] = []

const subscribeToDataSource = (
  subscriber: IDataSourceSubscribeCallback
) => {
 dataSources.push(subscriber) // obviously bad, but this is an example
}

let dataSource: IDataSource = {
 count: 0,
 name: 'foo'
}

setInterval(() => {
 const {
  count,
  name
 } = dataSource
 
 // also bad, again, an easy example
 dataSource = {
  count: count + 1,
  name
 }
 
 map(
  dataSources,
  (subscriber: IDataSourceSubscribeCallback) => subscriber && subscriber(dataSource)
 )
}, 1000)
```

Barring the fact that this _isn't functional_, let's talk about what is going on.

Every 10 seconds, a `count` is being updated and broadcast to all subscribers.  This means that _new_ subscribers won't see anything _until_ the update fires.  They have no idea what the `count` was when they started subscribing.

So if A subscribes like this:

```js

subscribeToDataSource(({
 count
}: IDataSource) => console.warn('This is A and I have a new count', count))
```

What does `B` see when it subscribes _later_?

```js
setTimeout(() => {
 subscribeToDataSource(({
  count,
  name
 }: IDataSource) => console.error('This is B and I have a new count', count, 'called', name))
}, 3000)
```

Clearly `B` doesn't get called until the `count` is updated.  

Let's suppose, to further convolute things, that more is being done with the `dataSource`:

```js
setInterval(() => {
 const count = dataSource.count + 1
 const name = count % 5 === 0 ? 'foo base 5 is alive!' : 'nothing special'
 
 dataSource = {
  count,
  name
 }
 
 map(
  dataSources,
  (subscriber: IDataSourceSubscribeCallback) => subscriber && subscriber(dataSource)
 )
}, 1000)
```

Now things are getting weirder, because now the _name_ is changing.  The initial name is actually being ignored and a bunch of other stuff is showing up.

Now imagine that this isn't so trivial, as if this is an async operation happening outside your control and the `name` field is something you are showing to a user in your UI.

It's kind of problematic to have a `null` or `undefined` value when you subscribe, no?

This is a very __toy example__ of a very _real_ problem.  You can play with the code [here](https://codepen.io/ezweave/pen/zYOvzEw).

Now, the way this is solved in the _reactive world_ is rather simple.  We will get to that in a bit, but the [fork](https://codepen.io/ezweave/pen/qBWOjyo) does it handily:

```js
const subscribeToDataSource = (
  subscriber: IDataSourceSubscribeCallback
) => {
 dataSources.push(subscriber) // obviously bad, but this is an example
 subscriber && subscriber(dataSource)
}
```

If the subscriber exists, upon subscription (we could check that going in, too, but __toy example__), just give them what the world looks like now.

This is one of the main concerns with __reactive programming__.  You can't just show up to the party, you need to know what is going on.

But to understand why this is important, you're going to have to understand what we mean by "stream".  And for that... we must dive in!

# WTF Is a Stream?

Let's be clear and flog this deceased equine (a way of saying "beat this dead horse" to those not familiar with this idiom for "saying something over and over until it is annoying"):

__A stream is not I/O.__

It _can_ be I/O, but it can be local too.  This is a _higher order_ concept you need to fully grok!  When we talk about _streams_ in the reactive world, we are not talking about I/O or media or anything that you might assume given that term.

So let's talk about `rxjs` and what a stream is... with some easy to grok examples!

I'll be linking to some examples you can play with because __streams are absolutely fundamental__ to understanding `rxjs`.  I've encountered lots of folks who use `redux` in single page applications (SPA, for short... usually [React]() or [Angular]()) and then they learn about `redux-observable` and still don't really grok what a stream is.

This is one of your author's big hangups with the ease in which you can pull a library in.  You hear of something "cool" and you add it to your project, copy a few examples from stackoverflow (don't lie, this is the definition of ["copy pasta"](https://www.urbandictionary.com/define.php?term=copypasta) as far as programming goes) and... then things start to fall apart.  Part of this is that what we're about to dive into isn't really clearly explained.  And `rxjs` operators are much like those in `lodash` and `ramda` and if you don't understand, don't have a good mental image of a stream, you start to misunderstand what you're blindly subscribing to.

I don't mean to scare you.  I am just speaking from experience.  You need to understand what streams actually represent.

To the code!

Let's start simple.  Your data source is just going to be a _very_ simple array.

```js
interface IFoo {
 name: string
 age: number
}

const foos: IFoo[] = [{
 name: 'Chewy',
 age: 212
}, {
 name: 'Han',
 age: 31
}, {
 name: 'Lando',
 age: 33
}, {
 name: 'Leia',
 age: 29
}]

const fooSource = from(foos)

fooSource.subscribe(({
 name,
 age
}:IFoo) => console.warn(name, 'is', age, 'years old'))
```

Hey!  Our stream is just the values of an array of objects we came up with.  This is it.  This is a stream at a pretty basic level.

The output of the subscribe call is something like this:

```
"Chewy" "is" 212 "years old"
"Han" "is" 31 "years old"
"Lando" "is" 33 "years old"
"Leia" "is" 29 "years old"
```

Each subscriber just got each element from the array and operated on it.  This is called "emitting a value."  As you can guess, this could be data from media streamed over a TCP connection or it could just be another part of your application (e.g. "local").  That doesn't matter!

[Play around with it!](https://codepen.io/ezweave/pen/mNzmvN)

[`from`](https://www.learnrxjs.io/operators/creation/from.html) is the base operator in `rxjs`.  All other functions are derived from it.  

We can even get `async` with it:

```js
const foo: Promise<IFoo> =
 new Promise((resolve) => resolve({
 name: 'Your dumb author',
 age: 39
}))

const fooSource = from(foo)

fooSource.subscribe(({
 name,
 age
}:IFoo) => console.warn(name, 'is', age, 'years old'))
```

Hey look, we can deal with `async` values!  That's the _magic_ of `rxjs` for you.  It won't give you a `Promise` back, it will just wait until it `resolve`s and give you what you want, which is the `IFoo` that you were waiting for.  [Muck around a bit](https://codepen.io/ezweave/pen/LYPpLwJ) and see what you come up with.

Now that's not enough for me to think that you, dear reader, really get how cool this actually is.  Let's look at a real I/O problem.  The kind we have avoided, thus far, in this book.

```js
interface ITodo {
 completed: boolean
 id: number
 title: string
 userId: number
}

interface ITodoResponse {
 response: ITodo
}

const todoSource = ajax(`https://jsonplaceholder.typicode.com/todos/1`)

todoSource.subscribe(({
 response: {
   title
 }
}: ITodoResponse) => console.warn('We got a response', title))
```

So now, we are asking for a subscription from an _external I/O_ source.  This is the usual "danger zone" with regards to functional programming.  But `rxjs` is doing a lot for us.  It's handling all the particulars that a `fetch` call (in the JavaScript world) would do for you.  There's a `Promise` under the hood and we're only dealing with "happy path" responses, but there it is.

[Go ahead and poke the bear](https://codepen.io/ezweave/pen/BaBodyN) and see what happens with `ajax`.  It is basically an extension of `from` that just takes care of the nuts and bolts of an `HTTPRequest` for you.

Now, there's a lot of particulars I am _definitely_ and _intentionally_ glossing over.
* The test uri (https://jsonplaceholder.typicode.com/todos/1) is asking for a document, that is a JSON object, in this case.  You need to understand _that_, but you probably already do.
* You might have been exposed to something like `Observables` but you missed this key part... and that's why things get "hard" to do.

And that's it.  That's all the reactive programming fundamentals there are.  You are just dealing with a _sliding_ view into a bunch of objects.  They could be in an array, from a user event in a webpage (like a click), or from some external source.  The important part is that this _stream_ is just a view of some type of _state_.  The state could be blank, awaiting a response from a REST endpoint or it could be an array of objects.  This is the important part: __you don't need to know where data was emitted from to consume it__.  This is going to become _abundantly_ clear in the next section.

Oh, what? You want to know why this was called "reactive" to begin with?

Well, fellow traveler: you're reacting to data.  You are reacting to events.  These events are just objects.  There is no mystery there.  You are just dealing with things when you `subscribe` to them.  An array of `number`s, an array of `JSON`, whatever.  You shouldn't care.  But you need to get that you are getting:
* The last view of the world (this is what we talk about with "propagation").
* New views of the world as they change.

We haven't even begun to talk about _functional programming_ within this _miasma_ of knowledge.  But I can't just explain `Observable`s to you without telling you what is going on, underneath.

My trivial example in the last section?  It's not that _far_ from the truth.  Think about every change to your back end data store, it may represent state, it may represent something else (which is probably state) but regardless of `redux` or whatever other tool brings you to `rxjs` but this is precisely what they fail to tell you concisely.  You will get _something_.  It will be an object or a primitive, but you will get whatever is being _emitted_ on a stream.  And a stream is _not_ necessarily I/O.  It might just be data from some local store, which is really an object or really an array.  The point is that the stream is a __sliding window of changing things__.  Each one should be atomic and discrete, but you get them as they come.