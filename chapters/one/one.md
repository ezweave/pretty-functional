# Chapter 1: Pretty Fizzy

If this were a more academic tome, we'd start out with the mathy bits firts.  There _is_ a whole way of viewing functional programming through the lens of [_lambda calculus_](https://en.wikipedia.org/wiki/Lambda_calculus), but we aren't there yet.  While your author certainly loves to talk about math, this book aims to be a bit more practical.  So we're going to start with some very basic concepts and... immediately start writing code.  The goal of this approach is to build your confidence in a new skillset, before we start throwing around words like _monad_ and _closure_ and the like.

For now, let's just call _everything_ a function.

There are three things that we do need to consider, before we begin:

- __Immutability__: we don't mutate any data _in place_, instead we make a copy.
- __Pure functions__: functions have no external side effects.
_ __Currying__: this can be a bit esotric, but it's basically the practice of returning functions, that can return other functions that can... ahhh!

Let's write some code that introduces these concepts.  In fact, let's start with some _bad_ code (from a functional programming standpoint).  Let's say we want to write good old [`FizzBuzz`](https://www.tomdalling.com/blog/software-design/fizzbuzz-in-too-much-detail/).

> Write a function that prints the numbers from 1 to n. But for multiples of three print "Fizz" instead of the number and for the multiples of five print "Buzz". For numbers which are multiples of both three and five print "FizzBuzz".

There's a few ways to skin this cat.

Here is a traditional, more _imperitive_ solution.  It's probably the _obvious_ solution to anyone who comes from the C-syntax world:

```js
function fizzBuzzer(n: number) {
 var i
 for(i = 1; i < n; i++) {
  if(i % 3 === 0 && i % 5 === 0) {
   console.log('FizzBuzz')
  } else if(i % 3 === 0) {
   console.log('Fizz')
  } else if(i % 5 === 0) {
   console.log('Buzz')
  } else {
   console.log(i)
  }
 }
}
```

This is the _most_ basic implementation, really.  Before we go any further, let's talk a little bit about _style_.  When I was a snot nosed little programmer, I often fought
the notion of writing _idiomatic_ code.  I would do silly things like put braces on _the same line_ in C#, because I was really a Java guy.  That sort of thing can be described as
[_bike shedding_](https://en.wiktionary.org/wiki/bikeshedding)(aka "getting caught up in inconsequential details" also a prime example of [_Parkinson's Law of Triviality_](https://en.wikipedia.org/wiki/Law_of_triviality)).  While it is bad form to write things like class names and variables in Python style amidst Java code, I don't think you nor I would 
do that intentionally.  What is not trivial is this:

* Don't use the `function` keyword.

That's _not_ really within the functional idiom.  You can absolutely write functional code that way, but as we get further into these exercises, you will find yourself fighting TypeScript,
and it will become confusing.  Instead, if we apply a little common sense to `FizzBuzz` we can, at least, rewrite our _imperitive_ version with a bit more verve and a fat arrow:

```js
const fizzBuzzer = (n: number) => {
 var i
 for(i = 1; i < n; i++) {
  var output = ''
  if(i % 3 === 0) {
   output = 'Fizz' 
  }
  if(i % 5 === 0) {
   output = `${output}Buzz` 
  }
  if(!output) {
   output = `${i}`
  }
  console.log(output)
 }
}
```

Of course, this is still not functional in any way.  Externally, it seems okay... but what's wrong with it?

1. That `var` keyword implies that you're not being functional.  We are mutating a reference as we concatenate the strings.  You might say to yourself: "It's fine
it's a _local_ variable."  Nyet.  A _pretty functional_ version would _omit_ local variables alltogether, even `const`s.
1. That `for` loop isn't functional at all.  It's _conceptually_ mutating.  We are basically building our data set as we go.
1. Technically, writing to the console is... an external side effect.

So how would we change this?

For our first go, we're going to utilize the more functional aspects of the widely available [`lodash`]() library.  It is far from a complete library for functional programming,
but it has grown _a lot_ since it was forked from the underscore (`_`) library many moons ago.

It has a lot of operators that you can use and since it's probably already in your project... there's no overhead added by using it in existing repos.

So let's start with what I will call "pretty functional FizzBuzz lodash, mark 1":

```js
const fizzBuzzer: (
 n: number
) => string[] = flow(
 range,
 partialRight(
  map,
  i => i % 15 === 0 ? 'FizzBuzz' : i
 ),
 partialRight(
  map,
  i => i % 3 === 0 ? 'Fizz' : i
 ),
 partialRight(
  map,
  i => i % 5 === 0 ? 'Buzz' : i
 )
)
```

Well that looks _more_ functional, but it's not really there... let's dissect what I did, before we add some polish.

First off, you will notice that I have only _typed_ the arguments for this function.  Lodash has a `flow` operator (you will see it again in Ramda and rx under the name 'pipe),
which basically allows you to curry the input and then pass the results of one function to the other.

```js
const fizzBuzzer: (
 n: number
) => string[] = flow(...)
```

`flow` returns a new function that takes in an argument.  We are telling the TypeScript transpiler that we will be passing this new function a number and that it will
return an array of strings.

Everything in the chain is a _function_.  `range` is a Lodash utility to fill an array with numbers in ascending order.  So, it expects a `number` as an argument.

But let's say you aren't quite sure... did it do what I wanted it to do?  This is a pretty normal reaction when using new operators.  All of the libraries we are 
using also have a very handy function `tap`.  `tap` returns its input but lets you operate on it.

So, we can add it right after the `range` call to see what we're working with:

```js
const fizzBuzzer: (
 n: number
) => string[] = flow(
 range,
 partialRight(
  tap,
  console.warn
 ),
 ```

 Ah, you might be wondering what `partialRight` is doing in all of these.  Good question!

 `partialRight` curries a function for you, by letting you pass all the arguments to the _right_ of the primary argument for any function.  `partial` does the reverse.

 So, as an example this:

 ```js
 const fizzBuzzer: (
 n: number
) => string[] = flow(
 range,
 (data: number[]) => tap(
   data,
   console.warn
 )
 ```

 Is the same as:

 ```js
const fizzBuzzer: (
 n: number
) => string[] = flow(
 range,
 partialRight(
  tap,
  console.warn
 ),
 ```

 It just saves you the trouble of having to type out the anonymous function to pass the array reference to `tap`.

 The rest of the solution then seems kind of... obvious:

 ```js
 partialRight(
  map,
  i => i % 15 === 0 ? 'FizzBuzz' : i
 ),
 partialRight(
  map,
  i => i % 3 === 0 ? 'Fizz' : i
 ),
 partialRight(
  map,
  i => i % 5 === 0 ? 'Buzz' : i
 )
 ```

 So, what could we do to make this _more_ functional?  

 There are quite a few ways to do this with `lodash`, but since we're just starting, let's keep it pretty basic.

While the problem statement asks for _a function_ there's nothing wrong with making more.  Each of the `partialRight(map, ...)` lines are what are called _anonymous functions_.  They
have no named constant pointing to them.  They are kind of "one and done" tools.

But, aren't they all really doing the same thing?

_Absolutely_.

Let's focus on these functions.  What are they doing?

They're saying for _some_ number _n_, if the value in the array module _n_ is zero, print a string.

We can write a function just for this, and then the logic is contained:

```js
const replacer = (
 n: number,
 replacement: string
): (
 numbers: (string|number)[]
) => (string|number)[] => partialRight(
 map,
 i => i % n === 0 ? replacement : i
) 
```

Now, TypeScript wants us to decorate this, but we could just make it trimmer in pure JS.  The slight verbosity is a _little annoying_, but it does tell the reader (or you, a week later when you forgot what you did), exactly what that was doing.

With that, the code becomes simpler... 

```js
const fizzBuzzer: (
 n: number
) => string[] = flow(
 range,
 replacer(15, 'FizzBuzz'),
 replacer(3, 'Fizz'),
 replacer(5,'Buzz')
)
```

Now, you've probably already noticed a bug in this code.

Did you find it?

The problem is `range`.  It starts at 0 and goes to a value _less_ than our input, _n_.

We can fix it trivially, by wrapping it in a new _anonymous function_:

```js
const fizzBuzzer: (
 n: number
) => string[] = flow(
 n => range(1, n + 1),
 replacer(15, 'FizzBuzz'),
 replacer(3, 'Fizz'),
 replacer(5,'Buzz')
)
```

Now, I posit that there is _an even better and more functional_ way of doing this.  But, let's take a step back and look at the whole solution:

```js
const replacer = (
 n: number,
 replacement: string
): (
 numbers: (string|number)[]
) => (string|number)[] => partialRight(
 map,
 i => i % n === 0 ? replacement : i
) 

const fizzBuzzer: (
 n: number
) => string[] = flow(
 n => range(1, n + 1),
 replacer(15, 'FizzBuzz'),
 replacer(3, 'Fizz'),
 replacer(5,'Buzz')
)
```

What is bad about this implementation?

1. It's still using a conventional operator (the ternary) to control the flow.
1. It's pretty verbose...
1. It doesn't actually print anything.

Well, let's work backwards.

We can make a wrapper that will do the printing for us, or we could simply put a `console.log` at the end of the `flow` call.  I'm not going to do that.  

Instead, let's make a new wrapper, so we can keep our logic seperate.  I will explain why in a moment.

```js
interface Printer {
 (a: string[]): void
}

const fizzPrinter = (
 printer: Printer
) => flow(
 fizzBuzzer,
 printer
)
```

Now, we could have typed the `Printer` in the args, like so:

```js
const fizzPrinter = (
 printer: {(a: string[]): void}
) => flow(
 fizzBuzzer,
 printer
)
```

But, I find that lends to a lack of readability.

Okay, so now I will answer the unanswered question, why did I not just append my original function, `fizzBuzzer`?

Well, I'm glad I asked:
* The `console` is really not a very functional construct, but we have to touch non-functional things, at times.  It's rare, but you could get an error by calling it.
* I might want to make a bunch of different printer type functions.

For example:

```js
const fizzLog = fizzPrinter(console.log)
const fizzWarn = fizzPrinter(console.warn)
const fizzError = fizzPrinter(console.error)
fizzLog(100)
fizzWarn(20)
fizzError(10)
```

I mentioned the _verbosity_ issue... that's kind of just the price you pay when dealing with TypeScript.  It's certainly confusing, at times.

For example:

```js
const foo = (x: number) => console.log(x)
```

Can also be written as:
```js
const foo = (x: number): void => console.log(x)
```

Can _also_ be written as:
```js
const foo: (x: number) => void = console.log
```

I _prefer_ the last iteration because it's more true to the _functional_ paradigm.  I know I'm dealing with a function and don't need to _capture_ the `x` for any reason.

Now, before we talk about how we might _ditch_ the ternary operator, let's look at the whole shebang again:

```js
const replacer = (
 n: number,
 replacement: string
): (
 numbers: (string|number)[]
) => (string|number)[] => partialRight(
 map,
 i => i % n === 0 ? replacement : i
) 

const fizzBuzzer: (
 n: number
) => string[] = flow(
 n => range(1, n + 1),
 replacer(15, 'FizzBuzz'),
 replacer(3, 'Fizz'),
 replacer(5,'Buzz')
)

interface Printer {
 (a: string[]): void
}

const fizzPrinter = (
 printer: Printer
) => flow(
 fizzBuzzer,
 printer
)

const fizzLog = fizzPrinter(console.log)
const fizzWarn = fizzPrinter(console.warn)
const fizzError = fizzPrinter(console.error)
fizzLog(100)
fizzWarn(20)
fizzError(10)
```

Gaze upon it!  Behold!  It is _pretty_ functional, compared to our old looping mess, right?  Well, trust me: it is.

Let's think about this differently, though.

What jumps out at you about this solution?

Let me get your gears turning... how would you _test_ this solution?

I hope you said to yourself "Well, now I can test everything!"

You can test `replacer` on its own.  You can test `fizzBuzzer` on its own.  And then you might not even need to test your `Printer` functions at all (it's possible to test console logging,
I've done it when writing API level code, but it can be a pain in the ass (P.I.T.A.)).

You can also slip `tap` functions into the `flow` chain and easily see what is going on at each stage.  _More importantly_ the core functionality is _pretty_ pure and it's discrete.  