# Chapter 3: Style

![stream](/static/images/lambda_graf.png)

# Introduction

[To be fair](https://www.youtube.com/watch?v=E55t0lnp_8M), we've barely scratched the surface of functional programming.  We've barely scratched the surface of even "pretty functional" programming.  ~We've looked at~ I've ranted about a few things with `lodash` and `rxjs` and hinted at things to come (ahem, monads), but this chapter is a bit of a breather to just discuss... style.

There's a few things to just get out of the way that I've _mostly_ left untouched, by design, because I wanted to get a little further into our relationship.  (_Yes, I can see you, please put your pants back on._)  Some of that is some controversy around nomenclature, some slick things I've introduced with TypeScript that I've not really expounded upon, and the whole emphasis on testing that I think is fundamental to good "pretty functional" programming.

- [Lambda Lambda Lambda](#lambda-lambda-lambda)
- [Summary](#summary)

[Table of Contents](/README.md#table-of-contents)

# Lambda Lambda Lambda

Ah, the _lambda_.  It's a term that is oft bandied about when talking about _functional programming_ and it's even a whole tier of cloud service available from [AWS](https://aws.amazon.com/lambda/).  It's even a harsh reminder of Gabe Newell's failed promise to deliver the [ending to Half-Life](https://en.wikipedia.org/wiki/Half-Life_(series)#Half-Life_2:_Episode_Three).  But outside of the context of any industry term (or video game... wait until this is dated enough that Episode 3 does come out and I eat my words) the term "lambda" means something _very specific_.  In the world of functional programming, what we're really talking about is [lambda calculus](https://en.wikipedia.org/wiki/Lambda_calculus).

Now, we've been using lambdas the _whole damn time_, I just haven't called them that.  This goes back to our discussion on [functions]()

[Top](#introduction)