# Introduction

- [Why Write A Book?](#why-write-a-book)
- [Background](#background)
- [Pretty Functional](#pretty-functional)
- [Lego All Over The Floor](#lego-all-over-the-floor)
- [Panacea](#panacea)
- [Toy Problems Versus Real Problems](#toy-problems-versus-real-problems)
- [Who Are You?](#whoami)
- [How To Use This Book](#this-is-how-we-do-it)
- [Additional Resources](#additional-resources)

Dear reader, before you delve into the body of this, er, _tome_, be forewarned: when we're done discussing facts, your author (me), often resorts to opinion.  There are multiple reasons for this:

* Trying to establish _idiomatic_ code withing the world of Functional JavaScript.
* I have an opinion and I'll be damned if it isn't _right_.

The last bullet point is a joke.  If you find that off-putting, I suggest you seek other sources.

All of that aside, I've tried to account for _heavily_ biased (to say nothing of the "less heavily biased, but biased none-the-less") portions of this book with the following blocks:

> _Caveat emptor: the following section contains subjective content that you, the reader, may disagree with.  The author implores you to consider the proceeding statements and to ignore them at your peril.  Or just ignore them._

<p align="center">
 <img src="/static/images/abe_simpson.png"/>
</p>

[Top](#introduction)
[Table of Contents](/chapters/table_of_contents.md)

# Why Write a Book?

I enjoy Computer Science.  I enjoy being challenged, and as I come from _somewhat_ of an academic background (lots of grad school, familial motivations) I cut my teeth on some of the classics of Computer Science.  I read through and half understood books like [The Art of Computer Programming](https://en.wikipedia.org/wiki/The_Art_of_Computer_Programming), [Introduction to Algorithms](https://en.wikipedia.org/wiki/Introduction_to_Algorithms),[Deep Learning](http://www.deeplearningbook.org/), [Modern Operating Systems](https://en.wikipedia.org/wiki/Modern_Operating_Systems), and others... many others.  I often feel that the authors forget what it is like to _learn_ something.  Even given a background in Computer Science, things are forgotten or written language fails to properly explain a concept.  

The authors of these books are not stupid in any way, only perhaps ignorant of their audience or they approach a topic they deal with so often that much of the language and mechanics of their explanations fails to help "connect the dots", as it were, to a given concept.  To be fair, hubris probably informs every author of every scientific or technical treatise to just _assume_ that "all the others have it wrong, let me have a go" and I am no different.  If you, for example, did nothing but think about a topic such as compiler design, your primer on the topic may instantly start explaining the topic with some _a priori_ knowledge that your audience doesn't have.  How can I explain to you the difference in, say, musical time signatures if I just assume you understand what a time signature means?  

No one does that, per se, but I often feel that when I am reading a textbook on mathematics or whatnot the authors _think_ they are doing this:

<p align="center">
 <img src="/static/images/complete_knowledge.png"/>
</p>

Which results in:

<p align="center">
 <img src="/static/images/god.png"/>
</p>

But in reality, _you_ probably already know some fundamentals and instead wade through chapters that "make you feel stupid" because they're pulling back to some theoretical or mathematical construct that seems... alien.  So then you end up doing something more like _this_:

<p align="center">
 <img src="/static/images/wtf.png"/>
</p>

Lots of flipping back to earlier sections, lots of trying to understand what you missed and, hopefully, you do "figure it all out" and by the time your final comes around, or you're drunk enough at a party with people you're trying to impress, you can at least sound intelligent enough to pass.  At least your lexicon is up to par.

<p align="center">
 <img src="/static/images/scared.png"/>
</p>

So my approach is different.  (Maybe.)  I wanted to assume that you _are_ some kind of programmer and you already understand a bit of JavaScript or TypeScript (the language I'm using, though it isn't really a "language" but that's another discussion).  I will elaborate on this, but I want to introduce _enough_ of the basics of "functional programming" with some concrete examples, before I try to get into the math (or "maths" for the UK folks). 

You'll find that after this introduction, we jump right into some code and we keep writing code and only after you're got some exposure to the style of functional programming I will explain shortly, do we start getting to the "mathy" bits.  At least we can be on the same, perhaps "wrong", page.

At worst, you will find my text both tedious and amateurish and you'll laugh at the author's naiveity.  At best, we will be somewhat on the same page when I try to explain what:

> &lambda;x.x

Means.

Or not.  There is a _great deal_ of content on the Internet.  This is probably the _least_ entertaining bit.

[Top](#introduction)

[Table of Contents](/chapters/table_of_contents.md)

# Background

There's no way for me to broach the topic of functional programming without invoking some Proustian moment wherein I am suddenly twenty years old again and the world is quite a different place from the world we now live in.  I wasn't yet old enough to buy myself a beer (in the United States, at least) and my chief concerns were mountain biking, mountain biking, and school.

In those halcyon days, the University of Colorado at Colorado Springs' College of Engineering had just moved the early level Computer Science (CS) courses over to Java from [Pascal](https://en.wikipedia.org/wiki/Pascal_(programming_language)).  Over the course of my undergraduate work, I would learn many languages: MIPS assembly, Bash scripting, Python, C, C++, a wee bit of PHP, Javascript (who would use _this scoping disaster_ language for anything, right), and, as mentioned, Java.

_Most_ of these languages share some bits of C in their DNA (so much so that they're often called [the C-family programming languages](https://en.wikipedia.org/wiki/List_of_C-family_programming_languages)).  Even if it's solely _syntax_, Java, C++, Objective-C, C#, even JavaScript, all share some concepts from C.  Of course, they are _very_ different languages in many other respects (runtime, memory management, it is a rather _laundry list_).

To a point, most of my undergraduate work had been chiefly within the realm of these languages, save for a foray into [MIPS Assembly](https://en.wikipedia.org/wiki/MIPS_architecture), and a few courses in "web programming."

Then I took [_Concepts of Programming Languages_](https://www.amazon.com/Concepts-Programming-Languages-Robert-Sebesta/dp/013394302X), which was taught by the author, Dr Robert W Sebesta.

_NOTE: he literally looked like what we thought Gandalf would look like, before the Peter Jackson films.  I mean [seriously](http://cs.uccs.edu/~rsebesta/sebesta.gif).  We joked that "one shouldn't cross a wizard."_

_Concepts_, if you have not had the privilege of experiencing the course, attempts to discuss programming languages at a higher level.  It covers a breadth of _different_ programming paradigms and talks about larger level constructs behind various implementations.  _Concepts_ involves "stepping back" (pardon the idiom) to consider different languages and features, commonalities, and concerns.  It is somewhat akin to discussing language at the level of Chomsky, which is to say: discussing his concept of a [Universal Grammar](https://en.wikipedia.org/wiki/Universal_grammar) instead of discussing merely the similarities between romance languages.  Granted, that is perhaps an _extreme_ comparison, and perhaps a confusing one.  Put more succinctly: knowing how to write some C++ is _not_ the same as understanding programming languages as a whole.  Knowing a handful of languages isn't much use either.  _Understanding_ what they're trying to do is rather different.

Another, perhaps simpler analogy is considering the difference between knowing _how_ to play a guitar (say knowing a handful of chords: G major, C major, D minor, and so on) and _understanding_ music theory.  Analogies, when inspected too closely, are always going to break down, but for the purpose of this introduction, I hope this will suffice.

Thusly, _Concepts_ was both abstract and exact and, at the same time, it was just _different_.  If it weren't for the mathematical nature of programming constructs, it could almost be described as "philosophical."  As an aside, I am well aware of the intersections between philosophy and mathematics, particularly things like Logic.  But for the sake of this discussion, what greatly contributed to the _otherness_ of a course like _Concepts_, was the medium of coursework: all assignments required using a language called [Scheme](https://en.wikipedia.org/wiki/Scheme_(programming_language)).  _Scheme_ was like reading some long forgotten pictographic language.  It looked nothing like all of the C family languages with which I was familiar.

As an example, this is what a [Fibonacci sequence to _n_](https://en.wikipedia.org/wiki/Fibonacci_number) implementation looks like in Scheme:

```scheme
(define (fibo n)
  (cond
    ((= n 0) 1)
    ((= n 1) 1)
    (true (+ (fibo (- n 1)) (fibo (- n 2))))
    )
  )
```

It's rather confusing to look at if you come from the C-syntax languages, eh? _(Some of that difference is [infix](https://en.wikipedia.org/wiki/Infix_notation) versus [prefix](https://en.wikipedia.org/wiki/Polish_notation) notation, of course.)_  Scheme is a dialect of [Lisp](https://en.wikipedia.org/wiki/Lisp_(programming_language)) and is high on _minimalism_ and lots and lots of parens.

<p align="center">
  <img width="414" height="136" src="https://imgs.xkcd.com/comics/lisp_cycles.png">
</p>

This, of course, isn't about Scheme or Lisp (AKA 'Lost In Stupid Parentheses'), but about _functional programming_. Scheme was my introduction to the idea, only I didn't quite [_grok_](https://en.wikipedia.org/wiki/Grok) that yet...

There was a moment, amidst that semester, when something clicked in my brain.  At first, Scheme's simple operators (`car` and `cdr`) and its endless rebuilding of arrays was grating.  The scant examples we were given were inscrutable.  The only IDE we had to use, other than simple running it from the command line, was a fickle, crude thing called "Dr Scheme" (which has evolved into the much more refined [Racket](https://racket-lang.org/)) and it really didn't seem to help all that much.  Where was my intellisense?

So it took a lot of thinking, diagrams, and really contemplating what we were doing to even think of how to approach building solutions to the homework assignments.  They were all such trivial things, in other languages, and more than one student asked Dr Sebesta if they could "just do it in C."  

It was amidst these conditions that I locked myself in the computer lab and just tried to break my brain, rewiring it to change how I had thought about programming.  Which really meant _copying_ any examples I could find and tinkering with the code.

Truthfully, OOP, as we know it, really just enforces [_imperative programming practices_](https://en.wikipedia.org/wiki/Imperative_programming).  Sure it gives you some better ways to organize your data and some handy tools to operate on it (polymorphism, shadowing, composition, the whole IS-A and HAS-A thing), but it often just leads to... bloat.

All of the big, popularly-understood-as-OO languages (Java, C#, and C++) are rife with [anti-patterns](https://en.wikipedia.org/wiki/Anti-pattern) which are one of many sources of ["code smell"](https://en.wikipedia.org/wiki/Code_smell).

Ignoring all of this naval gazing, let's jump nearly twenty years into 2019.  JavaScript, thanks largely in part to Node.js, has become a _very_ powerful programming language, but it also suffers from a sort of "programming multiple personality disorder."  You can write very OO looking JS or you can write more functional JS.

The truth is that many of the popular functional frameworks and programming languages are as purely functional as they would have you think.  Even [Scala](https://en.wikipedia.org/wiki/Scala_(programming_language))(which runs on the Java Virtual Machine and can utilize Java's SDK) has to bastardize itself a little because there are things you just can't fully control:
- REST calls to an external API
- Anything that introduces some level of randomness into your data
- and so on... as you will see

What JavaScript, on the other hand, does have going for it, is that you are really dealing with [JSON](https://en.wikipedia.org/wiki/JSON)... and JSON is just a map/dictionary that points at:
- Other JSON objects
- Primitives
- Arrays of the latter

JSON is _ideal_ for functional programming.  Plain JSON is divorced from function implementation, it is just data.  Data, that we can operate over in _deterministic_ ways (mostly, you will learn how Reactive X, specifically [`rxjs`](https://rxjs-dev.firebaseapp.com/) is built to handle `async` operations as we move along).

I don't expect all of that to fully make sense, yet.  But I wrote this because while there are some quality guides not dissimilar to this one and quite a few libraries that provide you with the sorts of _monads_ and operators you will find yourself using, nothing fully ties them together in quite the same way as I'm attempting to.  I will wager that I won't say anything revolutionary and that, perhaps, you will loathe this book and my writing style.  But while I can't solve all of those issues, and no one really can, I can at least give you better insight into _why_ and _how_ one can solve problems in JavaScript in a functional way.

It's really about "breaking your brain" and re-learning how to solve a problem and, as you will see, it greatly benefits _stable_ and reliable code.  E.g. it will cost you and your company less to maintain.

Break your brain.  

[Top](#introduction)

[Table of Contents](/chapters/table_of_contents.md)

# Pretty Functional

I've been calling a lot of the JavaScript and TypeScript I've written over the years "pretty functional."  As I mentioned in the introduction, even languages built around pure functional programming have to make concessions.  External APIs, any sort of I/O, all sorts of things break this paradigm.  We can't _always_ make our input data sets what we expect them to be.  I mean if I had a dollar for every `NullPointerException` or `NullReferenceException` I've seen in my life, I'd not be typing this now.  I'd be going crazy, Marlon Brando style, on an island of my own near Tahiti.  No language can guarantee "safe" input.  It can lie to you with static analysis, your IDE can assuage you of your sins, it can give you a level of confidence that is unwarranted, and that, dear reader, is why we have jobs.  We write bugs all the time.

_However_, I am a firm believer that this _pretty functional_ approach, while it has its flaws, encourages you to write _very_ hardened code.  As we start to break apart simple problems into a _series_ of functions, you start to see how confident we can be in some of our solutions.  I find that the _pretty functional_ approach encourages you to _write lots of unit tests_ which most programmers have an aversion to.

Why do we hate writing tests?

I can't say I have a definitive answer, but for me, it's hubris all the way.  I _know_ how to write code.  I _know_ how that library or function works.  So I don't like writing unit tests, because, _duh_ I know what I am doing and my time is valuable.

In truth, I never know as much as I think I do and the time I spend _not_ writing tests is far outpaced by the time (as in money) my employer spends fixing things, when bugs are invariably discovered.

I can't control my inputs.  Even with this approach of breaking up logic and writing lots of tests, you can and will _still write bugs_.  Nothing stops you from shooting yourself in the foot.  Or, as the joke goes, in Haskell you might shoot yourself in the foot, only to discover that all of those were aliases and you really hung yourself and shot fifty other people in the foot.  There is an _older_ joke about C++ along those lines from [Bjarne Stroustrup](https://en.wikipedia.org/wiki/Bjarne_Stroustrup):
>C makes it easy to shoot yourself in the foot; C++ makes it harder, but when you do it blows your whole leg off.

As an example of hubris gone awry: when I discovered the concept of [operator overloading](https://en.wikipedia.org/wiki/Operator_overloading) I wrote a lot of gibberish looking C++ because I thought "hey, I can now _add_ objects together."  Ick.

I will say this right now __I am not the best functional programmer_.  That's why this book is called "Pretty Functional" and not "Absolute FP Extreme Code Red."  We're going to get _pretty functional_, but I hope that you will start sending me elegant pull requests and suggestions that make me look... like an amateurish fool.

The phrase itself is also a bit of a pun.  Not only is it, at face value, a way to absolve myself (and perhaps you as well) of any sort of notion of _mastery_, but it also alludes to something more abstract.

"Pretty."

In common English usage, "pretty" is used to describe beauty.  Quite literally it means [_attractive in a delicate way without being truly beautiful_](https://www.lexico.com/en/definition/pretty).  While this is often employed in a patriarchal sense, it applies directly to any undertaking that is _creative_.

You might say of a Jaguar Series I E-Type: "That's a rather pretty car."

<p align="center">
 <img src="/static/images/pretty_functional_etype.png"/>
</p>

You might read a [poem by Rainier Maria Rilke](https://poets.org/poem/i-am-much-too-alone-world-yet-not-alone) and say "That's a pretty poem." Or perhaps listen to the entirety of [Jeff Mangum's opus](https://open.spotify.com/album/5COXoP5kj2DWfCDg0vxi4F?si=EmAiAqvQTke2rpwIgXVlOA) and remark "What a pretty concept."

There is this longing, perhaps in you, but certainly in me, to make something _beautiful_.  It's not unlike Plato's concept of [the Forms](https://study.com/academy/lesson/the-theory-of-forms-by-plato-definition-lesson-quiz.html).  Even in a very small, tactical and practical way, I know that for any given problem I face as a programmer, there is a _better_ way to solve it.  There is a solution that is, in some almost indescribable way, more elegant.  Almost, but not quite, beautiful.

As I grow older and spend more time with various frameworks, languages, and paradigms, my skills are ever evolving.  Code I've written even as little as a week ago, often looks somehow uglier than I remember.  I know that __I can always do better__.

So in this very real, yet hardly quantifiable way, __pretty functional__ is appropriate with regards to both my level of mastery (enough to be dangerous) and my endless yearning to write that perfect function... one day, one day.

I hope the concepts and exercises herein inspire the same sort of desire within you.

[Top](#introduction)

[Table of Contents](/chapters/table_of_contents.md)

# Lego All Over the Floor

<p align="center">
 <img src="/static/images/lego.png"/>
</p>

As a child of the Western world I'm sure that you are at least familiar with Lego brand building blocks.  If you've any experience with said blocks you know that despite attempts at organization a child's Lego collection quickly becomes relegated to giant bins that, while they may have some loose ordering ("Space" in here), they will inevitably be dumped upon the floor and pieces will be picked through to find "that one part they swear they had" for whatever project they are undertaking.  For your author, attempts were made to keep parts sorted in a giant, olive drab Plano fishing tackle box that quickly became inadequate for the sheer volume of Lego I acquired.  If you play with Lego, especially if you're a child, you will dump it all over the floor and spend hours scrounging about for, say, a red 1x1.  It happens.

The whole point of this rambling anecdote: the big refactor.  You've come to some point with some code and you tell your boss "this has to be rewritten."  Product managers and owners cringe, because they _don't get why it's so bad without lots of illustrations_, but you end up _breaking everything_ as you rewrite it.

I call this "Lego All Over the Floor."

You can plan around it, try to break it up into stories, but you will, _inevitably_, end up with a mess that takes a week to clean up.  It always happens and always will.

As you get _pretty functional_, you will probably get Lego all over the place.  Only now, you can better organize those piles, as you will see and now, when your author uses that phrase, you will understand, on some level, what I mean.  And like your author as a frustrated twenty year old, trying to learn Scheme, this might just be the best way for you to understand what _exactly_ is going on.

Now, you can extend this metaphor because, if you've been in a room where Lego has been "dumped all over the floor" you probably have also stepped on a piece of it barefooted and know that there is a special pain, an immediate sensation of anger and frustration, accompanying brick based __impetum pede__.  

Like many things in life, functional programming can be "easy to say, hard to do."

[Top](#introduction)

[Table of Contents](/chapters/table_of_contents.md)

# Panacea 

Functional Programming will solve all of your problems.  When you've finished these exercises you will be fitter, more attractive, younger, and wealthier... nah.  You will just be older, maybe even less fit and less attractive, but you will be _wiser_.  If you've been around programming long enough, you will always hear/read about some new paradigm or technology that will _solve all of your problems_.  Object Oriented Programming will make your code more readable and easier to debug, until it becomes a mess of spaghetti.  [Aspect Oriented Programming](https://en.wikipedia.org/wiki/Aspect-oriented_programming) was going to save the world by extracting cross cutting concerns.  Machine Learning (what we used to just call Neural Networks) would monetize your data (somehow)!  Visual Studio was going to provide _everything_ you would need to build, collaborate, and... and... well none of these things was or is a panacea.  

Functional Programming is no different.  By itself, it won't do anything (especially at first) aside from frustrate and alienate you.  There are a few reasons that I think it's a worthwhile paradigm, regardless:
- It forces you to consider _data_ over behavior, which is something OO languages often obfuscate.
- It encourages you to break apart problems into _many_ functions and to write tests against those functions to make sure your solutions are robust... in fact, with tools like `lodash`, `ramda`, `rxjs`, and `monet` you will start doing it all the time because you might not know _exactly_ how that one monad or operator works (don't worry, this will all be explained).
- It teaches you all kinds of silly new terminology you can flaunt at developer meet ups, so... that's good, right?
- By doing all of the above, you end up with code that is much more predictable and you can write tests around the things that aren't.
- Learning the core concepts will open you up to other FP languages: Scala, Haskell, Erlang, Lisp, Clojure and the like.  And those jobs [often pay more than imperative or OO dev jobs](https://www.quora.com/Why-is-the-salary-of-Haskell-Lisp-and-Clojure-programmers-lower-than-others).

In some ways, the approach I have found to be most practical for Functional Programming, almost _requires_ some form of [Test Driven Development](https://en.wikipedia.org/wiki/Test-driven_development)(TDD).  TDD is always a rather hard sell on its own, but when you "break your brain" and embrace the FP lifestyle, it becomes a dear ally and _with good reason_.

And, lastly, if nothing else, learning a new paradigm like FP will open new pathways in your brain and change how you approach problem solving.  In some very real ways, it has the potential to "expand your mind."

[Top](#introduction)
[Table of Contents](/chapters/table_of_contents.md)

# Toy Problems Versus Real Problems

When it comes to any sort of technical publication, whether it's something that seems somewhat _esoteric_ to your day to day life as a programmer, like the [Dragon Book](https://en.wikipedia.org/wiki/Compilers:_Principles,_Techniques,_and_Tools) on compiler design, something fun and whimsical like [Learn You A Haskell For Great Good](https://nostarch.com/lyah.htm), or even just the [`rxjs` documentation](https://www.learnrxjs.io/) there is this odd tension between what I like to call _toy problems_ and _real problems_.

__Toy problems__ often encapsulate problems that are either:
* Classic problems like implementing various sort algorithms, capitalizing words in a sentence, Fibonacci, Golden Ratio, et cetera.
* Bits of esoteric ephemera that some library or tool is better suited for (like writing a parser without [yacc](https://en.wikipedia.org/wiki/Yacc)).  Things you might do in school, but you'd likely go elsewhere unless it's part of your job or, as is often the case, you decide that what your company needs is a programming language or framework you came up with.  The latter is a fundamental sin of programmers who start thinking "they can do X better."  Very rarely does this pan out, and usually the company who trusted said programmers has to undo their havoc over a period of years.

__Real problems__ are things like:
* Pulling REST data into an `rxjs` stream.
* Making multiple asynchronous calls in one block of logic.

The problem is that many books rely too heavily on the former and skimp on the latter, or implement the latter in such a way that some of the concepts may be lost.  `rxjs` seems particularly bad about this, lacking documentation that fully explains what a _stream is doing_, but throws you lots of little examples of very discrete things.  If you don't fully understand streams, in this case, trying to use _interval_ with some sort of variable versus a constant becomes... confusing.

In this book I start with some __toy problems__, but move on, as we build your confidence to __real problems__.  I have often found this lack of transition to be quite frustrating when dealing with a new API or paradigm and is one of __the primary reasons I wanted to write this book__.  I want you, dear reader, to fully grok some basics before I throw you in the deep end.  Or, rather, I'd use the analogy (well debunked) of a [frog in boiling water](https://en.wikipedia.org/wiki/Boiling_frog)(and maybe don't click that... I think it's rather cruel): I'd rather slowly get you there than just turn up the heat right away.  Also, I may be a cannibal.

The most rewarding thing in _attempting_ to teach anyone, is to:
1. Observe the "aha" moment wherein the student really _does understand_ something.
1. Be told how wrong you are by someone who isn't being cocky, but is _actually correct_.

We start with the toys, because they are actually kind of fun (in my opinion) and move onto some hairy, real world situations.  I have often found that the jump from _toy_ to _day job_ problems highlight some deficiency in my own knowledge and... it can often be hard to bridge the two.  Nothing is worse than having someone say "good book, but I can't use any of this bollocks at work."  Together, we can ~save humanity~ try to avoid that mess.

[Top](#introduction)

[Table of Contents](/chapters/table_of_contents.md)

# whoami 

This is meant as a bit of _rhetoric_, but let's introduce ourselves before we go much further.

__Your humble(ish) author__: my name is Matt Weaver and, I'm sure you've gathered that I have some experience with programming languages.  I have both a Master's and Bachelor's of Science in Computer Science, I enjoy extremely short walks on the beach (sand in your shoes is no fun), the music of Converge, pushing myself, and bicycles.  I'm familiar enough with the writing of the likes of [Andrew Tanenebaum](https://en.wikipedia.org/wiki/Andrew_S._Tanenbaum) and [Donald Knuth](https://en.wikipedia.org/wiki/Donald_Knuth) to know that humor in Computer Science can sometimes be either too dry or not present at all.  I'd like to make your experience with this volume as entertaining and educational as possible, so there you go.

__You, Dear Reader__: you're a programmer. Okay, let's move on... no, no.  That won't do.  I'm going to do a bit of projection here, to get you into the right _frame of mind_.  To set the mood.  You're either curious or someone forced you to read this.  You're either self-driven or lazy, but I suspect not so much the latter and more so the former.  By nature, we often get quite comfortable with the knowledge and skill set we have.  If you're anything like I was/am/was, you're ever earnest to be _uncomfortable_, but perhaps not.  I say "uncomfortable" because I often suspect, that when things are _going too well_ I am somehow "bollocksing up."  What am I not doing, right now?  

None other than perhaps the greatest American Cyclist, Mr Greg LeMond put it best:

> It never gets easier, you just go faster.

It's an apt aphorism for life.  You either seek out as much comfort as possible, or you push yourself every day (or most days... okay, _some_ days).  You might be coming into this with a fair bit of experience in Functional Programming, JavaScript, or some combination of the two.  Even if you are a seasoned FP wrangler, I'd ask that you give this book a bit of a taste, as it may just be fun, and at the very least, it's short.  If nothing else, you can point out my mistakes, and lord your superiority over me.

If you're _not_ familiar with Functional Programming, then I hope you find this both entertaining and educational (and that is the _last_ time I will use that phrase).  As mentioned before, even if you _don't_ end up using many of these concepts and approaches we're going to work through, I hope it opens you up to new ideas and adds a new dimension to your own problem solving.

A few things to consider:
* As Knuth has always pointed out (in his long running and previously mentioned, but yet to be complete series [_The Art of Computer Programming_](https://en.wikipedia.org/wiki/The_Art_of_Computer_Programming)), Computer Science is really equal parts science, art, and hackery (my term).  There will be some math in this volume.  There will be some art.  And there will be a lot of hackery.  
* As a youth, I often felt that Computer Science was akin to some weird alchemy.  Some mystical, though not fantastical (e.g. it's real not some unprovable nonsense), art that the lay person would never understand.  But darkness cannot live where light penetrates (I say that to myself in an Ian McCellan as Gandalf voice or maybe it's a Harry Potter thing), and I hope this book sheds some light on an oft bandied about topic that might seem inscrutable.
* You will learn enough to be dangerous.  Do I consider myself an expert in _any_ discipline of Computer Science?  To be blunt, hell no.  Writing this has been a good refresher for your author and it should be good for you, but it is far from complete.  There is no such thing as "complete" in any remotely scientific discipline.  There is only the earnest need to improve and expand.
* This is just a tool.  There are many ways to skin a cat (or [four](https://www.youtube.com/watch?v=cUcjn1CuRZI), RIP [Harris](https://en.wikipedia.org/wiki/Harris_Wittels)).  Getting familiar with something makes you more inclined to use it.

That last point is _very_ important.  Something that seems _inscrutable_ (or even worse, something you "think" you understand but really don't) leads to __fear__ and that leads to poor implementation and practice.

To put it another way, let me quote from the IDLES' song ["Danny Nedelko"](https://www.youtube.com/watch?v=QkF_G-RF66M):

<p align="center">
 <img src="/static/images/idles.png"/>
</p>

While that's about _much larger problems with the world_ it applies to something like _functional programming_ as well.

__And not that you'd ask, because they're "most amateur", but yes, I did all the illustrations for this book save for the xkcd one about parens and LISP.__

[Top](#introduction)

[Table of Contents](/chapters/table_of_contents.md)

# This Is How We Do It

To go through the exercises in this book, you will need:

* A computer or some device so like a computer that you can install `git` and `nvm`.
* A somewhat working knowledge of a shell... `bash` is fine, though I am quite fond of `zsh` via [`yadr`](https://github.com/skwp/dotfiles) as it let's me do such silly things as use `vim` commands in the interpreter.
* Some sort of editor.  An IDE like [VSCode](https://code.visualstudio.com/) or [Idea](https://www.jetbrains.com/idea/), a text editor like [`vim`](https://www.vim.org/) (but no [`emacs`](https://www.gnu.org/software/emacs/), you keyboard chording animals) or [`ed`](https://en.wikipedia.org/wiki/Ed_(text_editor)).

To work through this book, I would suggest:
* Forking this repo.
* Run `npm i`
* Test your new skills by running `jest name_of_file.spec.ts` for each set of exercises. It won't evaluate your solution, but it will tell you if it at least works.
* Submitting a Pull Request (P.R.) from your fork, if you want me to look at your answers.  I cannot promise I will look at them all, but for now, have at it!

But to get started, I would suggest moving on to [Chapter 1: Pretty Fizzy with Lodash](/chapters/one/one.md)

[Top](#introduction)

[Table of Contents](/chapters/table_of_contents.md)

# Additional Resources

I'm hardly the inventor of functional programming, or functional programming in JavaScript.  There are some additional resources that you might find valuable:

* [Functional Light JS](https://github.com/getify/Functional-Light-JS): a similar book, though the theoretical focus is a _wee_ bit different.  This book (the one you're reading) focuses a bit more on practical exercises using a myriad of common frameworks and, paradoxically, on lambda calculus.  A good read, none the less.
* [Functional Programming in JavaScript](https://www.manning.com/books/functional-programming-in-javascript): I won't give this book a firm endorsement, it appears to be riddled with bugs and a bit out of date.  But it's worth a gander.
* [RxJS in Action](https://www.manning.com/books/rxjs-in-action): while the resources available on [_Learn RxJS_](https://www.learnrxjs.io/) are useful, it assumes some _a priori_ knowledge that you're unlikely to have (though hopefully that is less true after you finish this book).  The underlying concepts of rxjs are kind of glossed over in some of the online documentation and a few tools, like `redux-observable` operate so entirely on rxjs streams that if you _don't_ understand it well enough, you will hit roadblocks when attempting to solve real world problems almost immediately.

[Top](#introduction)

[Table of Contents](/chapters/table_of_contents.md)