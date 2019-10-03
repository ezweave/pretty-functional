# Chapter 3: An Introduction to Lambda Calculus 

![lambda](/static/images/lambda_graf.png)

# Introduction

- [Lambda Lambda Lambda](#lambda-lambda-lambda)
- [That Function Keyword](#that-function-keyword)
- [Restraint](#restraint)
- [Summary](#summary)

Dear reader, I hope that at this point we've established something of a _rapport_.  You have gotten this far into my tome and have been fooled into thinking I am enough of an expert that it's worth venturing on.  This is the point in the evening where either I'm drunk enough to think that all of my jokes are landing.

In terms of our relationship:

We're sitting at one of my favorite bar tops in Denver ([Steuben's](https://www.steubens.com/) or [Cuba Cuba](http://www.cubacubacafe.com/)).  One of my friends is tending bar, the lights are low and I'm single (which is not the case, in reality).  You, gender or identity or age aside, are conversing with me and I'm raising my eyebrow with every poorly executed pun and/or joke.  It's ten PM and I or perhaps you, have had enough drinks that this is all going swimmingly.

> Your author: So, what's a functional programmer's favorite animal?
>
> You: Oh I don't know.  What?
>
> Your author: A lamb, duh!


[To be fair](https://www.youtube.com/watch?v=E55t0lnp_8M), we've barely scratched the surface of functional programming.  We've barely scratched the surface of even "pretty functional" programming.  ~We've looked at~ I've ranted about a few things with `lodash` and `rxjs` and hinted at things to come (ahem, monads), but this chapter is a bit of a breather to just discuss... style.

There's a few things to just get out of the way that I've _mostly_ left untouched, by design, because I wanted to get a little further into our relationship.  (_Yes, I can see you, please put your pants back on._)  Some of that is some controversy around nomenclature, some slick things I've introduced with TypeScript that I've not really expounded upon, and the whole emphasis on testing that I think is fundamental to good "pretty functional" programming.

But before we get into _any_ of this, let me be clear: this entire chapter is pretty heavy on the _caveat emptor_ "your author has strong opinions" nonsense.  So much so that the alternate title for this, borrows from Abe Simpson:
<p align="center">
 <img src="/static/images/abe_simpson.png"/>
</p>


[Table of Contents](/README.md#table-of-contents)

# Lambda Lambda Lambda

Ah, the _lambda_.  It's a term that is oft bandied about when talking about _functional programming_ and it's even a whole tier of cloud service available from [AWS](https://aws.amazon.com/lambda/).  It's even a harsh reminder of Gabe Newell's failed promise to deliver the [ending to Half-Life](https://en.wikipedia.org/wiki/Half-Life_(series)#Half-Life_2:_Episode_Three).  But outside of the context of any industry term (or video game... wait until this is dated enough that Episode 3 does come out and I eat my words) the term "lambda" means something _very specific_.  In the world of functional programming, what we're really talking about is [lambda calculus](https://en.wikipedia.org/wiki/Lambda_calculus).

Now, we've been using lambdas the _whole damn time_, I just haven't called them that.  This goes back to our discussion on [functions](/chapters/one/one.md#what-is-a-function).  I shied away from dropping the term then, solely to ease the burden of introducing them to you.

At their heart, a lambda, is just a function.  It's the purest sense of the function.  Not a _method_, not a _procedure_, but the `f(x) -> y` notion.  This is just the building block for all of _lambda calculus_.

What really changes things is that functions (aka lambdas aka "&lambda;") are _first class values_.  This isn't so apparent or perhaps not so novel to you, but that means that a function is just like any other variable be it an object or primitive value.  When I was a boy, as I alluded to before, this wasn't super clear to me.  Sure, a function was a chunk of instructions that got turned into machine code, at some point, but to think of it at this "higher level" was alien.  I was still grappling with the concepts of Object Oriented Programming in C++ and Java.  But these things... they're first class values?  Like an instance of `Foo`?

When in doubt, code it out, right?  Well if we just create some random function in TypeScript (which I am currying unnecessarily):

```js
const myLambdanda = () => () => 'Ohh you make my &lambda; run.'
```

We can just dump that to the console and see it as:

```bash
const myLambdanda = () => () => 'Ohh you make my &lambda; run.'
```

Even if we get weird and decide to make a bunch of these:

```js
const myLambdanda = () => () => 'Ohh you make my &lambda; run.'

const allThe: (
 n: number
) => any = flow(
 range,
 partialRight(
  map,
  myLambdanda
 )
)

console.log(allThe(3))
```

We now just have an array of functions:

```bash
[function() {return 'Ohh you make my &lambda; run';}, function() {return 'Ohh you make my &lambda; run';}, function() {return 'Ohh you make my &lambda; run';}]
```

And _if_ you happen to do this in a browser and pop open your dev tools... you will see that the JavaScript runtime attaches all of the _object_ [prototype](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Objects/Object_prototypes) behavior to them:

<p align="center">
 <img src="/static/images/lambda_dump.png"/>
</p>

This means that JavaScript treats the _functions_ as it does an object.  It has all the scope information and everything else you would expect of what JavaScript considers an object. _[SOTTO VOCE](https://www.lexico.com/en/definition/sotto_voce): because it is an object._

This fulfills the needs of _any_ framework or language that needs to be truly _functional_ as well as the needs of _lambda calculus_.

Now, this wasn't obvious to me when I first jumped back into JavaScript after _many many years_ writing nothing but C-family code in Java, C++, and Objective-C.  But slowly, the dots started to connect.

Truth be told, despite my experiences in languages like LISP and Haskell, what _really_ connected the dots was the fact that I was quite fond of [C++ function pointers](https://www.learncpp.com/cpp-tutorial/78-function-pointers/).  This was the same concept, just in a different milieu.  Now, I was also fond of [_operator overloading_](https://www.geeksforgeeks.org/operator-overloading-c/) something that C++ supports and Haskell does ([in spades](https://stackoverflow.com/questions/8308015/can-you-overload-in-haskell)... to the extent that you can make unreadable/ungrokable Haskell) so there's limits to how useful that is (but, really operators like `=` and such _are just_ functions interpreted at a different levels of compilation depending on the language/framework).  

There's a great deal that could be mined there, and largely for our purposes that's best left as an abstract exercise (or something for you to do without my guidance).

While we've touched, basically, on _what_ a &lambda; is, we've eschewed formal definitions... until now.

[Top](#introduction)

# Defining a Lambda

More concretely, _lambda calculus_ is a formal, mathematical system for expressing computation.  It won't surprise you to know that in lambda calculus we are trying to express functions and then recomposing those functions to do useful things.

The simpler answer is: "how do we define functions mathematically?"  The goal, goes back to a paper written by the American mathematician [Alonzo Church](https://en.wikipedia.org/wiki/Alonzo_Church) in 1936.  It stems back to an attempt to solve [Alan Turing](https://en.wikipedia.org/wiki/Alan_Turing)'s ["halting problem"](https://en.wikipedia.org/wiki/Halting_problem).  This resulted in what is now known as the "Church-Turing thesis" and can be described as follows:

>The Church-Turing thesis concerns the concept of an effective or systematic or mechanical method in logic, mathematics and computer science. ‘Effective’ and its synonyms ‘systematic’ and ‘mechanical’ are terms of art in these disciplines: they do not carry their everyday meaning. A method, or procedure, _M_, for achieving some desired result is called ‘effective’ (or ‘systematic’ or ‘mechanical’) just in case:
>
>_M_ is set out in terms of a finite number of exact instructions (each instruction being expressed by means of a finite number of symbols);
>_M_ will, if carried out without error, produce the desired result in a finite number of steps;
>_M_ can (in practice or in principle) be carried out by a human being unaided by any machinery except paper and pencil;
>_M_ demands no insight, intuition, or ingenuity, on the part of the human being carrying out the method.
<sup>[1](#church-turing-thesis)</sup>

The _larger_ concern at play is encapsulated in Alan Turing's quest to solve the halting problem (to put it shortly: whether or not a given sequence of instructions _can be proven_ to stop or halt).  Now, we can go into this further, but for trivial pieces of code one can easily do this by observation.  However, for anything significant, it is computationally impossible to ensure that a program stops.  Obviously, you can look at a given function and say "of course it stops" but if we try to build that function as a [Turing machine]() we can't easily guarantee that it will stop.  In fact, we can't guarantee that it will.  While JavaScript (and TypeScript as a decorator language) is [Turing complete]() remember that a Turing Machine is a _simple_ construct.

In fact, in a very _ouroboros_ way, people have written [Turing machines in JavaScript](https://gist.github.com/azproduction/1400509).

<p align="center">
 <img src="/static/images/ouroboros.png"/>
</p>

Within this milieu we can say this:

* An __expression__ is either a variable, an abstraction, or a function application.

Of course, we should define these things more concretely.  Examine the following table:

| Concept | &lambda; | TypeScript |
| --- | ---| --- |
| __variable__ | x | `const x` |
| __abstraction__ | &lambda;x.x |  `const identity = x => x` |
| __function application__ | &lambda;x.x 100 | `identity(5) * 100` |

You're probably familiar with these constructs, as we've been doing this frequently in the previous chapters.  The __identity function__ is an important concept in &lambda; calculus but it's trivial to write in TypeScript:

```js
const identityFunction = x => x
```

Nothing radical going on there.  In _mathematics_ the identity function just returns itself.

> Are you 5?
>
> Yes, I am 5.

Now, one differentiation 

[Top](#introduction)

# That Function Keyword

I said it in [Chapter 1](/chapters/one/one.md#this-is-important) but I really, really try to avoid using the `function` keyword.  To me, it smacks too much of "the old way" of doing things.  I know that's a sort of "stick it up your ass grandpa!" attitude, but as we saw with the exercises in `lodash` the syntactic sugar afforded by fat arrow functions makes life a great deal easier.  Sadly, TypeScript isn't quite that hip and sometimes requires you to add typing that you really shouldn't need (it's not nearly as sophisticated of a static analyzer as something like [Clang](https://clang-analyzer.llvm.org/)).

Yet, some of that is just _style_.  Some of the other books on functional programming in JavaScript don't take such a harsh stand ([see the section in the beginning of the book](/README.md#additional-resources)).  However, if it isn't already clear, I'd rather wage a highly opinionated war __and be wrong__ than to dance around the subject.  This isn't Java.  This isn't C#.  My opinion is that the `function` keyword is a crutch.  It lends itself to the kind of OOP practices that will ultimately hurt your "pretty functional" chops.  The "fat arrow" (aka `=>`) style is used by everyone, it's just not used exclusively.  But I'm a bit of a sartorial wonk, even with regards to code, and I'm always trying to be "elegant" though that standard is always slipping and changing.  I'd go so far as to say "fuck the `function` keyword".  To be fair, your JavaScript via ES6 standards will be transpiled to that (yes, there are _other_ transpilation stages other than the TypeScript compiler), but for sake of "readability" and pushing some sort of "pretty functional" aesthetic, just drop it.  If you're using TypeScript that may mean you have to type something out, but I hope and pray (to `/dev/null`) that _that_ will go away and more folks will see the light.

Some of this is the tension that exists in the ES world right now.  Some folks are more on "my side" in that we should make JavaScript as "functional friendly as possible" and some of the others... just seem to be stuck in other, popular C-family languages that have been around for eons (or twenty years or so).  You are going to have to pick your battles. When it's just you and I, banging out code and talking about what we _can_ do, it's fine.  I like it and, perhaps, you do to.  But if you're doing this to "put bacon on the table" (or seitan), you are going to have to make some concessions...

[Top](#introduction)

# Restraint

In 1977, the "punk explosion" in the UK was severe enough that _already_ folks were deconstructing it.  Specifically, Wire's record [_Pink Flag_](https://en.wikipedia.org/wiki/Pink_Flag) dismantled the ethos of whatever it was that "punk" was to begin with to sub-minute songs.  A song like ["Three Girl Rhumba"](https://www.youtube.com/watch?v=8QykauA8p14) pulled apart the angular, aggressive music that the Sex Pistols, The Damned, and The Clash (who were all doing grand jobs and I won't denigrate them) and cut it _down_ to a fantastic guitar hook (IMHO) and the essence of "whatever" that other bollocks was about.  At the same time (thereabouts), the Leeds band [Gang of Four](https://en.wikipedia.org/wiki/Gang_of_Four_(band)) (and not the [design patterns dudes](https://en.wikipedia.org/wiki/Design_Patterns) nor the [Chinese Communists](https://en.wikipedia.org/wiki/Gang_of_Four) that coined the name apply) was bracing funk bass riffs with Andy Gill's "feedback as an instrument" guitar shenanigans with the same logic and producing gems like ["Anthrax"](https://www.youtube.com/watch?v=Akz2efTdJ-E) and the whole of [_Entertainment!_](https://en.wikipedia.org/wiki/Entertainment!) re-recorded later as _Return the Gift_ (itself a reference to the "gifts" of the United States government to First Peoples of the parts of North America they stole).  To say nothing of the _tremendous_ output of DEVO (and if you only know "Whip It" I'd kindly ask you to listen to ["Gates of Steel"](https://www.youtube.com/watch?v=Vh_x--PJ7RQ) amongst many others).

However much fun it is for me to reference what we often call "post-punk" (in retrospect, but it was all just and is "punk" I suppose) I mention all of this (which you may not care for) solely because as a programmer, you are partly an artist.  No one is ever going to pull up some block of code you wrote tomorrow (or ten years ago) and frame it and put it on a wall, but you need to know how and _when_ to deconstruct things.  For me, a great deal of "pretty functional" work is just using what I think are _better_ tools that cut away much of the cruft of OOP that hangs over JavaScript.

When is "the old way" useful?  When should you "rip it apart"?

Your first instinct, when you hit that "aha" moment and understand how whatever legacy system (and if you didn't write it, you will view it as "legacy", no matter how smart or restrained or "artisan" the original developers were) is to "refactor" and "repair" and "do it the right way".  That, of course, is a slippery slope.  Your "right way" today is going to be "wrong" tomorrow, even to you.  Or, really, you're going to look at something _you_ wrote and say "who wrote this shit?" and `git` or whatever version control system you use will tell you... that it was you.

So what do you do?

To be fair (see [above](#introduction)), your standards are _always_ going to change.  You aren't a politician.  It's __fucking right to be wrong__.  As a programmer, as a nascent Computer Scientist, or a Software Engineer, you should be _making mistakes all the damn time_ and those mistakes should inform future decisions.  I stress the "test driven approach" because I believe that "pretty functional" code almost requires it.  And, more importantly, if you write lots of "little tests" you can more rapidly diagnose defects.  Let's be real (real, real): you are going to write bugs.  You're going to miss things.  If you get "fast" at writing "pretty functional" code and _as a result_ writing tests for all of your &lambda;s, you're going to be _much_ more valuable to your employer.  To be hyperbolic and cliche: "get ninja with this FP shit". 

__Make mistakes and learn from them.  Test everything.__

Do that often and it will be easier than you think.

Now, let's bring this back to the idea of "restraint".

You can't always expect people to grok your super "pretty functional" code.  So you can't just rewrite it all from scratch.  Even if you write a litany of good tests for every damn thing, some poor QA person is going to have to come in and regression test whatever it is you just touched.

That's a bigger thing, and a more costly thing, than you can always consider.  It's really, really easy (and fun) to dive into problems and "boil the world" with some new solution.  But someone still is going to have to test that.  So hopefully, this book gets you in the habit of "testing early and often" with new code.

Now, that's not really or precisely _practical_ advice.

Practically, you just have to figure out _where_ you can insert your new skills.  You can't just scrap "the whole damn thing".  That's classic, [_Mythical Man Month_](https://en.wikipedia.org/wiki/The_Mythical_Man-Month) [second system syndrome](https://en.wikipedia.org/wiki/Second-system_effect) shit.  Don't be that person.

If it comes to it, reference this book.  Reference _better_ books or articles.  Just be judicious with your barrage of "hits" from learning functional programming.

Of course, I talked about music in this section, so here is your authors short list of some great post-punk gems:
* OMD's ["Enola Gay"](https://www.youtube.com/watch?v=d5XJ2GiR6Bo)
* DEVO's ["Uncontrollable Urge"](https://www.youtube.com/watch?v=M4Q35e0-fPQ)
* Wall of Voodoo's ["Back in Flesh"](https://www.youtube.com/watch?v=6NfvI2C5Bus)
* Wire's ["12xU"](https://www.youtube.com/watch?v=-vQLPd1uWxY)
* XTC's ["Statue of Liberty"](https://www.youtube.com/watch?v=9_Zg_ZWfYkg)

[Top](#introduction)

# TypeScript Tricks

I've been doing a few things in TypeScript that I want to talk about now.  But before I get into that, let's be 99.99% clear: TypeScript isn't _really_ a programing language.  It's a pre compilation, decorator language that is _transpiled_ to JavaScript. It doesn't, despite the name, have a real _compiler_.  Sure, there is `tsc`, but that isn't doing all the "compiler" things a real compiler does.  It's not building a real _symbol table_ or doing any true optimizations.  It isn't using a [linker loader](https://courses.cs.washington.edu/courses/cse378/97au/help/compilation.html) to build machine instructions.  But, it can be handy, and if you _lean on an IDE_ it can do a great deal for you.  I will wax poetic on IDEs and not using them in a bit, but for now, let's talk about TypeScript.

The biggest thing I end up doing, as you have seen, is using "deconstruction" to pull values out of arguments.

Let's look at an example.

Say I _know_ I'm going to have some object of the shape: 

```js
interface Foo {
 name: string
 age: number
}
```

And then I'm going to populate an array of those as such:

```js
const foos: Foo[] = [{
  name: 'Chewie',
  age: 22
 },{
  name: 'Verbal Kint'.
  age: 99
 }, {
  name: 'Captain Sensible',
  age: 65
 }, {
  name: 'Ian Curtis',
  age: 27
 }, {
  name: 'Phil Lynott',
  age: 36
 }
]
```

And what if, ultimately, I want an "average age" from all of these entries, so I _know_ that all I care about is `age` (treating this all as an `rxjs` problem):

```js
from(foos).pipe(
 tap(x => console.warn(x)),
 map(({
  age
 }: Foo) => age)
).subscribe(console.log)
```

Clearly, I'm not getting "averages" (yet), but I only _care_ about the "age" in the function I need.  Deconstruction is _very_ useful for this.  It can go "deep" and even rename things:

```js
from(foos).pipe(
 tap(x => console.warn(x)),
 map(({
  age: whatever
 }: Foo) => whatever)
).subscribe(console.log)
```

I'm now telling the TypeScript compiler to rename `age` as `whatever` and we could drill into deep objects, renaming things as we see fit, in case they are duplicating or confusing.  But really, an API call could _easily_ return a bunch of junk you don't care about. Sure, you could do something like:

```js
rom(foos).pipe(
 tap(x => console.warn(x)),
 map(x => x.age)
).subscribe(console.log)
```
Which, for this silly example, is _more concise_ but if you're dealing with values within other objects... you can see how this would be useful.  You could be carefully picking several fields that are buried deep within other objects or arrays.

And then, we can also leverage some pure ES6 deconstruction:

```js
from(foos).pipe(
 tap(x => console.warn(x)),
 map(({
  age: currentAge
 }: Foo) => ({currentAge})
)).subscribe(console.log)
```

Because maybe we want objects that look like:

```bash
Object {
  currentAge: 36
}
```

This, of course, is a _toy problem_ to the utmost, but I hope you can see what I'm driving towards: there are many things we don't care about.  There are many fields in a response from some resource that we _just don't care about_ and really, we can leverage TypeScript and ES6 deconstruction to just grab what we want.

[Top](#introduction)

# Too Personal

[Top](#introduction)

<a name="church-turing-thesis">1</a>: https://plato.stanford.edu/entries/church-turing/#ThesHist