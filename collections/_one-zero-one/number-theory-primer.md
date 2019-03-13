---
title: Number Theory Primer
description: A primer on number theoery concepts required for Cryptography
published: true
image: https://upload.wikimedia.org/wikipedia/commons/thumb/0/01/Number_theory_symbol.svg/809px-Number_theory_symbol.svg.png
imgdir: /assets/images/one_zero_one/number-theory-primer
twitter_shareable: true
twitter_image: https://upload.wikimedia.org/wikipedia/commons/thumb/0/01/Number_theory_symbol.svg/809px-Number_theory_symbol.svg.png
twitter_image_author: "Radiant chains, previous versions by Tob and WillT.Net"
twitter_image_license: https://creativecommons.org/licenses/by-sa/4.0/deed.en
hashtags: numbertheory, groups, abelian, Fermat, totient, Euler
---

### Introduction
There is a beauty to the ways in which numbers interact with one another, just 
as there is a beauty in the composition of a painting or a symphony. To 
appreciate this beauty, one has to be willing to expend a certain amount of 
mental energy. But the end result is well worth the effort. 

_**Pure mathematics**_ is the study of mathematical concepts independently of 
any application outside mathematics. These concepts may originate in 
real-world concerns, and the results obtained _**may**_ later turn out to be 
useful for practical applications, but the pure mathematicians are not 
primarily motivated by such applications. Instead, the appeal is attributed to 
the intellectual challenge.

_**Number theory**_ is a branch of pure mathematics devoted primarily to the 
study of the integers. It is the study of the set of positive whole numbers
```
1, 2, 3, 4, 5, 6, 7, ... ,
```
which are often called the set of natural numbers. 
The main goal of number theory is to discover interesting and unexpected 
relationships between different sorts of numbers and to prove that these 
relationships are true. Since ancient times, people have separated the 
natural numbers into a variety of different types. Here are some
familiar and not-so-familiar examples:
```
odd 1, 3, 5, 7, 9, 11, . . .
even 2, 4, 6, 8, 10, . . .
square 1, 4, 9, 16, 25, 36, . . .
cube 1, 8, 27, 64, 125, . . .
prime 2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, . . .
composite 4, 6, 8, 9, 10, 12, 14, 15, 16, . . .
1 (modulo 4) 1, 5, 9, 13, 17, 21, 25, . . .
3 (modulo 4) 3, 7, 11, 15, 19, 23, 27, . . .
triangular 1, 3, 6, 10, 15, 21, . . .
perfect 6, 28, 496, . . .
Fibonacci 1, 1, 2, 3, 5, 8, 13, 21, . . .
```

Many of these types of numbers are undoubtedly already known to you. Others, 
such as the `1 modulo 4` numbers, may not be familiar. A number is said to be
congruent to `1 (modulo 4)` if it leaves a remainder of 1 when divided by 4, 
and similarly for the `3 (modulo 4)` numbers. A number is called triangular if 
that number of pebbles can be arranged in a triangle, with one pebble at the 
top, two pebbles in the next row, and so on. A number is perfect if the sum of 
all its divisors, other than itself, adds back up to the original number.

Example _number theory_ questions:
* Can the sum of two squares be a square? (Answer: _YES_)
* Can the sum of two cubes be a cube? Can the sum of two fourth powers be a 
fourth power? In general, can the sum of two n<sup>th</sup> powers be an 
n<sup>th</sup> power? This famous problem is called _**Fermat's Last Theorem**_
(Answer: _NO_)
* Which **(odd) prime numbers** are a sum of two squares?

  <pre>
3 = NO, 5 = 1<sup>2</sup> + 2<sup>2</sup>, 7 = NO, 11 = NO,
13 = 2<sup>2</sup> + 3<sup>2</sup>, 17 = 1<sup>2</sup> + 4<sup>2</sup>
19 = NO, 23 = NO, 29 = 2<sup>2</sup> + 5<sup>2</sup>, 31 = NO, 
37 = 1<sup>2</sup> + 6<sup>2</sup>, ...
  </pre>
_Do you see a pattern?_ Possibly not, since this is only a short list, but a 
longer list leads to the conjecture that p is a sum of two squares if it is 
congruent to 1 (modulo 4). In other words, p is a sum of two squares if it 
leaves a remainder of 1 when divided by 4, and it is not a sum of two squares 
if it leaves a remainder of 3!

The best known application of number theory is public key cryptography, such 
as the RSA algorithm. Public key cryptography in turn enables many technologies 
we take for granted, such as the ability to make secure online transactions.
Trillions of dollars moves securely on internet due to Number Theory.

### Order of a group
The order of a group is its cardinality, i.e., the number of elements in its 
set. If we have a group _G_, order of _G_ is denoted by _|G|_

### Order of an element
Order of an element _a_ of a group is the smallest positive 
integer _m_ such that _a<sup>m</sup>_ = _e_ (where _e_ denotes the identity 
element of the group, and _a<sup>m</sup>_ denotes the product of _m_ copies of 
_a_). If no such _m_ exists, _a_ is said to have infinite order.

### Group
A group G is a finite or infinite set of elements together with a binary 
operation (called the _group operation_) that together satisfy the four 
fundamental properties of closure, associativity, the identity property, 
and the inverse property. The operation with respect to which a group is 
defined is often called the "_group operation_," and a set is said to be a 
group "under" this operation.

A group is a non-empty set (finite or infinite) _G_ with a binary 
operator • such that the following four properties (Cain) are satisfied:

* Closure: if _a_ and _b_ belong to _G,_ then _a•b_ also belongs to _G_
* Associative: _a•(b•c)=(a•b)•c_ for all _a_, _b_, _c_ in _G_
* Identity element: there is an element _e_ in _G_ such that 
    _a•e = e•a = a_ for every element _a_ in _G_
* Inverse element: for every element _a_ in _G_, there's an element 
_a'_ such that _a•a' = e_ where _e_ is the identity element

We usually denote a group by (G, •) or simply _G_ when the operator is 
clear in the context. One very common type of group is the cyclic groups. 
This group is isomorphic to the group of integers (_modulo n_), is 
denoted _Z<sub>n</sub>_, or _Z/nZ_, and is defined for every integer _n > 1_.

### Cyclic groups
A cyclic group is a group that can be generated by a single element X 
(the group generator). It contains an element _g_ such that every other element 
of the group may be obtained by repeatedly applying the group operation or 
its inverse to _g_. Each element can be written as a power of _g_ in 
multiplicative notation, or as a multiple of _g_ in additive notation. 
This element _g_ is called a _generator of the group_.

_**Wait! Set of integers with identity element 0 and addition operation is
not cyclic in any sense. How's that a cyclic group?**_

I had the exact same question! The name "cyclic" is misleading.
It is possible to generate infinitely many elements and not form any literal 
cycles; that is, every _g<sub>n</sub>_ is distinct. (It can be thought of as 
having one infinitely long cycle)

_**Infinitely long cycle doesn't make any sense! Why cyclic?**_

Please don't argue. They had better things to do I guess. Read 
[this](https://www.jstor.org/stable/40248334) for more information.

Important Properties:
* Every cyclic group is Abelian[^1]
* Every infinite cyclic group is isomorphic to the additive group of _Z_, 
the integers. 
* Every finite cyclic group of order _n_ is isomorphic to the additive group of 
_Z/nZ_, the integers modulo _n_.

A trivial example is the group _Z<sub>n</sub>_, the additive group of 
integers _modulo n_. In _Z<sub>n</sub>_, _1_ is always a generator:

1 ≡ 1 mod n

1+1 ≡ 2 mod n

1+1+1 ≡ 3 mod n
...

1+1+1+...+1 ≡ n ≡ 0 mod n

If a group is cyclic, then there may exist **multiple generators**. 
For example, we know _Z<sub>5</sub>_ is a cyclic group. 
_1_ is a generator for sure. And if we take a look at 2, we can find:

2 ≡ 2 mod 5

2+2 ≡ 4 mod 5

2+2+2 ≡ 6 ≡ 1 mod 5

2+2+2+2 ≡ 8 ≡ 3 mod 5

2+2+2+2+2 ≡ 10 ≡ 0 mod 5

So all the group elements _{0,1,2,3,4}_ in _Z<sub>5</sub>_ can also be 
generated by _2_. So, _2_ is also a generator for the group _Z<sub>5</sub>_.

However, not every element in a group is a generator. For example, the 
identity element in a group will never be a generator. No matter how many 
times you apply the group operator to the identity element, the only element 
you can yield is the identity element itself. For example, in _Z<sub>n</sub>_, 
_0_ is the identity element and _0+0+...+0 ≡ 0 mod n_ in all cases.

Not every group is cyclic. For example, _Z<sub>n</sub><sup>*</sup>_, the 
multiplicative group modulo _n_, is cyclic if and only if _n_ is _1_ or _2_ 
or _4_ or _p<sup>k</sup>_ or _2\*p<sup>k</sup>_ for an odd prime number _p_ 
and _k ≥ 1_. So _Z<sub>5</sub><sup>*</sup>_ must be a cyclic group 
because _5_ is a prime number. _2_ is a generator.

2<sup>1</sup> ≡ 2 mod 5

2<sup>2</sup> ≡ 4 mod 5

2<sup>3</sup> ≡ 8 ≡ 3 mod 5

2<sup>4</sup> ≡ 16 ≡ 1 mod 5

If _Z<sub>n</sub><sup>*</sup>_ is cyclic and _g_ is a generator of 
_Z<sub>n</sub><sup>*</sup>_, then _g_ is also called a 
_**primitive root modulo n**_

### Order of `a modulo n`

Given a positive integer _n > 1_, and an integer _a_, such that _gcd(a, n) = 1_,
the smallest possible integer _d_ for which _a<sup>d</sup> ≡ 1 mod n_ 
is called **order of _a_ modulo _n_**. Since Euler's theorem states that 
a<sup>φ(n)</sup> ≡ 1 mod n , _d_ indeed exists. The order of _a_ mod 
_n_ is sometimes written as ord<sub>n</sub>(a)

### Euler's totient function
In number theory, Euler's totient function counts the positive integers up to a 
given integer _n_ that are relatively prime to _n._ It is written using 
the Greek letter phi as φ(n) or ϕ(n), and may also be called Euler's _ph_
 function. It can be defined more formally as the number of integers k in the 
range 1 ≤ k ≤ n for which the greatest common divisor gcd(n, k) i
s equal to 1

The following table shows the function values for the first several natural 
numbers:

| n  |         coprimes of n         | φ(n) |
|----|:-----------------------------:|:----:|
| 3  |              1, 2             |   2  |
| 4  |              1, 3             |   2  |
| 5  |           1, 2, 3, 4          |   4  |
| 6  |              1, 5             |   2  |
| 7  |        1, 2, 3, 4, 5, 6       |   6  |
| 8  |           1, 3, 5, 7          |   4  |
| 9  |        1, 2, 4, 5, 7, 8       |   6  |
| 10 |           1, 3, 7, 9          |   4  |
| 11 | 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 |  10  |
| 12 |          1, 5, 7, 11          |   4  |

Take some time and try to find a cool relationship between n and φ(n).

Here's the relation:
when _n_ is a prime number (e.g. 2, 3, 5, 7, 11, 13), _φ(n) = n-1_.

_How about the composite numbers?_

You may also have noticed that, 

_15 = 3*5_ and _φ(15) = φ(3)*φ(5) = 2*4 = 8_
This is also true for 14,12,10 and 6. However, it does not hold for 4, 8, 9. 

For example, _9 = 3 \* 3_ , but _φ(9) = 6 ≠ φ(3)*φ(3) = 2 \* 2 =4_ 

In fact, this multiplicative relationship is conditional:
when m and n are coprime, _φ(m*n) = φ(m)*φ(n)_

The general formula to compute φ(n) is the following:

If the prime factorisation of _n_ is given by _n =p<sub>1</sub><sup>e<sup>1</sup></sup> \*...\* p<sub>n</sub><sup>e<sup>n</sup></sup>_, 
then _φ(n) = n *(1 - 1/p<sub>1</sub>)* ... (1 - 1/p<sub>n</sub>)_

For example:

* _9 = 3<sup>2</sup>, φ(9) = 9* (1-1/3) = 6_
* _4 =2<sup>2</sup>, φ(4) = 4* (1-1/2) = 2_

### Euler's theorem

> Also known as Fermat-Euler theorem or Euler's totient theorem

If _n_ and _a_ are coprime positive integers, then
_a<sup>φ(n)</sup> ≡ 1 mod n_

> The converse of Euler's theorem is also true: if the above congruence is 
true, then _a_ and _n_ must be coprime

### Primitive root modulo
Let _p_ be a prime. We say that _g_ is a primitive root of _p_ 
(or sometimes modulo _p_), if the powers g<sup>1</sup>, g<sup>2</sup>, 
g<sup>3</sup>, ..., g<sup>p-1</sup> are congruent, in some order, to 
1, 2, 3, ..., p-1 (_modulo p_). Or in simpler terms, when we consider the 
remainders when g<sup>k</sup> is divided by p, all numbers between 1 and 
_p-1_ are remainders (0 can't be).

Note that by Fermat's Theorem, _g<sup>p-1</sup> ≡ 1 mod p_, so after 
_g<sup>p-1</sup>_, the powers of _g_ start all over again 
modulo _p,_ so _g<sup>p</sup> ≡ g_, _g<sup>p+1</sup> ≡ g<sup>2</sup>_ 
and so on.

Using our knowledge of group theory, we could alternately say that 
_g_ is a primitive root of _p_ if _g_ is a generator of the multiplicative 
group on non-zero objects modulo _p_. It can be proved using elementary tools 
that every prime has a primitive root. The proof is not all that easy though. 
Large primes _p_ have many primitive roots.


### Credits

* [A Friendly Introduction to Number Theory by Joseph H. Silverman](https://www.math.brown.edu/~jhs/frintch1ch6.pdf)
* [Math in Network Security: A Crash Course by Changyu Dong](https://www.doc.ic.ac.uk/~mrh/330tutor/)

### Footnotes

[^1]: An Abelian group is a group for which the elements commute 
    (i.e., AB=BA for all elements A and B)

