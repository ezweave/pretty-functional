# Chapter 2: Events in The Stream

![stream](../static/images/stream.png)

If you've been _functional curious_ for any amount of time and you've poked around, you are probably most curious to know about the `ramda` library.  Originally, this chapter was going to introduce `ramda` using the same problem set, but... it quickly became apparent that without introducing you to `monads`, the code would look _nearly identical_ to the `lodash` solutions we already covered in the previous chapter.  This illustrates both how useful `lodash` can be (when curried and composed properly) and how powerful the `monad` concept is.

This would, could, have been a place to introduce `monad`s.  _However_, before I take you, dear reader, down that rabbit hole, I realize that we've left wholly untouched (thus far) the concept of _reactive programming_.  You will encounter this, and _reactive frameworks_ exist in a myriad of languages, which is to say: before we get further into _functional programming_, it's probably a good idea to introduce _reactive programming_.

To that end, we revisit our old friend, `FizzBuzz` and solve it using [`rxjs`](https://rxjs-dev.firebaseapp.com/).  While we will use the same concepts, to mechanically pull apart the logic, we will be introducing some ideas unique to `rxjs`.

- [Reactive Programming](#reactive-programming)
- [WTF Is A Stream?](#wtf-is-a-stream?)
- [Observables](#observables)
 - [FizzBuzz](#fizzbuzz)
- [Async Operations](#async-operations)

[Table of Contents](../../README.md#table-of-contents)

## Reactive Programming

Let's put down our "functional" hats for a moment and talk about something _completely_ different (hyperbole aside).  

[`rxjs`](https://rxjs-dev.firebaseapp.com/) is a JavaScript library for [Reactive X](http://reactivex.io/) which is, as the name implies, a [reactive programming](https://en.wikipedia.org/wiki/Reactive_programming) framework.  That, dear reader, probably begs the question: "What is reactive programming?"

Good question!

Now, to be _completely transparent_, Reactive X is actually a "reactive extension" and as you will quickly see that to indulge in this style of programming, you need... functions.  You need a litany of things to allow you to actual engage in "reactive programming" which are not going to just magically exist unless you, or someone very much like you, builds a library for it.

But let's not get _too_ far ahead of ourselves.  I should probably explain to you what is meant by "reactive programming."

A snarky answer would say "it's all in the name," which is true.  But that fails to explain reactive programming as a concept.  Definition via definition, which is not going to help you.

There are two overarching design goals that really inform _all_ reactive programming:
* __Data as a stream__, that is data being dealt with as a _series of events_ (this isn't quite right, but I will start here).
* __The propagation of changes__, which is to say: how do I tell everyone about _new_ data and, most importantly, how do I tell _new subscribers_ about _new data_.

And before you protest, functional programming is _part_ of reactive programming.  We will tie all these things together when we start solving some __toy problems__, but for now I want to step out of the world of __functional programming__ and help solidify a few things for you.

Forgetting "data as a stream," I want to talk about the latter point: propagation of changes.  This is such a common problem in _any_ streaming or message passing paradigm.

Now, another point that I must _hammer home_ (and I will do so again later) is that the notion of a "stream" in reactive programming is not tied to the concept of a "stream" as in HTML5 video or anything else that is I/O related.  This is a _very common_ misconception.  As soon as someone hears "stream" they immediately start thinking about web sockets or a myriad of other things.  While we can, and will, look at some I/O the reactive concept of a "data stream" is not at all tied to the source of said stream.  This will make more sense in the next section, but I want to get you away from that definition of a data stream.

Stepping back to what I alluded to earlier, with regards to the "propagation of changes" is sort of a larger problem in systems.

Let's say we have some entity A and A is listening to new data coming in from some message system.  This could be something like a [JMS Topic](https://docs.oracle.com/cd/E24902_01/doc.91/e24429/appx_topic_or_queue.htm) (where all subscribers get the same message) or it could just be a message system that pushes updates from some local collection (interesting, I wonder if this will come up again... in the next section?).  What do you do when some new subscriber, entity B wants to start subscribing to the data source?

The typical problem is that the new entity, B, needs to know about the state of the world (at least the state of the data source) when it starts listening to it.  This problem rears its head all over the place, from inter-system communication (like a [vector clock](https://en.wikipedia.org/wiki/Vector_clock) based distributed data store) to simple, local application message bus architectures (like various event bus implementations in the Java world).

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

[Top](#chapter-2-events-in-the-stream)

# WTF Is a Stream?

Let's be clear and flog this deceased equine (a way of saying "beat this dead horse" to those not familiar with this idiom for "saying something over and over until it is annoying"):

__A stream is not I/O.__

It _can_ be I/O, but it can be local (e.g in memory, within execution context) too.  This is a _higher order_ concept you need to fully grok!  When we talk about _streams_ in the reactive world, we are not talking about I/O or media or anything that you might assume given that term.

So let's talk about `rxjs` and what a stream is... with some easy to grok examples!

I'll be linking to some code you can play with because __streams are absolutely fundamental__ to understanding `rxjs`.  I've encountered lots of folks who use `redux` in single page applications (SPA, for short... usually [React](https://reactjs.org/) or [Angular](https://angularjs.org/)) and then they learn about [`redux-observable`](https://redux-observable.js.org/) (which uses `rxjs`) and still don't really grok what a stream is.

This is one of your author's big hangups with the ease in which you can pull a library in.  You hear of something "cool" and you add it to your project, copy a few examples from Stackoverflow (don't lie, this is the definition of ["copy pasta"](https://www.urbandictionary.com/define.php?term=copypasta) as far as programming goes) and... then things start to fall apart.  Part of this is that what we're about to dive into isn't really clearly explained.  And `rxjs` operators are much like those in `lodash` and `ramda` and if you don't understand, don't have a good mental image of a stream, you start to misunderstand what you're blindly subscribing to.

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

[Top](#chapter-2-events-in-the-stream)

# Observables

Now that you are somewhat familiar with a _stream_, let's talk about `Observable`s.

We're kind of hinted at what an `Observable` does already, with some of our example code.  _However_, we haven't explicitly called out the construct that is `Observable`.  This is often how `redux` developers get exposed to `rxjs` as `redux-observable` pulls this concept into the `redux` world.

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

This is the _difference_ between a _pull_ and a _push_ in the `rxjs` world.  Even though our example is rather _ugly_, the `Observable` version controls when it is emitting data and what, exactly, it is emitting.  

"Now hold on, just a damn minute.  What about that `ajax` call?"

Well there, partner, you are correct!  The `ajax` call was a _push_ and not a _pull_.  _However_, `Promise` based calls by themselves, in the `rxjs` world, only emit _one_ value and then they are done.  What if you need to _react_ to a series of values?  What if you need some _agent_ to intercept or compose data from external calls and emit computed data?  

What, _indeed_?

What we've done is exposed `Observable`.  The `from` operator, if you haven't noticed, actually creates an `Observable` for you (this _almost_ makes me a liar).  The difference is that it uses _three_ possible sources for input:

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

# Fizz Buzz

Let's look at ways to approach the old `FizzBuzz` problem using `rxjs` and `Observable`s.  As a little refresher,

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

[Top](#chapter-2-events-in-the-stream)
