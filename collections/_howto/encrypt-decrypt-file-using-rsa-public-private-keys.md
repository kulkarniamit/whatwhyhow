---
title: Encrypt/Decrypt a file using RSA public-private key pair
description: Learn how to encrypt/decrypt a file with RSA public 
    private key pair using OpenSSL commands
published: true
image: /assets/images/howto/encrypt-decrypt-file-using-rsa-public-private-keys/encrypt-decrypt.png
imgdir: /assets/images/howto/encrypt-decrypt-file-using-rsa-public-private-keys/
twitter_shareable: true
twitter_image: /assets/images/howto/encrypt-decrypt-file-using-rsa-public-private-keys/encrypt-decrypt.png
hashtags: openssl rsa encrypt decrypt 
---

### Introduction
RSA can encrypt data to a maximum amount of your key size 
(2048 bits = 256 bytes) minus padding/header data (11 bytes for PKCS#1 v1.5 
padding). As a result, it is often not possible to encrypt files with RSA 
directly. Also, RSA is not meant for this. Instead, we can encrypt a secret 
password (not shared with recipient) using recipient's RSA public key, encrypt 
the large file using a key derived from this secret password and then send the
encrypted secret password and encrypted file to the recipient.

**NOTE**: For this example, let's assume that the recipient has generated a
_**publickey**_ and corresponding _**private.pem**_ private key. Sender has 
received a copy of _**publickey**_ 

Sender will follow these steps:

1. Generate a 256 (or any non-zero value) bit (32 byte) random password<br/>
  
    ```bash
    # Generate a 32 (or any non-zero value) byte random password in hex
    $ openssl rand -hex 32 -out randompassword
    $ cat randompassword
    28D42DC7FF8AEAE5BFB23B1771C8E2C5997A8ABF10011520D9047C4AA938F10A
    ```
    > Since hex character occupies 4 bits, to generate 256 bits, we would need 
    > 64 hex characters (64 x 4 = 256)

2. Encrypt your file with a random key derived from _**randompassword**_<br/>
    ```bash
    $ openssl enc -p -aes-256-cbc -salt -in foo.txt -out foo.enc -pass file:./randompassword
    salt=945B287F64A17C25
    key=D888EC68E573197CF770624AC5738193753FE8D3D8A6718DE4C8B15A0E726626
    iv =D2BC27B45EAAFA427005573DCE192FC7

    $ file foo*
    foo.enc: openssl enc\'d data with salted password
    foo.txt: ASCII text
    
    $ ls -la foo*
    -rw-r--r--  1 <username>  <group>  3040 Mar  6 16:48 foo.enc
    -rw-r--r--  1 <username>  <group>  3022 Mar  6 15:48 foo.txt
    ```
    _**Parameters explained**_
    * _enc_: Encoding with Ciphers
    * _-p_: Print the key, initialization vector and salt value (if used)
    * _-aes-256-cbc_: AES Encryption with a 256 bit key and CBC mode
    * _-in_: Input file name
    * _-salt_: Add a salt to password
    * _-out_: Output file name
    * _-pass_: Password source. Possible values for arg are _pass:password_ or 
    _file:filename_, where _password_ is your password and _filename_ is file 
    containing the password.
    > The key and IV (initialization vector) are derived from randompassword

3. Encrypt your random password using recipient's RSA public key<br/>

    ```bash
    $ openssl rsautl -encrypt -inkey publickey -pubin -in randompassword -out randompassword.encrypted
    
    $ file randompassword*
    randompassword:           ASCII text
    randompassword.encrypted: data
    
    $ ls -la randompassword*
    -rw-r--r--  1 <username>  <group>   65 Mar  6 15:38 randompassword
    -rw-r--r--  1 <username>  <group>  256 Mar  6 16:26 randompassword.encrypted
    ```

    _**Parameters explained**_
    * _rsautl_: Command used to sign, verify, encrypt and decrypt data using 
                RSA algorithm
    * _-encrypt_: encrypt the input data using an RSA public key
    * _-inkey_: input key file
    * _-pubin_: input file is an RSA public key
    * _-in_: input filename to read data from
    * _-out_: output filename to write to

4. Send both _**randompassword.encrypted**_ and _**big-file.pdf.encrypted**_ to 
the recipient

Recipient will follow these steps:

* Decrypt the _**randompassword.encrypted**_ using his RSA private key 
  _**private.pem**_ to obtain _**randompassword**_

    ```bash
    $ openssl rsautl -decrypt -inkey private.pem -in randompassword.encrypted -out randompassword.decrypted
    $ diff randompassword.decrypted randompassword
    $ cat randompassword
    28d42dc7ff8aeae5bfb23b1771c8e2c5997a8abf10011520d9047c4aa938f10a
    $ cat randompassword.decrypted
    28d42dc7ff8aeae5bfb23b1771c8e2c5997a8abf10011520d9047c4aa938f10a
    ```
* Decrypt _**big-file.pdf.encrypted**_ using _**randompassword**_ (to derive 
the keying material for decryption)

    ```bash
    $ openssl enc -d -p -aes-256-cbc -salt -in foo.enc -out foo.dec -pass file:./randompassword.decrypted
    salt=945B287F64A17C25
    key=D888EC68E573197CF770624AC5738193753FE8D3D8A6718DE4C8B15A0E726626
    iv =D2BC27B45EAAFA427005573DCE192FC7
    
    $ diff foo.txt foo.dec
    $
    ```
    Notice that the salt, key and IV used are same for encryption and 
    decryption.

* You may use any non-zero password size
* You may use any cipher listed by `$ openssl list-cipher-algorithms` 
for symmetric encryption

_**Some articles mention generating a 256 bit random key and not a password. 
What is this password and key derivation? Are you sure?**_<br/>

Right! Some articles refer to the 256-bit random material as _key_ which is
misleading and creates confusion. It leads us to think that we will 
generate a 256 bit random _key_ and OpenSSL will use it to perform a 
symmetric encryption. However, we are using a secret password (length is 
much shorter than the RSA key size) to derive a key. OpenSSL uses this password
to derive a random key and IV. This key will be used for symmetric encryption.
If you don't believe me, scroll up and see if the secret password (32 bytes) 
and the key used are same (they're not!)

### References

* [openssl rand](https://www.openssl.org/docs/man1.0.2/man1/rand.html)
* [openssl-rsautl](https://www.openssl.org/docs/man1.0.2/man1/rsautl.html)
* [openssl-enc](https://www.openssl.org/docs/man1.1.1/man1/openssl-enc.html)
* [RFC 2313 section-8](https://tools.ietf.org/html/rfc2313#section-8)

### Credits

* [James H.Ellis](https://en.wikipedia.org/wiki/James_H._Ellis)
* [Clifford Cocks](https://en.wikipedia.org/wiki/Clifford_Cocks)
* [Ron Rivest](https://amturing.acm.org/award_winners/rivest_1403005.cfm)
* [Leonard M. Adleman](https://amturing.acm.org/award_winners/adleman_7308544.cfm)
* [Adi Shamir](https://amturing.acm.org/award_winners/shamir_2327856.cfm)
