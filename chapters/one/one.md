# Chapter 1: Pretty Fizzy

- [Terminology](#terminology)
- [Functional FizzBuzz](#functional-fizzbuzz)
  - [The Imperitive Approach](#the-imperitive-approach)
  - [Functionalish Approach](#functionalish-approach)
  - [Another Functionalish Approach](#another-functionalish-approach)
- [Functional Recursion](#functional-recursion)
- [Summary](#summary)
- [Exercises](#exercises)

I won't lie to you, dear reader.  I love a good academic tome.  I love theory and abstract concepts.  Learning a few basic things about limits and building up to integrals, that sort of thing.  _However_, time has taught me that while this is fun within the confines of academia, it's a bit hard for some folks to _grok_.  

There _is_ a whole way of viewing functional programming through the lens of [_lambda calculus_](https://en.wikipedia.org/wiki/Lambda_calculus), but we aren't there yet.  While your author certainly loves to talk about math, this book aims to be a bit more practical and start by _building confidence_ in a few basic ideas and a very different way of looking at data.

This, of course, has benefits for you.  So the focus of the first chapter won't be to delve into more esoteric operators, which you find in `ramda` and `lodash/fp` or introduce you to the most digestible _monads_ from `monet`.  We won't even jump into the _streaming_ concept you would get with `rxjs`.

This will be pure and concrete demonstration of functional ideas using the humble `lodash` library.

# Terminology

For now, let's just call _everything_ a function.  Beyond that, there are some other terms bandied about: _closure_, _higher order functions_, _anonymous functions_, and many more.  These terms are useful to know, but I don't want to delve too deeply into the nuances between all of those terms.  We're just going to talk about functions.

There are three concepts that we _do_ need to consider, before we begin:

- __Immutability__
- __Pure functions__
_ __Currying__

A little on each, and we'll demonstrate their use _shortly_.

__Immutability__ is the idea that we don't change any data in place.  Data comes in, new data (most likely copied data) comes out.  If you remember some language concepts, what we're really doing is _passing by value_.  Javascript libraries that lend themselves to functional programming exculsively operate in this manner.  We'll elaborate on this more later, but JavaScript doesn't _really_ support pass by reference, at a language level.  Even an object is actually a value and not a reference, but that nuance leads to a [rabbit hole of stupid arguments](https://stackoverflow.com/questions/2835070/is-there-thing-like-pass-by-value-pass-by-reference-in-javascript).

Don't mutate data, we'll demonstrate this shortly.

A __pure function__ is one that doesn't modify any values outside of its scope.  What happens between braces (or not between braces as you will see) is the end of it.  No extra values are set on the global scope.  A database isn't written to.  The last bit is important.  We can compose calls to, say, a REST API with functional code, but that's technically _unpredictable_.  It is outside of our control.  We want to seperate our data operations from say acquiring or writing data.  The _logic_ needs to be stand alone.  This will benefit you greatly, in the very near future.

Lastly, __currying__, which is... hard to explain without an example, so...

# Functional FizzBuzz

Let's write some code that introduces these concepts.  In fact, let's start with some _bad_ code (from a functional programming standpoint).  Let's say we want to write good old [`FizzBuzz`](https://www.tomdalling.com/blog/software-design/fizzbuzz-in-too-much-detail/).  This is, of course, a __toy problem__.

> Write a function that prints the numbers from 1 to n. But for multiples of three print "Fizz" instead of the number and for the multiples of five print "Buzz". For numbers which are multiples of both three and five print "FizzBuzz".

There's a few ways to skin this cat.

## The Imperitive Approach

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

Now you're probably saying "but TypeScript has classes!" and here's the other thing to __drill into your ~tiny~ sexy brain__: concatenation operators are not _very FP_.

E.g. `foo.someThing().otherThing()`

Some FP languages (ahem Scala) do that, but really when we are talking about base operators, it's a bad thing.  We're not in the `HAS-A` world anymore, Dorothy.  As we turn this solution into something that's _pretty functional_, those concatenated calls end up causing debugging nightmares and they also belie this core conceit: it's all about the functions, bud.  Using `pipe` or `flow` (as you will shortly see) has an elegance that emphasizes _functions_ and seperates them from their data.  Kind of.  

Trust me.  Swallow this little red pill and all will be illuminated.  It's not rohypnol, I swear.

Of course, this solution is still not functional in any way.  Externally, it seems okay... but what's wrong with it?

1. That `var` keyword implies that you're not being functional.  We are mutating a reference as we concatenate the strings.  You might say to yourself: "It's fine
it's a _local_ variable."  Nyet.  A _pretty functional_ version would _omit_ local variables alltogether, even `const`s.
1. That `for` loop isn't functional at all.  It's _conceptually_ mutating.  We are basically building our data set as we go.
1. Technically, writing to the console is... an external side effect.

So how would we change this?

## Functionalish Approach

For our first go, we're going to utilize the more functional aspects of the widely available [`lodash`](https://lodash.com/) library.  It is far from a complete library for functional programming,
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

First off, you will notice that I have only _typed_ the arguments for this function.  Lodash has a [`flow`](https://lodash.com/docs/4.17.11#flow) operator (you will see it again in Ramda and rx under the name `pipe`),
which basically allows you to curry the input and then pass the results of one function to the other.

```js
const fizzBuzzer: (
 n: number
) => string[] = flow(...)
```

`flow` returns a new function that takes in an argument.  We are telling the TypeScript transpiler that we will be passing this new function a number and that it will
return an array of strings.  This is where __currying__ will come into play, as the problems become more complex.

Everything in the chain is a _function_.  [`range`](https://lodash.com/docs/4.17.11#range) is a Lodash utility to fill an array with numbers in ascending order.  So, it expects a `number` as an argument.

But let's say you aren't quite sure... did it do what I wanted it to do?  This is a pretty normal reaction when using new operators.  All of the libraries we are 
using also have a very handy function [`tap`](https://lodash.com/docs/4.17.11#tap).  `tap` returns its input but lets you operate on it.

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

Before I explain the use of `partialRight`, you might notice something if you run this code... there's a bug!

What is the bug?  Well, this is the output of that call:

```js
[0, 1, 2, 3, 4]
```

So we can't just use range.  This is where being able to toss in a new function, in this case, `tap` can be handy for debugging.

```js
const fizzBuzzer: (
 n: number
) => string[] = flow(
 n => range(1, n + 1),
 partialRight(
  tap,
  console.warn
 ),
 ```

 This gives us a new collection, that meets our specs:

 ```js
 [1, 2, 3, 4, 5]
 ```

 Now, you might be wondering what `partialRight` is doing in all of these.  Good question!

 [`partialRight`](https://lodash.com/docs/4.17.11#partialRight) curries a function for you, by letting you pass all the arguments to the _right_ of the primary argument for any function.  [`partial`](https://lodash.com/docs/4.17.11#partial) does the reverse.

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

 It just saves you the trouble of having to type out the anonymous function to pass the array reference to `tap`.  Congratulations, you've now seen a bit of _currying_ in action.  In fact, much of what `lodash/fp` adds to `lodash` is just wrappers that do what `partial` and `partialRight` do.  Let's move on and I can explain this better.  

 If you find yourself fancying some Thai food, that is perfectly understandable.  I do love a good Panang style curry.


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

With the partials on [`map`](https://lodash.com/docs/4.17.11#map) it becomes a little more... well, is _this_ __currying__?

Yes.

What `partialRight` is doing is saying: "Hey, I'm going to use `map`, but I'm going to change the order so you're really getting something like this:"

```js
const curriedMap = (
  otherFunction: {(
    i: number
  ): number | string}
) => (
  array: (number | string)[]
) => map(array, otherFunction)

```

By _capturing_ the `otherFunction` we now have a _new_ function that takes in an array.  This allows us to easily compose our functions via `flow`.

While this solution is _better_ and _more_ functional, I think we can do a lot better.

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

We can make a wrapper that will do the printing for us, or we could simply put a `console.log` at the end of the `flow` arguments.  I'm not going to do that.  

Instead, let's make a new wrapper, so we can keep our logic seperate.  This will make it a more _pure function_ even though we are just moving that logic to _another function_.  I will explain why in a moment.

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

But, I find that lends to a lack of readability.  Again, ask yourself if you could easily grok this word jumble after a few beers, a month later, when you sit down at home, it's 10 pm at night, and you really _really_ want to fix that bug you were struggling with all day.

Okay, so now I will answer the unanswered question, why did I not just append my original function, `fizzBuzzer`?

Well, I'm glad I asked:
* The `console` is really not a very functional construct, but we have to touch non-functional things, at times.  It's rare, but you could get an error by calling it.  In general, _I/O of any sort is unpredictable_.  By seperating the _logic_ of creating our array, we're starting to _think_ more functionally.
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

I mentioned the _verbosity_ issue... that's kind of just the price you pay when dealing with TypeScript.  It's certainly confusing, at times, as TypeScript is still fairly young.

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

I _prefer_ the last iteration because it's more true to the _functional_ paradigm.  I know I'm dealing with a function and don't need to _capture_ the `x` for any reason.  At the end of the day, programmers are not writing data directly to a computer.  You're not inserting carefully curated, artisinal integers into registers or anything like that.  We're _kind of_ just glorfied typists.  It's a fun way to introduce yourself at parties.

> Friend of a Friend (FOF): So what do you do for work?
You: I type all day.  Sometimes I swear.
FOF: Oh... okay... 
_walks away slowly, doesn't bother you with their brilliant idea for a mobile application_

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

Gaze upon it!  Behold!  It is _pretty functional_, compared to our old looping mess, right?  Well, trust me: it is.

Let's think about this differently, though.

What jumps out at you about this solution?

Let me get your brain's gears turning: how would you _test_ this solution?

I hope you said to yourself "Well, now I can test everything!"

You can test `replacer` on its own.  You can test `fizzBuzzer` on its own.  And then you might not even need to test your `Printer` functions at all (it's possible to test console logging,
I've done it when writing API level code, but it can be a pain in the ass (P.I.T.A.)).

You can also slip `tap` functions into the `flow` chain and easily see what is going on at each stage.  _More importantly_ the core functionality is _pretty_ pure and it's discrete, there's no funny business going on with global variables.  

But let's call this "FizzBuzz Lodash 2: Electric Boogaloo".  What if there was a fan made _alternate_ sequel that also "got the job done?"

However, pause for a moment.  Before you delve into that, feel free to explore this solution in [CodePen](https://codepen.io/ezweave/pen/wLyXGG).  Add some `tap` calls and see what is happening with each new array.  I want you to _get this_.  Playing with the code and _primitive debugging_ can be _very_ illuminating.

Also, in these CodePen exercises, libraries are globally scoped.  So there are no `import` statements.  Instead you have:

```js
const { flow, tap, range, partialRight, map } = _
```

In your code, you will use `import`.  I hope that's not confusing... it shouldn't be!

Now, this code, our first _better_ solution is _pretty functional_.  I don't like the ternarys, but they are what they are.  I'd gladly accept a pull request or merge request (that's the GitLab version) of it, especially if you wrote a _shit ton_ of tests.  I'd say to myself "this isn't perfect, but it's pretty, pretty good." (Channeling Larry David, of course.)

You're already starting "the dance."  This P.R. is from someone _thinking_ about functions.  They're thinking about how they can do things _functionally_.  It's _pretty damn functional_.

But those ternarys...

## Another Functionalish Approach

So let's break this.

We're not going to introduce _monads_ just yet.  I want you, dear reader, to get into thinking about things functionally and working within limits.  Again, you've probably got `lodash` around already.  So let's do this a different way, via `lodash`:

```js
const sassyReplacer = (
 n: number,
 replacement: string
) => (
 val: number | string
) : number | string => val % n === 0 && replacement

const fizzBuzzer: (
 n: number
) => string[] = flow(
 n => range(1, n + 1),
 partialRight(
  map,
  over(
   sassyReplacer(15, 'FizzBuzz'),
   sassyReplacer(3, 'Fizz'),
   sassyReplacer(5, 'Buzz'),
   i => i
  )
 ),
 partialRight(
  map,
  i => find(i)
 )
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
fizzLog(5)
fizzWarn(20)
fizzError(10)
```

This is a bit of an eyeful... and there _is_ a bug in the version of `lodash` I'm using, which I will point out, shortly. (Two, actually.)

The _key_ difference in this implementation is the use of the [`over`](https://lodash.com/docs/4.17.11#over) operator.  Instead of using ternarys, I am replacing them with a new, curried function:

```js
const sassyReplacer = (
 n: number,
 replacement: string
) => (
 val: number | string
) : number | string => val % n === 0 && replacement
```
Using some short circuited boolean logic, this will either return the value I seek _or_ it will return `false`.

Now, breaking these apart into our four sets of rules:

```js
partialRight(
  map,
  over(
   sassyReplacer(15, 'FizzBuzz'),
   sassyReplacer(3, 'Fizz'),
   sassyReplacer(5, 'Buzz'),
   i => i 
  )
 ),
```
Will give us an array with the results of all of those evaluations.  For the a value of 1, for example, I would get:

```js
[false, false, false, 1]
```

Now, the last rule, `i => i` should work with a call to `tap`, but herein may be some mischief within the TypeScript/Lodash transpilation.  Easily enough, we can just spit back the value we seek.

Now, consider when our input number is `15`, the output over over would be:

```js
['FizzBuzz', 'Fizz', 'Buzz', 15]
```

This is why we also want to map over the array of arrays we feed into the next set of operators and use [`find`](https://lodash.com/docs/4.17.11#find):

```js
 partialRight(
  map,
  i => find(i)
 )
```
Here, also, is our second bug.  We should just be able to pass in `find` without capturing the input, but again some kind of TypeScript/Lodash trickery is at work.  As we move to other libraries this will be less of an issue, but we are going to limp before we run.

`find` takes _any_ collection (by which we mean an array or JSON) and returns the _first_ truthy value.  For the case of the number `15`, this will be `'FizzBuzz'`.

Now, [this solution](https://codepen.io/ezweave/pen/qzoaYp) is a bit of a mess.  This is not nearly as elegant as the [last solution](https://codepen.io/ezweave/pen/wLyXGG), but there is a lesson to be learned here: _functions_ can do logical operations.

This is an important concept as in the next chapter, when we start looking at _monads_, we will be doing the same thing only without any flow control.  It will make sense later on.

For the purposes of introducing some of these concepts, the "Mark 2" solution is really best and what I would rather see.  The last solution is really just to demonstrate just how differently you can approach this problem.

# Functional Recursion

_Recusion_ can be a hairy beast.  It starts off so innocently.  You've been handed some exercise by your professor and you have some faint knowledge that "functions can call themselves" and then you get going and... BOOM.  Stack overflow.

This usually happens because some lack of guard has allowed your recursive function to be _too greedy_.  

This is a huge problem for compilers and virtual machines that lack [tail recursion](https://en.wikipedia.org/wiki/Tail_call).  _Hotspot_, which is the Sun originated virtual machine for languages that run on the JVM (redundant, but Java, Scala, Grails) doesn't support it _directly_.  It is possible in Scala because they have a `@tailrec` annotation that tells the compiler, "hey buddy, I am going to call this a great deal so please don't create a new stack frame that is the same as the last fella, eh?"

That's not an important thing to understand and I am doing a great deal of hand waving.  What you need to know is that there are problems that are recursive in the functional world.  I am guessing you have figured that out, since you're this far into a section entitled _Functional Recursion_.

What scares many folks away from such things when trying to be _pretty functional_ in JavaScript and TypeScript is the notion of currying.  The obvious question is "How can I recursively call a curried function?"

Now, to be totally fair, few production problems _require_ recursion.  So you might have dodged this bullet for some time.  But there are _legitamate_ problems that require recursive solutions.  We are ignoring performance, for now, so just bear with me.  But imagine you need to implement a binary search tree, for a good reason (like deeply nested SQL queries that can't be properly optimized at that layer).  If I left you without _some_ exposure on how to handle this functionally, you'd go back to your old ways and write something with bad guards and blow up the stack and be left to contemplate suicide by bashing one's head against a flimsy LED screen.

So, we're going to start _easy_.  Let's do `n!`.  It's a classic and a __toy problem__.

Basicaly `n!` is _factorial of n_, which is the product of integer numbers from 1 to n.

The real _recursion_ here is just in the `reduce` call:

```js
const factorial: (
 n: number
) => number = flow(
 n => range(1, n + 1),
 partialRight(
  reduce,
  (p: number, i: number): number => p * i
 )
)
```

In this example, if I set `n = 10`, I see this output:

```
3628800
```

So this seems so trivial, you're asking "where is the recursion?"  Well, in this __toy problem__, it's all in the function I pass to `reduce`:

```js
(p: number, i: number): number => p * i
```

This is, believe it or not, called _recursively_ but it isn't what you are used to seeing.

A functionalish (wait for it) _recursive_ solution _sans_ reduce looks like this:

```js
const factorialRecurse = (
 n: number
) => n === 0 ? 1 : n * factorialRecurse(n - 1)
```

Again, this isn't mind blowing and the `lodash`-less solution is actually easier to grok.  So let's step through it.

If we want `n = 4`, this becomes easier.  That is:

```
4 * 3 * 2 * 1 = 24
```

The `lodash`-less way is super obvious.  We're just backing down, `1` at a time from `n`.

With the more _idiomatic_ approach, we're sort of cheating.  We _start_ with an array that looks like this (from `range`):

```
[1, 2, 3, 4]
```

Those are, literally, the steps down from `n`, which is 4.

Next, we are using `reduce` to just multiply them all together.  That looks like this:

```
at p=1 i=2 p*i=2
at p=2 i=3 p*i=6
at p=6 i=4 p*i=24
```

If it's not obvious yet... we're cheating.  This isn't _recursive_ in the sense you're used to.  It is, however, recursive with regards to the data.  We are taking advantage of the fact that we _know_ that the multipicands are going to be the values in the array `[1, 2, 3, 4]`.

The real answer here is that we don't want to _do recursion_ in the conventional way.  There is a problem of scope _and_ of idiom.

In the ES6 (modern, at this time, JavaScript world) we _could_ use `bind` (or the `lodash` equivalent) to set and access variables on the global scope.  This is how you would get around problems with _anonymous_ functions inside of a curried series.  _However_ this is _inherintly_ not functional, so I won't explain it.  Don't do that.

Remember Scala and the annotation for tail recursion?

You don't usually need to do that.  The truth is, recursion isn't very FP.  Not in the traditional sense.  Instead, we want to change one set of data and pass it on.  `reduce` is great for this.  Again, `n!` is a __toy problem__.  You won't be doing anything that trivial in production applications.  You can get _functionalish_ by using the `factorialRecurse` style, but really, we are breaking the idiom.

_However_ you can do it in some languages.  In the Scala world, if you use the `@tailrec` annotation, the compiler _checks to see if your call is tail recursive and then makes it imperitive_.  It also lies to you.

Let me be clear.  You don't need to grok Scala to get this ([taken from here](https://alvinalexander.com/scala/scala-recursion-examples-recursive-programming#a-tail-recursive-fibonacci-recursion-example)):

```scala
import scala.annotation.tailrec

/**
 * The `fibHelper` code comes from this url: rosettacode.org/wiki/Fibonacci_sequence#Scala  
 */
object FibonacciTailRecursive extends App {
    
    println(fib(9)) // this is a static call, since you might not know Scala... if you do this outside of toy problems, you suck

    def fib(x: Int): BigInt = {
        // Scala needs this annotation or it will yell at you, because you're gonna blow that stack when n gets big
        @tailrec def fibHelper(n: Int, prev: BigInt = 0, next: BigInt = 1): BigInt = n match {
            case 0 => prev
            case 1 => next
            case _ => fibHelper(n - 1, next, (next + prev))
        }
        fibHelper(x)
    }

}
```

In this case, `fibHelper` is a function.  `fib`, which is the _member function_ of a class that has nothing else (again, Scala isn't pure FP, yell at me all you'd like).  It is merely _the step 0_ of a recursive call.  `fibHelper` is the one being called _over and over again_.

This isn't too different from our `n!` using `reduce`.  Just shift your thinking from recusion being:

```
  foo
    foo
      foo
        foo
         ... until some guard is hit
```

To:

```
Look at data.
Change data.
Pass new data.
Repeat.
```

That's it.

I've actually lied to you.  This isn't _recursion_ per se.  `reduce` allows the _same logic_ but without the same programmatic constructs one would use when writing recursive functions in other languages.  It is _and_ isn't recursive.  We are _recursive_ in the sense that `reduce` operations look at _the last_ thing we fiddled with and it _is_ calling the same "function" but it isn't.  We could _bike shed_ about various JavaScript runtimes, but from your perspective (and you're not wrong) it's calling a _new anonymous function_ that just looks the same with _new_ data (the output of the last cycle).

You will find that `reduce` is useful in lots of places and I suspect, you might have fiddled with it already.  There are other ways to do _recursive_ style operations in JavaScript, but it isn't really _your grandad's recursion_.  (I am 39, so I could be... or perhaps am, your granddad.)

What is important to grok, is that using `reduce` requires similar thinking to how you'd write `foo calls foo` in another language.  You still need guards in that anonymous function.  If you don't... you can end up with sexy new errors.

Basically, almost any problem you would do _impertively_ with calls to the function calling, can be solved differently in the _pretty functional_ world.  Think about the data, not the call stack.

# Summary

So we've started to get _more_ functional.  We're eschewing the use of ES6 classes and operators (`Array.map`, for example) and using `lodash`s `flow` with functions that are not connected to any particular data type.  We're also starting to think about operating on collections, vs objects. Oh wait, are we?

Remember that JSON is just a `map`.  It's really just another collection type, which is why many `lodash` operators work on arrays or maps.  Keep that in mind going forward.  When we start using `rxjs` and introduce the concept of a _stream_, this is an important thing to understand.  But we're limping before we're sprinting.  For our purposes, ES6 classes are _not_ particularly useful.  There is a difference, of course between JSON and an ES6 class.  I prefer the former, as it lends to a _more_ functional style.

Some basic takeaways:
* Fat arrows are your friend.
* Compose operations as a series of functions, each doing something _discrete_ to a data set.
* Write tests around your functions.
* Use `tap` to inspect data without manipulating it.
* `partialRight` is _very_ handy in currying functions to expect the _data_ last.

Things we _haven't_ dealt with yet:
* WTF is a _monad_?
* Dealing with external, unpredictable endpoints
* Alternative approaches using other libraries
* Performance

I hope you aren't sick of `FizzBuzz` quite yet... it's a stupidly simple problem (a __toy problem__), that we will be revisiting when we start talking about _monads_ in Chapter 2.

# Exercises

For your first assignment, I've already pulled in the `FizzBuzz` solution for you.  In the version of TypeScript that is bundled with this repo, there are more disagreements between `lodash` and TypeScript, so the code is a _wee_ bit different.

Don't let that alienate you, because I didn't want to throw you into the fire with syntax that is slightly off.

Other than having to wrap a call with `flow` (the `replacer`), which is unnecessary, the only other difference is that we are placing our flow/piped functions inside an array.  E.g. `flow([...])`.  It's two extra characters.

As for the rest of the problems, the ones you will do yourself, _feel free_ to break up the problem into multiple little pieces.  Write tests against each one.  Dive into the [`lodash`]() documentation and start thinking about what you're doing.

I can't really (or easily) analyze your code programmatically to see if it is functional.  

To run the tests (from the root of the repo) simply type:

```bash
jest chapters/one/exerciseOne.spec.ts
```

Of course, you can _read_ the tests.  I just don't want you to [Kobayashi Maru](https://en.wikipedia.org/wiki/Kobayashi_Maru) them, because then you learn nothing and Gene Wilder as Willy Wonka won't let you take over the factory.  Stretch that brain, do it differently.  Play around.

[Table of Contents](../../README.md#table-of-contents)