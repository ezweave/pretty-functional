# pretty-functional

![pretty-functional](/static/images/pretty_functional.png)

`pretty-functional` is a collection of chapters and exercises designed to help you become more proficient in functional programming (FP) in JavaScript/TypeScript.  It is _not_ an authoritative guide on FP practices or theory, though we do have to introduce enough of those ideas so that your progression makes sense.

## Table of Contents

- [Introduction](#introduction)
- [Caveat Emptor](#caveat-emptor)
- [Chapter 1](/chapters/one/one.md)


## Introduction

When I was working on my undergraduate degree in Computer Science, the college of Engineering at my university had just switched their cirriculum over from using Pascal as the _de facto_ programming language for introductory CS classes to Java.  This was at the tail end of the nineties and Java had yet to hit 1.2.  There were lots of things missing from the Java ecosystem in those days from Integrated Development Environments (IDEs) to SDK bits and bobs to a real clear idea of where Java would go (we had to write build scripts in bash).  In the ensuing years of my Bachelor's I would learn C++ (which I already knew a bit of), MIPS assembly, JavaScript, and all manner of extensions and libraries to use in conjuction with them (OpenGL, et cetera).  JavaScript, at the time, wasn't considered much of a serious language (my how things have changed).

Most of this education, when not writing low level instructions or embedded or operating system level code, was focused on _Object Oriented Programming_ (OOP).  It was such a prevailing concept, that you almost learned it as a matter of course... in fact, the first class solely focused on OOP was a 300 level C++ programming class.  All other classes were more about data structures, discrete mathematics, algorithms, and the like and utilized Java.

Until I took [_Concepts of Programming Languages_](https://www.amazon.com/Concepts-Programming-Languages-Robert-Sebesta/dp/013394302X), which was taught by the author, Dr Robert W Sebesta.

If you're familiar with the class, it is one of those insidiously deceptive titles.  Much like _Linear Algebra_.  As a barely post-pubescent little scamp (who thought he knew everything, of course) I thought to myself "I know how to code, dumb ass."  

But I was wrong.  _Concepts_ was at the same time much more high level and abstract as it was just _different_.  This was chiefly because all of our homework was in a little language called [Scheme](https://en.wikipedia.org/wiki/Scheme_(programming_language)).  _Scheme_ was like reading some odd alien script.  It looked nothing like all of the higher level languages I _had_ been using, which really all get their rough syntax and structure from C (this includes: C++, Objective-C, Java, JavaScript, even C#).

Of course, I was learning Python and a few other things by that point, but Scheme was wholly different.  

As an example, this is what a fibonacci implementation looks like in Scheme:

```
(define (fibo n)
  (cond
    ((= n 0) 1)
    ((= n 1) 1)
    (true (+ (fibo (- n 1)) (fibo (- n 2))))
    )
  )

(define (sumofint n)
  (cond
    ((= n 0) 0)
    (true (+ (sumofint (- n 1)) n))
    )
```

Scheme is a dialect of [Lisp](https://en.wikipedia.org/wiki/Lisp_(programming_language)) and is high on _minimalism_ and lots and lots of parens.

![xkcd](https://imgs.xkcd.com/comics/lisp_cycles.png)

This, of course, isn't about Scheme or Lisp (AKA 'Lost In Stupid Parentheses'), but about _functional programming_ and Scheme was my introduction to the idea, only I didn't quite _grok_ that yet...

There was a moment, amidst that semester, when something clicked in my brain.  At first, Scheme's simple operators (`car` and `cdr`) and its endless rebuilding of arrays of primitives was grating.  Solving problems in it seemed inscrutable.  The only IDE we had to use, other than simple running it from the command line, was a fickle, crude thing called "Dr Scheme" (which has evolved into the much more refined [Racket](https://racket-lang.org/)).  Now, I wasn't unaware of the concept of "primitive debugging" (which is not referring to a datatype, but was slang we used to describe priting output to the console in lieu of using `gdb` or a full on IDE like Visual Studio), but it didn't even help that much in the Scheme world.

So it took a lot of thinking, diagrams, and really contemplating what we were doing to even think of how to approach building solutions to the homework assignments.  They were all such trivial things, in other languages, and more than one student asked Dr Sebesta if they could "just do it in C."  

It was amidst these conditions that I locked myself in the computer lab and just tried to break my brain's way of thinking.

Truthfully, OOP, as we know it, really just enforces [_imperitive programming practices_](https://en.wikipedia.org/wiki/Imperative_programming).  Sure it gives you some better ways to organize your data and some handy tools to operate on it (polymorphism, shadowing, composition, the whole IS-A and HAS-A thing), but it often just leads to... bloat.

All of the big, popularly understood as OO languages (Java, C#, and C++) are rife with [anti-patterns](https://en.wikipedia.org/wiki/Anti-pattern) which are one of many sources of ["code smell"](https://en.wikipedia.org/wiki/Code_smell).

Ignoring all of this naval gazing, let's jump into 2019.  JavaScript, thanks largely in part to Node.js, has become a _very_ powerful programming language, but it also suffers from a sort of "programming multiple personality disorder."  You can write very OO looking JS or you can write... functional JS.

The truth is that none of the popular functional frameworks are as purely functional as they would have you think.  Even [Scala](https://en.wikipedia.org/wiki/Scala_(programming_language))(which runs on the Java Virtual Machine and can utilize Java's SDK) has to bastardize itself a little because there are things you just can't fully control:
- REST calls to an external API
- Anything that introduces some level of randomness into your data
- and so on... as you will see

What JavaScript does have going for it, is that you are really dealing with [JSON](https://en.wikipedia.org/wiki/JSON)... and JSON is just a map/dictionary that points at:
- Other JSON objects
- Primitives
- Arrays of the latter

JSON is _ideal_ for functional programming.  It is divorced from function implementation, it is just data.  Data, that we can operate over in _deterministic_ ways.

I don't expect all of that to fully make sense, yet.  But I wrote this because while there are some quality guides and quite a few libraries that provide you with the sorts of _monads_ you will find yourself using, nothing fully ties them together.  I will wager that I won't either.  But while I can't solve all of those issues, and no one really can, I can at least give you better insight into _why_ and _how_ one can solve problems in JavaScript in a functional way.

It's really about "breaking your brain" and re-learning how to solve a problem and, as you will see, it greatly benefits _stable_ and reliable code.  E.g. it will cost you and your company less to maintain.

Break your brain.  

[Table of Contents](#table-of-contents)

# Caveat Emptor

Functional Programming will solve all of your problems.  When you've finished these exercises you will be fitter, more attractive, younger, and wealthier... nah.  You will just be older, maybe even less fit and less attractive, but you will be _wiser_.  If you've been around programming long enough, you will always hear/read about some new paradigm or technology that will _solve all of your problems_.  Object Oriented Programming will make your code more readible and easier to debug, until it becomes a mess of spaghetti.  [Aspect Oriented Programming](https://en.wikipedia.org/wiki/Aspect-oriented_programming) was going to save the world by extracting cross cutting concerns.  Machine Learning (what we used to just call Neural Networks) would monetize your data (somehow)!  Visual Studio was going to provide _everything_ you would need to build, collaborate, and... and... well none of these things was or is a panacea.  

Functional Programming is no different.  By itself, it won't do anything (especially at first) aside from frustrate and alienate you.  There are a few reasons that I think it's a worthwhile paradigm, regardless:
- It forces you to consider _data_ over behavior, which is something OO languages often obfuscate.
- It encourages you to break apart problems into _many_ functions and to write tests against those functions to make sure your solutions are robust... in fact, with tools like `lodash`, `ramda`, `rx`, and `monet` you will start doing it all the time because you might not know _exactly_ how that one monad works.
- It teaches you all kinds of silly new terminology you can flaunt at developer meet ups, so... that's good, right?
- By doing all of the above, you end up with code that is much more predictable and you can write tests around the things that aren't.
- Learning the core concepts will open you up to other FP languages: Scala, Haskel, Erlang, Lisp, Clojure and the like.  And those jobs [often pay more than imperitve or OO dev jobs](https://www.quora.com/Why-is-the-salary-of-Haskell-Lisp-and-Clojure-programmers-lower-than-others).

In some ways, the approach I have found to be most practical for Functional Programming, almost _requires_ some form of [Test Driven Development](https://en.wikipedia.org/wiki/Test-driven_development)(TDD).  TDD is always a rather hard sell on its own, but when you "break your brain" and embrace the FP lifestyle, it becomes a dear ally and _with good reason_.

And, lastly, if nothing else, learning a new paradigm like FP will open new pathways in your brain and change how you approach problem solving.  In some very real, but rather esoteric ways, it will "expand your mind."

[Table of Contents](#table-of-contents)
