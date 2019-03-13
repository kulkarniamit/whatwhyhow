---
title: Public Key Cryptography
description: Introduction to Public Key Cryptography (Asymmetric Cryptography). 
    The article explains generating public-private keys, encrypting/decrypting 
    files using public key cryptography, Public and Private key formats, 
    difference between ".pem, .cer, .der", reading public keys using command
    line utilities, and converting keys from OpenSSL to 
    OpenSSH (or vice versa) format
published: true
image: /assets/images/security/public-key-cryptography/pki.jpg
imgdir: /assets/images/security/public-key-cryptography/
twitter_shareable: true
twitter_image: /assets/images/security/public-key-cryptography/pki.jpg
hashtags: rsa, pki, cryptography, asymmetric-cryptography, public-private, openssl
---

### Table of Contents
* [Introduction](#introduction)
* [History](#history)
* [Unsung heroes of Public Key Cryptography](#unsung-heroes-of-public-key-cryptography)
* [What's private key cryptography?](#whats-private-key-cryptography)
* [Why do we need Public key cryptography?](#why-do-we-need-public-key-cryptography)
* [What is RSA?](#what-is-rsa)
* [Generate RSA public-private key pair](#generate-rsa-public-private-key-pair)
* [Public key cryptography for encryption](#public-key-cryptography-for-encryption)
* [Public cryptography for signing (digital signatures)](#public-cryptography-for-signing-digital-signatures)
* [Additional resources](#additional-resources)

### Introduction
Public key cryptography is used interchangeably with asymmetric cryptography; 
They both denote the exact same thing and are used synonymously.
Public key cryptography (Asymmetric Cryptography) involves a pair 
of keys known as a 'public key' and a 'private key'. Public key is 
published and the corresponding private key is kept secret. Data 
that is encrypted with the public key can be decrypted only with the 
corresponding private key.

_**Interesting! How can I use it?**_<br/>
Interestingly enough, there's a very high chance that you've already
used public key cryptography. Have you booked a holiday/flight on a
reputed travel company webstite? Have you ever purchased something from
amazon.com? Chances are: your browser has used these keys on your behalf
in the background while you waited for that product image to load on amazon 
or while you mindlessly scrolled on facebook to peek into other's lives.
Billions of people all over the planet use public key cryptography on a 
daily basis to establish secure connections to their banks, e-commerce sites, 
e-mail servers, and the cloud. 

### History
_**Why History? Isn't it boring and just a collection of names, dates and events?**_<br/>
I used to think so too. However, history of public key cryptography has
some valuable lessons for our present and future. It gives you the motivation 
to solve new problems, identify patterns, and contribute to the world of 
cryptography. DH protocol or RSA or any early protocols were answers to a 
2000 year old (_historic_) symmetric key problem. Knowing the history and the 
large scale impact of some historical discoveries gives you the motivation to 
solve new problems or to improve existing solutions.

Publicly introduced by 
[Whitfield Diffie](https://cisac.fsi.stanford.edu/people/whitfield_diffie), 
[Martin Hellman](https://ee.stanford.edu/~hellman/) and 
[Ralph Merkle](http://www.merkle.com/) in 1976. Mr. Merkle, Mr. Hellman and 
Mr. Diffie played a crucial role in ending the monopoly on cryptography.

Whitfield Diffie and Martin Hellman are also the recipients of 
[ACM Turing award](https://awards.acm.org/about/2015-turing).
> The ACM Turing Award, often referred to as the "**Nobel Prize of Computing**," 
carries a $1 million prize with financial support provided by Google, Inc.

### Unsung heroes of Public Key Cryptography
In 1970, a cryptographer named [James H.Ellis](https://en.wikipedia.org/wiki/James_H._Ellis) 
working for the UK's Government Communications Headquarters (GCHQ) theorized 
about a public key encryption system ("non-secret encryption") way before 
Diffie-Hellman protocol. 

> What Ellis called "non-secret encryption" we now call public key cryptography.

Ellis said that the idea first occurred to him after reading a paper from 
World War II by someone at Bell Labs describing a way to protect voice 
communications by the receiver adding (and then later subtracting) random 
noise. He realised that 'noise' could be applied mathematically but was unable 
to devise a way to implement the idea.

> Now you see why history is not a mere collection of names, dates and events?

In 1973, on arriving at GCHQ, a mathematician [Clifford Cocks](https://en.wikipedia.org/wiki/Clifford_Cocks) 
was given Ellis's internal report. He started working on it using his number 
theory background and within a very short time had invented the algorithm 
(now known as the RSA algorithm) that was to be identified four years later 
by Rivest, Shamir and Adleman.
Clifford's school friend, [Malcolm John Williamson](https://en.wikipedia.org/wiki/Malcolm_J._Williamson), 
had also joined GCHQ around this time, and he managed, after reading Ellis's 
report, to come up with what we now know as the Diffie-Hellman protocol. 

The story of this discovery was kept secret for a further 24 years. In 1997, 
Clifford announced to a conference the true history of the development of 
public key cryptography, and various internal reports were declassified to 
support the story. Alas, Ellis, whose original idea it had all stemmed from, 
died a few months before the announcement.

_**Just out of curiosity: Do we have access to those declassified documents from GCHQ?**_<br/>
Yes!
* [The Possibility of Secure Non-Secret Encryption by James H.Ellis](https://www.gchq.gov.uk/sites/default/files/document_files/CESG_Research_Report_No_3006_0.pdf)
* [A Note on 'Non-secret Encryption' by Clifford Cocks](https://www.gchq.gov.uk/sites/default/files/document_files/Cliff%20Cocks%20paper%2019731120.pdf)

_**Have you read them?**_<br/>
Not yet, it's in my bucket list

### What's private key cryptography?
In Private key cryptography, both parties must hold on to a matching private 
key (or else exchange it upon transmission) to encipher and then decipher 
plaintext. 
Famous examples: 
* [Caesar's cipher](http://practicalcryptography.com/ciphers/caesar-cipher/)
* [The Enigma machine](https://www.theguardian.com/technology/2014/nov/14/how-did-enigma-machine-work-imitation-game)

![symmetric key cryptography]({{site.baseurl}}{{page.imgdir}}symmetric_key_cryptography.png "Symmetric Key Cryptography")

### Why do we need Public key cryptography?
There is a major flaw inherent in private key cryptography. Today we 
refer to it as key distribution. If there was any distance between the two 
parties (which was not uncommon), you had to entrust a courier with your 
private key or travel there to exchange it yourself. 

In a typical situation, Alice wants to send a message to Bob, and Eve is 
trying to eavesdrop. If Alice is sending private messages to Bob, she will 
encrypt each one before sending it, using a separate key each time. Alice is 
continually faced with the problem of key distribution because she has to convey
the keys to Bob securely, otherwise he cannot decrypt the messages. One way to 
solve the problem is for Alice and Bob to meet up once a week and exchange
enough keys to cover the messages that might be sent during the next seven days.
Exchanging keys in person is certainly secure, but it is inconvenient, 
not scalable and if either Alice or Bob is sick during winter, the system 
breaks down. Even in the digital age, private key encryption on its own 
struggles with key distribution. 

##### _**How's asymmetric different from symmetric cryptography?**_
In symmetric cryptography, unscrambling process is simply the opposite of 
scrambling. For example, the Enigma machine uses a certain key setting to 
encipher a message, and the receiver uses an identical machine in the same key 
setting to decipher it. Both sender and receiver effectively have equivalent 
knowledge, and they both use the same key to encrypt and decrypt. Their 
relationship is symmetric. 
In an asymmetric key system, as the name suggests, the encryption key and the 
decryption key are not identical. This distinction between encryption and 
decryption keys is what makes an asymmetric cipher special.
In an asymmetric cipher, if Alice knows the encryption key, she can encrypt a 
message, but she cannot decrypt a message. In order to decrypt, Alice must 
have the decryption key. 

##### _**Hold on! Diffie-Hellman protocol is used for exchanging keys for symmetric cryptography. Why is DH-protocol included in Public Key Cryptography?**_
Sharp observation. Diffie-Hellman protocol belongs to a public-key technology.
It is an asymmetric technology used to negotiate symmetric keys.
Here's the basic functionality:

* Alice and Bob publicly agree to use a modulus `p` and base `g`
* Alice chooses a secret integer `a`, then sends Bob `A = `g<sup>a</sup>` mod p`
* Bob chooses a secret integer `b`, then sends Alice `B = `g<sup>b</sup>` mod p`
* Alice computes `s = `B<sup>a</sup>` mod p`
* Bob computes `s = `A<sup>b</sup>` mod p`
* Alice and Bob now share a secret `s`

Alice's public key `A` and Bob's public key `B` was sent over a public channel.
Alice's private key `a` and Bob's private key `b` was kept private.
Hence, this has the context of being a public key cryptography in which both the
parties have a pair of public and private keys.

> **Wait! Why are those keys same? The equation looks different.**

> They are the same because of a property of modulo exponents
>
>(g<sup>a</sup> mod p)<sup>b</sup> mod p = g<sup>ab</sup> mod p
>
>(g<sup>b</sup> mod p)<sup>a</sup> mod p = g<sup>ab</sup> mod p

The security of Diffie-Hellman protocol relies on the computational 
intractability of finding solutions to the [Discrete Logarithm Problem (DLP)](https://www.khanacademy.org/computing/computer-science/cryptography/modern-crypt/v/discrete-logarithm-problem).
This is a long standing problem in number theory.

##### _**While we're on DHKE, how does Diffie-Hellman Key Exchange work?**_
When I started to write this article, I thought I could give a brief explanation
of Diffie-Hellman Key Exchange and the discrete logarithm problem. 
But the beauty of number theory, hard mathematical problems, properties of prime
numbers is such that, it's injustice to merely state the protocol 
and not explain how math works. It's not just modulo arithmetic and large 
numbers. It deserves it's own page and explanation.
Here's an article dedicated to [Diffie-Hellman Key Exchange]({{site.baseurl}}/security/diffie-hellman-key-exchange.html).

##### _What was the need for asymmetric encryption when DHKE solved the problem of secure symmetric key exchange?_
DHKE is an asymmetric technology used to exchange symmetric keys. Both
parties still had to use the same key to unlock a piece of information.
* Imagine a bank that needs to secure transactions with customers. If there
are 100,000 customers, the bank would need to store 100,000 keys and send
thousands of messages with customers to establish symmetric keys.
* Imagine an organization with 2000 employees and if each of them need to
communicate with each other securely with a distinct key, the organization
would need 2 million (`n (n - 1)/2`) shared secret keys.
These problems can be solved by asymmetric keys.

### What is RSA?
RSA (Rivest-Shamir-Adleman) is one of the first public-key cryptosystems and is
widely used for secure data transmission. Strenth of RSA lies in the practical
difficulty of "factoring problem". RSA has been the industry standard for 
public key cryptography for many years now. 

_**Why are we just discussing RSA? What about DSA, ECDSA, Ed25519?**_<br/>
RSA keys are the most widely used and better known. RSA has been around longer 
than others, and people trust it more because of the significant time it has
spent in the open world. The longer an algorithm stays in open for academic
studies, strength analysis and deep scrutiny by security community, the higher
the trust. Anyway, there is some information available in the 
[Additional resources](#additional-resources) section for those who like 
closure.

##### _How does RSA work?_
Here's a brief and quick summary of RSA:
* Choose two large prime numbers `p` and `q` and calulate their product `n = pq`
* Calculate _φ(pq) = (p - 1)(q - 1)_ and chooses a number `e` relatively 
prime(coprime) to _φ(pq)_. 
* Calculate the modular inverse `d` of `e` modulo _φ(pq)_. 
In other words, _de ≡ 1 mod φ(n)_. (`d` is the private key)
* Distribute both parts of the public key: `n` and `e`
* `d` is kept secret

Let's keep this article light and reserve deep dives to a dedicated article.
Please refer [this]({{site.url}}{{site.baseurl}}/security/rsa.html) article for a deep dive on RSA and the math behind it.

### What is ECDSA?
Elliptic Curve Digital Signature Algorithm (ECDSA) offers a variant of the 
Digital Signature Algorithm (DSA) which uses elliptic curve cryptography.

### Generate RSA public-private key pair

#### Using OpenSSL

```bash
# Generating private RSA key
$ openssl genrsa -out openssl_private_key.pem 1024
Generating RSA private key, 1024 bit long modulus
...++++++
.................++++++
e is 65537 (0x010001)

$ file *
openssl_private_key.pem: PEM RSA private key

$ cat openssl_private_key.pem
-----BEGIN RSA PRIVATE KEY-----
MIICXQIBAAKBgQDfmPMQaJba+n3P4E65x7HoHRxmwNl8STPZuIjUMTjSCLfB17FU
Rs9k2yGVSgS24mW6bQnlHy0dW0uDOFd7PqshB/7S2xnP+f+90YBdvT43BKpn1VZ8
...
-----END RSA PRIVATE KEY-----

# Generating public RSA key using OpenSSL
$ openssl rsa -in openssl_private_key.pem -pubout > openssl_public_key.pub
writing RSA key

$ cat openssl_public_key.pub
-----BEGIN PUBLIC KEY-----
MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDfmPMQaJba+n3P4E65x7HoHRxm
wNl8STPZuIjUMTjSCLfB17FURs9k2yGVSgS24mW6bQnlHy0dW0uDOFd7PqshB/7S
2xnP+f+90YBdvT43BKpn1VZ8qMVjGR5xvX9Y/7+I8J4XJTZBNMNXq0Jbq116fLEu
+ylTKsdtS4ewi/U9gQIDAQAB
-----END PUBLIC KEY-----

# Generating public RSA key using OpenSSH
# -y:   Read a private OpenSSH format file and print openSSH public key
#       to stdout
# -e:   Read a public/private OpenSSH key file and print to stdout the key 
#       in one of the formats specified by -m option
# -m:   Specify a key format for -i(import) or -e(export)
# -f:   Filename of key file
$ ssh-keygen -y -f openssl_private_key.pem -e -mpkcs8
-----BEGIN PUBLIC KEY-----
MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDfmPMQaJba+n3P4E65x7HoHRxm
wNl8STPZuIjUMTjSCLfB17FURs9k2yGVSgS24mW6bQnlHy0dW0uDOFd7PqshB/7S
2xnP+f+90YBdvT43BKpn1VZ8qMVjGR5xvX9Y/7+I8J4XJTZBNMNXq0Jbq116fLEu
+ylTKsdtS4ewi/U9gQIDAQAB
-----END PUBLIC KEY-----

```
#### Using OpenSSH
```bash
# -t: Type of key to create
# -b: Number of bits in the key to create
# -N: New passphrase
# -v: Verbose mode
# -f: Filename of key file
$ ssh-keygen -t rsa -b 1024 -N "" -v -f ./id_rsa
Generating public/private rsa key pair.
Your identification has been saved in ./id_rsa.
Your public key has been saved in ./id_rsa.pub.
The key fingerprint is:
SHA256:J9fVZ57aHq2p+cp5WvuqXtKnZ2dVlEZIEf63OVkL8AY <username>@d91513f539fd
The key\'s randomart image is:
+---[RSA 1024]----+
|            .+=..|
|            .. +.|
|           E .o.+|
|           .+..o+|
|        S o .+ o=|
|         +  ..+ X|
|            ..+O+|
|           . *o*B|
|           .XBBBo|
+----[SHA256]-----+

$ file id_rsa*
id_rsa:     PEM RSA private key
id_rsa.pub: OpenSSH RSA public key

$ cat id_rsa         
-----BEGIN RSA PRIVATE KEY-----
MIICXgIBAAKBgQDZjTG1uWYEoO35h7Me4D3R6CmskvQAWf6sc1/o7SwM1CYDusi1
...
2i/mz+FNJOExkkHGu3w/3sPyrW+mCKFLGrWvXJ03IsHDw==
-----END RSA PRIVATE KEY-----

$ cat id_rsa.pub 
ssh-rsa AAAAB3N...+w== 

```

_**Looks like the public key formats are different for OpenSSH and OpenSSL. 
Can I convert OpenSSH public key to OpenSSL public key 
format (or vice versa)?**_<br/>
Of course!

```bash
# Converting OpenSSH public key to OpenSSL public key format
# -e:   Read a public/private OpenSSH key file and print to stdout the key 
#       in one of the formats specified by -m option
# -m:   Specify a key format for -i(import) or -e(export)
# -f:   Filename of key file
$ ssh-keygen -e -m pkcs8 -f id_rsa.pub
-----BEGIN PUBLIC KEY-----
MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDZjTG1uWYEoO35h7Me4D3R6Cms
kvQAWf6sc1/o7SwM1CYDusi1Ihgdk7966sDDpSW1iBAZOWLNW8u8l/Av/3ziG/i8
izrPyjYVdqBMbiDn2urgIsk0yhZkeWs93hSN46ZI4VRjDACHqYL19pntN+/z8ydW
tRzezWz780J9lzYA+wIDAQAB
-----END PUBLIC KEY-----

# Converting OpenSSL public key to OpenSSH public key format
# -f:   Filename of key file
# -i:   Read an unencrypted private(or public key) in the format specified by
#       -m option and print an OpenSSH compatible private (or public) key to
#       stdout
# -m:   Specify a key format for -i(import) or -e(export)
$ ssh-keygen -f openssl_public_key.pub -i -mPKCS8
ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAAAgQDfmPMQaJba+n3P4E65x7HoHRxmwNl8STPZuIjUMTjSCLfB17FURs9k2yGVSgS24mW6bQnlHy0dW0uDOFd7PqshB/7S2xnP+f+90YBdvT43BKpn1VZ8qMVjGR5xvX9Y/7+I8J4XJTZBNMNXq0Jbq116fLEu+ylTKsdtS4ewi/U9gQ==

```

_**I tried to use `-m PEM` and I obtained a slightly different format, 
what's that?**_<br/>
As you noticed, there's a slight variation in the format. Let's see what it
looks like:

```bash
$ ssh-keygen -e -m pem -f id_rsa.pub
-----BEGIN RSA PUBLIC KEY-----
MIGJAoGBANmNMbW5ZgSg7fmHsx7gPdHoKayS9ABZ/qxzX+jtLAzUJgO6yLUiGB2T
v3rqwMOlJbWIEBk5Ys1by7yX8C//fOIb+LyLOs/KNhV2oExuIOfa6uAiyTTKFmR5
az3eFI3jpkjhVGMMAIepgvX2me037/PzJ1a1HN7NbPvzQn2XNgD7AgMBAAE=
-----END RSA PUBLIC KEY-----
```
This is a PKCS#1 PEM-encoded public key. 
Markers used to delimit the base64 encoded data:

```
-----BEGIN RSA PUBLIC KEY-----
...
-----END RSA PUBLIC KEY-----
```

This is different from an x.509 public key, which looks like this:
```
-----BEGIN PUBLIC KEY-----
...
-----END PUBLIC KEY-----
```

The X.509 format may be used to store keys generated using algorithms other 
than RSA.


_**PEM? What's that? What's DER?**_<br/>
_**PEM**_: Privacy Enhanced Mail is a de facto file format for storing and sending 
cryptographic keys, certificates, and other data, based on a set of IETF 
standards defining "privacy-enhanced mail.". Because DER produces binary 
output, it can be challenging to transmit the resulting files through systems, 
like electronic mail, that only support ASCII. The PEM format solves this 
problem by encoding the binary data using base64. PEM also defines a one-line 
header, consisting of "`-----BEGIN` ", a label, and "`-----`", and a one-line 
footer, consisting of "`-----END`", a label, and "`-----`". The label 
determines the type of message encoded. Common labels include 
"`CERTIFICATE`", "`CERTIFICATE REQUEST`", and "`PRIVATE KEY`".

_**DER**_: Distinguished Encoding Rules is a restricted variant of 
BER (Basic Encoding Rules) for producing unequivocal transfer syntax for data 
structures described by ASN.1. DER is the same thing as BER with all but one 
sender's options removed. DER is widely used for digital certificates such as 
X.509.

_**X.509**_: A standard defining the format of public key certificates. X.509 
certificates are used in many Internet protocols, including TLS/SSL. An X.509 
certificate contains a public key and an identity (a hostname, or an 
organization, or an individual), and is either signed by a certificate 
authority or self-signed. When a certificate is signed by a trusted certificate 
authority, or validated by other means, someone holding that certificate can 
rely on the public key it contains to establish secure communications with 
another party, or validate documents digitally signed by the corresponding 
private key.

_**BER**_: The format for Basic Encoding Rules specifies a self-describing and 
self-delimiting format for encoding ASN.1 data structures. Each data element is 
encoded as a type identifier, a length description, the actual data elements, 
and, where necessary, an end-of-content marker. These types of encodings are 
commonly called type-length-value or TLV encodings. This format allows a 
receiver to decode the ASN.1 information from an incomplete stream, without 
requiring any pre-knowledge of the size, content, or semantic meaning of the 
data.

_**ASN.1**_: Abstract Syntax Notation One (ASN.1) is a standard interface 
description language for defining data structures that can be serialized and 
deserialized in a cross-platform way. ASN.1 is also independent of any hardware 
or operating system you might choose to use. This allows exchange of 
information whether one end is a cell phone and the other end is a super 
computer, or anything in between. It is broadly used in telecommunications and 
computer networking, and especially in cryptography. ASN.1 is both 
human-readable and machine-readable.

#### _**Quick summary**_
* DER is a concrete binary representation used as a wire format to describe 
ASN.1 schemas
* PEM is nothing more than a base64-encoded DER

### Public key cryptography for encryption
Let's say Alice wants to send a confidential email to Bob.
However, Eve lives in Alice's apartment and is taking network security
course at her grad school. Whenever Eve is jobless and doesn't have any
assignments, she intercepts messages on her network and likes to read
others messages. Eve uses Wireshark or ettercap or some Kali linux tool.
I am not sure since I haven't met Eve. To overcome this irritating Eve's
eavesdropping habit, Alice calls up Bob and asks him to create a public-private
key pair. Bob sends his public key to Alice (It's public key, so Eve 
has most probably intercepted it already, who cares!). Since RSA public
key encryption has limitation on message size, Alice uses a symmetric key
and encrypts her confidential email using AES encryption. Next, Alice 
encrypts the symmetric key using Bob's RSA public key and sends both
the encrypted symmetric key and encrypted email to Bob. Eve intercepts
both these messages but is unable to decrypt the email since it's encrypted
using symmetric key and the key can only be decrypted by Bob's private key.
<br/><br/>
Since Eve doesn't have access to a Quantum computer and hasn't figured out
how to factor the primes of RSA, she's unable to read Alice's emails.
Alice is happy and the last time I checked, Eve is reading up on 
[Shor's Algorithm](https://en.wikipedia.org/wiki/Shor%27s_algorithm) and plans 
to use [IBM Q soon](https://www.research.ibm.com/ibm-q/learn/what-is-ibm-q/). 
Until she does that, Alice's emails are secure.

**FYI**: This is the basic idea behind PGP (Pretty Good Privacy). Have a look:

![Diagram illustrating how PGP works](https://upload.wikimedia.org/wikipedia/commons/4/4d/PGP_diagram.svg "Diagram illustrating how PGP works")
Image credits: [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:PGP_diagram.svg)

_**I've heard PGP is dead. Is that true?**_<br/>
On 17 May 2018, Wired declared "[PGP is dead](https://www.wired.co.uk/article/efail-pgp-vulnerability-outlook-thunderbird-smime)".
Without describing [Efail](https://efail.de/) vulnerability technically, they
start with their complaint that PGP was first developed in 1991 and science of 
cryptography has advanced dramatically since then. 

However, the truth is: PGP encryption itself is not broken in any way. 
The vulnerability is introduced by the user'e email client that processes
messages. Saying PGP is broken is just plain wrong, but I guess it 
generates a lot of clicks.

> In a nutshell, if an attacker is able to get access to a user's encrypted 
> email, they can modify the message in a specific way and send it back to the 
> user. The user's email client will the decrypt the message and (if the email 
> client is rendering HTML tags) automatically send the decrypted message back 
> to the attacker

_"At its core, PGP remains cryptographically sound, and using a few bad 
   implementations to claim that PGP has a serious flaw is both untrue and 
   disingenuous."_<br/>
<p style="text-align: right;">
- Andy Yen (Founder of Protonmail)
</p>

I'll let Andy from protonmail do the rest of talking : [No, PGP is not broken, not even with the Efail vulnerabilities](https://protonmail.com/blog/pgp-vulnerability-efail/)

### Public cryptography for signing (digital signatures)
Just imagine if Eve gets an 'A' on her Network Security course and tries to fool
around by sending an email to Bob by spoofing Alice? All she has to do is use
Bob's public key to encrypt a random key. Encrypt an email using that random key
and send it to Bob as Alice. Now, you may be thinking "That's impossible! How 
can Bob not recognize Alice's email address? He already knows Alice's email 
address is _alice@gmail.com_". Okay, what if Eve creates a new email account 
_therealalice@gmail.com_ and sends out the following email to Bob using above
method:

_"Hey Bob!<br/> I lost my previous email account password and I think it may be 
    hacked. So, please ignore all emails from alice@gmail.com and use my new 
    email address to contact me.<br/><br/>
    Oh btw Bob! I know this is last minute request but I owe about $5000 to Eve
    for my tuition and rental. Today is the last date for Eve to pay her minimum
    credit card bill. Could you please be a lamb and transfer $3000 to Eve 
    before 1pm today?<br/>
    Here's Eve's venmo account: @evilevetrapsyou<br/><br/>
    Later alligator,<br/>
    Alice <3 you"_

> Now please don't ramble about why Bob never texted/called Alice to confirm 
> this email switch. Just assume Alice left her phone at home or her phone 
> hanged due to an update and Bob couldn't reach her to verify. Why did Alice 
> leave her phone at home? How would I know? May be she was fed up of
> charging her phone every 3-4 hours! May be her phone manufacturer sent
> her an update to deliberately slow down her phone! (Alice hasn't purchased
> the latest shiny $1000 phone yet). It could be anything, stop trying to 
> find loopholes and think of a solution instead

What if Alice and Bob both exchanged their public keys securely. Now Alice
will take a hash of the message, encrypt the hash using her own private key and
append the result to the message. Eve can of course decrypt this hash
using Alice's public key but hash is of no use. If Eve replaces the hash and the
message, Bob won't be able to use Alice's public key to decrypt the hash and
hence won't believe the message. This is how digital signatures work!

![Diagram illustrating how a simple digital signature is applied and verified](https://upload.wikimedia.org/wikipedia/commons/2/2b/Digital_Signature_diagram.svg "Diagram illustrating how a simple digital signature is applied and verified")
Image source: [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Digital_Signature_diagram.svg)

When Bob receives the message, he follows these steps:
* Decrypt the signature using Alice's public key. This will yield a hash of the 
  message. 
* Decrypt the session key (symmetric) using his private key.
* Decrypt the actual message using session key
* Generate a hash of the message
* Check if the generated hash matches the decrypted hash from signature
* If there's no match, discard the message
* If there's a match, Alice is the only person on planet earth to send that 
message since she has the private key

#### Create and verify a signature using OpenSSL
```bash
# Create a signature file signature.sha256 for a plaintext file foo.txt
$ openssl dgst -sha256 -sign private.pem -out signature.sha256 foo.txt
$ file signature*
signature.sha256: data

# Verify the signature for foo.txt
$ openssl dgst -sha256 -verify publickey -signature signature.sha256 foo.txt
Verified OK
```

_**Can I encrypt a file with my private key and decrypt using public key?**_<br/>
Just think of this operation and see if it makes sense. Encrypting with your 
private key doesn't make much sense when the decryption key is well known and 
public. You might as well give the file in plaintext to the world.

### Additional resources

* [RSA]()
* [Encrypt/Decrypt a file using RSA public-private key pair]({{site.url}}{{site.baseurl}}/howto/encrypt-decrypt-file-using-rsa-public-private-keys.html)

* RSA, DSA, ECDSA, and Ed25519 are all used for digital signing
    * DSA (Digital Signature Algorithm) is a Federal Information Processing 
      Standard for digital signatures. It's security relies on a discrete 
      logarithmic problem. Compared to RSA, DSA is faster for signature 
      generation but slower for validation. Compare it yourself using your
      openssl toolset: <br/>
      ```bash
      $ openssl speed dsa
      ...
      sign    verify    sign/s verify/s
      dsa  512 bits 0.000667s 0.000794s   1499.2   1258.8
      dsa 1024 bits 0.002285s 0.002750s    437.6    363.6
      dsa 2048 bits 0.008332s 0.009960s    120.0    100.4

      $ openssl speed rsa
      ...
      sign    verify    sign/s verify/s
      rsa  512 bits 0.000706s 0.000038s   1416.0  26280.2
      rsa 1024 bits 0.004336s 0.000191s    230.6   5237.8
      rsa 2048 bits 0.029155s 0.000825s     34.3   1212.6
      rsa 4096 bits 0.198824s 0.003049s      5.0    327.9
      ```
      This matters because we generate (sign) the key once but end users verify 
      it way more often. Current processors for desktops and laptops are 
      ridiculously fast. It can be an issue on embedded devices
    * ECDSA is an Elliptic Curve implementation of DSA (Digital Signature 
      Algorithm). Elliptic curve cryptography[^1] is able to provide the 
      relatively the same level of security level as RSA with a smaller key
    * Ed25519 is similar to ECDSA but uses a superior curve, and it does not 
      have the same weaknesses when weak RNGs[^2] are used as DSA/ECDSA.
      There's some [conspiracy theory](http://cr.yp.to/talks/2013.05.31/slides-dan+tanja-20130531-4x3.pdf)
      as well, but that's a topic for another day.

### References

* [Enc - OpenSSLWiki](https://wiki.openssl.org/index.php/Enc)
* [openssl-rsautl](https://www.openssl.org/docs/man1.0.2/man1/rsautl.html)
* [How PGP works](http://users.ece.cmu.edu/~adrian/630-f04/PGP-intro.html#p4)

### Credits

* [James H.Ellis](https://en.wikipedia.org/wiki/James_H._Ellis)
* [Malcolm John Williamson](https://en.wikipedia.org/wiki/Malcolm_J._Williamson)
* [Whitfield Diffie](https://amturing.acm.org/award_winners/diffie_8371646.cfm)
* [Martin Hellman](https://ee.stanford.edu/~hellman/)
* [Ralph Merkle](http://merkle.com)

### Footnotes

[^1]: Will be explained in detail in another article. Not here, a lot of math
      to be explained

[^2]: Random Number Generator
