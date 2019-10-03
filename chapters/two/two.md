# Chapter 2: Events in The Stream

![stream](/static/images/stream.png)

# Introduction

If you've been _functional curious_ for any amount of time and you've poked around, you are probably most curious to know about the `ramda` library.  Originally, this chapter was going to introduce `ramda` using the same problem set, but... it quickly became apparent that without introducing you to `monads`, the code would look _nearly identical_ to the `lodash` solutions we already covered in the previous chapter.  This illustrates both how useful `lodash` can be (when curried and composed properly) and how powerful the `monad` concept is.

This would, could, have been a place to introduce `monad`s.  _However_, before I take you, dear reader, down that rabbit hole, I realize that we've left wholly untouched (thus far) the concept of _reactive programming_.  You will encounter this, and _reactive frameworks_ exist in a myriad of languages, which is to say: before we get further into _functional programming_, it's probably a good idea to introduce _reactive programming_.

To that end, we revisit our old friend, `FizzBuzz` and solve it using [`rxjs`](https://rxjs-dev.firebaseapp.com/).  While we will use the same concepts, to mechanically pull apart the logic, we will be introducing some ideas unique to `rxjs`.

- [Reactive Programming](#reactive-programming)
- [WTF Is A Stream?](#wtf-is-a-stream?)
- [Observables](#observables)
- [There Can Be Only One (Stream)](#there-can-be-only-one-(stream))
- [FizzBuzz](#fizzbuzz)
- [Async Operations](#async-operations)
- [The Treasure of Maps](#the-treasure-of-maps)
- [Error Handling](#error-handling)
- [Summary](#summary)
- [Exercises](#exercises)

[Table of Contents](/README.md#table-of-contents)

# Reactive Programming

Let's put down our "functional" hats for a moment and talk about something _completely_ different (hyperbole aside).  

[`rxjs`](https://rxjs-dev.firebaseapp.com/) is a JavaScript library for [Reactive X](http://reactivex.io/) which is, as the name implies, a [reactive programming](https://en.wikipedia.org/wiki/Reactive_programming) framework.  That, dear reader, probably begs the question: "What is reactive programming?"

Good question!

Now, to be _completely transparent_, Reactive X is actually a "reactive extension" and as you will quickly see that to indulge in this style of programming, you need... functions.  You need a litany of things to allow you to actual engage in "reactive programming" which are not going to just magically exist unless you, or someone very much like you, builds a library for it.

But let's not get _too_ far ahead of ourselves.  I should probably explain to you what is meant by "reactive programming."

A snarky answer would say "it's all in the name," which is true.  But that fails to explain reactive programming as a concept.  Definition via definition, which is not going to help you.

> Q: What is a monad?
>
> A: A functional programming construct for doing monadic things.

That's not very helpful, though that is a _good question_! And it is one that we will get to, further on in this book, but as far as _reactive programming goes_...

There are two overarching design goals that really inform _all_ reactive programming:
* __Data as a stream__, that is data being dealt with as a _series of events_ (this isn't quite right, but I will start here).
* __The propagation of changes__, which is to say: how do I tell everyone about _new_ data and, most importantly, how do I tell _new subscribers_ about _new data_.

And before you protest, functional programming is _part_ of reactive programming.  We will tie all these things together when we start solving some __toy problems__, but for now I want to step out of the world of __functional programming__ and help solidify a few things for you.

Forgetting "data as a stream," I want to talk about the latter point: propagation of changes.  This is such a common problem in _any_ streaming or message passing paradigm.

Now, another point that I must _hammer home_ (and I will do so again later) is that the notion of a "stream" in reactive programming is not tied to the concept of a "stream" as in HTML5 video or anything else that is I/O related.  This is a _very common_ misconception.  As soon as someone hears "stream" they immediately start thinking about web sockets or a myriad of other things.  While we can, and will, look at some I/O the reactive concept of a "data stream" is not at all tied to the source of said stream.  This will make more sense in the next section, but I want to get you away from that definition of a data stream.

Stepping back to the problem I alluded to earlier is the "propagation of changes," which is sort of a classic problem in systems, _especially_ in distributed systems.

Let's say we have some entity A and A is listening to new data coming in from some message system.  This could be something like a [JMS Topic](https://docs.oracle.com/cd/E24902_01/doc.91/e24429/appx_topic_or_queue.htm) (where all subscribers get the same message) or it could just be a message system that pushes updates from some local collection (interesting, I wonder if this will come up again... in the next section?).  What do you do when some new subscriber, entity B wants to start subscribing to the data source?

The typical problem is that the new entity, B, needs to know about the state of the world (at least the state of the data source) when it starts listening to it.  This problem rears its head all over the place, from inter-system communication (like a [vector clock](https://en.wikipedia.org/wiki/Vector_clock) based distributed data store) to simple, local application message bus architectures (like various event bus implementations in the Java world).

The typical approach is that, somehow, the prior state (or an initial state plus diffs) must be pushed to the new subscriber.

Let's quit being abstract and write a little code to illustrate this.

Say that the data source for this little demonstration is some type of JSON object:

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

Then we write a block of code that looks like this:

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

[Top](#introduction)

# WTF Is a Stream?

Let's be clear and flog this deceased equine (a way of saying "beat this dead horse" to those not familiar with this idiom for "saying something over and over until it is annoying"):

__A stream is not I/O.__

![dead stream](/static/images/dead_horse.png)

It _can_ be I/O, but it can be local (e.g in memory, within execution context) too.  This is a _higher order_ concept you need to fully grok!  When we talk about _streams_ in the reactive world, we are not talking about I/O or media or anything that you might assume given that term.

So let's talk about `rxjs` and what a stream is... with some easy to grok examples!

I'll be linking to some code you can play with because __streams are absolutely fundamental__ to understanding `rxjs`.  I've encountered lots of folks who use `redux` in single page applications (SPA, for short... usually [React](https://reactjs.org/) or [Angular](https://angularjs.org/)) and then they learn about [`redux-observable`](https://redux-observable.js.org/) (which uses `rxjs`) and still don't really grok what a stream is.

This is one of your author's big hangups with the ease in which you can pull a library in.  You hear of something "cool" and you add it to your project, copy a few examples from [Stackoverflow](https://stackoverflow.com/questions/tagged/rxjs) (don't lie, this is the definition of ["copy pasta"](https://www.urbandictionary.com/define.php?term=copypasta) as far as programming goes) and... then things start to fall apart.  Part of this is that what we're about to dive into isn't really clearly explained.  And `rxjs` operators are much like those in `lodash` and `ramda` and if you don't understand, don't have a good mental image of a stream, you start to misunderstand what you're blindly subscribing to.

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

So now, we are asking for a subscription from an _external I/O_ source.  This is the usual "danger zone" with regards to functional programming.  But `rxjs` is doing a lot for us, with the [`ajax`](https://www.learnrxjs.io/operators/creation/ajax.html) operator.  It's handling all the particulars that a `fetch` call (in the JavaScript world) would do for you.  There's a `Promise` under the hood and we're only dealing with "happy path" responses, but there it is

[Go ahead and poke the bear](https://codepen.io/ezweave/pen/BaBodyN) and see what happens with `ajax`.  It is basically an extension of `from` that just takes care of the nuts and bolts of an `HTTPRequest` for you.

Now, there's a lot of particulars I am _definitely_ and _intentionally_ glossing over.
* The test uri (https://jsonplaceholder.typicode.com/todos/1) is asking for a document, that is a JSON object, in this case.  You need to understand _that_, but you probably already do.
* You might have been exposed to something like `Observable` but you missed this key part... and that's why things get "hard" to do (more on this in a bit, because you're _technically_ already using one).

And that's it.  That's all the reactive programming fundamentals there are.  You are just dealing with a _sliding_ view into a bunch of objects.  They could be in an array, from a user event in a webpage (like a click), or from some external source.  The important part is that this _stream_ is just a view of some type of _state_.  The state could be blank, awaiting a response from a REST endpoint or it could be an array of objects.  This is the important part: __you don't need to know where data was emitted from to consume it__.  This is going to become _abundantly_ clear in the next section.

Oh, what? You want to know why this was called "reactive" to begin with?

Well, fellow traveler: you're reacting to data.  You are reacting to events.  These events are just objects.  There is no mystery there.  You are just dealing with things when you `subscribe` to them.  An array of `number`s, an array of `JSON`, whatever.  You shouldn't care.  But you need to get that you are getting:
* The last view of the world (this is what we talk about with "propagation").
* New views of the world as they change.

We haven't even begun to talk about _functional programming_ within this _miasma_ of knowledge.  But I can't just explain `Observable`s to you without telling you what is going on, underneath.

My trivial example in the last section?  It's not that _far_ from the truth.  Think about every change to your back end data store, it may represent state, it may represent something else (which is probably state) but regardless of `redux` or whatever other tool brings you to `rxjs`, it's just a _stream_ of events/values/actions. This is precisely what they fail to tell you concisely.  You will get _something_.  It will be an object or a primitive, but you will get whatever is being _emitted_ on a stream.  And a stream is _not_ necessarily I/O.  It might just be data from some local store, which is really an object or really an array.  The point is that the stream is a __sliding window of changing things__.  Each one should be atomic and discrete, but you get them as they come.

_NOTE: to aid in explaining the concepts we're describing, I am explicitly typing the `const` values as `Observable<T>`.  In practice, you should be able to infer this, or your IDE will._

[Top](#introduction)

# Observables

Now that you are somewhat familiar with a _stream_, let's talk about `Observable`s.

We're kind of hinted at what an `Observable` does already, with some of our example code.  _However_, we haven't explicitly called out the construct that is `Observable`.  This is often how `redux` developers get exposed to `rxjs` as `redux-observable` pulls this concept into the `redux` world, but that's another book and I'm not going to teach you `redux` (it has almost nothing to do with being "pretty functional").

First, let's just look at some code.  This is a _slight_ variation on the [very basic example](https://rxjs-dev.firebaseapp.com/guide/observable) you can find in the `rxjs` documentation.

```js
const observable = new Observable<string>(
 sub => {
  sub.next('The')
  sub.next('quick')
  sub.next('brown')
  sub.next('fox')
  sub.next('jumped')
  sub.next('over')
  sub.next('the')
  setTimeout(() => {
   sub.next('lazy dog')
   sub.complete()
  }, 1000)
 }
)

console.log('About to subscribe')
observable.subscribe(
  console.warn,
  partial(
   console.error,
   'Something bad happened'
  ),
  () => console.warn('done') 
)
console.log('After subscribe')
```

Now, I did pull in a little `lodash` love for our `subscribe`, but you can get the gist of what is happening here.  The `Observable`, when subscribed to, emits the classic [_The quick brown fox jumps over the lazy dog_](https://en.wikipedia.org/wiki/The_quick_brown_fox_jumps_over_the_lazy_dog) test sentence. It waits one second to emit the "lazy dog" part, but other than that this looks _pretty damn similar_ to what we've seen already.

You can see the [code here](https://codepen.io/ezweave/pen/MWgXwVY).

Now, you are probably asking yourself, "What is the difference between this `Observable` and just emitting the string as an array?"  Something like this, perhaps:

```js
const sentence = split(
 'The quick brown fox jumped over the lazy dog',
 ' '
)

console.log('Using a straight stream')
from(
 sentence
).subscribe(
 console.log
)
console.log('Stream done')
```

You can see the two, together, [here](https://codepen.io/ezweave/pen/JjPZdqr).

While they are similar, there is a fundamental difference you may have already picked up on.  With the `from` operator, we are asking for the contents of some data source, but the data source _itself_ exerts no control over that request.  When we `subscribe` to the stream, that uses the split sentence as a data source, it just emits its data.

This is the _difference_ between a _pull_ and a _push_ in the `rxjs` world.  Even though our example is rather _ugly_, the _explicitly created_ `Observable` version controls when it is emitting data and what, exactly, it is emitting.  

"Now hold on, just a damn minute.  What about that `ajax` call?"

Well there, partner, you are correct!  The `ajax` call was a _push_ and not a _pull_.  _However_, `Promise` based calls by themselves, in the `rxjs` world, only emit _one_ value and then they are done.  What if you need to _react_ to a series of values?  What if you need some _agent_ to intercept or compose data from external calls and emit computed data?  

What, _indeed_?

What we've done is exposed the guts of the `Observable`.  The `from` operator, if you haven't noticed, actually creates an `Observable` for you (this _almost_ makes me a liar).  The difference is that it uses _three_ possible sources for input:

- An array: any array of data.
- An iterable: a collection (e.g. could be JSON key value pairs) that is iterable (e.g. "array like").
- A `Promise`.  Obviously any function that returns a promise.

What `from` did for us before, was create an `Observable` that we then subscribed to.  But, we can also just create our own `Observable`.  Going back to our _The quick brown fox_ example, remember that we used the `from` operator to wrap the array?

Basically this:

```js
const foxy = split(
 'The quick brown fox jumped over the lazy dog',
 ' '
)

const observable = new Observable<string>(
 sub => {
  map(foxy, x => sub.next(x))
  sub.complete()
 }
)
```

And this:

```js
const usingFrom = from(
 foxy
)
```

Can be subscribed to in the same way:

```js
observable.subscribe(console.warn)
usingFrom.subscribe(console.warn)
```

And will have _the same_ output.

The _difference_ is that when we create the `Observable` ourselves, we can directly _control_ how and when the values are emitted.  That's it!  This will become _more_ powerful when we start _composing_ operators on the stream.  But, for now, remember that `from` will give you an `Observable`, but it will not let that `Observable` truly control when it emits a value.  That is why we can also create `Observable`s explicitly.

For all intents and purposes when we say "stream" we are really talking about a "stream" that comes from an `Observable`.  Rarely do you end up creating streams in any other fashion and, for the purposes of what we are doing in this chapter, we can really just use `Observable` to mean anything pulled using the `from` operator.  In fact, _technically speaking_ (pushes up glasses), `from` creates an `Observable` as we have seen.  The difference is just that if you make one _explicitly_ you can better control when it emits on the resulting stream.  As long as that is _somewhat_ clear, just think of an `Observable` as a "streaming thing".  We will end up getting `Observable`s in a myriad of ways moving forward and you just have to remember that it's just gonna "chuck some shit in the stream" and you'll have to deal with it.  An `Observable` is a stream and most streams come from `Observable`s.

[Top](#introduction)

# There Can Be Only One (Stream)

Now, this will become more clear later, but you're going to see some code as we move on that starts to build `Observable`s inside _other_ `Observable`s.  What _might_ not be clear is that it's always just _one_ stream.

Let's look at some code!

Here's a really basic `Observable` that will just emit some values from an array:

```js
from([0, 1, 2]).pipe(
 tap(x => console.log('Stream point 1', x)),
 map(x => `${x}-decorated`),
 tap(x => console.log('Stream point 2', x)),
 reduce(
  (results, curr) => results.concat(curr),
  []
 )
).subscribe(console.log)
```
As you might expect, the output is going to show something like this:

```bash
"Stream point 1" 0
"Stream point 2" "0-decorated"
"Stream point 1" 1
"Stream point 2" "1-decorated"
"Stream point 1" 2
"Stream point 2" "2-decorated"
```

That _shouldn't_ be surprising.  The emissions in the stream are being changed by the `map` call, one at a time.  This can be a little confusing, as this `map` isn't operating on a collection _iteratively_ as `map` does in `lodash`, it is instead reacting to everything that is in the stream, atomically.  It's not going through _all_ the array because it doesn't "see" the whole array.  The `Observable` created by `from` is going to emit each value _one at a time_.

But what happens if we do something weird, like create a _new_ `Observable` in the `map` call?  Let's add _even_ more logging while we're at it.

```js
from([0, 1, 2]).pipe(
 tap(emission => console.log('Outer Observable point 1', emission)),
 mergeMap(outerEmission => from(['bourbon', 'scotch', 'beer']).pipe(
  tap(
   partial(
    console.log,
    'Inner Observable point 1',
    x
   )
  ),
  map(
   drink => `${outerEmission} ${drink}` 
  ),
  tap(
   partial(
    console.log,
    'Inner Observable point 2',
    x
   )
  ),
 )),
 tap(emission => console.log('Outer Observable point 2', emission)),
 reduce(
  (results, curr) => results.concat(curr),
  []
 )
).subscribe(console.log)
```

Before we look at the log, ignore the `mergeMap` operator (we will get to that later), view it as something _akin_ to `map` (only not at all, but just be patient) and look at this block (sans logging):

```js
from([0, 1, 2]).pipe(
 mergeMap(outerEmission => from(['bourbon', 'scotch', 'beer']).pipe(
  map(
   drink => `${outerEmission} ${drink}` 
  )
 ))
).subscribe()
```

We start with emissions from the array `[0, 1, 2]` then we try to make a joke based on the oft covered John Lee Hooker song ["One Bourbon, One Scotch, One Beer"](https://www.youtube.com/watch?v=q-fSZRYeBWk) in a new `Observable` that is feeding itself with emissions from the outer `Observable`.

The output, as you can see, can be a bit dizzying:

```bash
"Outer Observable point 1" 0
"Inner Observable point 1" 0 "bourbon"
"Inner Observable point 2" 0 "0 bourbon"
"Outer Observable point 2" "0 bourbon"
"Inner Observable point 1" 0 "scotch"
"Inner Observable point 2" 0 "0 scotch"
"Outer Observable point 2" "0 scotch"
"Inner Observable point 1" 0 "beer"
"Inner Observable point 2" 0 "0 beer"
"Outer Observable point 2" "0 beer"
"Outer Observable point 1" 1
"Inner Observable point 1" 1 "bourbon"
"Inner Observable point 2" 1 "1 bourbon"
"Outer Observable point 2" "1 bourbon"
"Inner Observable point 1" 1 "scotch"
"Inner Observable point 2" 1 "1 scotch"
"Outer Observable point 2" "1 scotch"
"Inner Observable point 1" 1 "beer"
"Inner Observable point 2" 1 "1 beer"
"Outer Observable point 2" "1 beer"
"Outer Observable point 1" 2
"Inner Observable point 1" 2 "bourbon"
"Inner Observable point 2" 2 "2 bourbon"
"Outer Observable point 2" "2 bourbon"
"Inner Observable point 1" 2 "scotch"
"Inner Observable point 2" 2 "2 scotch"
"Outer Observable point 2" "2 scotch"
"Inner Observable point 1" 2 "beer"
"Inner Observable point 2" 2 "2 beer"
"Outer Observable point 2" "2 beer"
```

You're probably _really damn confused_, at this point.  Let's walk through this.

For the first value emitted from the array, `0`, we hit our first logging point.  There is only the `0` on the stream now.

But, we quickly run into our "inner `Observable`", that is going to make _new_ emissions!

The first thing that happens, is it emits "bourbon" by itself.

```bash
"Inner Observable point 1" 0 "bourbon"
```

To reference the value in the "outer" stream, we hold onto it with the `outerEmission` variable.  We now have a new "sub" stream that is still contextually bound (in terms of run time) to the parent stream, but has its own emissions as well.  We see this when we start "decorating" with the `drink`:

```bash
"Inner Observable point 2" 0 "0 bourbon"
```

But here's where it's going to throw you for a bit of a loop: notice that it's _not_ emitting all the values from the inner `Observable` before it emits the next value from the outer `Observable`!

```bash
"Outer Observable point 1" 0
"Inner Observable point 1" 0 "bourbon"
"Inner Observable point 2" 0 "0 bourbon"
"Outer Observable point 2" "0 bourbon"
"Inner Observable point 1" 0 "scotch"
"Inner Observable point 2" 0 "0 scotch"
"Outer Observable point 2" "0 scotch"
"Inner Observable point 1" 0 "beer"
"Inner Observable point 2" 0 "0 beer"
"Outer Observable point 2" "0 beer"
```

What is happening, is that the new _emissions_ are still part of the outer stream.  They're just new values.

This gets a little clearer, if we delete some of the logging as such:

```js
 tap(emission => console.log('Outer Observable point 1', emission)),
 mergeMap(outerEmission => from(['bourbon', 'scotch', 'beer']).pipe(
  map(
   drink => `${outerEmission} ${drink}` 
  )
 )),
 tap(emission => console.log('Outer Observable point 2', emission)),
```

Then we just see what is going on with the stream as a whole:

```bash
"Outer Observable point 1" 0
"Outer Observable point 2" "0 bourbon"
"Outer Observable point 2" "0 scotch"
"Outer Observable point 2" "0 beer"
"Outer Observable point 1" 1
"Outer Observable point 2" "1 bourbon"
"Outer Observable point 2" "1 scotch"
"Outer Observable point 2" "1 beer"
"Outer Observable point 1" 2
"Outer Observable point 2" "2 bourbon"
"Outer Observable point 2" "2 scotch"
"Outer Observable point 2" "2 beer"
```

The important thing to grok here is that the fellow that kicked it off, that first `Observable` from the array `[0, 1, 2]` created a stream and _all_ subsequent emissions will be "within" that stream.  What _is_ different, is that we're putting a bunch of new values in the stream with the inner `Observable`.  The _entire_ cycle is still going to fire through all of the _first set_ of emissions, one at a time.  It's effectively "growing" (really "injecting new") emissions in the stream:

```bash
"Outer Observable point 1" 0
"Outer Observable point 2" "0 bourbon"
"Outer Observable point 2" "0 scotch"
"Outer Observable point 2" "0 beer"
"Outer Observable point 1" 1
```

If that were not the case, we'd expect the stream to "block" and wait for the next number from the array before it starts hitting the second `tap` call.  It doesn't, though.  It just adds those new emissions.

You can see that the first emission:

```bash
"Outer Observable point 1" 0
```

Is followed by _three_ new emissions that came from the inner `Observable`:

```bash
"Outer Observable point 2" "0 bourbon"
"Outer Observable point 2" "0 scotch"
"Outer Observable point 2" "0 beer"
```

This is obvious because we're at "point 2".

And the _whole_ of the logging (including the output after `reduce`) is quite long, even with the changes:

```bash
"Outer Observable point 1" 0
"Outer Observable point 2" "0 bourbon"
"Outer Observable point 2" "0 scotch"
"Outer Observable point 2" "0 beer"
"Outer Observable point 1" 1
"Outer Observable point 2" "1 bourbon"
"Outer Observable point 2" "1 scotch"
"Outer Observable point 2" "1 beer"
"Outer Observable point 1" 2
"Outer Observable point 2" "2 bourbon"
"Outer Observable point 2" "2 scotch"
"Outer Observable point 2" "2 beer"
["0 bourbon", "0 scotch", "0 beer", "1 bourbon", "1 scotch", "1 beer", "2 bourbon", "2 scotch", "2 beer"]
```

The last line is output from the function we're passing to `subscribe`, meaning that it doesn't get _the last emission_ (which is the array we reduce to) until _all_ of the emissions are done.  It's _one stream_.

Take a look [at the code](https://codepen.io/ezweave/pen/LYPwwPd) and add anything else you'd like to see logged.  We'll talk more about `mergeMap` later, but understand that from the first `pipe` to `subscribe` it's all just one stream, no matter how many `Observable`s we make in the interim.

An alternate title for this section was going to be "many `Observable`s, one stream" but it wasn't very funny.

[Top](#introduction)

# Fizz Buzz

Let's look at ways to approach the old `FizzBuzz` problem using `rxjs` and `Observable`s.  Let's see if we can make it "pretty functional" with our new `rxjs` tools.  As a little refresher,

- Print the numbers from 1 to _n_. 
- For multiples of three print "Fizz" instead of the number. 
- For the multiples of five print "Buzz". 
- For numbers which are multiples of both three and five print "FizzBuzz".

Now, there's a few ways of solving this and it all comes down to what we're trying to emulate, problem solving wise.  On the one hand, you could construct an `Observable` that emits the output of some function, `f(x)` wherein we use the logic we applied via `lodash` in Chapter 1.  _However_, doing so would simply _move_ the logic out of the real of `rxjs` and back into the same sort of structure we used for a `lodash` FP solution.

Instead, let's start _simply_ with an `Observable` that just fills an array of length _n_ with integer values.  We construct a _function_ that will create an `Observable` for the given range, then emit those values when a subscription is hooked up:

```js
const generateN = (
 n: number
): Observable<number> => from(
  range(1, n + 1)
)

generateN(5).subscribe(console.info)
```

This generates the output:

```bash
1
2
3
4
5
```

We use the `rxjs` operator `range` to populate our data source.  Now, I bet you're thinking "let's just use the `subscribe` operator to do the logical bit!"  You certainly _could_ do that and you'd end up placing the logic used prior to determine where to put `Fizz` or `Buzz` or `FizzBuzz`.  But... that wouldn't do much to teach you about `rxjs`.  _Instead_ let us examine another operator in the `rxjs` universe: [`pipe`](https://rxjs-dev.firebaseapp.com/api/index/function/pipe).  Before I explain _how_ it works, let's just tinker with it:

```js
const generateN = (
 n: number
): Observable<number> => range(1, n + 1)

generateN(5).pipe(
 tap(n => console.info('Value is', n)) 
).subscribe()
```

Now, we're using `tap` from `rxjs`, but it behaves _exactly_ like `tap` from `lodash`.  As you might imagine, `pipe` is quite similar to `flow`.  But there's one key bit you should pay attention to here.  Let us split up our `Observable`s so it is more obvious.

```js
const generateN = (
 n: number
): Observable<number> => range(1, n + 1)

const observable$: Observable<number> = generateN(5)
const pipedObservable$: Observable<number> = observable$.pipe(
 tap(n => console.info('Value is', n))
)
pipedObservable$.subscribe()
```

What do you notice now?

For one, the `generateN` call, which uses `range` to create an `Observable` is _one_ `Observable`.  And when we call `pipe`, we're actually getting a _different_ `Observable` back.  This should remind you of one of the core tenets of _Functional Programming_ which is to avoid mutation.

Put a pin in that thought and let's mention _the most important_ bit here.

A note on naming in the `rxjs` world: if anything is a _stream_ (as in an explicit `stream` or an `Observable`), it is common to append a `$` to indicate as much.  This helps to avoid confusion later on, but you will see this pattern throughout these exercises.

If we comment out the `pipedObservable$.subscribe()` call _nothing happens_.  In the `rxjs` world, `subscribe` is the faucet.  You might also have noticed that we aren't doing anything with the subscription, right now.  `subscribe` doesn't have to do anything with emitted values.  All it does is say "turn on the stream!".

Is that clear?  Remember __`subscribe` is the faucet__.  Without calling `subscribe`, nothing will happen.  Ever.

Let's go back to the aforementioned bit we just discussed, about new `Observable`s.  What if we wanted to handle the values emitted on the stream differently?  Let's first change this so that we actually do something with the values in the first `pipe`.  Let's change it so that we are now going to intercept the values that could be `Fizz`.

```js
const generateN = (
 n: number
): Observable<number> => range(1, n + 1)

const observable$: Observable<number> = generateN(5)
const pipedObservable$: Observable<string | number> = observable$.pipe(
 tap(n => console.info('Value is', n)),
 map(
  n => n % 3 === 0 ? 'Fizz' : n
 ),
 tap(n => console.info('Value after transformation is', n))
)
pipedObservable$.subscribe(console.info)
```

The `map` we are using is _not_ from `lodash` but from `rxjs`.  You can see that we are now spitting out `Fizz` in the `subscribe` call if values are divisible by three, per the rules of `FizzBuzz`.  But I want to play around a little, before we solve the problem.  Let's make _another_ pipeline that handles the `Buzz` case.  I'm going to omit the `tap` calls for now (because it is cluttering up the output).

```js
const observable$: Observable<number> = generateN(5)
const pipedObservable$: Observable<string | number> = observable$.pipe(
 map(
  n => n % 3 === 0 ? 'Fizz' : n
 )
)
pipedObservable$.subscribe(console.info)
const pipedObservable2$: Observable<string | number> = observable$.pipe(
 map(
  n => n % 5 === 0 ? 'Buzz' : n
 )
)
pipedObservable2$.subscribe(console.info)
```

Now, the output is _two_ sets of data:

```bash
1
2
Fizz
4
5
```

And...

```bash
1
2
3
4
Buzz
```

This, obviously, is not going to meet the criteria of `FizzBuzz`, but it demonstrates an important concept with regards to _immutability_.  The new `Observable` doesn't manipulate the original `Observable` that emits our integer values.  They are now _discrete_ and only operate within their own confines.  While this does nothing for the problem statement it _does_ demonstrate what is going on, under the hood.

Let's go back to our original and implement a _sort of_ naive solution, using what we already know:

```js
const generateN = (
 n: number
): Observable<number> => range(1, n + 1)

const observable$: Observable<number> = generateN(15)
const pipedObservable$: Observable<string | number> = observable$.pipe(
 map(
  n => n % 15 === 0 ? 'FizzBuzz': n
 ),
 map(
  n => n % 3 === 0 ? 'Fizz' : n
 ),
 map(
  n => n % 5 === 0 ? 'Buzz': n
 )
)
pipedObservable$.subscribe(console.info)
```

This, obviously, meets the requirements for our solution, but it is _very_ simplistic.  In fact, there's several ways we _could_ solve this problem even using one `map` operator.  But let's see if we can do something that exercises our knowledge of `rxjs` and introduces some _further_ concepts.  Before we get too far, feel free to [explore this solution](https://codepen.io/ezweave/pen/bGbjXPR).

So, let's do something a wee bit different.  Earlier we touched on the idea of creating new streams to handle "Fizz" and "Buzz" separately.  While what we did won't actually produce a viable solution, we can use the [`zip`](https://www.learnrxjs.io/operators/combination/zip.html) operator to _combine_ the output of streams.

Let's see what _that_ would look like:

```js
const generateN = (
 n: number
): Observable<number> => range(1, n + 1)

const numbers$: Observable<number> = generateN(15)
const fizz$: Observable<string> = numbers$.pipe(
 map(
  n => n % 3 === 0 ? 'Fizz': ''
 )
)
const buzz$: Observable<string> = numbers$.pipe(
 map(
  n => n % 5 === 0 ? 'Buzz': ''
 )
)

zip(
 numbers$,
 fizz$,
 buzz$
).pipe(
 map(
  ([n, fizz, buzz]) => fizz + buzz || `${n}`) 
).subscribe(console.info)
```

 So what is going on now?  Well, when we `zip` the streams together, we effectively create a new array that looks like this:

 | Index | Values |
 | --- | --- |
 | `0` | `[1, '', '']` |    
 | `1` | `[2, '', '']` |    
 | `2` | `[3, 'Fizz', '']` |    
 | `3` | `[4, '', '']` |    
 | `4` | `[5, '', 'Buzz']` |
 | ... | ... |    
 | `14` | `[15, 'Fizz', 'Buzz']` |

 Then we use `map` to combine the values we need, either the literal strings or the integer value.

 It's actually relatively straightforward from there.    

 Now, we could also make a _further_ optimization, just to minimize our code:

 ```js
const generateN = (
 n: number
): Observable<number> => range(1, n)

const subForN = (
 obs$: Observable<number>,
 n: number,
 substitution: string
): Observable<string> => obs$.pipe(
 map(
  x => x % n === 0 ? substitution : ''
 )
)

const numbers$: Observable<number> = generateN(15)
const fizz$: Observable<string> = subForN(numbers$, 3, 'Fizz')
const buzz$: Observable<string> = subForN(numbers$, 5, 'Buzz')

zip(
 numbers$,
 fizz$,
 buzz$
).pipe(
 map(
  ([n, fizz, buzz]) => fizz + buzz || `${n}`
 ),
 scan(
  (results, curr) => results.concat(curr),
  [] 
 )
).subscribe(console.info)
 ```

The only _other_ difference here, in the our _more idiomatic_ solution is the use of [`scan`](https://www.learnrxjs.io/operators/transformation/scan.html).  All `scan` is doing, is basically a `reduce` type operation _over time_.  It's just a way of returning the whole array as:

```bash
["1", "2", "Fizz", "4", "Buzz", "Fizz", "7", "8", "Fizz", "Buzz", "11", "Fizz", "13", "14", "FizzBuzz"]
```
Instead of logging each value in place.  In practice, you may find that you _do_ want to use `scan`. A rather subtle distinction between `scan` and [`reduce`](https://www.learnrxjs.io/operators/transformation/reduce.html)(yes, there is an `rxjs` specific `reduce` operator) is that `reduce` operates only on a _complete_ emission. E.g. the stream will generate no new values.  `scan`, on the other hand works with each new emission.  If you look at the solution, you can see the array grow with each call to `scan`.  Now, we really could just use `reduce` here, but I wanted to expose you to `scan` as you may find it is more appropriate in cases where you might be collecting an indeterminate amount of data.  We will talk more about this in the next section.  But `reduce` would work here, as well, since we _know_ that the stream will eventually complete.

I hope that the notion of what a `stream` is and the _push_ behavior of an `Observable` is a bit more clear after you've explored this exercise.

Feel free to [explore the solution](https://codepen.io/ezweave/pen/vYBzBvJ).

[Top](#introduction)

# Async Operations 

We've looked at some _toy problems_ with `rxjs`, but it's time to tackle something a little meatier.  Really, we need to look at a more "real world" example.

Now, before we begin, to actually run this code, you will need to get an API key from [Open Weather](https://home.openweathermap.org/).  I'll leave the key field blank in any CodePens but you will want to set that up, if you'd like to play with the API.  There are charges affiliated with load (there is a request per minute cap), but we won't be getting close to those limits.

The point of solving a _real problem_ is to better demonstrate how you'd actually compose a call with `rxjs` versus just throwing more _toy problems_ at you.  In fact, this is going to be the first _real problem_ of the book.

Buckle up!

This example will be slightly contrived, just so we can demonstrate a polling `HTTPRequest`.  But let's state the problem:

* Get sunrise, sunset, and current temperature for a given zip code.
* Request this `n` times at a given interval.

Realistically, the temperature won't fluctuate enough every few seconds, to make much of a difference, but this will demonstrate how you would wrangle that in the `rxjs` world.

First up, we are going to define some `Interface`s, just for clarity.  Your author has gone to the trouble of typing out the responses and created the following interfaces:

```js
interface WeatherOverview {
 description: string
 icon: string
 id: number
 main: string
}

interface Wind {
 deg: number
 speed:number
}

interface Sun {
 country: string
 id: number
 message: number
 sunrise: number
 sunset: number
 type: number
}

interface Main {
 humidity: number
 pressure: number
 temp: number
 temp_max: number
 temp_min: number
}

interface Coordinates {
 lat: number
 lon: number
}

interface Clouds {
 all: number
}

interface WeatherData {
 base: string
 clouds: Clouds
 cod: number
 coord: Coordinates
 dt: number
 id: number
 main: Main
 name: string
 sys: Sun
 timezone: number
 visibility: number
 weather: WeatherOverview[]
 wind: Wind
}
```

That's really just busy work, for the purposes of solving this problem.  Now, we also want to _spit out_ an array of simplified data, that will be easier to grok.  With that in mind, this is the shape of the objects we will create:

```js
interface SimplifiedWeatherData {
 location: string
 sunrise: string
 sunset: string
 temperature: string
 time: string
}
```
Further discovery shows that the API returns times as seconds since the epoch.  Sadly, the ES6 `Date` object is a bit bulky and the `setUTCSeconds` call does _not_ return the date it operates on (instead it returns... the value you just set it to).  So here's a little, rather _ugly_ function to convert those dates for us:

```js
const convertUTCSecondsToLocalTime = (
 epochTimeInMS: number
) => {
 const date = new Date(0)
 date.setUTCSeconds(epochTimeInMS)
 return date.toString()
}
```
We could do something fancy with `lodash`, but we're going to add more complexity anyway.  I'll leave a nicer solution up to you, dear reader.

Additionally, the temperatures are all in Kelvin, which is great but not very useful to denizens of the United States, who expect temperature to be expressed in Fahrenheit.

```js
const kelvinToF = (
 kelvin: number
) => 9/5 * (kelvin - 273.5)  + 32
```

Now that is it for the non-`rxjs` code.  It's time to start looking at the `operators` we are going to use to actually _solve_ the problem.

So _here_ is the entirety of the solution, wrapped in a `Promise` for the purposes of testing.  Don't worry, I will walk you through it.

```js
const getWeather = (
 zipCode: number,
 timeInSeconds: number = 5,
 attempts: number = 5,
 apiKey: string = '//insert your key here'
) => new Promise<WeatherData[]>(
 (resolve, reject) => timer(0, timeInSeconds * 1000).pipe(
  take(attempts),
  tap(x => console.log('Requesting weather data...', x)),
  concatMap(
    x => ajax.getJSON(
      `https://api.openweathermap.org/data/2.5/weather?zip=${zipCode},us&appid=${apiKey}`
    )
  ),
  map(
     ({
      name: location,
      sys: {
        sunrise,
        sunset
      },
      main: {
       temp: degreesKelvin
      }
     }: WeatherData) => ({
       location,
       sunrise: convertUTCSecondsToLocalTime(sunrise),
       sunset: convertUTCSecondsToLocalTime(sunset),
       temperature: kelvinToF(degreesKelvin),
       time: new Date().toString()
     })
   ),
  reduce(
   (results, curr) => results.concat(curr),
   []
  ),
 ).subscribe(resolve, reject)
)
```

My, my, that's a bunch of stuff you haven't seen before, no?

Well most of what is going on is rather simple.  It's just that now you have to think of this in terms of a _stream_.

The _first_ thing we are doing is using the `rxjs` [`timer`](https://www.learnrxjs.io/operators/creation/timer.html) operator to emit what is really an _empty_ action at a millisecond interval (hence the `timeInSeconds * 1000` line).  The initial value, is how long to wait for the first emission.  In this case, we want to emit _right away_.  So we pass in `(0, timeInSeconds * 1000)`.

Now, in this case, we want to let the stream _complete_ after so many attempts.  We don't want to hit the endpoint forever.  So here we are using the [`take`](https://www.learnrxjs.io/operators/filtering/take.html) operator to say "Do this _n_ times, then stop."  There are quite a few variations on `take` and many of them copy the semantics of looping constructs you might be familiar with, specifically flow control conditions prescribed by things like a `for` or a `do while` loop.

We can actually look at the actions of a `timer` and `take` chain in isolation:

```js
const timerTest = (
 timeInSeconds: number,
 attempts: number
) => new Promise<any>(
 (resolve, reject) => timer(0, timeInSeconds * 1000).pipe(
  take(attempts),
  tap(x => console.log('Timer is firing', x)),
 ).subscribe(resolve, reject)
)
```

If we call the `timerTest` method as such:

```js
timerTest(
 10,
 3
).then(
 console.info
)
```

We can see the logs from the `tap` call spit out:

```bash
"Timer is firing" 0
"Timer is firing" 1
"Timer is firing" 2
```
As you can see, the emission from a `timer` is just a monotonically increasing integer.  It doesn't _actually_ matter what it is.  This could just be `undefined`, but `rxjs` does give you a number, just in case you want to use it in some capacity.

Now, if you take a look at the [code](https://codepen.io/ezweave/pen/LYPKabz) you can see that there is an additional log statement.  I've added some more verbiage by creating a new function so that it's clear what is coming out of the stream:

```js
timerTest(
 10,
 3
).then(
 x => console.info('From the stream', x)
)
```

This outputs:

```bash
"Timer is firing" 0
"From the stream" 0
"Timer is firing" 1
"Timer is firing" 2
```

You may be asking, or may not, why we only see one number returned in the `Promise` we wrapped our `rxjs` code with.  Well, let's step back a moment and remember that we only wrapped these calls in a `new Promise` to make them easy to test.  We're passing the subscribe method the `resolve` from the new `Promise` so it's just going to return the _first_ emission.  The stream only continues to emit because we didn't actually stop the stream, we just stopped ~caring~ listening.

Now, if we go back to the weather API example, you can see that further down the chain, we _are_ using the `rxjs` `reduce` operator to build an array of our mapped `SimplifiedWeatherData` objects.  This means that we only `resolve` the `Promise` when we have our full set where "full" means we have used `take` to grab however many weather data points we want.

What does this mean for the data flow through our chain of operators?

We can abstract some of the _actual_ logic as such:

```
 timer(0, timeInSeconds * 1000).pipe(
  take
  tap
  concatMap 
  map
  reduce
```

1. `timer` emits monotonically increasing integers every `timeInSeconds * 1000` milliseconds on a stream.
1. `take` takes actions until we hit the specified limit.  `take(5)` would take 5 emissions, or in this case `0, 1, 2, 3, 4`.
1. [`concatMap`]()
1. `map` is not a unique operator and operates like `map` does in `lodash` or ES6 or what have you.  We're literally just mapping the responses we get from our `ajax.getJSON` calls, which are just returning the body of our request. 
1. `reduce` another familiar fellow.  We're just using this to _atomize_ our requests as an array of responses.  The smallest unit our code returns is an array of `SimplifiedWeatherData` in lieu of each response.  This is done to illustrate how we can "hide" the `rxjs` operations in a `Promise`.

Again, the use of `Promise` in these examples is just to provide an easy way to understand the input and output of a stream.  In reality, you'd not wrap these calls in a `Promise` and instead end up using some _other_ data processor (like middleware in a `redux` based application) to hydrate a data source.  But, you can easily solve slightly convoluted problems with a stream that is "closed" to anyone else.

But let's talk about that in a bit.

As far as [this solution](https://codepen.io/ezweave/pen/OJLBBVN) goes (and you will have to obtain your own api key to make it work) the _flow_ is important to understand.  I'm hand waving what _exactly_ we're doing with that `ajax.getJSON` call within the `switchMap`, but I think you can see that the _output_ is weather data, as you would expect.

# The Treasure of Maps

In the weather API example, we used the `concatMap` operator, but there are _three_ special map operators in the `rxjs` world:
* [`switchMap`](https://www.learnrxjs.io/operators/transformation/switchmap.html)
* [`mergeMap` AKA `flatMap`](https://www.learnrxjs.io/operators/transformation/mergemap.html)
* [`concatMap`](https://www.learnrxjs.io/operators/transformation/concatmap.html)

The first unique thing about all of these operators, over the `map` operator, is that they will operate much like `from`.  They will create inner `Observable`s from the same sources `from` will take.  This means you can use `Promise` based calls, arrays, arrays of `Promise`s and so on.  In the weather API example, we're using them to handle the `ajax.getJSON` calls since they are asynchronous.  But it's always a little unclear just _how_ those operators differ.

So let's take a look at an example!

To keep confusion to a minimum, we're going to use `lodash` to basically make a bunch of _asynchronous_ calls.  Think of these like some third party, `Promise` based call that you're just pulling into your project.  We could build these using `rxjs` operators, but the focus of this section is _not_ on anything other than the various map functions that deal with such things.

So let's say we have two utility functions that will generate some number, _n_ of calls that will sleep for some random amount of time and then return a string indicating when they were called.

Like so:

```js
 const someAsyncThing = async (
 count: number
): Promise<string> => new Promise<string>(
  resolve => {
    const delay = Math.floor(Math.random() * 10)
    setTimeout(() => resolve(`Response #${count} delay ${delay} ms`), delay)
 })

const buildSet: (
 total: number
) => Promise<string>[] = flow(
 range,
 partialRight(
  map,
  someAsyncThing
 )
)
```

Again, we could reproduce this logic directly on a stream using things like `timer` and such, but we're not here to muck about.  This is just a straightforward way of looking at map operators.  As you can see, all we are doing is building a bunch of `Promise` based calls that will `resolve` at varying intervals.

We set up this collection as such:

```js
const promises = buildSet(5)
```

Now, let's be sure that we can see what happens when we simply use `Promise.all`:

```js
Promise.all(
 cloneDeep(promises)
).then(results => {
 console.warn('Using Promise.all', results)
})
```

This is fairly straightforward and we will come back to the output shortly, but what we're interested in is what happens when you use:
1. an `rxjs` stream from an `Observable` (or array of `Observable`s, as is the case here).
1. the different map operators.

Because I am rather lazy, I made a utility function that will take in an operator, execute on it and do some logging:

```js
const mapTester = (
 mapperOperator: any,
 mapperName: string
) => from(cloneDeep(promises)).pipe(
 mapperOperator(
  x => x
 ),
 reduce(
  (results, curr) => results.concat(curr),
  []
 )
).subscribe(output => console.log(`Using ${mapperName} operator:`, output))
```
__NOTE: using `cloneDeep` is important as we want identical copies of the prebuilt functions being passed around... we want those delays to be the same.__

We can then call this with various map operators like so:

```js
mapTester(mergeMap, 'mergeMap')
mapTester(concatMap, 'concatMap')
mapTester(switchMap, 'switchMap')
```

Now, the actual _interesting_ part, the output!

```bash
"Using switchMap operator:" ["Response #4 delay 4 ms"]
"Using mergeMap operator:" ["Response #1 delay 1 ms", "Response #2 delay 2 ms", "Response #4 delay 4 ms", "Response #0 delay 5 ms", "Response #3 delay 5 ms"]
"Using Promise.all" ["Response #0 delay 5 ms", "Response #1 delay 1 ms", "Response #2 delay 2 ms", "Response #3 delay 5 ms", "Response #4 delay 4 ms"]
"Using concatMap operator:" ["Response #0 delay 5 ms", "Response #1 delay 1 ms", "Response #2 delay 2 ms", "Response #3 delay 5 ms", "Response #4 delay 4 ms"]
```

For grins, let's put this data into a table:

| Operator | Responses in Order |
| -- | -- |
| `Promise.all` | `[0, 1, 2, 3, 4]` |
| `concatMap` | `[0, 1, 2, 3, 4]` |
| `mergeMap` | `[1, 2, 4, 0, 3]` |
| `switchMap` | `[4]` |

As you would expect, `Promise.all` is actually just mapping over the `Promise`s and waiting until each one resolves, in order.  This is per the contract of [`Promise.all`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all).  It's here _just_ to show you what that looks like.  Each operation happens in order, as you would expect.

Next, we see that `concatMap` largely does _the same thing_.  It waits for each inner `Observable` to emit before going on to the next.  This is useful if _you care about order_ for some reason.  In practice, I rarely use `concatMap` with any sort of `async` operation.  It just doesn't make much sense, but it can be useful.

Things start to get more interesting when we look at `mergeMap`.  This is also, as I mentioned earlier, known as `flatMap` and what it is doing, as you can see, is just letting the operations return in the order they execute.  From the raw logging, you can see that the fastest operation (in this case) is the second response, AKA "Response #1."  Then it goes down the line and emits responses as soon as they are available.  This is why `mergeMap` is often jokingly called "no rules map" or something like that.  It makes a great deal of sense for batch processes, that may involve, say different queries.  Perhaps it's a call to something like a database and while the SQL _looks_ equivalent, some queries take longer due to their position in a table or any other sort of thing (this is not a discussion about SQL or [RDBMS](https://en.wikipedia.org/wiki/Relational_database) efficiency).  You can expect `mergeMap` to emit to the stream _as soon as it gets a response_.  In this case, as soon as the first `Promise` resolves.

Now, `switchMap` is the real outlier here.

As you can see, it only returns _the last_ emission from the last `Observable` it handled.  It's called "switch" because it "switches out" the other `Observable`s.  The last request it saw was for "Response 4" and it _sequentially_ cancelled all the other `Observable` emissions.

"Why would I want to do that?"

Well, for many, many reasons.  With _real problems_ you might find that subsequent `Observable`s _should_ cancel prior ones.  Think about a case where you might use `rxjs` with some user input, like toggling a button off and on.  If this was updating something, say something in local storage or some UI piece, you might just want _the last_ action.  The others are moot, at this point.  Or, perhaps due to some design or API issue, it's possible to get _multiple_ responses from different `ajax` based calls and it is really just a matter of whichever one came last.  

Obviously, there's some timeliness to this.  We're firing off actions pretty quickly (which is why I print those delays we generate), but it is possible that we don't use a `reduce` and just want to get or `take` actions until we have what we need.  This is all about how your stream is composed.  

Honestly, the differences between map operators in `rxjs` is rather subtle.  Without actually playing around with them, it can be hard to fully grok what is going on.

To that end, [here's the CodePen](https://codepen.io/ezweave/pen/QWLeZar) so you can play around with it yourself.  

Let's recap what we've talked about, with regards to map operators:
* The special map operators in `rxjs` work just like `from`: they will unwrap a `Promise` for you or a collection of `Promise`s as new `Observable`s.  
* They behave differently and it's important to _use the right operator_ for the job.
* Most problems end up with either a `mergeMap` or a `switchMap` solution.  Be sure you pick the best one for your application.

[Top](#introduction)

# Error Handling

At this point, we've left one thing uncovered that you perhaps already occurred to you when looking at the weather API code.

"What happens when we get an error?"

It's a very good question.  All of those nice little operators like `from` and `mergeMap` handily unwrap your `Promise`s into `Observable`s, but they are all written, or have been thus far, in such a way that assumes that _only_ the `resolve` path would happen.  We have done nothing to look at a stream that might happen to "blow up" when something _doesn't_ work.

If you've been writing code for any amount of time, even in a non-professional capacity, you've definitely encountered "borked" endpoints or bugs and handling errors is an important thing to do.  With the `lodash` examples, we were not dealing with anything `async`, which is where you really expect to have issues.  Even simple things like a malformed URL is going to cause problems.

So what happens, if I just happened to "fat finger" the URL for the weather API, no other changes?

Let's say, I _purposely_ break it to look like this:

```js
  tap(x => console.log('Requesting weather data...', x)),
  concatMap(
    x => ajax.getJSON<WeatherData>(
      `https://api.openweathermap.org/foo/weather?zip=${zipCode},us&appid=${apiKey}`
    )
  ),
```

If you look at the logs, you will see this:

```bash
"Requesting weather data..." 0
```

And... nothing.  No error messages.  In fact, pull up your CodePen and make a similar change yourself.  I'll wait.

Now, we're not going to fix this, just yet.  And by "fix" I mean add some error handling.  This kind of error, simply mistyping a URL, is pretty easy to do and probably not too hard to figure out.  It might be the kind of thing that you need a "second set of eyes" for ("Hey Jasmine, I've been beating myself up over this code all day and can't see what I'm missing, mind taking a look?"), but it's a systematic kind of failure.  What isn't is an _inconsistent_ error.  By that, I mean, every single one of these API calls will fail because the URL is wrong.  But how would that change if only _some_ of your `Observable`s broke?

Let's mix this up with a new example.  

Say I've got this function that _occasionally_ tries to divide by 0.  In some languages, this would throw an error, but in the JavaScript world, it's just going to return `NaN` or `Infinity` (this gets into a whole conversation about how to treat divide by 0 which you are free to have with yourself or bring up at your next dinner party, just leave me out of it).  But let's say we need to get an actual number out of this and not just some `NaN` or `Infinity` value.

So we have this code:

```js
const somethingMightBreak = async (
 count: number
): Promise<number> => new Promise<number>(
 (resolve, reject) => 
  setTimeout(() => {
   const divisor = Math.floor(Math.random() * Math.floor(count))
   const value = count/divisor
   isNaN(value) || !isFinite(value) ? reject(`Cannot divide by ${divisor}`) : resolve(value)
  }, Math.floor(Math.random() * 10))
)
```

It's not fancy, but it basically generates some random number, tries to divide by it and if the result is `NaN` or `Infinity`, then we reject it.

Now, if we try to create a new `Observable` (in this case just an array `[0, 1, 2, 3, 4]`) inside of this stream as such:

```js
from([0, 1, 2, 3, 4]).pipe(
 mergeMap(
  x => somethingMightBreak(x)
 ),
 reduce(
  (results, curr) => results.concat(curr),
  []
 )
).subscribe(console.log)
```

The `Observable` that is automatically created from the `Promise` just breaks the whole thing.  We can see this more concretely if we try to add some before and after logging:

```js
from([0, 1, 2, 3, 4]).pipe(
 tap(x => console.log('Emission before', x)),
 mergeMap(
  somethingMightBreak
 ),
 tap(x => console.log('Emission after', x)),
 reduce(
  (results, curr) => results.concat(curr),
  []
 )
).subscribe(console.log)
```

Then we see this output (in one run):

```bash
"Emission before" 0
"Emission before" 1
"Emission before" 2
"Emission before" 3
"Emission before" 4
"Object after" 2
"Object after" 1.5
```

The third attempt to call `somethingMightBreak` does just that.  It _effectively_ breaks the whole stream.  Note that we don't even get to the `reduce` call, at this point.  It just gives up.  That's not so good.

Now, let's say we add a _new_ stream to handle potentially bad calls:

```js
from([0, 1, 2, 3, 4]).pipe(
 mergeMap(
  x => from(somethingMightBreak(x)).pipe(
   catchError(
    error => of(error)
   )
  )
 ),
 reduce(
  (results, curr) => results.concat(curr),
  []
 )
).subscribe(console.warn)
```

Then our _new_ output looks like so:

```bash
["Cannot divide by 0", "Cannot divide by 0", 2, "Cannot divide by 0", 4]
```

It still _rejected_ but we now said, "okay we _know_ this can break, let's do something about it!"

We do end up hitting the `reduce` call later, to pull all of our results together, but some of them are now error messages.  That's okay!

Let's look at that code more closely:

```js
mergeMap(
  x => from(somethingMightBreak(x)).pipe(
   catchError(
    error => of(error)
   )
  )
 )
```

We're doing a few things here that _might_ not be obvious.  When we called `mergeMap` before, we were just letting it unwrap our `Promise` as a new `Observable`.  Now, we have to be more discrete and not only create an `Observable` explicitly (using `from`), but we also need to `pipe` this new, "sub stream" to the `rxjs` operator [`catchError`](https://www.learnrxjs.io/operators/error_handling/catch.html).  We then use [`of`](https://www.learnrxjs.io/operators/creation/of.html) in a similar fashion as `from`, only `of` isn't designed to deal with `Promise`s.  

Now that might be _kind of, sort of_ clear, but there's one more piece to consider.  What do you think `from(somethingMightBreak(x)).pipe` is returning?

I'll give you a hint: it's starts with `Ob` and ends with `servable`. This goes back to our earlier discussion in the [There Can Be Only One Stream](#there-can-be-only-one-(stream)) section. 

It's just emitting new values in the same stream that started it all.  This is totally normal in `rxjs`.  It might look kind of odd, but remember _you can always cram more emissions in the stream_.  It's emissions, or `Observable`s as far as you want to go down, but still in one stream.  Granted, this can become spaghetti-like if you let it go too far, but there's nothing wrong with using `Observable`s inside of other `Observable`s.  Our special map operators (`concatMap`,`mergeMap`, and `switchMap`) can unpack deeply nested streams and "bring them up" to the parent.  This is often called "flattening".  We just threw some operators in to handle the bad actors.

There's a very, very crucial point to handling errors and really _all_ of `rxjs`: you can nest `Observable`s as deep as you like, just now that all of those emissions have to be handled further on in the stream.

Does that make sense?

Feel free to [poke around the example](https://codepen.io/ezweave/pen/OJLKeVZ) and see what else you can come up with.

Now, let's go back to our _broken_ weather API call, for completeness' sake.

How do we deal with the error that is, undoubtedly, being hidden from us by our `ajax.fromJSON` call?

I won't explore how you would handle that in the functions we pass to the `map` operator (obviously that code would need reworking), but we can at least _log_ the error as such:

```js
concatMap(
    x => ajax.getJSON<WeatherData>(
      `https://api.openweathermap.org/foo/weather?zip=${zipCode},us&appid=${apiKey}`
    ).pipe(
     catchError(
      error => {
       console.warn(error.message)
      }
     )
    )
  ),
```

In this case, we will just get repeated logs that say "ajax error" and not much else.  We aren't making a new `Observable` here, we're just eating the errors.  That may or may not be "bad for business" but it demonstrates that you _can_ handle those errors in the `Observable` created by `ajax.getJSON`.  If you fix the URL, this will just work.  We might _want_ to create a new stream and thus a new emission that wraps that error message (which means we have to handle it later in the `map`), but that should be _rather obvious_ at this point.  The important piece is that now, you can handle the error and the stream won't suddenly "die of mysterious circumstances".

[Top](#introduction)

# Summary

If you've never worked with `rxjs`, it can be a lot to take in at once.  Sadly, as I mentioned earlier, there are quite a few developers that get exposed to streams via the use of `redux-observable` which doesn't really do a good job at explaining what is going on.  They start writing ["epics"](https://redux-observable.js.org/docs/basics/Epics.html), which just take in actions off of a stream (in `redux-observable` you have _one_ stream that feeds off of the `redux` state versus creating new ones _ad hoc_ as we've been doing) and quickly get bogged down when asked to do things like use a delay (as we have shown with `interval` and `timer`) because they don't understand that they can create a new stream internal to the epic.  As we've played around, you can see that we often make _lots_ of new emissions inside a given stream.  It's really ["turtles all the way down"](https://en.wikipedia.org/wiki/Turtles_all_the_way_down).  Those emissions become scoped to whatever stream you've started with and if you use one of the fancy map operators, it will handle subsequent `Observable`s without having to do anything (unless you need to use `catchError` but that just moves the logic a bit).  You can just keep going and going, but it will all be the same chain of events.

Some of the larger trickery is in how `Observable`s unwrap things like `Promise`s and how there are tools that can be used to manipulate them.  

The biggest caveat to this entire chapter: I've really only covered some basics.  There are many, many `rxjs` operators.  To explain them all would require a whole other book and, really, they change over time too... so it would be out of date after a year or so and you'd all be pestering me with "updates".  But you should have enough exposure to be dangerous.

Really, in the grander scheme of "pretty functional" code, `rxjs` is largely plumbing.  There are certain problems where the notion of a stream is very useful, and others where it may just muddy the waters.  The important thing to grok is just what a stream is.

At the heart of reactive programming, a stream is a _very_ simple thing.  What makes it interesting is all the ways that emissions from the stream can be created and processed in flight.  In fact, I'd like you to take a look at some of the older problems you solved in [Chapter 1]() using these new tools.