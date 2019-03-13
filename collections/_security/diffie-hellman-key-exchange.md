---
title: Diffie-Hellman Key Exchange 
description: Introduction to Diffie-Hellman Key Exchange protocol. The article explains the what, why and how of DHKE. It also includes information about attacks on Diffie-Hellman key exchange and briefly describes the real life implementations of this protocol.
published: true
image: https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Diffie-Hellman_muster.png/640px-Diffie-Hellman_muster.png
imgdir: /assets/images/security/diffie-hellman-key-exchange/
twitter_shareable: true
twitter_image: https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Diffie-Hellman_muster.png/640px-Diffie-Hellman_muster.png
twitter_image_license: https://creativecommons.org/licenses/by-sa/4.0/deed.en
twitter_image_author: Kristen Gilden
hashtags: dhke, diffie-hellman, key-exchange, symmetric, security, cryptography, dlp
---
### Table of Contents
1. [Introduction](#introduction)
2. [Applications](#applications)
3. [Number Theory](#number-theory)
4. [DHKE steps](#dhke-steps)
5. [Need for primitive root](#why-should-g-be-primitive-root-modulo-p)
6. [Discrete Logarithm Problem (DLP)](#discrete-logarithm-problem)
7. [Solving DLP](#popular-methods-for-solving-the-discrete-logarithm-problem)
8. [Attacks on DHKE](#attacks-on-dhke)
9. [DH in real life](#dh-in-real-life)
10. [Additional resources](#additional-resources)

### Introduction
The Diffie-Hellman key exchange (DHKE), proposed by Whitfield Diffie and Martin 
Hellman in 1976, was the first asymmetric scheme published in the open 
literature. They were also influenced by the work of Ralph Merkle.
DHKE provides a practical solution to the key distribution problem, i.e., it 
enables two parties to derive a common secret key by communicating over an 
insecure channel. DHKE is a very impressive application of the discrete 
logarithm problem. There _was_ a 
patent [US patent 4200770](https://patents.google.com/patent/US4200770A/en) 
for this protocol but it expired in 1997.

_**Wait what?! The patent mentions "Merkle; Ralph C. (Palo Alto, CA)" as 
an inventor. Why don't we call this diffie-hellman-merkle protocol?**_<br/>

Well, Martin Hellman acknowledges it too. His paper 
"[AN OVERVIEW OF PUBLIC KEY CRYPTOGRAPHY](https://ee.stanford.edu/~hellman/publications/73.pdf)"
mentions:
_"... system in this paper has since become known as Diffie-Hellman key 
exchange. While that system was first described in a paper by Diffie and me, 
it is a public key distribution system, a concept developed by Merkle, and 
hence should be called "Diffie-Hellman-Merkle key exchange" if names are to be 
associated with it. I hope this small pulpit might help in that endeavor to 
recognize Merkle's equal contribution to the invention of public key 
cryptography. Space does not permit an explanation of the quirk of fate that 
seems to have deprived Merkle of the credit he deserves, but a quirk it is"_

Since Martin himself thinks this is a _quirk of fate_, I don't think I have
a better explanation.

However, there's an interesting story behind Ralph C. Merkle about ...
Apologies for digressing. I'll tell the story at the end of article.

### Applications
The fundamental key agreement technique is implemented in many open and 
commercial cryptographic protocols like Secure Shell (SSH), Transport Layer 
Security (TLS), and Internet Protocol Security (IPSec). If you've ever
transferred/received money online (domestic/international), if you've ever
paid your phone/internet/water/apartment/utilities bill online, if you've
ever paid your tuition fee online, if you've booked a hotel room online,
if you've purchased air/train/bus tickets online, if you've purchased anything 
online on amazon/walmart/wayfair/ebay/alibaba/flipkart/jd (and so on), 
it is _**extremely likely**_ that you've made use of this key exchange protocol.

Let's take a moment to thank 
* [James H.Ellis](https://en.wikipedia.org/wiki/James_H._Ellis)
* [Malcolm John Williamson](https://en.wikipedia.org/wiki/Malcolm_J._Williamson)
* [Whitfield Diffie](https://amturing.acm.org/award_winners/diffie_8371646.cfm)
* [Martin Hellman](https://ee.stanford.edu/~hellman/)
* [Ralph Merkle](http://merkle.com)

### Number theory
Order of an element, cyclic group, generator, Euler's theorem, Euler's Totient 
function,...If you are not familiar with any of these terms, I highly recommend
brushing up on some elementary number theory. 
[Number Theory Primer]({{site.baseurl}}/one-zero-one/number-theory-primer.html) 
is a reference that I use to refresh my memory. You are welcome to read up 
other materials too.

A lot of mathematicians have spent great amount of time and energy to discover 
the beauty of numbers and their relationships. It takes a lot of persistence 
and intelligence to discover these relations. We are just reaping the practical 
benefits of those theoretical studies. We owe it to those mathematicians to 
appreciate their work and build on it. 

> Alice and Bob exchange a large prime _**p**_ and a primitive root (modulo _p_)
_**g**_. Alice picks a private number _**a**_ and sends 
_**g<sup>a</sup> mod p**_ to Bob and Bob picks a private number _**b**_ and 
sends _**g<sup>b</sup> mod p**_ to Alice.
Alice and Bob now generate _**g<sup>ab</sup> mod p**_ as their secret key.

There we go, that's DHKE summarized in 3 sentences.

The whole purpose of knowing DHKE is not just to find out the steps but to 
understand why it guarantees a secure key exchange. What computationally 
infeasible problem does it use to create a secure key exchange architecture. 
What other mathematical problems can be used to build security for the modern 
world.

### DHKE steps

Alice and Bob need to exchange a secret key securely over an insecure channel.
Secret key should never be on the insecure channel.
> At first glance it appears that Alice and Bob face an impossible task. 
It was a brilliant insight of Diffie and Hellman that the difficulty of the 
discrete logarithm problem provides a possible solution.

1. Alice and Bob to agree on a large prime _**p**_ and a nonzero integer _**g**_ 
(where _**p**_ is large (typically at least 512 bits) and _**g**_ is a 
primitive root _modulo p_)
2. Alice and Bob make the values of _**p**_ and _**g**_ public knowledge
3. Alice chooses a large random number _**a**_ as her private key and Bob 
similarly chooses a large number _**b**_
4. Alice then computes _**A = g<sup>a</sup> mod p**_, which she sends to Bob 
and Bob computes _**B = g<sup>b</sup> mod p**_, which he sends to Alice
5. Both Alice and Bob compute their shared key _**K=g<sup>ab</sup> mod p**_, 
    which Alice computes as

    _**K = B<sup>a</sup> mod p = (g<sup>b</sup> mod p)<sup>a</sup> mod p**_

    and Bob computes as

    _**K = A<sup>b</sup> mod p = (g<sup>a</sup> mod p)<sup>b</sup> mod p**_

6. Alice and Bob can now use their shared key _**K**_ to exchange information 
without worrying about other users obtaining this information. 

In order for a potential eavesdropper (Eve) to do so, she would first need to 
obtain _**K**_ knowing _**g**_, _**p**_, _**A**_ and  _**B**_ only. This can 
be done by computing _**a**_ from _**A = g<sup>a</sup> mod p**_ or 
_**b**_ from _**B = g<sup>b</sup> mod p**_
This is the discrete logarithm problem, which is computationally infeasible for 
large _p_. Computing the discrete logarithm of a number _modulo p_ takes 
roughly the same amount of time as factoring the product of two primes the 
same size as _p_, which is what the security of the RSA cryptosystem relies on.

### Why should _**g**_ be primitive root modulo _**p**_?

That's a great question! The idea of computationally infeasible problem 
rests on this requirement being satisfied. Before we move on to the _why_, 
let's first understand _what_ is _**primitive root modulo n**_.

_**Programmatic definition**_: 
Primitive root of a prime number _n_ is an integer _r_ between _[1, n-1]_
such that the values of _r<sup>x</sup> mod n_ where _x_ is in range _[0, n-2]_
are different.

_**Mathematical definition**_:
Let _n_ be a positive integer. A primitive root _mod n_ is an integer _g_ such 
that every integer relatively prime to _n_ (coprime[^1] of _n_) is congruent 
to a power of g _mod n_. Integer _g_ is a primitive root _(mod n)_ if for every 
number _a_ relatively prime to _n_ there is an integer _k_ such that 
_a ≡ g<sup>k</sup> mod n_

Example:

`2` is a primitive root mod `5`, because for every number `a` coprime to 5, 
there is an integer `k` such that a ≡ 2<sup>k</sup> (mod 5).
For every integer relatively prime to  there is a power of  that is congruent.

Primitive root _modulo n_ exists if and only if:
* _n_ is 1, 2, 4, or
* _n_ is power of an odd prime number (n=p<sup>k</sup>), or
* _n_ is twice power of an odd prime number (n=2.p<sup>k</sup>).

This theorem was proved by Gauss.

Properties: 
* No simple general formula to compute primitive roots modulo _n_ is known
* The number of primitive roots modulo n, if there are any, is equal to 
_φ(φ(n))_

    Example: _17_ has _8_ primitive roots modulo _17_.<br/>
    _φ(17) = 16_ (Hint: 17 is a prime number)([Verify](http://www.javascripter.net/math/calculators/eulertotientfunction.htm))<br/>
    _φ(16) = 8_ ([Verify](http://www.javascripter.net/math/calculators/eulertotientfunction.htm))

    [Find all primitive root modulo 17 ](http://www.bluetulip.org/2014/programs/primitive.html)

* If the 
[multiplicative order](https://en.wikipedia.org/wiki/Multiplicative_order) 
of a number _m_ modulo _n_ is equal to _φ(n)_, then it is a primitive root. 
The converse is also true: If _m_ is a primitive root modulo _n_, then the 
multiplicative order of _m_ is _φ(n)_

#### _**Finding primitive root**_

* First, compute _φ(n)_. Then determine the different prime factors of 
_φ(n)_, say p<sup>1</sup>, ..., p<sup>k</sup>. Now, for every element _m_ 
of _Z<sub>n</sub><sup>*</sup>_, compute _m<sup>φ(n)/p<sub>i</sub></sup> mod n_
for _i = 1, 2, 3...k_
* A number _m_ for which these _k_ results are all different from _1_ is a 
primitive root

### Discrete Logarithm Problem

Discrete logarithms are logarithms defined with regard to multiplicative cyclic 
groups. If _G_ is a multiplicative cyclic group and _g_ is a generator of _G_, 
then from the definition of cyclic groups, we know every element _h_ in _G_ 
can be written as _g<sup>x</sup>_ for some _x_. The discrete logarithm to the 
base _g_ of _h_ in the group _G_ is defined to be _x_. 

Personally, I find it hard to deal with these generic _a, b, c ..._ 
terminology. Nothing better than an actual numeric example! So let's take
an example of _Z<sub>5</sub><sup>*</sup>_

_G = {1, 2, 3, 4}_

If _2_ is a generator, it has to generate all the elements _modulo 5_

_2<sup>0</sup> ≡ **1** mod 5_<br/>
_2<sup>1</sup> ≡ **2** mod 5_<br/>
_2<sup>2</sup> ≡ **4** mod 5_<br/>
_2<sup>3</sup> ≡ **3** mod 5_<br/>
_2<sup>4</sup> ≡ **1** mod 5_<br/>
_2<sup>5</sup> ≡ **2** mod 5_<br/>
...

Indeed, _2_ is capable of generating all possible residues modulo _5_ coprime 
to _5_.

Following the definition above: All elements of _G_ can be generated
by the _generator_ when raised to some power _x_

2<sup>x</sup> ≡ 4 mod 5

_log<sub>2</sub>(element in G) = x_

Discrete logarithm of _1_ is _4_ because _2<sup>4</sup> ≡ 1 mod 5_<br/>
Discrete logarithm of _2_ is _1_ because _2<sup>1</sup> ≡ 2 mod 5_<br/>
Discrete logarithm of _3_ is _3_ because _2<sup>3</sup> ≡ 3 mod 5_<br/>
Discrete logarithm of _4_ is _2_ because _2<sup>2</sup> ≡ 4 mod 5_<br/>

_**Discrete logarithm problem**_ is defined as: given a group _G_, a generator 
_g_ of the group and an element _h_ of _G_, find the discrete logarithm to 
the base _g_ of _h_ in the group _G_. 

In the above example, when the generator _2_ is raised to a power _x_, the
solution is equally likely to be any integer between 1 and 4. This creates
our trap-door function. Strength of a one-way function is the time
required to reverse it. Even with all the computational power on earth,
it would take thousands of years to evaluate all possibilities.
> Easy to perform in one way but hard to reverse.

Let's look at a few more examples:
* _2_ is a primitive root of modulo _5_
* _3_ is a primitive root of modulo _17_
* _3_ is a primitive root of modulo _7_

You may verify the repitition cycle [here](https://www.mathcelebrity.com/primitiveroot.php)

#### Repetition and uniform distribution of solution
![Distribution of powers of primitive root]({{site.baseurl}}{{page.imgdir}}primitive_root_uniform_distribution.png "Uniform distribution of powers of primitive root")

Considering our Z<sub>5</sub><sup>*</sup> with (2 is generator):
Calculating _3_ by raising _2_ with a power is trivial.<br/>
2<sup>3</sup> = 8 ≡ 3 mod 5

However, when you try to find out the powers that generate this element:

```python
>>> for x in range(3, 100, 4):
...     print("2^" + str(x) + " mod 5 = " + str(2 ** x % 5))
...
2^3 mod 5 = 3
2^7 mod 5 = 3
2^11 mod 5 = 3
2^15 mod 5 = 3
2^19 mod 5 = 3
2^23 mod 5 = 3
2^27 mod 5 = 3
2^31 mod 5 = 3
2^35 mod 5 = 3
2^39 mod 5 = 3
2^43 mod 5 = 3
2^47 mod 5 = 3
2^51 mod 5 = 3
2^55 mod 5 = 3
2^59 mod 5 = 3
2^63 mod 5 = 3
2^67 mod 5 = 3
2^71 mod 5 = 3
2^75 mod 5 = 3
2^79 mod 5 = 3
2^83 mod 5 = 3
2^87 mod 5 = 3
2^91 mod 5 = 3
2^95 mod 5 = 3
2^99 mod 5 = 3
```

You observe that now the search space for this power is extremely large.
Remember this was for a small prime number _5_. Imagine the computational
feasibility when the chosen prime is something like:

```
2519590847565789349402718324004839857142928212620403202777713783604366202070
7595556264018525880784406918290641249515082189298559149176184502808489120072
8449926873928072877767359714183472702618963750149718246911650776133798590957
0009733045974880842840179742910064245869181719511874612151517265463228221686
9987549182422433637259085141865462043576798423387184774447920739934236584823
8242811981638150106748104516603773060562016196762561338441436038339044149526
3443219011465754445417842402092461651572335077870774981712577246796292638635
6373289912154831438167899885040445364023527381951378636564391212010397122822
120720357
```

This prime number has 617 decimal digits (2048 bits).
Now, I hope you can imagine the colossal computation required to find discrete
logarithm of this number to the base of generator.

_**Is this discrete logarithm problem always hard?**_<br/>
No. The hardness of finding discrete logarithms depends on the groups. 
For example, a popular choice of groups for discrete logarithm based 
crypto-systems is Z<sub>p</sub><sup>*</sup> where _p_ is a prime number. 
However, if p-1 is a product of small primes, then the Pohlig-Hellman algorithm 
can solve the discrete logarithm problem in this group very efficiently. 
That's why we always want p to be a safe prime when using 
Z<sub>p</sub><sup>*</sup> as the basis of discrete logarithm based 
crypto-systems. A safe prime is a prime number which equals _2q+1_ where _q_ is 
a large prime number. This guarantees that p-1 = 2q has a large prime factor so 
that the Pohlig-Hellman algorithm cannot solve the discrete logarithm 
problem easily. 

### Popular methods for solving the discrete logarithm problem

* Pohlig-Hellman algorithm
* Baby step/giant step algorithm
* Pollard’s ρ algorithm
* Index calculus

> If you're wondering why there are no links to these methods, it's because
without reading those pages, I cannot vouch for their simplicity or help
in enriching knowledge. Feel free to google up.

### Attacks on DHKE

1. _**Discrete logarithm computation**_: If Eve wants to determine 
g<sup>ab</sup> given _g_, _g<sup>a</sup>_, _g<sup>b</sup>_, she could simply
evaluate the discrete logarithm _log<sub>g</sub>(g<sup>a</sup>)_ to compute 
_a_, and then evaluate (g<sup>b</sup>)<sup>a</sup>.

    Again, like with factorization, it is believed that general discrete 
    logarithm computation is difficult with a standard (i.e., non-quantum) 
    computer, provided the prime _p_ is suciently large and not of any
    particularly special form (e.g., not such that _p_ - _1_ only has small 
    prime divisors).

2. _**Man-in-the-middle-attack**_:
    Imagine that an adversary Eve can intercept all communication between 
    Alice and Bob. When Alice sends _c<sub>1</sub> = g<sup>a</sup>_ to Bob, 
    Eve stores _c<sub>1</sub>_ and sends _g<sup>e</sup>_ to Bob, for some 
    random integer _e_ known to Eve. Similarly, when Bob sends 
    _c<sub>2</sub> = g<sup>b</sup>_ to Alice, Eve stores _c<sub>2</sub>_ 
    and sends _g<sup>e</sup>_ to Alice. Alice computes the key _g<sup>ae</sup>_ 
    and Bob computes the key _g<sup>be</sup>_. Eve can compute both keys. If 
    Alice later sends an encrypted message to Bob using the key
    _g<sup>ae</sup>_ then Eve can decrypt it, read it, re-encrypt using the key 
    _g<sup>be</sup>_, and forward to Bob. Hence Alice and Bob might never learn 
    that their security has been compromised. One way to overcome 
    man-in-the-middle attacks is for Alice to send a digital signature on her 
    value _g<sup>a</sup>_ (and similarly for Bob). As long as Alice and Bob 
    each hold authentic copies of the other's public keys then this attack 
    fails. There are various modications to the basic Die-Hellman algorithm 
    that allow for mutual authentication: they are sufficiently distinct from 
    the basic algorithm

3. Imagine Alice and Bob are exchanging secure messages using a key generated
    by DHKE. Let's say they both have a configured system with a private key
    and public parameters set to some values. Now, our evil Eve is quietly
    listening to these encrypted messages and recording all the packets.
    Eve continues to do this for almost a year. One fine morning, Eve
    gets access to Alice's phone/computer and manages to extract the private 
    key! (A real shame Alice isn't careful with her stuff - I know). With 
    this private key and other public information, Eve applies the right
    Math and ends up with the symmetric key Alice and Bob used so far.
    With this symmetric key, Eve decrypts all the session traffic captured so 
    far. Guess what Eve stumbles upon! Bank account numbers, personal photos,
    personal messages, Alice's VIN number, Alice's DL number, and so on.
    (Don't ask me why Alice had to share those numbers with Bob. People
    share all sorts of unwanted trash on social networks and this was a
    private chat, so why not?). So, it's a big problem if 
    every session doesn't have a separate key.

### DH in real life

Well, people outsmart people all the time. Classical textbook DH is no
longer secure by itself. Even though the math (and DLP) stands strong,
there are other ways of exploiting this key exchange protocol.

Various forms of DHKE: 

* _**Anonymous Diffie-Hellman**_: Diffie-Hellman, but without authentication. 
Since the keys used in the exchange are not authenticated, the protocol is 
susceptible to Man-in-the-Middle attacks. 
Anonymous Diffie-Hellman should not be used in any communication.

* _**Fixed Diffie-Hellman**_ embeds the server's public parameter in the 
certificate, and the CA then signs the certificate. That is, the certificate 
contains the Diffie-Hellman public-key parameters, and those parameters never 
change. Diffie-Hellman parameters are signed with a DSS or RSA certificate.

* _**Ephemeral Diffie-Hellman (DHE)**_ uses temporary, public keys. Each 
instance or run of the protocol uses a different public key. The authenticity 
of the server's temporary key can be verified by checking the signature on the 
key. Since the public keys are temporary, a compromise of the server's long 
term signing key does not jeopardize the privacy of past sessions. This is 
known as Perfect Forward Secrecy (PFS).
With DHE, a different key is used for each connection, and a leakage of 
private key would still mean that all of the communications were secure. 

> In TLS[^2], we often use DHE as part of a key-exchange that uses an additional 
authentication mechanism (e.g. RSA, PSK or ECDSA). So the fact that the SSL 
server signs the ephemeral public key implies to the SSL client that this 
Diffie-Hellman public key is from the SSL server. Within _DHE-RSA_, the server 
signs the Diffie-Hellman parameter (using a private key from an _RSA_ key pair) 
to create a shared key.

* _**ECDHE: Elliptic Curve Diffie Hellman Ephemeral**_<br/>
Another way to achieve a Diffie-Hellman key exchange with the help of [elliptic 
curve cryptography](https://en.wikipedia.org/wiki/Elliptic-curve_cryptography) 
is based on the algebraic structure of elliptic curves over finite fields. 
Elliptic curve cryptography allows one to achieve the same level of security 
than RSA with smaller keys.

> Elliptic Curve Cryptography needs an article for itself. I'll post a link
to it once I write it. 

_**Why should one prefer ECDHE over DHE?**_<br/>
* ECDHE is faster, for a given security level
* The performance ratio increases with higher security levels (e.g. a 224-bit 
curve will give you roughly the same security as a 2048-bit plain DH key, 
leading to a factor of more than 8 in favour of the curve)
* Smaller messages

> Even Google chrome [favors ECDHE over DHE](https://security.googleblog.com/2018/10/modernizing-transport-security.html)

### Additional Resources
* [Brilliant explanation of Diffie-Hellman protocol](https://www.youtube.com/watch?v=YEBfamv-_do) 
by the youtube channel "Art of the Problem".
* [Diffie-Hellman Key Exchange in plain English](https://security.stackexchange.com/a/45971)
* [Diffie-Hellman protocol by brilliant.org with Mathematical proof](https://brilliant.org/wiki/diffie-hellman-protocol/)
* [DH Math](https://www.practicalnetworking.net/series/cryptography/diffie-hellman/)
* [Diffie-Hellman Protocol](http://mathworld.wolfram.com/Diffie-HellmanProtocol.html) by [David Terr](http://mathworld.wolfram.com/topics/Terr.html)
* [Ralph Merkle's Homepage](http://www.merkle.com/)
* [Ephemeral Diffie-Hellman with RSA (DHE-RSA)](https://medium.com/asecuritysite-when-bob-met-alice/ephemeral-diffie-hellman-c07c54afabff) 
* [Discrete Logarithms in Cryptography](https://math.la.asu.edu/~dummit/docs/cryptography_3_discrete_logarithms_in_cryptography.pdf)

##### _**Extras**_<br/>
In the fall of 1974, Ralph Merkle enrolled in CS244, the Computer Security 
course offered at UC Berkeley taught by Lance Hoffman. All students were 
required to submit two project proposals, one of which they would complete for 
the course. Ralph submitted a proposal for what would eventually become known 
as Public Key Cryptography -- which Hoffman _**rejected**_! 

After Hoffman rejected this proposal, he rewrote it to be shorter and simpler.
Ralph resubmitted it to Hoffman. Hoffman continued to show little interest so 
he dropped the course, but kept working on the idea. Later, he showed an early 
draft to Bob Fabry, then on the faculty at Berkeley, who immediately recognized 
it as both novel and valuable and said "Publish it, win fame and fortune!" 

Ralph submitted it to Susan Graham, then an Editor at the 
[CACM](https://m-cacm.acm.org/)
in August of 1975. Graham sent his submitted paper out for review and 
received the following response from an "experienced cryptography expert" 
whose identity is unknown to this day:

"_I am sorry to have to inform you that the paper is not in the main stream of 
present cryptography thinking and I would not recommend that it be published in 
the Communications of the ACM.
Experience shows that it is extremely dangerous to transmit key information in 
the clear._"

With this blanket rejection of public key cryptography by an "expert", 
CACM rejected the article. She was particularly bothered by the fact that 
_"there are no references to the literature. Has anyone else ever investigated 
this approach. If they consider it and reject it, why?_"

Ralph had failed to provide any references to the prior work on public key 
cryptography. The term "public key cryptography" did not yet exist, and there 
were no previous workers in the field. 

As Ralph says: "_This is not a unique problem: it illustrates a problem faced 
by anyone trying to explain a new idea to an "expert" who expects a properly 
referenced article anytime anyone tries to explain something to them._"

The first rejection by CACM left him confident that no one had previously 
investigated this approach, as the "experienced cryptography expert" had rather 
obviously failed to understand what was being proposed. 

> CACM eventually published the paper, though only after almost three years of 
delay

### Credits

* [James H.Ellis](https://en.wikipedia.org/wiki/James_H._Ellis)
* [Malcolm John Williamson](https://en.wikipedia.org/wiki/Malcolm_J._Williamson)
* [Whitfield Diffie](https://amturing.acm.org/award_winners/diffie_8371646.cfm)
* [Martin Hellman](https://ee.stanford.edu/~hellman/)
* [Ralph Merkle](http://merkle.com)

### Footnotes

[^1]: In number theory, two integers `a` and `b` are said to be relatively 
    prime, mutually prime, or coprime if the only positive integer (factor) 
    that divides both of them is `1` (`gcd(a, b) = 1`)

[^2]: Transport Layer Security is a cryptographic protocol designed to provide 
    communications security over a computer network
