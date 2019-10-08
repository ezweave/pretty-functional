# Chapter 3: An Introduction to Lambda Calculus 

![lambda](/static/images/lambda_graf.png)

# Introduction

- [Lambda Lambda Lambda](#lambda-lambda-lambda)
- [That Function Keyword](#that-function-keyword)
- [Restraint](#restraint)
- [Summary](#summary)

At this stage in our relationship, it's about time to introduce some more _heady_ topics.  No, I'm not asking "where this relationship is going" but rather it's time to start talking more about math (or "maths" if you're from the UK).  Really, it's about time we start talking about _lambda calculus_ (or for those UK folks, "_the_ lambda calculus").

> Your author: So, what's a functional programmer's favorite animal?
>
> You: Oh I don't know.  What?
>
> Your author: A lamb, duh!

In chapter 1, [I talked about defining a function](/chapters/one/one.md#what-is-a-function) in what I would call "somewhat mathematical" terms.  Recall that we talked about functions in sort of a classic, almost algebraic way.  After university, it's not uncommon for all of those math courses to grow rather distant, so it's easy to talk about functions in an `f(x) = y` way in that very few people forget what is really middle school math.  Sure, you're probably not quite ready to jump into solving systems of equations ala a long forgotten course (like _Differential Equations_), but the basic "function" paradigm used throughout mathematics is easy to grok or re-grok (if you've forgotten even that).

It probably also won't surprise you to know that, that, was a very high level and imprecise definition of _functions_ as far as lambda calculus goes.  It isn't wrong, per se, it's just a bit misleading.

However, what we really want to do is start leveraging _monads_ and before we can do that, we have to break down _exactly_ what we mean by "lambda calculus". 


[Top](#introduction)
[Table of Contents](/chapters/table_of_contents.md)

# A Little Bit of Background 

More concretely, _lambda calculus_ is a formal, mathematical system for expressing computation.  It won't surprise you to know that in lambda calculus we are trying to express functions and then recomposing those functions to do useful things.

The simpler answer is: "how do we define functions mathematically?"  The goal, goes back to a paper written by the American mathematician [Alonzo Church](https://en.wikipedia.org/wiki/Alonzo_Church) in 1936.  It stems back to an attempt to solve [Alan Turing](https://en.wikipedia.org/wiki/Alan_Turing)'s ["halting problem"](https://en.wikipedia.org/wiki/Halting_problem).  This resulted in what is now known as the "Church-Turing thesis" and can be described as follows:

>The Church-Turing thesis concerns the concept of an effective or systematic or mechanical method in logic, mathematics and computer science. ‘Effective’ and its synonyms ‘systematic’ and ‘mechanical’ are terms of art in these disciplines: they do not carry their everyday meaning. A method, or procedure, _M_, for achieving some desired result is called ‘effective’ (or ‘systematic’ or ‘mechanical’) just in case:
>
>_M_ is set out in terms of a finite number of exact instructions (each instruction being expressed by means of a finite number of symbols);
>
>_M_ will, if carried out without error, produce the desired result in a finite number of steps;
>
>_M_ can (in practice or in principle) be carried out by a human being unaided by any machinery except paper and pencil;
>
>_M_ demands no insight, intuition, or ingenuity, on the part of the human being carrying out the method.
<sup>[1](#church-turing-thesis)</sup>

Now Church and Turing were effectively coming up with two _very_ different solutions (or, "non solutions") to the same problem.

From Turing's perspective, a mathematical model could be constructed from an imagined machine that operates simply by writing state to an "infinite" tape.  All operations possible can be performed by reading and writing to various points on this tape.  There is some state to this, obviously as there is the "current progress" of the machine and the "_m-configuration_" which represents all of the state on the tape.  The "head" of the machine (the "current progress") can move left or right on the tape and perform reads, writes, and erases (essentially [CRUD](https://en.wikipedia.org/wiki/Create,_read,_update_and_delete) operations) and by doing so, with the "infinite tape", it could execute any program.  This is known as a [_Turing Machine_](https://en.wikipedia.org/wiki/Turing_machine).

I am not going to elaborate too much more on Turing machines as that is a much more in depth discussion than is useful for our purposes and really has nothing to do with lambda calculus.  

In a very _ouroboros_ way, people have written [Turing machines in JavaScript](https://gist.github.com/azproduction/1400509) which is, itself, a ["Turing Complete"](https://www.freecodecamp.org/news/javascript-is-turing-complete-explained-41a34287d263/) language.

<p align="center">
 <img src="/static/images/ouroboros.png"/>
</p>

Now Church (who incidentally was Turing's thesis advisor at Princeton) used a much different approach.  In Church's attempts to solve the "halting problem" (more on this in a moment as I'm not being entirely correct in saying that) he came up with a _very_ different methodology.  At a high level, he described programs as functions that take _some input_ and produce _some output_. They have no state.

In effect, it would look something like this:

```js
const program = (input) => ??? 
const output = program(input)
```

This should look very familiar to you, at this point.  Now Church, of course, didn't have a programming language as we know of them and was doing this with a pencil and paper.  So the question is, using lambda calculus, how do we define a function?

Church utilized the lower case greek lambda character, &lambda;, as such:  imagine you have some function that takes in _any_ input, we will call it _x_ and simply outputs it.

You would write that, in lambda calculus, as:

> &lambda;x.x

In TypeScript, we might write that as:

```js
const fx = x => x
```

This is the __identity function__ and it will come into play later on.

Now, imagine a more elaborate (if only slightly so) function that adds two inputs together, lets call them _x_ and _y_:

> &lambda;x.&lambda;y.x + y

And again, we could write that as:

```js
const fxy = (x, y) => x + y
```

If we say that `x = 5` and `y = 3` we would write that in lambda calculus as:

> (&lambda;x.&lambda;y.x + y) (5, 3)

Or we can call it in TypeScript as such:

```js
fxy(5, 3)
```

Now, in the realm of lambda calculus, having multiple inputs is not desirable.  We can work backwards from this using what we learned about [currying in Chapter 1]() and write a more proper function as:

```js
const fxy = (x) => (y) => x + y
```

The question becomes, how do we write this curried function in lambda calculus?

It's not as hard as you think:

> &lambda;x.(&lambda;y.x + y)

We are saying that &lambda;x returns a function, &lambda;y, that returns the sum of both inputs.  That's actually pretty simple.

// TODO add more on church and such.

# Lambda Lambda Lambda

Now we've looked at some of the syntax, already, in our discussion of the _history_ of lambda calculus, but we haven't actually done much more than show some examples.  Let's establish some _concrete_ concepts.

Everything in the world of lambda calculus is an _expression_.

* An __expression__ is either a variable, an abstraction, or a function application.

Now, before you ask the question, what is a _variable_, an _abstraction_, and an _application_?

| Concept | &lambda; | TypeScript |
| --- | ---| --- |
| __variable__ | x | `const x` |
| __abstraction__ | &lambda;x.x |  `const identity = x => x` |
| __application__ | (&lambda;x.x) (100) | `identity(100)` |

Now, we should be clear and in lambda calculus it is not unusual to omit parenthesis, when they are unnecessary so you could also write the application of the identity function as:

> &lambda;x.x 100

Going back to some of what we alluded to in the prior section 

Now in lambda calculus, we only have one variable type which is symbolic (meaning it can store numbers, letters, or symbols).  In programming languages like JavaScript (and TypeScript) we heavily rely on the __boolean__ (not truthiness or logical comparison operators but the literal `true` or `false` values).  But this doesn't exist in lambda calculus.  So, without booleans (and we can't use the C++ trick of using anything less than one for `false`) how would we describe true or false, functionally?

It's a little hard to grok at first, but here is the lambda calculus for true and false, as functions:

> &lambda;x.(&lambda;y.x)
>
> &lambda;x.(&lambda;y.y)

This would be written in TypeScript as:

```js
const fTrue = (x) => (y) => x
const fFalse = (x) => (y) => y
```

"Say what?"

We're not _evaluating_ whether or not the variables `x` or `y` are true.  This isn't a comparison.  This is us saying that either `x` or `y` is representing `true` or `false`.

I'm going to write some "pidgen" lambda calculus code to demonsrate this:

```js
if(x === 'some value') {
  return fTrue(x)(y)
} else {
  return fFalse(x)(y)
}
```

Now, really, we should make the _operator_ (`x === 'some value'`) an abstraction and rewrite this further as:
```js
  const condition = (x) => x === 'some value'
  condition(x)
```

[Top](#introduction)
[Table of Contents](/chapters/table_of_contents.md)

# That Function Keyword

I said it in [Chapter 1](/chapters/one/one.md#this-is-important) but I really, really try to avoid using the `function` keyword.  To me, it smacks too much of "the old way" of doing things.  I know that's a sort of "stick it up your ass grandpa!" attitude, but as we saw with the exercises in `lodash` the syntactic sugar afforded by fat arrow functions makes life a great deal easier.  Sadly, TypeScript isn't quite that hip and sometimes requires you to add typing that you really shouldn't need (it's not nearly as sophisticated of a static analyzer as something like [Clang](https://clang-analyzer.llvm.org/)).

Yet, some of that is just _style_.  Some of the other books on functional programming in JavaScript don't take such a harsh stand ([see the section in the beginning of the book](/README.md#additional-resources)).  However, if it isn't already clear, I'd rather wage a highly opinionated war __and be wrong__ than to dance around the subject.  This isn't Java.  This isn't C#.  My opinion is that the `function` keyword is a crutch.  It lends itself to the kind of OOP practices that will ultimately hurt your "pretty functional" chops.  The "fat arrow" (aka `=>`) style is used by everyone, it's just not used exclusively.  But I'm a bit of a sartorial wonk, even with regards to code, and I'm always trying to be "elegant" though that standard is always slipping and changing.  I'd go so far as to say "fuck the `function` keyword".  To be fair, your JavaScript via ES6 standards will be transpiled to that (yes, there are _other_ transpilation stages other than the TypeScript compiler), but for sake of "readability" and pushing some sort of "pretty functional" aesthetic, just drop it.  If you're using TypeScript that may mean you have to type something out, but I hope and pray (to `/dev/null`) that _that_ will go away and more folks will see the light.

Some of this is the tension that exists in the ES world right now.  Some folks are more on "my side" in that we should make JavaScript as "functional friendly as possible" and some of the others... just seem to be stuck in other, popular C-family languages that have been around for eons (or twenty years or so).  You are going to have to pick your battles. When it's just you and I, banging out code and talking about what we _can_ do, it's fine.  I like it and, perhaps, you do to.  But if you're doing this to "put bacon on the table" (or seitan), you are going to have to make some concessions...

[Top](#introduction)
[Table of Contents](/chapters/table_of_contents.md)


<a name="church-turing-thesis">1</a>: https://plato.stanford.edu/entries/church-turing/#ThesHist