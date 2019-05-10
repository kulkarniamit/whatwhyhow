---
title: Use vim with ctags
description: Quickly navigate source code using vim with ctags. Learn 
  ctags installation, usage and regex patterns for quick tag search
published: true
image:  /assets/images/howto/use-vim-with-ctags/vim_ctags_preview.png
imgdir: /assets/images/howto/use-vim-with-ctags/
twitter_shareable: true
twitter_image: /assets/images/howto/use-vim-with-ctags/vim_ctags_preview.png
hashtags: vim, ctags
---

### Introduction
Ctags generates an index (or tag) file of language objects found in source 
files that allows these items to be quickly and easily located by a text 
editor or other utility. A tag signifies a language object for which an index 
entry is available. Vim is the official editor of ctags (_No vim plugin 
required_). Plain and simple: ctags lets us jump around our source code using 
tags and a stack. 
Ctags (specifically Exuberant Ctags, not the BSD version shipped with OS X) 
indexes source code to make it easy to jump to functions, variables, classes, 
and other identifiers in (among other editors) Vim (see :help tags). 

### Prerequisites
* Any Linux based OS with vim
* Source code in any of the [ctags supported programming languages](http://ctags.sourceforge.net/languages.html)

### Installation

* Ubuntu
  ```bash
  $ sudo apt-get update && sudo apt-get install -y exuberant-ctags
  ```
* CentOS
  ```bash
  $ sudo yum update && sudo yum install -y ctags
  ```
* MacOS
  ```bash
  # Some MacOS comes with ctags 
  $ /usr/bin/ctags
  usage: ctags [-BFadtuwvx] [-f tagsfile] file ...
    
  # Don't use that default ctags. Install Exuberant Ctags from homebrew
  $ brew install ctags
  $ alias ctags="`brew --prefix`/bin/ctags"
  $ alias ctags >> ~/.bash_profile
    
  $ which ctags
  /usr/local/bin/ctags
  ```
* Windows
  * [Download CemtOS](http://isoredirect.centos.org/centos/7/isos/x86_64/CentOS-7-x86_64-Minimal-1810.iso)
  * [Download Ubuntu](http://releases.ubuntu.com/18.04.2/ubuntu-18.04.2-desktop-amd64.iso)
  * [Download Manjaro](https://manjaro.org/download/gnome/)
  * [Download Fedora](https://getfedora.org/en/workstation/download/)

### How to generate tags file?

* `cd` to the root directory of your source code
* Run Ctags recursively over the entire source code to generate the tags file
* Command to generate tags:

```bash
# Example: Source code is in 'openssl' directory
$ cd openssl

$ ctags --recurse=yes --exclude=.git --exclude=BUILD --exclude=.svn --exclude=vendor/* --exclude=node_modules/* --exclude=db/* --exclude=log/*

$ ls -la tags
-rw-r--r-- 1 alice dev 3640065 Jan 24 23:11 tags
```
* It would be silly to specify the long command in every source code directory.
  `~/.ctags` file to our rescue! Just list all the commonly used arguments of
  `ctags` and place it in your home directory and call it `.ctags`
  ```bash
  $ cat ~/.ctags
  --recurse=yes
  --exclude=.git
  --exclude=BUILD
  --exclude=.svn
  --exclude=*.js
  --exclude=vendor/*
  --exclude=node_modules/*
  --exclude=db/*
  --exclude=log/*
  --exclude=\*.min.\*
  --exclude=\*.swp
  --exclude=\*.bak
  --exclude=\*.pyc
  --exclude=\*.class
  --exclude=\*.sln
  --exclude=\*.csproj
  --exclude=\*.csproj.user
  --exclude=\*.cache
  --exclude=\*.dll
  --exclude=\*.pdb
  ```
* If we have a `~/.ctags` file, we can just enter our source code directory and
  generate a `tags` file using:
  ```bash
  $ pwd 
  /home/alice/openssl
  $ ctags
  $ ls tags
  tags
  ```

**NOTE:** 
* Feel free to exclude any other directories you don't wish to search.
* Feel free to explore and use the wealth of [ctags command options](https://linux.die.net/man/1/ctags)

### How to use tags?
* To search for a specific tag and open Vim with its definition, run the 
  following command in your shell:
   `$ vim -t <tag>`

##### Demo:
[![asciicast](https://asciinema.org/a/37xnhw7A0PSVGipDPVBxxR2Wk.svg)](https://asciinema.org/a/37xnhw7A0PSVGipDPVBxxR2Wk?speed=1.5)

* Open any source file in Vim and use the following basic commands:

    |          **Keyboard command**          |                          **Action**                          |
    | :------------------------------------: | :----------------------------------------------------------: |
    | `Ctrl + ]` <br/>OR<br/> `g]`<br/> OR<br/> `:ta[g] Ctrl+rw`| Jump to the tag underneath the cursor using the information in the tags file(s) |
    |        `:ts[elect] <tag_name>`         | List the tags that match `<tag_name>`, using the information in the tags file(s). When `<tag_name>` is not given, the last tag name from the tag stack is used |
    |        `:pts[elect] <tag_name>` &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; | Does `:tselect` and shows the new tag in a "Preview" window (horizontal split) without moving the cursor |
    |     `Ctrl + w }`<br/>OR<br/> `:ptag Ctrl+rw`     | Opens a preview window with the location of the tag definition. The cursor does not change its position, so tag stack is not updated |
    |          `Ctrl + wz` <br/>OR<br/> `:pc`          |    Close preview window created by the command `Ctrl+w }`    |
    |          `Ctrl + w Ctrl + ]`           |          Open the definition in a horizontal split           |
    |                 `:tn`                  |  Jump to next matching tag (If there are multiple matches)   |
    |                 `:tp`                  | Jump to previous matching tag (If there are multiple matches) |
    |                `Ctrl-t`                |                Jump back up in the tag stack                 |
    |                `:tags`                 | Show the contents of the tag stack.  The active entry is marked with a `>` |

> `Ctrl+rw` pastes the word under cursor in command mode. It's just a quick copy paste command in vim

##### Demo
**NOTE**: vim commands will appear in the bottom left of the screen. Watching 
the demo in full screen is recommended for laptops.

[![asciicast](https://asciinema.org/a/8mh4qU3TeOfTaBgAMJ9ktQuSP.svg)](https://asciinema.org/a/8mh4qU3TeOfTaBgAMJ9ktQuSP)

**NOTE:**

* I've just listed the basic shortcuts and commands that make sense to me and 
  fit my typing speed. There are tons of other shortcuts and similar looking 
  commands in `:help tag `. Feel free to use anything that suits your 
  speed/workflow
* Of course there are plenty of plugins out there with bells and whistles. I 
  just don't like plugins.

#### tag-regexp

The tag commands also accept a regular expression argument. When using a 
pattern, case is ignored.  If you want to match case, use `\C` in the pattern. 
When the argument starts with `/`, it is used as a regex pattern.  If the 
argument does not start with `/`, it is taken literally, as a full tag name.
Examples: 

* `:tag main` jumps directly to the tag "main"
* `:tag /^get` jumps to the tag that starts with "get"
* `:tag /Final$` jumps to the tag that ends with "Final"
* `:tag /norm` lists all the tags that contain "norm", including "id_norm"
* `:tag /Final$\C` lists all the tags that end with "Final" (Doesn't match "Cipher_final" or "SHA_FINAL")

When the argument both exists literally, and match when used as a regexp, a 
literal match has a higher priority.  For example, `:tag /open` matches "open" 
before "open_file" and "file_open". 

##### Demo:
Notes:
* People have written whole [books just for regex](https://www.regular-expressions.info/books.html).
  This demo doesn't cover the complex patterns
* This demo covers the regular expressions that I use frequently and are simple 
  to remember
* Feel free to try out your complex regex ([regex101](https://regex101.com/r/tY3zV2/4))

[![asciicast](https://asciinema.org/a/jNA3mBW3EZVSt9Erwco3DF0lz.svg)](https://asciinema.org/a/jNA3mBW3EZVSt9Erwco3DF0lz?speed=1.2)

#### Sample regex searches with vim

|Requirement|Command|
|---|---|
|Search tags containing 'aes'|`vim -t '/aes'`|
|Search tags ending with 'sha1'|`vim -t '/sha1$'`|
|Search tags beginning with 'evp' and ending with 'sha1'|`vim -t '/^evp\w\+sha1$'`|
|Search tags beginning with 'EVP' and ending with 'sha1'(case sensitive)|`vim -t '/^EVP\w\+sha1$\C'`|
|Search tags beginning with 'evp', ending with 'sha1' and containing 'aes_xxx' in between|`vim -t '/^evp\w\+aes_\d\d\d\w\+sha1$'` &nbsp; &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;|
|Search tags beginning with alphabets (no numbers) and ending with 'sha1'|`vim -t '/^[a-zA-Z]\w\+sha1$'`|

### Keeping the index file up-to-date
The major downside to Ctags is having to manually rebuild that index all the 
time. 
There are multiple ways of automating this stuff:
* [Autocmd to update ctags file](https://vim.fandom.com/wiki/Autocmd_to_update_ctags_file)
* [Effortless Ctags with Git](https://tbaggery.com/2011/08/08/effortless-ctags-with-git.html)
* [AutoTag:Updates entries in a tags file automatically when saving](https://www.vim.org/scripts/script.php?script_id=1343)

However, here's an easy one using vim autocommands:
Add the following lines to your `~/.vimrc` file. 

> Create a `~/.vimrc` if it doesn't exist

```bash
" Auto generate tags file on file write of *.c and *.h files
autocmd BufWritePost *.c,*.h silent! !ctags . &
```
Where,
```bash
:au[tocmd] [group] {event} {pat} [nested] {cmd}
                        Add {cmd} to the list of commands that Vim will
                        execute automatically on {event} for a file matching
                        {pat} |autocmd-patterns|.
BufWritePost            After writing the whole buffer to a file
&                       Run the command in background
silent!                 Execute {cmd} silently. Skip error messages too(!)
*.c,*.h                 Files with extension .c and .h
```

##### Example
If you're in `openssl` source code directory, add the following lines to 
`crypto/aes/aes_cbc.c` and exit the file using vim command `:wq!`
```bash
void foo_function_to_execute_bar(){
    printf("Useless function");
}
```
Verify `tags` file:
```bash
$ grep "foo_function_to_execute_bar" tags
foo_function_to_execute_bar	crypto/aes/aes_cbc.c	/^void foo_function_to_execute_bar(){$/;"	f
```
> Of course it's going to rebuild the entire index and take a lot
of time for large projects. Remember, I said it's easy (not quick) 

### References:
* [Languages supported](http://ctags.sourceforge.net/languages.html)
* [Supported Editors](http://ctags.sourceforge.net/tools.html)
* [ctags website](http://ctags.sourceforge.net/)
* [ctags(1) - Linux man page](https://linux.die.net/man/1/ctags)
* [What is ctags?](http://ctags.sourceforge.net/whatis.html)
* [How to use ctags with vi](http://ctags.sourceforge.net/ctags.html#HOW%20TO%20USE%20WITH%20VI)
* [Negative Lookbehind in vim](http://ssiaf.blogspot.com/2009/07/negative-lookbehind-in-vim.html)
* [Negative lookahead](http://vimdoc.sourceforge.net/htmldoc/pattern.html#/\@!)
* [Negative lookbehind](http://vimdoc.sourceforge.net/htmldoc/pattern.html#/\@<!)

### Credits
* [Darren Brent Hiebert (Creator of Exuberant Ctags)](http://darrenhiebert.com/)
