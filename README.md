# pretty-functional

![pretty-functional](/static/images/pretty_functional.png)

`pretty-functional` is a collection of chapters and exercises designed to help you become more proficient in functional programming (FP) in JavaScript/TypeScript.  It is _not_ an authoritative guide on FP practices or theory, though we do have to introduce enough of those ideas so that your progression makes sense.

## Table of Contents

- [Introduction](#introduction)
  - [Why Functional?](#why-functional)
- [Caveat Emptor](#caveat-emptor)
- [Who Are You?](#whoami)
- [How To Use This Book](#this-is-how-we-do-it)
- [Chapter 1](/chapters/one/one.md)


## Introduction

The year is 1999 and when not reinforcing my Y2K bunker, you could find me either riding mountain bikes or staring off into the void just beyond the corner of my monitor trying to turn myself into a decent programmer.

In those halycon days, the University of Colorado at Colorado Springs' College of Engineering had just moved the early level Computer Science (CS) courses over to Java from [Pascal](https://en.wikipedia.org/wiki/Pascal_(programming_language))(was it [Turbo Pascal](https://en.wikipedia.org/wiki/Turbo_Pascal), you might ask, and I don't actually know... I do recall my father having a few books on that subject at his desk when he taught CS and I was a wee lad).  Over the course of my undergraduate work, I would learn many languages: MIPS assembly, Bash scripting, Python, C, C++, a wee bit of PHP, Javascript (who would use _this scoping disaster_ language for anything, right), and, as mentioned, Java.

_Most_ of these languages share some bits of C in their DNA.  Even if it's soley _syntax_, Java, C++, Objective-C, C#, even Javascript, all share some concepts from C.  Of course, they are _very_ different languages, I'm not unaware.  This is more about the "look and feel" of the actual syntax than runtime and all that rot.

Most of my early education, when not writing low level instructions or embedded or operating system level code, was focused on _Object Oriented Programming_ (OOP).  It was such a prevailing concept, that you almost learned it as a matter of course... in fact, the first class solely focused on OOP was a 300 level C++ programming class.  All other classes were more about data structures, discrete mathematics, algorithms, and the like and utilized Java.

Until I took [_Concepts of Programming Languages_](https://www.amazon.com/Concepts-Programming-Languages-Robert-Sebesta/dp/013394302X), which was taught by the author, Dr Robert W Sebesta.

If you're familiar with the book and that class (which is a requirement for [ABET](https://en.wikipedia.org/wiki/ABET) accredited programs), it is one of those insidiously deceptive titles.  Much like _Linear Algebra_.  As a barely post-pubescent little scamp (who thought he knew everything, of course) I thought to myself "I know how to code, dumb ass."  

But I was wrong.  _Concepts_ was both abstract and exact and it was just _different_.  This was partly because all of our homework was in a little language called [Scheme](https://en.wikipedia.org/wiki/Scheme_(programming_language)).  _Scheme_ was like reading some odd alien script.  It looked nothing like all of the higher level languages I _had_ been using, which really all get their rough syntax and structure from C (this includes: C++, Objective-C, Java, JavaScript, even C#).

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

Kind of confusing if you come from the C-syntax languages, eh?  Scheme is a dialect of [Lisp](https://en.wikipedia.org/wiki/Lisp_(programming_language)) and is high on _minimalism_ and lots and lots of parens.

![xkcd](https://imgs.xkcd.com/comics/lisp_cycles.png)

This, of course, isn't about Scheme or Lisp (AKA 'Lost In Stupid Parentheses'), but about _functional programming_. Scheme was my introduction to the idea, only I didn't quite _grok_ that yet...

There was a moment, amidst that semester, when something clicked in my brain.  At first, Scheme's simple operators (`car` and `cdr`) and its endless rebuilding of arrays of primitives was grating.  Solving problems in it seemed inscrutable.  The only IDE we had to use, other than simple running it from the command line, was a fickle, crude thing called "Dr Scheme" (which has evolved into the much more refined [Racket](https://racket-lang.org/)).  Now, I wasn't unaware of the concept of "primitive debugging" (which is not referring to a datatype, but was slang we used to describe priting output to the console in lieu of using `gdb` or a full on IDE like Visual Studio), but it didn't even help that much in the Scheme world.

So it took a lot of thinking, diagrams, and really contemplating what we were doing to even think of how to approach building solutions to the homework assignments.  They were all such trivial things, in other languages, and more than one student asked Dr Sebesta if they could "just do it in C."  

It was amidst these conditions that I locked myself in the computer lab and just tried to break my brain, rewiring it to change how I had thought about programming.

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

JSON is _ideal_ for functional programming.  It is divorced from function implementation, it is just data.  Data, that we can operate over in _deterministic_ ways (mostly).

I don't expect all of that to fully make sense, yet.  But I wrote this because while there are some quality guides and quite a few libraries that provide you with the sorts of _monads_ and operators you will find yourself using, nothing fully ties them together.  I will wager that I won't either.  But while I can't solve all of those issues, and no one really can, I can at least give you better insight into _why_ and _how_ one can solve problems in JavaScript in a functional way.

It's really about "breaking your brain" and re-learning how to solve a problem and, as you will see, it greatly benefits _stable_ and reliable code.  E.g. it will cost you and your company less to maintain.

Break your brain.  

[Table of Contents](#table-of-contents)

# Caveat Emptor

Functional Programming will solve all of your problems.  When you've finished these exercises you will be fitter, more attractive, younger, and wealthier... nah.  You will just be older, maybe even less fit and less attractive, but you will be _wiser_.  If you've been around programming long enough, you will always hear/read about some new paradigm or technology that will _solve all of your problems_.  Object Oriented Programming will make your code more readible and easier to debug, until it becomes a mess of spaghetti.  [Aspect Oriented Programming](https://en.wikipedia.org/wiki/Aspect-oriented_programming) was going to save the world by extracting cross cutting concerns.  Machine Learning (what we used to just call Neural Networks) would monetize your data (somehow)!  Visual Studio was going to provide _everything_ you would need to build, collaborate, and... and... well none of these things was or is a panacea.  

Functional Programming is no different.  By itself, it won't do anything (especially at first) aside from frustrate and alienate you.  There are a few reasons that I think it's a worthwhile paradigm, regardless:
- It forces you to consider _data_ over behavior, which is something OO languages often obfuscate.
- It encourages you to break apart problems into _many_ functions and to write tests against those functions to make sure your solutions are robust... in fact, with tools like `lodash`, `ramda`, `rx`, and `monet` you will start doing it all the time because you might not know _exactly_ how that one monad or operator works (don't worry, this will all be explained).
- It teaches you all kinds of silly new terminology you can flaunt at developer meet ups, so... that's good, right?
- By doing all of the above, you end up with code that is much more predictable and you can write tests around the things that aren't.
- Learning the core concepts will open you up to other FP languages: Scala, Haskel, Erlang, Lisp, Clojure and the like.  And those jobs [often pay more than imperitve or OO dev jobs](https://www.quora.com/Why-is-the-salary-of-Haskell-Lisp-and-Clojure-programmers-lower-than-others).

In some ways, the approach I have found to be most practical for Functional Programming, almost _requires_ some form of [Test Driven Development](https://en.wikipedia.org/wiki/Test-driven_development)(TDD).  TDD is always a rather hard sell on its own, but when you "break your brain" and embrace the FP lifestyle, it becomes a dear ally and _with good reason_.

And, lastly, if nothing else, learning a new paradigm like FP will open new pathways in your brain and change how you approach problem solving.  In some very real, but rather esoteric ways, it will "expand your mind."

[Table of Contents](#table-of-contents)

# whoami 

This is meant as a bit of _rhetoric_, but let's introduce ourselves before we go much further.

__Your humble(ish) author__: my name is Matt Weaver (long called "ezweave" on "teh webz") and I'm a software engineer by trade, but a programmer for purposes of our one-sided discourse.  I was born in the early 80s (making me either an "in-betweener" or "the oldest Millenial") and started programming around 1989-90 when my father (an engineer at Bell Labs, at the time) forced me to learn QBASIC, of all things (`GOTO another_programming_language`).  I come from a wee bit of an academic background (with a Bachelor's and Master's of Science in Computer Science and some now expired credits towards a PhD in the same), somewhat due to my aforementioned father... but also because I was a solitary child, whose best friends were books and Lego bricks.  I like the music of Converge, short walks on the beach (I hate sand in my shoes), racing bicycles, and generally making an ass out of myself.  You'll find this book rife with odd humor that I blame on being Candian-American (and the added twist of having spent much of my youth in a mix of the American Southeast, rural Alberta, and the 'burbs of Chicago), but I'll try to keep it light.  I'm familiar enough with the writing of the likes of [Andrew Tanenebaum](https://en.wikipedia.org/wiki/Andrew_S._Tanenbaum) and [Donald Knuth](https://en.wikipedia.org/wiki/Donald_Knuth) to know that humor in Computer Science can sometimes be either too dry or not present at all.  I'd like to make your experience with this volume as entertaining and educational as possible, so there you go.

__You, Dear Reader__: you're a programmer. Okay, let's move on... no, no.  That won't do.  I'm going to do a bit of projection here, to get you into the right _frame of mind_.  To set the mood.  You're either curious or someone forced you to read this.  You're either self-driven or lazy, but I suspect not so much the latter and more so the former.  By nature, we often get quite comfortable with the knowledge and skillset we have.  If you're anything like I was/am/was, you're ever earnest to be _uncomfortable_, but perhaps not.  I say "uncomfortable" because I often suspect, that when things are _going too well_ I am somehow "bollocksing up."  What am I not doing, right now?  None other than perhaps the greatest American Cyclist, Mr Greg LeMond put it best:

> It never gets easier, you just go faster.

It's an apt aphorism for life.  You either seek out as much comfort as possible, or you push yourself every day (or most days... okay, _some_ days).  You might be coming into this with a fair bit of experience in Functional Programming, JavaScript, or some combination of the two.  Even if you are a seasoned FP wrangler, I'd ask that you give this book a bit of a taste, as it may just be fun, and at the very least, it's short.  If nothing else, you can point out my mistakes, and lord your superiority over me.

If you're _not_ familiar with Functional Programming, then I hope you find this both entertaining and educational (and that is the _last_ time I will use that phrase).  As mentioned before, even if you _don't_ end up using many of these concepts and approaches we're going to work through, I hope it opens you up to new ideas and adds a new dimension to your own problem solving.

A few things to consider:
* As Knuth has always pointed out (in his long running, yet to be complete series [_The Art of Computer Programming_](https://en.wikipedia.org/wiki/The_Art_of_Computer_Programming)), Computer Science is really equal parts science, art, and hackery.  There will be some math in this volume.  There will be some art.  And there will be a lot of hackery.  
* As a youth, I often felt that Computer Science was akin to some weird Alchemy.  Some mystical, though not fantastical, art that the lay person would never understand.  But darkness cannot live where light penetrates (I say that to myself in an Ian McCellan as Gandalf voice), and I hope this book sheds some light on an oft banted topic that might seem inscrutable.
* You will learn enough to be dangerous.  Do I consider myself an expert in _any_ discipline of Computer Science?  To be blunt, hell no.  Writing this has been a good refresher for your author and it should be good for you, but it is far from complete.  There is no such thing as "complete" in any remotely scientific discipline.  There is only the earnest need to improve and expand.

[Table of Contents](#table-of-contents)

# This Is How We Do It

I'll go over this more in the first chapter, but to go through this book, you will need:

* A computer or some device so like a computer that you can install `git` and `nvm`.
* A somewhat working knowledge of a shell... `bash` is fine, though I am quite fond of `zsh` via [`yadr`](https://github.com/skwp/dotfiles) as it let's me do such silly things as use `vim` commands in the interpreter.
* Some sort of editor.  An IDE like [VSCode](https://code.visualstudio.com/) or [Idea](https://www.jetbrains.com/idea/), a text editor like [`vim`](https://www.vim.org/) (but no [`emacs`](https://www.gnu.org/software/emacs/), you keyboard chording animals) or [`ed`](https://en.wikipedia.org/wiki/Ed_(text_editor)).

To work through this book, I would suggest:
* Forking this repo.
* Run `npm i`
* Test your new skills by running `jest name_of_file.spec.ts` for each set of exercises. It won't evaluate your solution, but it will tell you if it at least works.
* Submitting a Pull Request (P.R.) from your fork, if you want me to look at your answers.  I cannot promise I will look at them all, but for now, have at it!

If you find any mistakes or want to make a correction, also feel free to submit a P.R.  I will handily ignore it, unless you can procure for me a bottle of Sazerac 18.  Then we can talk.

[Chapter 1](/chapters/one/one.md)

[Table of Contents](#table-of-contents)
