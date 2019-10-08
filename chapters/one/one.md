# Chapter 1: Pretty Fizzy With Lodash

![lodash](/static/images/lodash.png)

## Introduction

- [Terminology](#terminology)
 - [What is a function?](#what-is-a-function)
 - [Three key concepts](#three-key-concepts)
- [Functional FizzBuzz](#functional-fizzbuzz)
  - [The Imperitive Approach](#the-imperitive-approach)
  - [Functionalish Approach](#functionalish-approach)
  - [Another Functionalish Approach](#another-functionalish-approach)
- [Functional Recursion](#functional-recursion)
- [Summary](#summary)
- [Exercises](#exercises)

[Table of Contents](/chapters/table_of_contents.md)

There _is_ a whole way of viewing functional programming through the lens of [_lambda calculus_](https://en.wikipedia.org/wiki/Lambda_calculus), but we aren't there yet.  While your author certainly loves to talk about math (or pretend he knows anything about the subject), this book aims to be a bit more practical and start by _building confidence_ in a few basic ideas and a very different way of looking at data.  You've probably surmised as much already, given the quite "casual" tone of the text thus far.

This, of course, has benefits for you.  Because the focus of the first chapter won't be to delve into more esoteric operators, which you find in `ramda` and `lodash/fp` or introduce you to the most digestible _monads_ from `monet` (there is a joke about writing blog posts on monads as a rite of passage for functional programmers).  We won't even jump into the _streaming_ concept you would get with `rxjs`.

This will be pure and concrete demonstration of functional ideas using the humble `lodash` library.  You can write functional code with `lodash`?  Absolutely.

There will be those of you who read the last statement and close this book forever.  Life is too short for such banalities.  Yes, there are more fully featured libraries, and for many `lodash` is unsexy and unappealing.  I, obviously, disagree.  It is but a tool and you will learn to use many, in your career.  It's akin to asking if you can write Object Oriented code in Java?  Of course you can, but... you can also write very iterative, very non OO code.  Conversely, you can write very non-functional code using `lodash`.  It wasn't built as a functional library, _per se_, though the `lodash/fp` library is literally just a wrapper that does what we will do with `partialRight` and such out of the box.

`lodash` should be given _more_ credit for pushing functional programming concepts (`map` operations in particular) into common use in the JavaScript world, which ultimately led to things like `Array.map` and such being a part of the SDK.  We will address this and, _caveat emptor_, the author does _not_ really like the built in `map` function... but we will get to that.

On with the show!

# Terminology

For now, let's just call _everything_ a function.  Beyond that, there are some other terms bandied about: _higher order functions_, _anonymous functions_, and many more.  These terms are useful to know, but I don't want to delve too deeply into the nuances between all of those terms.  I'm just going to talk about functions.

[Top](#introduction)

[Table of Contents](/chapters/table_of_contents.md)

# What Is A Function?

People often use the terms _method_, _procedure_, and _function_ interchangeably.  While this is _sort of_ okay it's sort of like mixing up bourbon, rye, and Scotch whisk(e)y.  There are differences between them and you'd probably not make any friends by confusing them.

__Function__: the name is mathematical and the concept is too, this is kind of the core of _functional programming_.  E.g.
```
f(x) = y
```

For some input value _x_, return a _y_.

Consider a simple _linear_ function.

```
f(x) = mx + b
```

When these inputs and outputs are represented graphically on a Cartesian co-ordinate system, this gives you a _straight line_.  Which is to say if we represent the inputs, _x_, on the horizontal axis and the output, _f(x)_ (aka _y_) on the vertical axis, and _m_ and _b_ are constants, then _m_ represents the _slope_ of a line and _b_ represents the point on the vertical (or _y_) axis where _x_ is zero.  But this is really just a relationship between inputs and outputs and the "graph" you may remember from your youth is just a way of representing that relationship.

That's pretty basic math and you can imagine a TypeScript function that does _exactly_ that:

```js
function f(x: number): number {
  return 4 * x + 12
}
```

If you wanted to make that more _functional_ (in style or perhaps, _pretty functional_) you could write something like this:

```js
const f = (
  m: number,
  b: number
) => (
  x: number
): number => m * x + b

const f1 = f(4, 12)
const y = f1(2)
// y = 20
```

"What the eff is that mess?"

I will get to that... I'm just teasing you with the format, but you can see that we _take some input_ and return some _output_.  If we go back to our more traditional `function f(x)` we can see that _no matter the input we return the same output_.  This concept is important (we call this being _deterministic_) and is _easy_ in something as simple as `f(x) = mx + b`.  But this idea is _fundamental_ to functional programming.  It might quickly grow to something that you can't easily describe, as a formula, using basic Algebra, but we always want to do the same thing, given the same input.

Of course, taken further, you will see that _external_ injection (like getting data from a REST endpoint) needs to be handled carefully.  More on that later, which is to say, that's where `rxjs` really shines.

__Method__: methods _are functions_, but they are often divorced from the notion of a _pure function_ (we will explain this shortly).  _Methods_ come from object oriented programming and specifically refer to a _member function_.  Which is to say, a _function_ that is a member in the same way that a _variable_ might be: it is encapsulated by a parent.  But, as you can see, the math can break down.  Consider the practice of `getters` and `setters` in Java:

```java
class Foo {
  private String bar;

  public void setBar(String bar) {
    this.bar = bar;
  }

  public String getBar() {
    return this.bar;
  }
}
```

While `setBar` and `getBar` are _member functions_, they don't lend themselves to mathematical description easily. 

Why?

> _Caveat emptor: your author has strong feelings about class level functions, which you may disagree with._

It's because they don't have both an obvious _x_ or an obvious _y_.  One can argue that they do, but because they're bound to an object, they don't _feel_ very functional.  For our purposes, class level functions (really _methods_) are not very functional.  More on that in a bit, but for now...

__Procedure__: largely this term isn't used by modern programmers, but it occasionally pops up.  While _methods_ often don't return anything, _procedures_ never do.  It's basically a swallower of variables.  It doesn't mean they don't _do_ anything.  The one place you will find them pop up is in the realm of relational database systems.  The use of the term there is a bit different, however, it is correct in that they usually are triggered by some data being written to a table, where upon they will write to some other table.  So they don't really have outputs as you would expect.

We don't use this term or concept at all in functional programming directly.  I/O _can_ often be considered a procedure, but usually we at least get some sort of status value from those sorts of calls.  Whether or not you wish to call that a _procedure_ is sort of up to you, but you might get some odd looks from your colleagues.

And one more thing, before I move on: __closures__.  Closures are actually quite simple things and we introduced one above, in concrete terms _a closure is a function that captures some lexical state and returns a new function_.  This is at the heart of _currying_.  I will discuss currying further in the next section, but let's write a little closure in _old school_ ES6/TypeScript:

```js
function decorator(greeting: string) {
  return function(name: string) {
    return `${greeting}, ${name}!`
  }
}
```

This can be used as such:

```js
const howdy = decorator('Howdy')
howdy('pardner`)
// 'Howdy, pardner!'
```

The `greeting` may only be available to you at a certain point in execution, but you might need it later.  So the closure, `decorator` is capturing that value when you have it, so you can use it later.  As you will see in the __toy problem__ we are about to look at, you will _do this all the time_.

This will make more sense shortly, but really I would write the `decorator` as such:

```js
const decorator = (
  greeting: string
) => (
  name: string
): string => `${greeting}, ${name}!`
```

You will really see how handy this is, very, very soon.

[Top](#introduction)
[Table of Contents](/chapters/table_of_contents.md)

# Three Key Concepts

There are three concepts in functional programming that we need to have some knowledge of before we really start writing code, I've introduced some of these already, but let's be explicit:

- __Immutability__
- __Pure functions__
- __Currying__

A little on each, and I'll demonstrate their use _shortly_.

__Immutability__ is the idea that we don't change any data in place.  Data comes in, new data (most likely copied data) comes out.  If you remember some language concepts, what we're really doing is _passing by value_.  Javascript libraries that lend themselves to functional programming exclusively operate in this manner.  We'll elaborate on this more later, but JavaScript doesn't _really_ support pass by reference, at a language level.  Even an object is actually a value and not a reference, but that nuance leads to a [rabbit hole of stupid arguments](https://stackoverflow.com/questions/2835070/is-there-thing-like-pass-by-value-pass-by-reference-in-javascript).

Don't mutate data, I'll demonstrate this shortly.

A __pure function__ is one that doesn't modify any values outside of its scope.  This goes back to our talk on _functions_, _methods_, and _procedures_.  What happens between braces (or not between braces as you will see) is the end of it.  No extra values are set on the global scope.  A database isn't written to.  The last bit is important.  We can compose calls to, say, a REST API with functional code, but that's technically _unpredictable_.  It is outside of our control.  We want to separate our data operations from say acquiring or writing data.  The _logic_ needs to be stand alone.  This will benefit you greatly, in the very near future.  In practice, you _will_ have to deal with I/O (let's consider all such things: writing or reading from a database, a REST call, an external library) _non-deterministic_.  You can still write functional code that interacts with _non-deterministic_ entities, you just _compose_ it differently.  Of course, when we delve into problems with `rxjs` you will see that it has unique ways of handling calls that might be _non-deterministic_, but for now, I'm not going to bother with that.

Lastly, __currying__, I talked about _closures_ and _currying_ is really utilizing the JavaScript notion of a closure to capture variables at different stages.  This is also called _capturing lexical state_.  This is a very powerful, very useful tool in functional programming.

[Top](#introduction)
[Table of Contents](/chapters/table_of_contents.md)

# Functional FizzBuzz

Let's write some code that introduces these concepts.  In fact, let's start with some _bad_ code (from a functional programming standpoint).  Let's say we want to write good old [`FizzBuzz`](https://www.tomdalling.com/blog/software-design/fizzbuzz-in-too-much-detail/).  This is, of course, a __toy problem__.

> Write a function that prints the numbers from 1 to n. But for multiples of three print "Fizz" instead of the number and for the multiples of five print "Buzz". For numbers which are multiples of both three and five print "FizzBuzz".

There's a [few ways to skin this cat.](https://youtu.be/cUcjn1CuRZI?t=45)

[Top](#introduction)

[Table of Contents](/chapters/table_of_contents.md)

## The Imperative Approach

Here is a traditional, more _imperative_ solution.  It's probably the _obvious_ solution to anyone who comes from the C-family world:

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

### This is important

* Don't use the `function` keyword.

> _Caveat emptor: the author has strong feelings about [fat arrows](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions)!_

That's _not_ really within the functional idiom, or at least outside of the idiom I call _pretty functional_.  I realize I just told you not to use the keyword `function` when writing functional code.  Divorce the keyword from the concept.  You can absolutely write functional code that way, but as we get further into these exercises, you will find yourself fighting TypeScript, and it will become confusing.  When we talked about _functions_ and _closures_, I rewrote the _closure_ without the `function` keyword for a reason.  Even if we don't solve the other issues with the _imperative_ approach to `FizzBuzz` we can, at least, rewrite our _imperative_ version with a bit more verve and a fat arrow:

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

Now you're probably saying "but TypeScript has classes!" and here's the other thing to __drill into your ~tiny~ beautiful brain__: concatenation operators are not _very FP_.  Remember, classes really have _methods_ which may or may not be _pure functions_.

E.g. `foo.someThing().otherThing()`

Some FP languages (ahem Scala) do that, but really when we are talking about base operators, it's a bad thing.  We're not in the `HAS-A` world anymore, Dorothy.  As we turn this solution into something that's _pretty functional_, those concatenated calls end up causing debugging nightmares and they also belie this core conceit: it's all about the functions, bud.  Using `pipe` or `flow` (as you will shortly see) has an elegance that emphasizes _functions_ and separates them from their data.  Kind of.  It also prevents calls that start to look like:

```js
doOneThing(x)
 .someThingElse(b)
    .someThingElse(c)
```

Trust me.  Swallow this little red pill and all will be illuminated.  It's not Rohypnol, I swear.

Of course, this solution is still not functional in any way.  Externally, it seems okay... but what's wrong with it?

1. That `var` keyword implies that you're not being functional.  We are mutating a reference as we concatenate the strings.  You might say to yourself: "It's fine
it's a _local_ variable."  Nyet.  A _pretty functional_ version would _omit_ local variables altogether, even `const`s.
1. That `for` loop isn't functional at all.  It's _conceptually_ mutating.  We are basically building our data set as we go.
1. Technically, writing to the console is... an external side effect.

So how would we change this?


[Top](#introduction)
[Table of Contents](/chapters/table_of_contents.md)

## Functionalish Approach

For our first go, we're going to utilize the more functional aspects of the widely available [`lodash`](https://lodash.com/) library.  It is far from a complete library for functional programming, but it has grown _a lot_ since it was forked from the underscore (`_`) library many moons ago.

It has a lot of operators that you can use and since it's widely used outside of _functional_ programming, you might already be familiar with aspects of it or are even using it already.  In other words there's no overhead added by using it in existing repositories, because someone probably already did.  Or didn't, let's not fight about that.

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

First off, you will notice that I have only _typed_ the arguments for this function.  Lodash has a [`flow`](https://lodash.com/docs/4.17.11#flow) operator (you will see it again in Ramda and `rxjs` under the name `pipe`), which basically allows you to curry the input and then pass the results of one function to the other.

```js
const fizzBuzzer: (
 n: number
) => string[] = flow(...)
```

`flow` returns a new function that takes in an argument.  We are telling the TypeScript transpiler that we will be passing this new function a number and that it will
return an array of strings.  This is where __currying__ will come into play, as the problems become more complex.  In fact, you will find yourself using __currying__ constantly, so much so that you won't even think about it.  You'll even find yourself going more than two levels deep... you may find that you pass around curried functions and keep invoking new closures for a while... until your curried function (which is a data type that is somewhat similar to an object) is four levels deep.  But don't worry about that for now.

Everything in the chain is a _function_.  [`range`](https://lodash.com/docs/4.17.11#range) is a Lodash utility to fill an array with numbers in ascending order.  So, it expects a `number` as an argument.

But let's say you aren't quite sure... did it do what I wanted it to do?  This is a pretty normal reaction when using new operators.  All of the libraries we are going to be 
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

So we can't just use range.  This is where being able to toss in a new function, in this case, `tap` can be handy for debugging.  We've spotted a problem we didn't even think of.

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

 [`partialRight`](https://lodash.com/docs/4.17.11#partialRight) curries a function for you, by letting you pass all the arguments to the _right_ of the primary argument for any function.  [`partial`](https://lodash.com/docs/4.17.11#partial) does this but in normal, left-to-right order.  `partialRight` is very useful with `lodash` (and other libraries) because often, the first argument of an operator is an array or collection, but if you're using a `pipe`/`flow` construct, you won't have that in your current lexical scope.

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

 Which is to say that we could rewrite them as:

 ```js
 const func1 = (
   data: number[]
 ) => tap(data, console.warn)
```

Is the same as:

```js
const func1 = partialRight(
  tap,
  console.warn
)
```

Which we can even type explicitly as:

```js
const func1: (data: number[]) => number = partialRight(
  tap,
  console.warn
)
```

To make it more clear that the two are _identical_.  One is just a little less typing.

It just saves you the trouble of having to type out the anonymous function to pass the array reference to `tap`.  Congratulations, you've now seen a bit of _currying_ in action.  In fact, much of what `lodash/fp` adds to `lodash` is just wrappers that do what `partial` and `partialRight` do.  Let's move on and I can explain this better.  

If you find yourself fancying some Thai food, that is perfectly understandable.  I do love a good Panang style curry.  However, the term _curry_ is actual a reference to [Haskell Curry](https://en.wikipedia.org/wiki/Haskell_Curry).

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
1. __It doesn't actually print anything.__

Well, let's work backwards.

We can make a wrapper that will do the printing for us, or we could simply put a `console.log` at the end of the `flow` arguments.  I'm not going to do that.  

Instead, let's make a new wrapper, so we can keep our logic separate.  This will make it a more _pure function_ even though we are just moving that logic to _another function_.  I will explain why in a moment.

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
* The `console` is really not a very functional construct, but we have to touch non-functional things, at times.  It's rare, but you could get an error by calling it.  In general, _I/O of any sort is unpredictable and non-deterministic_, as we have stated previously.  By separating the _logic_ of creating our array, we're starting to _think_ more functionally.
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

I _prefer_ the last iteration because it's more true to the _functional_ paradigm and it gets you to think of functions as first class constructs.  I know I'm dealing with a function and don't need to _capture_ the `x` for any reason.  At the end of the day, programmers are not writing data directly to a computer.  You're not inserting carefully curated, artisanal integers into registers or anything like that.  We're _kind of_ just glorified typists.  It's a fun way to introduce yourself at parties.

>>Friend of a Friend (FOF): So what do you do for work?
>>
>>You: I type all day.  Sometimes I swear.
>>
>> FOF: Oh... okay... _walks away slowly, doesn't bother you with their brilliant idea for a mobile application_

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

You can test `replacer` on its own.  You can test `fizzBuzzer` on its own.  And then you might not even need to test your `Printer` functions at all (it's possible to test console logging, I've done it when writing API level code, but it can be a pain in the ass (P.I.T.A.)).

You can also slip `tap` functions into the `flow` chain and easily see what is going on at each stage.  _More importantly_ the core functionality is _pretty_ pure and it's discrete, there's no funny business going on with global variables.  

But let's call this "FizzBuzz Lodash 2: Electric Boogaloo".  What if there was a fan made _alternate_ sequel that also "got the job done?"

However, pause for a moment.  Before you delve into that, feel free to explore this solution in [CodePen](https://codepen.io/ezweave/pen/wLyXGG).  Add some `tap` calls and see what is happening with each new array.  I want you to _get this_.  Playing with the code and _primitive debugging_ can be _very_ illuminating.

Also, in these CodePen exercises, libraries are globally scoped.  So there are no `import` statements.  Instead you have:

```js
const { flow, tap, range, partialRight, map } = _
```

In your code, you will use `import`.  I hope that's not confusing... it shouldn't be!

Now, this code, our first _better_ solution is _pretty functional_.  I don't love the ternary operators, but they are what they are.  Sometimes they _are_ the best solution, but they often get harry (when you start having long chains of them).  I'd gladly accept a pull request or merge request (that's the GitLab version) of it, especially if you wrote a _shit ton_ of tests.  I'd say to myself "this isn't perfect, but it's pretty, pretty good." (Channeling Larry David, of course.)

You're already starting "the dance."  This P.R. is from someone _thinking_ about functions.  They're thinking about how they can do things _functionally_.  It's _pretty damn functional_.

But those ternary operators...

[Top](#introduction)

[Table of Contents](/chapters/table_of_contents.md)

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

The _key_ difference in this implementation is the use of the [`over`](https://lodash.com/docs/4.17.11#over) operator.  Instead of using ternary operators, I am replacing them with a new, curried function:

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

This is an important concept as in the third chapter, when we start looking at _monads_, we will be doing the same thing only without any flow control.  Monads will provide the control for us, but this is to give you an inkling into what we will be doing when we start talking about left and right values and the like.

For the purposes of introducing some of these concepts, the "Mark 2" solution is really best and what I would rather see.  The last solution is really just to demonstrate just how differently you can approach this problem.

[Top](#introduction)

[Table of Contents](/chapters/table_of_contents.md)

# Functional Recursion

_Recursion_ can be a hairy beast.  It starts off so innocently.  You've been handed some exercise by your professor and you have some faint knowledge that "functions can call themselves" and then you get going and... BOOM.  Stack overflow.

```
RangeError: Maximum call stack size exceeded
```

This usually happens because some lack of guard has allowed your recursive function to be _too greedy_, but it is also a problem of _growing the call stack_.  A recursive function that is _too greedy_ adds too many frames to the [call stack](https://en.wikipedia.org/wiki/Call_stack) (which we just call "the stack").

For example:

```js
const foo = (
  x: number
) => {
  const n = x > 0 ? foo (x -1) : x
  return n
}
```

The stack, of course, will grow until the guard is hit, and then it will pass back that reference through all prior calls.

Essentially, for `foo(4`), the stack looks like this when we hit the guard:

```js
foo(0)
foo(1)
foo(2)
foo(3)
foo(4)
```

For large values of `x`, the stack will grow in a linear fashion, but this (of course) is a _very_ toy problem and in reality it will grow much larger.  There is a way to rewrite `foo` to prevent this, but more on that in a moment.

Out of control stack growth is a huge problem for compilers and virtual machines that lack support for [tail calls](https://en.wikipedia.org/wiki/Tail_call).  _Hotspot_, which is the Sun originated virtual machine for languages that run on the JVM (redundant, but Java, Scala, Grails) doesn't support it _directly_.  It is possible in Scala because they have a `@tailrec` annotation that tells the compiler, "hey buddy, I am going to call this a great deal so please don't create a new stack frame that is the same as the last fella, eh?"

That's not an important thing to understand and I am doing a great deal of hand waving.  What you need to know is that there are problems that are recursive in the functional world.  I am guessing you have figured that out, since you're this far into a section entitled _Functional Recursion_.

Remember Scala and the annotation for tail recursion?

JavaScript _does_ support tail calls (as a language spec, but I'll get to that in a bit), and tail calls aren't even only the domain of recursion.  Simply put, a tail call (wherein we don't add to the call stack unnecessary frames), is _any_ function that calls another function on a return:

```js

const otherFoo = (
  x: number
) => bar(x)
```

That is technically a tail call.  JavaScript supports tail calls in `strict` mode, which helps to keep the stack in check.

We can also rewrite `foo` to use a tail call:

```js
const foo = (
  x: number
) => x > 0 ? foo(x - 1): x
```

This, when employed in `strict` mode, is called a __Proper Tail Call__ (PTC).

But writing a PTC is a subtle thing because neither this:

```js
const yetSomeOtherFoo = (
  x: number
) => x + bar(x)
```

nor our old `foo`:

```js
const foo = (
  x: number
) => {
  const n = x > 0 foo(x - 1) : x
  return n 
}
```

Have PTCs.

Now in the Scala world, if you use the `@tailrec` annotation, the compiler _checks to see if your call is tail recursive_ (such trickery). 

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
            case _ => fibHelper(n - 1, next, (next + prev)) // tail call!
        }
        fibHelper(x)
    }

}
```

In this case, `fibHelper` is a function.  `fib`, which is the _member function_ of a class that has nothing else (again, Scala isn't pure FP, yell at me all you'd like).  It is merely _the step 0_ of a recursive call.  `fibHelper` is the one being called _over and over again_.

__Now for some bad news!__

Since I told you about how great PTCs are, you should know that very few JavaScript runtimes _actually_ support them in 2019.  _Le sigh_.  As of this writing, [you can see that](https://kangax.github.io/compat-table/es6/#test-proper_tail_calls_(tail_call_optimisation)) when it comes to ES6, not even [Node](https://stackoverflow.com/questions/23260390/node-js-tail-call-optimization-possible-or-not) supports them.  Oddly enough, Safari does.  Yay?

I mentioned PTCs, knowing full well you probably can't use them, solely because I'm hopeful that _one day_ you will.  It's also just important to understand what happens when you make a recursive call.

Ignoring that, what scares many folks away from recursion when trying to be _pretty functional_ in JavaScript and TypeScript is the notion of currying.  The obvious question is "How can I recursively call a curried function?"

It's really no different than how you'd call a function by itself (remembering that a curried function returns a new function with lexical state), but let's start writing some actual code.

So, we're going to start _easy_.  Let's do `n!`.  It's a classic and a __toy problem__.

Basically `n!` is _factorial of n_, which is the product of integer numbers from 1 to n.

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

This seems so trivial, you're asking "where is the recursion?"  Well, in this __toy problem__, it's all in the function I pass to `reduce`:

```js
(p: number, i: number): number => p * i
```

Now some of you might know that `reduce` isn't really recursive, and you're correct.  I've basically cheated.  But it is _often_ used in place of explicit recursion and, aside from the call stack, can be thought of in a similar fashion.

`reduce` starts with some initial value, then calls the `iteratee` function until it's mapped over all items in the collection.

A functionalish truly _recursive_ solution looks like this:

```js
const factorialRecurse = (
 n: number
) => n === 0 ? 1 : n * factorialRecurse(n - 1)
```

But, of course, it really needs PTC support to be performant, but barring that....

This isn't mind blowing and the `lodash`-less solution is actually easier to grok.  This is a common claim in other functional languages (which also have a `reduce` or analog).  So let's step through it.

If we want `n = 4`, this becomes easier.  That is:

```
4 * 3 * 2 * 1 = 24
```

The `lodash`-less way is super obvious.  We're just backing down, `1` at a time from `n`.

With the more _idiomatic_ approach, we're cheating.  We _start_ with an array that looks like this (from `range`):

```
[1, 2, 3, 4]
```

Those are the steps down from `n`, which is 4.

Next, we are using `reduce` to just multiply them all together.  That looks like this:

```
at p=1 i=2 p*i=2
at p=2 i=3 p*i=6
at p=6 i=4 p*i=24
```

This isn't too different from our `n!` using `reduce`.  Just shift your thinking from recursion being:

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

You will find that `reduce` is useful in lots of places and I suspect, you might have fiddled with it already.  There are other ways to do _recursive_ style operations in JavaScript, but it isn't really _your grandad's recursion_.  (I am 39, so I could be... or perhaps am, your granddad.)

What is important to grok, is that using `reduce` requires similar thinking to how you'd write `foo calls foo` with a truly recursive call.  You need to think about the data set you're building as you step through the data set.

Now, there's an even _wilder_ concept to grab onto.

_Recursive reducing._

Lodash (and all the other libraries we will use in subsequent chapters) has a `flattenDeep` method that will flatten nested arrays into one.

Basically, if the input array looks like this:

```js
[1, 2, [3, [4, 5]]]
```

Then running `flattenDeep` gives us:

```js
[1, 2, 3, 4, 5]
```

ES6 has this built in, but (of course) it's a member of the `Array.prototype` and smacks of OO styling.

But what if we were to... write our own?

Let's call ours `flattenSoDeep` because it's funny (right?):

```js
const flattenSoDeep = (
 arreh: number[]
): number[] => isArray(arreh) ?
  reduce(
    arreh, 
    (done: number[], current: number[]) => concat(done, flattenSoDeep(current)),
    []
  ) : arreh
```
_NOTE: here TypeScript actually lets us be a bit lazy... we really have an irregular array and not a normal one dimensional job.  It's not wrong, but the actual typing is not obvious._

Not very surprising, is it?

The important part, as with all recursive code, is to _make sure your guard is hit_.  The guard in this case is just the check to see if we have reached the end of nested arrays.  E.g. `isArray`.

[Try it yourself!](https://codepen.io/ezweave/pen/GbzGXq)

Now, what if we want to make our syntax just a _bit tighter_?  Well... we can, by using a technique called _mutual recursion_.

Behold:

```js
interface Flattener {
 (x: number[]): number[]
}

const mutual = (
 flattener: Flattener
) => (
 done: number[],
 current: number[]
): number[] => concat(done, flattener(current))

const flattenSoDeep = (
 arreh: number[]
): number[] => isArray(arreh) ?
  reduce(
    arreh, 
    mutual(flattenSoDeep),
    []
  ) : arreh
```

I added the `Flattener` type for convenience, but you can see what we are doing.  The function passed in calls `mutual` which then calls the function that we passed in... this is a form of _mutual recursion_.  This solution, for what it's worth, is harder to understand than the more obvious solution we tackled earlier, but it demonstrates the concept.

[Give it a go](https://codepen.io/ezweave/pen/YoBjyG) and see what you think.

Basically, almost any problem you would do _imperatively_ with calls to the function calling, can be solved differently in the _pretty functional_ world.  Think about the data, not the call stack.

__I've really only touched on recursion__, as that's not the focus of this book.  I'm just giving you enough to be dangerous.  For a more in depth look at various recursive approaches, I'd refer you to [Functional Light JS](https://github.com/getify/Functional-Light-JS/blob/master/manuscript/ch8.md/#chapter-8-recursion) wherein the author, Kyle Simpson goes a bit further with explaining the state of the stack and various styles of recursion.

It's a damn shame that PTCs aren't widely supported.

[Top](#introduction)

[Table of Contents](/chapters/table_of_contents.md)

# Summary

So we've started to get _more_ functional.  We're eschewing the use of ES6 classes and operators (`Array.map`, for example) and using `lodash`s `flow` with functions that are not connected to any particular data type.  We're also starting to think about operating on collections, vs objects. Oh wait, are we?

Remember that JSON is just a `Map` (in terms of data structure).  It's really just another collection type, which is why many `lodash` operators work on arrays or maps.  Keep that in mind going forward.  When we start using `rxjs` and introduce the concept of a _stream_, this is an important thing to understand.  But we're limping before we're sprinting.  For our purposes, ES6 classes are _not_ particularly useful.  There is a difference, of course between JSON and an ES6 class.  I prefer the former, as it lends to a _more_ functional style.

Some basic takeaways:
* Fat arrows are your friend.
* Compose operations as a series of functions, each doing something _discrete_ to a data set.
* Write tests around your functions.
* Use `tap` to inspect data without manipulating it.
* `partialRight` is _very_ handy in currying functions to expect the _data_ last.
* Despite what some may tell you, `lodash` is a perfectly viable toolset to use for Functional Programming.

Things we _haven't_ dealt with yet:
* WTF is a _monad_?
* Dealing with external, unpredictable endpoints.
* Alternative approaches using other libraries.
* Performance (especially since we don't have PTCs).

I hope you aren't sick of `FizzBuzz` quite yet... it's a stupidly simple problem (a __toy problem__), that we will be revisiting in the next two chapters.

# Exercises

For your first assignment, I've already pulled in the `FizzBuzz` solution for you.  In the version of TypeScript that is bundled with this repository, there are more disagreements between `lodash` and TypeScript, so the code is a _wee_ bit different.

Don't let that alienate you, because I didn't want to throw you into the fire with syntax that is slightly off.

Other than having to wrap a call with `flow` (the `replacer`), which is unnecessary, the only other difference is that we are placing our flow/piped functions inside an array.  E.g. `flow([...])`.  It's two extra characters.

As for the rest of the problems, the ones you will do yourself, _feel free_ to break up the problem into multiple little pieces.  Write tests against each one.  Dive into the [`lodash`]() documentation and start thinking about what you're doing.

I can't really (or easily) analyze your code programmatically to see if it is functional.  

To run the tests (from the root of the repository) simply type:

```bash
jest chapters/one/exerciseOne.spec.ts
```

Of course, you can _read_ the tests.  I just don't want you to [Kobayashi Maru](https://en.wikipedia.org/wiki/Kobayashi_Maru) them, because then you learn nothing and Gene Wilder as Willy Wonka won't let you take over the factory.  Stretch that brain, do it differently.  Play around.

Then, when you feel you are ready... [Chapter 2: Events in the Stream](/chapters/two/two.md) awaits.

[Top](#introduction)

[Table of Contents](/chapters/table_of_contents.md)