# Chapter 3: Style

![lambda](/static/images/lambda_graf.png)

# Introduction

[To be fair](https://www.youtube.com/watch?v=E55t0lnp_8M), we've barely scratched the surface of functional programming.  We've barely scratched the surface of even "pretty functional" programming.  ~We've looked at~ I've ranted about a few things with `lodash` and `rxjs` and hinted at things to come (ahem, monads), but this chapter is a bit of a breather to just discuss... style.

There's a few things to just get out of the way that I've _mostly_ left untouched, by design, because I wanted to get a little further into our relationship.  (_Yes, I can see you, please put your pants back on._)  Some of that is some controversy around nomenclature, some slick things I've introduced with TypeScript that I've not really expounded upon, and the whole emphasis on testing that I think is fundamental to good "pretty functional" programming.

But before we get into _any_ of this, let me be clear: this entire chapter is pretty heavy on the _caveat emptor_ "your author has strong opinions" nonsense.  So much so that the alternate title for this, borrows from Abe Simpson:
<p align="center">
 <img src="/static/images/abe_simpson.png"/>
</p>

- [Lambda Lambda Lambda](#lambda-lambda-lambda)
- [Summary](#summary)

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

Now because this chapter is, first and foremost, about _style_ I'm going to abandon the discussion of lambda calculus (there's a whole chapter on it) to talk about that.

I said it in [Chapter 1](/chapters/one/one#L206) but I really, really try to avoid using the `function` keyword.  To me, it smacks too much of "the old way" of doing things.  I know that's a sort of "stick it up your ass grandpa!" attitude, but as we saw with the exercises in `lodash` the syntactic sugar afforded by fat arrow functions makes life a great deal easier.  Sadly, TypeScript isn't quite that hip and sometimes requires you to add typing that you really shouldn't need (it's not nearly as sophisticated of a static analyzer as something like [Clang](https://clang-analyzer.llvm.org/)).

[Top](#introduction)