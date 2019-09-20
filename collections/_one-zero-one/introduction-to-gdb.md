---
title: Introduction to gdb (GNU Debugger)
description: Learn to step through a program, set breakpoints, set bookmarks,
  break on condition, add variables to watchlist, examine memory areas,
  attach to a forked child, attach to an already running process, and 
  more 
published: true
image: /assets/images/one_zero_one/introduction-to-gdb/gdb-cmd.jpg
imgdir: /assets/images/one_zero_one/introduction-to-gdb/
twitter_shareable: true
twitter_image: /assets/images/one_zero_one/introduction-to-gdb/gdb-cmd.jpg
hashtags: gdb, debugging, 101, gdb101
---

### Table of Contents
* [About GDB](#about-gdb)
* [Installation](#installation)
* [Compile and run a program with gdb](#compile-and-run-a-program-with-gdb)
* [Get information from gdb](#get-information-from-gdb)
* [Getting help](#getting-help)
* [Navigating the program](#navigating-the-program)
* [Breakpoints](#breakpoints)
* [Print](#print)
* [Auto display](#auto-display)
* [Attaching to processes](#attaching-to-processes)
* [Bookmarks](#bookmarks)
* [Altering the flow](#altering-the-flow)
* [Examining memory areas](#examining-memory-areas)
* [Additional resources](#additional-resources)
* [Credits](#credits)


### About GDB

GDB, the GNU Project debugger, allows us to see what is going on _inside_ a 
program while it executes. We can pause a program, examine memory areas,
examine variable state, examine input arguments, experiment with values of
variables  and thus figure out why and how a program fails or works the way 
it does.

To be honest, gdb is an old school way of debugging. Less trendy and less
fancy compared to some cool GUI debugging tools available in VSCode or other 
IDEs. I work mostly on C code and I browse my source code using vim with 
ctags and cscope. Since I'm not used to any IDEs, I prefer the good old
command line gdb. Let's just say I prefer typing to clicking.

GDB supports debugging programs writting in the following languages:
* Ada
* Assembly
* C
* C++
* D
* Fortran
* Go
* Objective-C
* OpenCL
* Modula-2
* Pascal
* Rust

### Installation

* Debian based linux distros
  ```bash
  $ sudo apt-get update & sudo apt-get install -y gdb
  ```

* CentOS or RHEL linux distros
  ```bash
  $ sudo yum update && sudo yum install -y gdb
  ```

* MacOS installation
  ```bash
  # Install Homebrew package manager
  $ /usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"

  # Install gdb
  $ brew install gdb
  ```
  * Unfortunately, your sensitive MacOS needs extra care to use gdb. Please
    follow [these](https://www.ics.uci.edu/~pattis/common/handouts/macmingweclipse/allexperimental/mac-gdb-install.html) 
    instructions to please it.

* Build and install gdb on CentOS/RHEL 
  ```bash
  $ sudo yum install -y gcc gcc-c++ wget tar gzip ncurses-devel texinfo svn python-devel
  $ mkdir gdb-source && cd gdb-source

  # Download any version from http://ftp.gnu.org/gnu/gdb/?C=M;O=D
  $ wget http://ftp.gnu.org/gnu/gdb/gdb-8.3.tar.gz
  $ tar -zxvf gdb-8.3.tar.gz
  $ cd gdb-8.3
  $ ./configure --with-python=yes && make && sudo make install && echo success

  $ whereis gdb
  gdb: /usr/local/bin/gdb /usr/share/gdb
  ```

* Build and install on debian based distros
  ```bash
  $ sudo apt-get update && sudo apt-get install -y wget texinfo build-essential
  $ mkdir gdb-source && cd gdb-source

  # Download any version from http://ftp.gnu.org/gnu/gdb/?C=M;O=D
  $ wget http://ftp.gnu.org/gnu/gdb/gdb-8.3.tar.gz
  $ tar -zxvf gdb-8.3.tar.gz
  $ cd gdb-8.3
  $ ./configure && make && sudo make install && echo success

  $ whereis gdb
  gdb: /usr/local/bin/gdb /usr/share/gdb
  ```

* Windows<br/>
  Please install virtualbox/vmware workstation and use one of the above 
  operating systems

> If you're planning to use gdb in a docker container, it needs to be run with 
> the following options: 
```
$ docker run -it --cap-add=SYS_PTRACE --security-opt seccomp=unconfined --security-opt apparmor:unconfined ubuntu /bin/bash
```

### Compile and run a program with gdb

#### Sample program 
```c
/* A simple program that finds the factorial of 5 */
#include <stdio.h>

unsigned int factorial(unsigned int n, unsigned int a){
  if (n == 0)  return a;
  return factorial(n-1, n*a);
}

int main(int argc, char* argv[]){
  unsigned int number = 5;
  printf("Factorial of number %d is %d\n", 
          number, factorial(number, 1));
  return 0;
}
```

#### Compile
```bash
$ gcc -g -ggdb3 -o factorial factorial.c
```
Where,
```
-g : produces debugging information in the OSs native format (stabs, COFF, XCOFF, or DWARF 2).
-ggdb : produces debugging information specifically intended for gdb.
-ggdb3 : produces extra debugging information, for example: including macro definitions.  
(-ggdb by itself without specifying the level defaults to -ggdb2)
-o binaryfile: Place the output in the specified binaryfile 
```

#### Run a program with arguments using gdb
```bash
$ gdb -q --args factorial arg1 arg2
Reading symbols from factorial...done.
(gdb) b main
Breakpoint 1 at 0x68a: file factorial.c, line 9.
(gdb) run
Starting program: /tmp/factorial arg1 arg2

Breakpoint 1, main (argc=3, argv=0x7fffffffe768) at factorial.c:9
9       unsigned int number = 5;
(gdb) info args
argc = 3
argv = 0x7fffffffe768
(gdb) p *argv@argc
$3 = {0x7fffffffe938 "/tmp/factorial", 0x7fffffffe947 "arg1", 0x7fffffffe94c "arg2"}
```

#### GDB initialization scripts
_Consider a scenario in which you need to set an environment variable
before debugging a program. For example: 
`$ PROGUSER=alice foo_program arg1 arg2`._

_May be you wish to print the value of an environment variable as soon
as you start debugging a program. What if we wish to automate it?_

_What if we need to look at our gdb session later and analyze a program 
behavior? Can we set a file for recording our sessions?_

_What if we wanted to print all variable outputs in hex by default?_

Solution: Use `.gdbinit` scripts and commands file

We can configure some GDB commands to automatically execute during GDB startup
using a script called `.gdbinit`. We can create these scripts per project basis
and also system wide. 

* `~/.gdbinit`: User initialization file stored in user's home directory. It is 
  executed unless user specifies GDB options `-nx`, `-n` or `-nh`
* `./.gdbinit`: Initialization file for current directory. It may need to be 
  enabled with GDB security command `set auto-load local-gdbinit`. You may check
  if it's enabled or not using `show auto-load local-gdbinit` command. By 
  default, GDB reads and executes the canned sequences of commands from init 
  file (if any) in the current working directory
  ```bash
  (gdb) show auto-load local-gdbinit
  Auto-loading of .gdbinit script from current directory is on.
  ```
> Local `.gdbinit` script commands override the user's home directory 
initialization file commands.

**Example**<br/>
```bash
# User initialization script in home directory
$ cat ~/.gdbinit
# Print environment variable USER
show environment USER
# Print environment variable HOME
show environment HOME

$ gdb -q ~/target
USER = john
HOME = /home/john
Reading symbols from /home/john/target...Reading symbols from ...
done.
```

Use a local `.gdbinit` in current directory to have project
specific initializations. Example: Set an environment variable
before debugging a binary.

```bash
$ cat ./.gdbinit
set environment RUNAS_USER alice

$ gdb -q cs
Reading symbols from cs...Reading symbols from <path>/cs...done.
done.
(gdb) show environment RUNAS_USER
RUNAS_USER = alice
```

##### [Q] Which commands are available to use in these scripts?

```bash
# Some interesting commands
(gdb) help show
Generic command for showing things about the debugger.

List of show subcommands:

show ada -- Generic command for showing Ada-specific settings
show agent -- Show debugger\'s willingness to use agent as a helper
show annotate -- Show annotation_level
show architecture -- Show architecture of target
show args -- Show argument list to give program being debugged when it is started
...
(gdb) help info
Generic command for showing things about the program being debugged.

List of info subcommands:

info address -- Describe where symbol SYM is stored
info all-registers -- List of all registers and their contents
info args -- Argument variables of current stack frame
info auto-load -- Print current status of auto-loaded files
info auxv -- Display the inferior\'s auxiliary vector
info bookmarks -- Status of user-settable bookmarks
...
(gdb) help set
...
List of set subcommands:

set ada -- Prefix command for changing Ada-specfic settings
set agent -- Set debugger\'s willingness to use agent as a helper
set annotate -- Set annotation_level
set architecture -- Set architecture of target
set args -- Set argument list to give program being debugged when it is started
...

# More commands
(gdb) help all
```

#### Run GDB commands at launch
While debugging a particular bug or developing a particular
feature/project, there may be a set of breakpoints or commands
that need to be set up everytime before we start GDB. We can use some
`gdb` arguments to specify those commmands.

```bash
--command=FILE, -x : Execute GDB commands from FILE
--init-command=FILE, -ix: Like -x but execute commands before loading inferior
--eval-command=COMMAND, -ex: Execute a single GDB command. May be used multiple 
                             times and in conjunction with --command
--init-eval-command=COMMAND, -iex: Like -ex but before loading inferior
```
Naturally, this raises the question: **What is this inferior?**<br/>
**Answer**: GDB lets you run and debug multiple programs in a single session. 
In addition, GDB on some systems may let you run several programs 
simultaneously (otherwise you have to exit from one before starting another). 
In the most general case, you can have multiple threads of execution in each of 
multiple processes, launched from multiple executables. GDB represents the 
state of each program execution with an object called an inferior.

**Demo**<br/>
```bash
$ cat gdb-commands
break main
break foo
break goo

$ gdb -x gdb-commands -q call_chain
Reading symbols from call_chain...Reading symbols from <path>/call_chain...done.
done.
Breakpoint 1 at 0x100000f6f: file call_chain.c, line 18.
Breakpoint 2 at 0x100000f44: file call_chain.c, line 13.
Breakpoint 3 at 0x100000eff: file call_chain.c, line 3.
(gdb) i b
Num     Type           Disp Enb Address            What
1       breakpoint     keep y   0x0000000100000f6f in main at call_chain.c:18
2       breakpoint     keep y   0x0000000100000f44 in foo at call_chain.c:13
3       breakpoint     keep y   0x0000000100000eff in goo at call_chain.c:3
```
```bash
$ gdb -ex "break foo" -ex "break goo" -q call_chain
Reading symbols from call_chain...Reading symbols from <path>/call_chain...done.
done.
Breakpoint 1 at 0x100000f44: file call_chain.c, line 13.
Breakpoint 2 at 0x100000eff: file call_chain.c, line 3.
(gdb) i b
Num     Type           Disp Enb Address            What
1       breakpoint     keep y   0x0000000100000f44 in foo at call_chain.c:13
2       breakpoint     keep y   0x0000000100000eff in goo at call_chain.c:3
```

If you have a set of commands to execute everytime you debug
a particular project, you can use a commands file to automate
those steps for that specific project. Lets say you're debugging
two programs: `transmitter` and `receiver`.

```bash
$ cat /tmp/gdb-transmitter-commands
b main
set output-radix 16
show environment USER

$ cat /tmp/gdb-receiver-commands
b main
set output-radix 10
show environment HOME

$ gdb -q -x /tmp/gdb-transmitter-commands transmitter
Reading symbols from transmitter...Reading symbols from <path>/transmitter...done.
done.
Breakpoint 1 at 0x100000fad: file transmitter.c, line 2.
USER = alice
(gdb) r
Starting program: /home/alice/transmitter
[New Thread 0x1903 of process 78459]

Thread 2 hit Breakpoint 1, main () at transmitter.c:2
2	    int i = 65535;
(gdb) n
3	    return 0;
(gdb) print i
$1 = 0xffff
(gdb) c
Continuing.
[Inferior 1 (process 78459) exited normally]
(gdb) q

$ gdb -q -x /tmp/gdb-receiver-commands receiver
Reading symbols from receiver...Reading symbols from <path>/receiver...done.
done.
Breakpoint 1 at 0x100000fad: file receiver.c, line 2.
HOME = /home/alice
(gdb) r
Starting program: /home/alice/receiver
[New Thread 0x2503 of process 78478]

Thread 2 hit Breakpoint 1, main () at receiver.c:2
2	    int i = 65535;
(gdb) n
3	    return 0;
(gdb) print i
$1 = 65535
(gdb) c
Continuing.
[Inferior 1 (process 78478) exited normally]
(gdb) q
```


#### Quit/Exit GDB

```bash
(gdb) quit
```
> You may also use `q` or Ctrl+d to quit

### Get information from gdb

```bash
# gdb produces a lot of noise without -q option, open it in quiet mode
$ gdb -q factorial
Reading symbols from factorial...done.
(gdb) info
List of info subcommands:info address -- Describe where symbol SYM is stored
info all-registers -- List of all registers and their contents
info args -- Argument variables of current stack frame
info auto-load -- Print current status of auto-loaded files
info auto-load-scripts -- Print the list of automatically loaded Python scripts
info auxv -- Display the inferior\'s auxiliary vector
info bookmarks -- Status of user-settable bookmarks
info breakpoints -- Status of specified breakpoints (all user-settable breakpoints if no argument)
...
info os -- Show OS data ARG
info types -- All type names
info variables -- All global and static variable names
---Type <return> to continue, or q <return> to quit---
```

#### List of some interesting commands in help
```bash
(gdb) help status   # lists a bunch of info commands
(gdb) info frame    # list information about the current stack frame
(gdb) info locals   # list local variable values of current stack frame
(gdb) info args     # list argument values of current stack frame
(gdb) info registers        # list register values
(gdb) info breakpoints      # list status of all breakpoints
```

#### Listing the lines of source files
We can use `list`/`l` commmand to print lines from a source file. 
There are several ways to specify what part of the file you want to print. 

Most commonly used formats:
* `list linenum`: Print lines centered around line number _linenum_ in the 
   current source file
* `list function`: Print lines centered around the beginning of function 
  _function_
* `list`: Print more lines. If the last lines printed were printed with a 
  `list` command, this prints lines following the last lines printed
* `list -`: Print lines just before the lines last printed

By default, GDB prints ten source lines with any of these forms of the 
`list` command. You can change this using `set listsize`.

**Example**<br/>
`(gdb) set listsize 6` makes the list command display 6 source lines

#### Searching expressions
`gdb` allows a forward and reverse search for regular expressions
within a file being debugged using `search` and `reverse-search`
command.

Consider a source file
```c
#include <stdio.h>
#include <string.h>

int main(){
    char *word = "everest";
    char reverseword[strlen(word)+1];
    unsigned int letters_remaining = strlen(word);
    char *wordpointer = &word[strlen(word)-1];
    int i = 0;
    while(letters_remaining > 0){
        reverseword[i++] = *wordpointer--;
        letters_remaining--;
    }
    reverseword[strlen(word)] = '\0';
    printf("So the reversed word is %s\n",reverseword);
    return 0;
}
```

```bash
$ gdb -q reverse_word
Reading symbols from reverse_word...done.
(gdb) search pointer
8       char *wordpointer = &word[strlen(word)-1];
(gdb) search reversewo
11          reverseword[i++] = *wordpointer--;
(gdb) reverse-search letters_
10      while(letters_remaining > 0){
(gdb) 
```

This search could prove quite handy when you are debugging a file
and looking to break on a particular function.

#### Backtrace
Typical workflow of debugging an error message from log:
* Look for the error message in source code
* Identify the function that's generating the error
* Put a breakpoint on that function and analyze the issue

Often enough, the root cause of an error propagates through a call
flow and finally surfaces in an entirely different function.

**Example**<br/>
`foo()` creates memory on heap and passes the pointer to `bar()`. 
`bar()` performs some calculations and stores some bytes on
the heap memory and passes the heap memory pointer to `goo()` function.
`goo()` reads the heap memory to find out it wasn't sufficient to copy
a required signature byte and raises an error.

If we insert a breakpoint in `goo()`, we won't have sufficient information to 
resolve the error. In order to fix this, we have to backtrace using 
`backtrace`/`bt` command and find the root cause of bug.

**Source code**<br/>
```c
#include <stdio.h>
void goo(){
    printf("ERR: Signature not found\n");
}

void bar(){
    goo();
}

void foo(){
    bar();
}

int main(){
    foo();
    return 0;
}
```

```bash
$ gdb -q call_chain
Reading symbols from call_chain...Reading symbols from <path>/call_chain...done.
done.
(gdb) b goo
Breakpoint 1 at 0x100000f2f: file call_chain.c, line 3.
(gdb) r
Starting program: <path>/call_chain
[New Thread 0x1803 of process 75745]

Thread 2 hit Breakpoint 1, goo () at call_chain.c:3
3	    printf("ERR: Signature not found\n");
(gdb) bt
#0  goo () at call_chain.c:3
#1  0x0000000100000f49 in bar () at call_chain.c:7
#2  0x0000000100000f59 in foo () at call_chain.c:11
#3  0x0000000100000f74 in main () at call_chain.c:15
```

> Use `help bt` for more options to use with backtrace

#### Executing shell commands in GDB
```bash
(gdb) shell ping -c 1 stallman.org
PING stallman.org (216.116.72.174): 56 data bytes
64 bytes from 216.116.72.174: icmp_seq=0 ttl=49 time=91.188 ms

--- stallman.org ping statistics ---
1 packets transmitted, 1 packets received, 0.0% packet loss
round-trip min/avg/max/stddev = 91.188/91.188/91.188/0.000 ms
(gdb) shell pwd
/home/alice/
(gdb) shell grep -rI "bar" .
./call_chain.c:void bar(){
./call_chain.c:    int bar_var = 10;
./call_chain.c:    bar();
```

#### Logging GDB to a file
GDB allows logging the entire debugging session to a file of your choice.
This file may be later helpful to trace back the state of program at 
different breakpoints.
If logging is turned on, default name of log file is `gdb.txt` and it will be 
created in the current directory. However, we may change this file name and the 
directory.

> gdb logging is not turned on by default. We have to explicitly set it during 
 a gdb session or using initialization scripts

```bash
$ cat gdb-log-setting
set logging file /tmp/gdb.log
set logging on

$ gdb -x gdb-log-setting -q call_chain
...
Thread 2 hit Breakpoint 2, main () at call_chain.c:18
18	    foo();
(gdb) n
Thread 2 hit Breakpoint 1, foo () at call_chain.c:13
13	    int foo_var = 10;
(gdb) n
14	    bar();
(gdb) i b
Num     Type           Disp Enb Address            What
1       breakpoint     keep y   0x0000000100000f44 in foo at call_chain.c:13
	breakpoint already hit 1 time
2       breakpoint     keep y   0x0000000100000f6f in main at call_chain.c:18
	breakpoint already hit 1 time
...
```
```bash
$ ls -ldgo /tmp/gdb.log
-rw-r--r--  1   684 Aug  7 00:52 /tmp/gdb.log
```

> Use `(gdb) help set logging` to find more options of logging


### Getting help
`gdb` comes with a ton of help information built into the tool.<br/>
General syntax: `(gdb) help <command>`

Examples:
```bash
(gdb) help all

Command class: aliases

ni -- Step one instruction
rc -- Continue program being debugged but run it in reverse
rni -- Step backward one instruction
rsi -- Step backward exactly one instruction
si -- Step one instruction exactly
...

(gdb) help macro
Prefix for commands dealing with C preprocessor macros.

List of macro subcommands:

macro define -- Define a new C/C++ preprocessor macro
macro expand -- Fully expand any C/C++ preprocessor macro invocations in EXPRESSION
macro expand-once -- Expand C/C++ preprocessor macro invocations appearing directly in EXPRESSION
macro list -- List all the macros defined using the 'macro define' command
macro undef -- Remove the definition of the C/C++ preprocessor macro with the given name

Type "help macro" followed by macro subcommand name for full documentation.
Type "apropos word" to search for commands related to "word".
Command name abbreviations are allowed if unambiguous.

(gdb) help macro define
Define a new C/C++ preprocessor macro.
The GDB command 'macro define DEFINITION' is equivalent to placing a
preprocessor directive of the form '#define DEFINITION' such that the
definition is visible in all the inferior\'s source files.
For example:
  (gdb) macro define PI (3.1415926)
  (gdb) macro define MIN(x,y) ((x) < (y) ? (x) : (y))

(gdb) help breakpoints 
Making program stop at certain points.

List of commands:

awatch -- Set a watchpoint for an expression
break -- Set breakpoint at specified location
break-range -- Set a breakpoint for an address range
catch -- Set catchpoints to catch events
...
```

### Navigating the program
Simple navigation requires `run`/`r`, `step`/`s`, `next`/`n`, `continue`/`c` and 
`finish`/`f` commands. Use `(gdb) help <command>` for advanced usage of these 
options.

* `run`/`r`: Runs a program until it hits a breakpoint
* `step`/`s`: Steps into a subroutine if it exists, executes the next expression otherwise
* `next`/`n`: Executes the next step and doesn not step into any subroutines
* `continue`/`c`: Continues the execution of program until the next breakpoint
* `finish`/`f`: Forces the program to finish the execution of current function

Example:
```c
/* foo.c */
int foo(){
  int b = 100;
  return 23;
}

int bar(){
  int a = 10;
  return 34;
}
int main(){
  int x, y;
  x = foo();
  y = bar();
  return 0;
}
```

```bash
$ gdb -q binary 
Reading symbols from binary...done.
(gdb) b main
Breakpoint 1 at 0x626: file foo.c, line 12.
(gdb) r
Starting program: /tmp/binary 

Breakpoint 1, main () at foo.c:12
12    x = foo();
(gdb) step
foo () at foo.c:2
2     int b = 100;
(gdb) finish
Run till exit from #0  foo () at foo.c:2
0x0000555555554630 in main () at foo.c:12
12    x = foo();
Value returned is $1 = 23
(gdb) next
13    y = bar();
(gdb) next
14    return 0;
(gdb) continue 
Continuing.
[Inferior 1 (process 1705) exited normally]
```

### Breakpoints
Breakpoints are used to pause a running program and examine 
the variables, arguments, memory areas, stack, heap and experiment
with the values or contents.

Breakpoints can be set while starting gdb or after the program starts running.
If you know the function or line number to pause, it can be specified on the
command line before starting gdb

```bash
# foo_binary is the compiled binary
# args.c is one of the linked source files
$ gdb -q -ex "break function_foo" -ex "break args.c:45" foo_binary
```

If we wish to set breakpoints after the program starts:

```bash
gdb -q factorial
Reading symbols from factorial...done.
(gdb) break main
Breakpoint 1 at 0x68a: file factorial.c, line 9.
(gdb) break 4
Breakpoint 2 at 0x658: file factorial.c, line 4.
(gdb) break factorial.c:4
Note: breakpoint 2 also set at pc 0x658.
Breakpoint 3 at 0x658: file factorial.c, line 4.
```

* `b` is a shortcut command for `break`
* breakpoint on a line can be set without filename if the line is in 
  the current source being debugged
* Do not run the program without setting breakpoints (otherwise it defeats
  the purpose of `gdb`)

#### View the current breakpoints
```bash
(gdb) info breakpoints 
Num     Type           Disp Enb Address            What
1       breakpoint     keep y   0x000055555555468a in main at factorial.c:9
    breakpoint already hit 1 time
2       breakpoint     keep y   0x0000555555554658 in factorial at factorial.c:4
3       breakpoint     keep y   0x0000555555554658 in factorial at factorial.c:4
```

#### Deleting a breakpoint
Delete breakpoint number 3
```bash
(gdb) delete breakpoints 3
```

> `gdb` does not allow deleting multiple breakpoints at once. We have
to delete the breakpoints one by one

#### Setting a temporary breakpoint (breaks the program only once)
```bash
(gdb) tbreak factorial
Temporary breakpoint 1 at 0x658: file factorial.c, line 4.
```
This breakpoint will be deleted automatically after it hits the breakpoint once

#### Disable and enable breakpoints
Lets say there are two functions `foo()` and `bar()` called in the following order:
1. foo()
2. bar()
3. foo()

We may wish to debug `foo()` function only after `bar()` executes. In such cases, we 
can set breakpoints for both functions and just disable `foo()` until `bar()` executes

Disable breakpoint number 1
```bash
(gdb) disable 1
```

Enable breakpoint number 1 after `bar()` executes.
```bash
(gdb) enable 1
```

`Enb` column in the `info breakpoints` output shows whether the breakpoint
is enabled or disabled

```bash
(gdb) info breakpoints 
Num     Type           Disp Enb Address            What
1       breakpoint     keep n   0x0000000000000658 in factorial at factorial.c:4
2       breakpoint     keep y   0x0000000000000658 in factorial at factorial.c:4
3       breakpoint     keep y   0x0000000000000663 in factorial at factorial.c:5
```

#### Ignoring a breakpoint
If we want the debugger to skip the breakpoint of a function/line for 
a fixed number of times, we can use the `ignore` command

```bash
(gdb) info breakpoints 
Num     Type           Disp Enb Address            What
1       breakpoint     keep y   0x0000000000000658 in factorial at factorial.c:4
2       breakpoint     keep y   0x000000000000068a in main at factorial.c:9
3       breakpoint     keep y   0x0000000000000658 in factorial at factorial.c:4
(gdb) ignore 1 3
Will ignore next 3 crossings of breakpoint 1.
```

#### Conditional breakpoints
Sometimes we may wish to pause the debugger at a breakpoint only
when a condition is met.<br/>
Example: We may wish to break on `factorial()` when the argument 
is near the end of calculations.

```bash
(gdb) b factorial if n == 3
Breakpoint 1 at 0x658: file factorial.c, line 4.
(gdb) info breakpoints 
Num     Type           Disp Enb Address            What
1       breakpoint     keep y   0x0000000000000658 in factorial at factorial.c:4
    stop only if n == 3
(gdb) r
Starting program: /tmp/factorial 
Breakpoint 1, factorial (n=3, a=20) at factorial.c:4
4       if (n == 0)  return a;
```
If we are breaking on a line in a function (`ex: n = do_foo_get_val()`), we 
may specify the condition to meet a particular criteria
```bash
(gdb) b processor.c:43 if n > 100
```

We may also set a condition on an existing breakpoint using 
`condition <breakpoint number> <condition>`:

```bash
(gdb) info breakpoints 
Num     Type           Disp Enb Address            What
1       breakpoint     keep y   0x0000555555554658 in factorial at factorial.c:4
2       breakpoint     keep y   0x000055555555468a in main at factorial.c:9
    breakpoint already hit 1 time
(gdb) condition 1 (n > 3)
(gdb) info breakpoints 
Num     Type           Disp Enb Address            What
1       breakpoint     keep y   0x0000555555554658 in factorial at factorial.c:4
    stop only if (n > 3)
2       breakpoint     keep y   0x000055555555468a in main at factorial.c:9
    breakpoint already hit 1 time
```

> FYI: `n` is the argument to factorial function

### Print
The whole point of using breakpoints and pausing programs is to 
print and view the values and understand the working of a program
logic. Hence, `print`/`p` is one of the most essential commands of `gdb`.

#### Printing simple variables
```bash
gdb -q --args factorial arg1 arg2
Reading symbols from factorial...done.
(gdb) b main
Breakpoint 1 at 0x68a: file factorial.c, line 9.
(gdb) r
Starting program: /tmp/factorial arg1 arg2

Breakpoint 1, main (argc=3, argv=0x7fffffffe768) at factorial.c:9
9       unsigned int number = 5;
(gdb) print argv[0]
$1 = 0x7fffffffe938 "/tmp/factorial"
(gdb) print argv[1]
$2 = 0x7fffffffe947 "arg1"
(gdb) print argv[2]
$3 = 0x7fffffffe94c "arg2"
(gdb) p argc  
$4 = 3
(gdb) # Printing macros
(gdb) p FOO_CONSTANT
$1 = 83779
```

#### Printing the whole array at once
General syntax: `(gdb) p *array_name@array_length`
```bash
(gdb) p *argv@argc
$5 = {0x7fffffffe938 "/tmp/factorial", 0x7fffffffe947 "arg1", 0x7fffffffe94c "arg2"}
```

#### Printing numbers in different formats
By default, GDB prints a value according to its data type. Optionally, we can 
specify an output format when we print a value.

This is done by starting the arguments of the print command with a slash and a 
format letter. The format letters supported are:

```bash
x: Regard the bits of the value as an integer, and print the integer in 
   hexadecimal.
d: Print as integer in signed decimal.
u: Print as integer in unsigned decimal.
o: Print as integer in octal.
t: Print as integer in binary. The letter 't' stands for two. 10
a: Print as an address, both absolute in hexadecimal and as an offset from the 
   nearest preceding symbol. You can use this format used to discover where 
   (in what function) an unknown address is located:

 (gdb) p/a 0x54320
 $3 = 0x54320 <_initialize_vx+396>

c: Regard as an integer and print it as a character constant. 
f: Regard the bits of the value as a floating point number and print using 
   typical floating point syntax.
s: Regard as a string, if possible. 
z: Like 'x' formatting, the value is treated as an integer and printed as 
   hexadecimal, but leading zeros are printed to pad the value to the size of 
   the integer type.
r: Print using the 'raw' formatting. By default, GDB will use a Python-based 
   pretty-printer, if one is available. This typically results in a 
   higher-level display of the value's contents. The 'r' format bypasses any 
   Python pretty-printer which might exist. 
```

Examples:
```bash
(gdb) p/x argc
$6 = 0x3
(gdb) p/t argc
$8 = 11
(gdb) p/d argc
$12 = 3
(gdb) p/o argc
$13 = 03
(gdb) p/z argc
$14 = 0x00000003
(gdb) # Printing program counter
(gdb) p/x $pc
$15 = 0x55555555468a
```

#### Printing source of a macro
Consider a case in which 
* `foo.c` has included `foo.h`
* `foo.h` has included `bar.h`
* `bar.h` has included `goo.h`
* `goo.h` has defined a macro constant `FOO_CONSTANT`

We can easily trace the origin of a macro in gdb as follows:
```bash
(gdb) info macro FOO_CONSTANT 
Defined at /tmp/goo.h:1
  included at /tmp/bar.h:1
  included at /tmp/foo.h:1
  included at /tmp/foo.c:2
#define FOO_CONSTANT 46
```
We can also expand a macro to see the value substitutions

Example macro:
```c
#define FOO(x, y) (x+y)/(x*y*bar(x))
```
```bash
(gdb) macro expand FOO(3, 4)
expands to: (3+4)/(3*4*bar(3))
```
#### Printing source of a linked function
Lets say we wanted to know the source of a function `process_encrypted_data` in current context

```bash
(gdb) info line *process_encrypted_data
Line 825 of "/src/aes/encryption.h"
   starts at address 0x5852b9 <process_encrypted_data>
   and ends at 0x5852c1 <process_encrypted_data+8>.
```

#### Printing the type of a variable/function

`ptype` command prints the definition of the type specified.

Consider the following defined types:
```c
struct evp_cipher_st {
    int nid;
    int iv_len;
    unsigned long flags;
    int (*ctrl) (int type, int arg);
    /* Application data */
    void *app_data;
};

typedef struct evp_cipher_st EVP_CIPHER;
```

```bash
(gdb) r
Starting program: <path>/ptype-demo
Breakpoint 1, main () at ptype-demo.c:24
24  EVP_CIPHER *evp_cipher = malloc(sizeof(EVP_CIPHER *));
(gdb) n
25  evp_cipher->nid = 120;
(gdb) ptype(evp_cipher)
type = struct evp_cipher_st {
    int nid;
    int iv_len;
    unsigned long flags;
    int (*ctrl)(int, int);
    void *app_data;
} *
(gdb) n
27  evp_cipher->ctrl = controller;
(gdb) ptype(evp_cipher->ctrl)
type = int (*)(int, int)
(gdb) ptype(evp_cipher->app_data)
type = void *
(gdb) ptype factorial
type = unsigned int (unsigned int, unsigned int)
```

#### Exploring expression or types
Another way of examining values of expressions and type information is through 
the Python extension command `explore` (available only if the GDB build is 
configured with `--with-python`). It offers an interactive way to start at the 
highest level (or, the most abstract level) of the data type of an expression 
(or, the data type itself) and explore all the way down to leaf scalar 
values/fields embedded in the higher level data types.

Syntax: `(gdb) explore arg`<br/>
Where, `arg` is either an expression (in the source language), or a type 
visible in the current context of the program being debugged.

Simple expression exploration:
```c
int main(){
    char word[4] = {'g', 'd', 'b'};
    char *arr = "gnu";
    int a = 10;
    return 0;
}
```

```bash
...# Start debugging
(gdb) explore word
'word' is an array of 'char'.
Enter the index of the element you want to explore in 'word': 1
'word[1]' is a scalar value of type 'char'.
word[1] = 100 'd'

Press enter to return to parent value: q

Returning to parent value...

'word' is an array of 'char'.
Enter the index of the element you want to explore in 'word': q
(gdb) explore arr
'arr' is a pointer to a value of type 'char'
Continue exploring it as a pointer to a single value [y/n]: n
Continue exploring it as a pointer to an array [y/n]: y
Enter the index of the element you want to explore in 'arr': 1
'arr[1]' is a scalar value of type 'char'.
arr[1] = 110 'n'

Press enter to return to parent value: q

Returning to parent value...

Enter the index of the element you want to explore in 'arr': q
```

**Embedded struct example**<br/>
```c
struct SimpleStruct {
  int i;
  double d;
};

struct ComplexStruct {
  struct SimpleStruct *ss_p;
  int arr[10];
};

int main(){
  struct SimpleStruct ss = { 10, 1.11 };
  struct ComplexStruct cs = { &ss, { 0, 1, 2, 3, 4, 5, 6, 7, 8, 9 } };
    return 0;
}
```

```bash
(gdb) explore cs
The value of 'cs' is a struct/class of type 'struct ComplexStruct' with the following fields:

  ss_p = <Enter 0 to explore this field of type 'struct SimpleStruct *'>
   arr = <Enter 1 to explore this field of type 'int [10]'>

Enter the field number of choice: 0
'cs.ss_p' is a pointer to a value of type 'struct SimpleStruct'
Continue exploring it as a pointer to a single value [y/n]: y
The value of '*(cs.ss_p)' is a struct/class of type 'struct SimpleStruct' with the following fields:

  i = 10 .. (Value of type 'int')
  d = 1.1100000000000001 .. (Value of type 'double')


Press enter to return to parent value:
The value of 'cs' is a struct/class of type 'struct ComplexStruct' with the following fields:

  ss_p = <Enter 0 to explore this field of type 'struct SimpleStruct *'>
   arr = <Enter 1 to explore this field of type 'int [10]'>

Enter the field number of choice: 1
'cs.arr' is an array of 'int'.
Enter the index of the element you want to explore in 'cs.arr': 3
'(cs.arr)[3]' is a scalar value of type 'int'.
(cs.arr)[3] = 3

Press enter to return to parent value:

Returning to parent value...

'cs.arr' is an array of 'int'.
Enter the index of the element you want to explore in 'cs.arr':

Returning to parent value...
```

### Auto display
Instead of using the print command to watch the value of a variable or contents 
of a memory region for every line of execution, gdb allows us to create a 
watch list and automatically prints those values when we step through commands. 
`display` command allows us to both print variables and contents of a memory 
region.

#### Syntax
```bash
display expression
display/fmt expression
display/fmt address
```
Where,
`fmt` offers the same options as formats of `print` command.

Consider a simple word reverse program
```c
#include <stdio.h>
#include <string.h>
int main(){
    char *word = "test";        /* Word to reverse */
    char reverseword[strlen(word)+1]; /* Storage for reversed word */
    unsigned int letters_remaining = strlen(word);
    char *wordpointer = &word[strlen(word)-1];
    int i = 0;
    while(letters_remaining > 0){
        reverseword[i++] = *wordpointer--;
        letters_remaining--;
    }
    reverseword[i] = '\0';  /* Null terminator for the word */
    printf("Reversed word is %s\n",reverseword);
    return 0;
}
```
Automatic display example
```bash
$ gdb -q wordreverse
Reading symbols from wordreverse...Reading symbols from <path>/wordreverse...done.
done.
(gdb) b main
Breakpoint 1 at 0x100000e5d: file wordreverse.c, line 4.
(gdb) r
Starting program: <path>/ordreverse
[New Thread 0x1803 of process 13710]

Thread 2 hit Breakpoint 1, main () at wordreverse.c:4
4	    char *word = "test";
(gdb) n
5	    char reverseword[strlen(word)+1];
(gdb)
6	    unsigned int letters_remaining = strlen(word);
(gdb)
7	    char *wordpointer = &word[strlen(word)-1];
(gdb)
8	    int i = 0;
(gdb)
9	    while(letters_remaining > 0){
(gdb) display  letters_remaining
1: letters_remaining = 4
(gdb) display *wordpointer
2: *wordpointer = 116 't'
(gdb) display/5cb reverseword
3: x/5cb reverseword
0x7ffeefbff800:	96 '`'	-8 '\370'	-65 '\277'	-17 '\357'	-2 '\376'
(gdb) n
10	        reverseword[i++] = *wordpointer--;
1: letters_remaining = 4
2: *wordpointer = 116 't'
3: x/5cb reverseword
0x7ffeefbff800:	96 '`'	-8 '\370'	-65 '\277'	-17 '\357'	-2 '\376'
(gdb)
11	        letters_remaining--;
1: letters_remaining = 4
2: *wordpointer = 115 's'
3: x/5cb reverseword
0x7ffeefbff800:	116 't'	-8 '\370'	-65 '\277'	-17 '\357'	-2 '\376'
(gdb)
9	    while(letters_remaining > 0){
1: letters_remaining = 3
2: *wordpointer = 115 's'
3: x/5cb reverseword
0x7ffeefbff800:	116 't'	-8 '\370'	-65 '\277'	-17 '\357'	-2 '\376'
(gdb)
10	        reverseword[i++] = *wordpointer--;
1: letters_remaining = 3
2: *wordpointer = 115 's'
3: x/5cb reverseword
0x7ffeefbff800:	116 't'	-8 '\370'	-65 '\277'	-17 '\357'	-2 '\376'
(gdb)
11	        letters_remaining--;
1: letters_remaining = 3
2: *wordpointer = 101 'e'
3: x/5cb reverseword
0x7ffeefbff800:	116 't'	115 's'	-65 '\277'	-17 '\357'	-2 '\376'
(gdb)
9	    while(letters_remaining > 0){
1: letters_remaining = 2
2: *wordpointer = 101 'e'
3: x/5cb reverseword
0x7ffeefbff800:	116 't'	115 's'	-65 '\277'	-17 '\357'	-2 '\376'
(gdb)
10	        reverseword[i++] = *wordpointer--;
1: letters_remaining = 2
2: *wordpointer = 101 'e'
3: x/5cb reverseword
0x7ffeefbff800:	116 't'	115 's'	-65 '\277'	-17 '\357'	-2 '\376'
(gdb)
11	        letters_remaining--;
1: letters_remaining = 2
2: *wordpointer = 116 't'
3: x/5cb reverseword
0x7ffeefbff800:	116 't'	115 's'	101 'e'	-17 '\357'	-2 '\376'
(gdb)
9	    while(letters_remaining > 0){
1: letters_remaining = 1
2: *wordpointer = 116 't'
3: x/5cb reverseword
0x7ffeefbff800:	116 't'	115 's'	101 'e'	-17 '\357'	-2 '\376'
(gdb)
10	        reverseword[i++] = *wordpointer--;
1: letters_remaining = 1
2: *wordpointer = 116 't'
3: x/5cb reverseword
0x7ffeefbff800:	116 't'	115 's'	101 'e'	-17 '\357'	-2 '\376'
(gdb)
11	        letters_remaining--;
1: letters_remaining = 1
2: *wordpointer = -1 '\377'
3: x/5cb reverseword
0x7ffeefbff800:	116 't'	115 's'	101 'e'	116 't'	-2 '\376'
(gdb)
9	    while(letters_remaining > 0){
1: letters_remaining = 0
2: *wordpointer = -1 '\377'
3: x/5cb reverseword
0x7ffeefbff800:	116 't'	115 's'	101 'e'	116 't'	-2 '\376'
(gdb)
13	    reverseword[i] = '\0';
1: letters_remaining = 0
2: *wordpointer = -1 '\377'
3: x/5cb reverseword
0x7ffeefbff800:	116 't'	115 's'	101 'e'	116 't'	-2 '\376'
(gdb)
14	    printf("Reversed word is %s\n",reverseword);
1: letters_remaining = 0
2: *wordpointer = -1 '\377'
3: x/5cb reverseword
0x7ffeefbff800:	116 't'	115 's'	101 'e'	116 't'	0 '\000'
(gdb)
Reversed word is tset
15	    return 0;
1: letters_remaining = 0
2: *wordpointer = -1 '\377'
3: x/5cb reverseword
0x7ffeefbff800:	116 't'	115 's'	101 'e'	116 't'	0 '\000'
(gdb)
16	}
```

#### Viewing the watchlist variables

`(gdb) display` shows all the watchlist variables along with their display
numbers

#### Deleting a display
You can either delete a single display number or a range of display
numbers (_Example: 1-3_)

* `undisplay <display_number/Range>` or
* `delete display <display_number/Range>`

Examples
```bash
(gdb) undisplay 2
(gdb) delete display 1
(gdb) del display 3-5
```

#### Disable/Enable a display
A disabled display item is not printed automatically, but is not forgotten. 
It may be enabled again later. Optionally, you can disable a range of display 
numbers.

Examples
```bash
(gdb) disable display 4
(gdb) disable display 5-7
(gdb) enable display 6
```

#### View information about displays
This command shows all the displays in effect alongwith the status 
(enabled/disabled)

```bash
(gdb) info display
Auto-display expressions now in effect:
Num Enb Expression
1:   n  letters_remaining
2:   y  *wordpointer
3:   n  /5bc reverseword
```

### Attaching to processes

#### Attaching to a forked child process
Lets say you are writing a parallel program and you wish to spawn child 
processes. The default behavior of `gdb` is to follow the parent process.

Lets consider a simple program that forks a child process to do some work in 
parallel with the main process.

```c
#include <stdio.h>
#include <sys/types.h>
#include <unistd.h>
void do_parent_process(){
    sleep(1); /* Make sure parent is alive while the child works */
    printf("PID of parent process: %d\n",getpid());
}
void do_child_process(){
    printf("PID of Child process: %d\n",getpid());
    printf("PID of parent of child process: %d\n",getppid()); 
}
int main(){
    pid_t pid;
    pid = fork();
    if(pid == 0){
        /* Child process */
        do_child_process();
    }
    else{
        /* Parent process */
        do_parent_process();
    }
    return 0;
}
```
If we debug the program with default behavior of gdb:
```bash
(gdb) b do_child_process 
Breakpoint 1 at 0x400687: file main.c, line 11.
(gdb) b do_parent_process 
Breakpoint 2 at 0x400661: file main.c, line 6.
(gdb) i b
Num     Type           Disp Enb Address            What
1       breakpoint     keep y   0x0000000000400687 in do_child_process at main.c:11
2       breakpoint     keep y   0x0000000000400661 in do_parent_process at main.c:6
(gdb) r
Starting program: <path>/fork-demo 
PID of Child process: 2863
PID of parent of child process: 2859
Breakpoint 2, do_parent_process () at main.c:6
6  sleep(1); /* To make sure parent is alive while the child works */
(gdb)
```
We see that gdb latched on the breakpoint in main process even though we had a 
breakpoint for the function in child process. So, how do we follow the child 
process? `set` command to our rescue.

```bash
(gdb) set follow-fork-mode child
(gdb) b do_child_process 
Breakpoint 1 at 0x400687: file main.c, line 11.
(gdb) b do_parent_process 
Breakpoint 2 at 0x400661: file main.c, line 6.
(gdb) r
Starting program: <path>/fork-demo 
[New process 2874]
[Switching to process 2874]
Breakpoint 1, do_child_process () at main.c:11
11  printf("PID of Child process: %d\n",getpid());
(gdb) PID of parent process: 2870
(gdb) n
PID of Child process: 2874
12  printf("PID of parent of child process: %d\n",getppid()); 
(gdb)
```

#### Attaching to a running process
Lets say you wish to debug your daemon process (compiled with debug flag). 
You can easily attach to your process using the process ID and insert 
breakpoints to debug it.

First, start your daemon process
```bash
$ ./daemonprocess
```
Next, open another terminal, find the pid of your process and attach to the 
process. 

> NOTE: Ubuntu requires sudo privileges to attach to an already running process

```bash
$ pgrep -f daemonprocess
8666
$ sudo gdb -q
(gdb) attach 8666
Attaching to process 8666
Reading symbols from <path>/daemonprocess...done.
Reading symbols from /lib/x86_64-linux-gnu/libc.so.6...Reading symbols from /usr/lib/debug//lib/x86_64-linux-gnu/libc-2.19.so...done.
done.
Loaded symbols for /lib/x86_64-linux-gnu/libc.so.6
Reading symbols from /lib64/ld-linux-x86-64.so.2...Reading symbols from /usr/lib/debug//lib/x86_64-linux-gnu/ld-2.19.so...done.
done.
Loaded symbols for /lib64/ld-linux-x86-64.so.2
0x00007f6844b27330 in __read_nocancel () at ../sysdeps/unix/syscall-template.S:81
81 ../sysdeps/unix/syscall-template.S: No such file or directory.
(gdb) b a_simple_loop
Breakpoint 1 at 0x400678: file daemonprocess.c, line 6.
(gdb) c
Continuing.
Breakpoint 1, a_simple_loop (limit=50) at daemonprocess.c:6
6  for(iterator = 0; iterator < limit; iterator++){
(gdb) p limit
$1 = 50
(gdb) detach
```
You may detach from the running process anytime using `detach` command.
Detaching the process continues its execution. After the detach command, that 
process and GDB become completely independent once more, and you are ready to 
attach another process. If you exit GDB while you have an attached process, you 
detach that process. If you use the run command, you kill that process. By 
default, GDB asks for confirmation if you try to do either of these things.

### Bookmarks

One of the incredible features of GDB is bookmarking or setting checkpoints.
Its basically a time machine for our program. We can navigate between the past,
present and future of our program with the exact same context!

> **Last updated**: August 7, 2019<br/>
> This feature is currently available on GNU/Linux only

Many times during debugging, we wish to go back to a state of program that
has already executed and take a different execution path by altering
the flow of program. **Currently on GNU/Linux**, GDB is able to save a snapshot 
of a program's state, called a _checkpoint_, and come back to it later.

* Returning to a checkpoint effectively undoes everything that has happened in 
  the program since the checkpoint was saved. This includes changes in memory, 
  registers, and even (within some limits) system state
* Effectively, it is like going back in time to the moment when the checkpoint 
  was saved

##### [Q] Why do I need checkpoints in the first place?
If you're stepping through a program and you think you're getting close 
to the point where things go wrong, you can save a checkpoint. Then, if you 
accidentally go too far and miss the critical statement, instead of having to 
restart your program from the beginning, you can just go back to the checkpoint 
and start again from there. This can be especially useful if it takes a lot of 
time or steps to reach the point where you think the bug occurs.

##### [Q] Why can't I just restart the program and debug?
On some systems such as GNU/Linux, address space randomization is 
performed on new processes for security reasons. This makes it difficult or 
impossible to set a breakpoint, or watchpoint, on an absolute address if you 
have to restart the program, since the absolute location of a symbol will 
change from one execution to the next. A checkpoint, however, is an identical 
copy of a process. Therefore if you create a checkpoint at (eg.) the start of 
main, and simply return to that checkpoint instead of restarting the process, 
you can avoid the effects of address randomization and your symbols will all 
stay in the same place. 

##### [Q] If my program has already written data to a file, will it un-write?
Good question. The answer is no. It will rewind the file pointer to the previous
location, so that the previously written data can be overwritten.

##### [Q] If I've already read some data from a file, will the checkpoint read it again?
Yes. For files opened in read mode, the pointer will also be restored so that 
the previously read data can be read again.

##### [Q] Can I undo the writes sent to an external device like a printer or stdout?
Essentially, you're asking if `gdb` can snatch back the characters sent to 
external devices or stdout. The answer is no. Lets not run wild with our 
imagination of a time machine.

##### [Q] Does it work in multithreaded environment?
I couldn't find any official documentation about the support for checkpoints in a multithreaded environment.
But my experiments conclude that it's not posssible.
```bash
(gdb) checkpoint                                                                                                                                                             
checkpoint: can't checkpoint multiple threads. 
```

#### Using checkpoints in GDB
```c
/* Source code */
#include <stdio.h>
int main(){
    int a = 10;
    char str[4] = "abc";
    char *strp = str;
    while (a > 8) {
        a--;
        strp++;
    }
    printf("strp: %c\n", *strp);
    printf("Value of a: %d\n", a);
    return 0;
}
```

```bash
...
(gdb) 
6       while (a > 8) {
(gdb) display a
1: a = 10
(gdb) display *strp
2: *strp = 97 'a'
(gdb) n
7           a--;
2: *strp = 97 'a'
1: a = 10
(gdb) # Insert a checkpoint in case we wish to restart
(gdb) checkpoint 
checkpoint: fork returned pid 25880.
(gdb) # Show available checkpoints
(gdb) i checkpoints 
  1 process 25880 at 0x4005cc, file checkpoints.c, line 7
* 0 process 25872 (main process) at 0x4005cc, file checkpoints.c, line 7
(gdb) n
8           strp++;
2: *strp = 97 'a'
1: a = 9
(gdb) 
6       while (a > 8) {
2: *strp = 98 'b'
1: a = 9
(gdb) 
7           a--;
2: *strp = 98 'b'
1: a = 9
(gdb) 
8           strp++;
2: *strp = 98 'b'
1: a = 8
(gdb) 
6       while (a > 8) {
2: *strp = 99 'c'
1: a = 8
(gdb) 
10      printf("strp: %c\n", *strp);
2: *strp = 99 'c'
1: a = 8
(gdb) # Lets go back to our bookmark
(gdb) restart 1
Switching to process 25880
#0  main () at checkpoints.c:7
7           a--;
(gdb) display 
2: *strp = 97 'a'
1: a = 10
(gdb) # We are back to our checkpoint!

```

> Use `delete checkpoint <checkpoint-id>` to delete a checkpoint

#### Convenience variables

GDB provides convenience variables that can be used to hold on to a value and refer to it later. These variables exist entirely within GDB; they are not part of the program, and setting a convenience variable has no direct effect on further execution of the program. 
* Convenience variables are prefixed with `$`
* Any name preceded by `$` can be used for a convenience variable, unless it is one of the predefined machine-specific register names

```c
$ cat multi_function_program.c 
#include <stdio.h>

void foo(int *x){
  *x = 100;
}
void bar(int *x){
  *x = 1000;
}
int main(){
  int *a; 
  int i = 10;
  foo(&i);
  bar(&i);
  printf("i: %d\n", i);
}
```

```bash
$ gdb -q multi_function_program
Reading symbols from multi_function_program...done.
(gdb) b main
Breakpoint 1 at 0x40055d: file multi_function_program.c, line 11.
(gdb) b foo
Breakpoint 2 at 0x400535: file multi_function_program.c, line 4.
(gdb) b bar
Breakpoint 3 at 0x400549: file multi_function_program.c, line 7.
(gdb) r
Starting program: multi_function_program 

Breakpoint 1, main () at multi_function_program.c:11
11	  int i = 10;
(gdb) n
12	  foo(&i);
(gdb) set $old_i = i
(gdb) p $old_i
$1 = 10
(gdb) n

Breakpoint 2, foo (x=0x7fffffffdc7c) at multi_function_program.c:4
4	  *x = 100;
(gdb) p $old_i
$2 = 10
(gdb) n
5	}
(gdb) 
main () at multi_function_program.c:13
13	  bar(&i);
(gdb) p $old_i
$3 = 10
(gdb) n

Breakpoint 3, bar (x=0x7fffffffdc7c) at multi_function_program.c:7
7	  *x = 1000;
(gdb) 
8	}
(gdb) 
main () at multi_function_program.c:14
14	  printf("i: %d\n", i);
(gdb) 
i: 1000
15	}
(gdb) p i
$4 = 1000
(gdb) p $old_i
$5 = 10
(gdb) q
```

The old faithful convenience variable will be with you throughout your program in any function in any thread.
Since you assign a static value to it, it doesn't change when the source value/pointer changes. 


### Altering the flow
Sometimes while debugging a program, you may need to alter the flow of program. 
There could be many reasons for altering the flow :
* Reset a counter in a loop
* Change the string input before performing a string operation
* Set the contents of some memory addresses of interest
* Observe the behavior of some code for a particular input
* Experiment with different values of a variable to test some piece of code
* Send a signal to your program
* Return prematurely from a function

Lets get started with simple editing of variables using the `set` command
```c
#include <stdio.h>
#include <stdlib.h>
typedef struct {
 unsigned int balance;
} store;
int credit(store *account, int amount){
 account->balance += amount;
}
int debit(store *account, int amount){
 account->balance -= amount;
}
int main(){
 store *account = malloc(sizeof(store *));
 credit(account, 200);
 debit(account, 300);
 printf("Balance in the store account = %u\n", account->balance);
}
```
Editing the variable value directly and using it's memory address:
```bash
(gdb) r
Starting program: <path>/flow-alter
Breakpoint 1, credit (account=0x602010, amount=200) at flow-alter.c:9
9  account->balance += amount;
(gdb) p amount
$1 = 200
(gdb) set var amount=5000
(gdb) p amount
$2 = 5000
(gdb) c
Continuing.
Breakpoint 2, debit (account=0x602010, amount=300) at flow-alter.c:13
13  account->balance -= amount;
(gdb) p &amount
$3 = (int *) 0x7fffffffde84
(gdb) set {int}0x7fffffffde84 = 50
(gdb) p amount
$4 = 50
(gdb)
```

#### Jumping around in a program
Sometimes we may have missed some important lines of code and we may wish to 
jump back to the line for a second look. `jump` command to our rescue! 
`jump` command moves the execution to the specified line number and stops at 
the next breakpoint:

```bash
(gdb) r
Starting program: <path>/flow-alter
Breakpoint 1, debit (account=0x602010, amount=300) at flow-alter.c:13
13  account->balance -= amount;
(gdb) l
8 int credit(store *account, int amount){
9  account->balance += amount;
10 }
11 
12 int debit(store *account, int amount){
13  account->balance -= amount;
14 }
15 
16 int main(){
17  store *account = malloc(sizeof(store *));
(gdb) 
18  credit(account, 200);
19  debit(account, 300);
20  printf("Balance in the store account = %u\n", account->balance);
21 }
(gdb) n
14 }
(gdb) n
main () at flow-alter.c:20
20  printf("Balance in the store account = %u\n", account->balance);
(gdb) jump 18
Continuing at 0x4005cf.
Breakpoint 1, debit (account=0x602010, amount=300) at flow-alter.c:13
13  account->balance -= amount;
(gdb)
```
#### Send signals to program
We can send signals to our program manually using `signal` command.
```bash
(gdb) help signal
Continue program with the specified signal.
Usage: signal SIGNAL
The SIGNAL argument is processed the same as the handle command.
An argument of "0" means continue the program without sending it a signal. 
This is useful in cases where the program stopped because of a signal, and you 
want to resume the program while discarding the signal.
(gdb) info signals
Signal        Stop Print Pass to program Description
SIGHUP        Yes Yes Yes  Hangup
SIGINT        Yes Yes No  Interrupt
SIGQUIT       Yes Yes Yes  Quit
SIGILL        Yes Yes Yes  Illegal instruction
SIGTRAP       Yes Yes No  Trace/breakpoint trap
SIGABRT       Yes Yes Yes  Aborted
...
```

#### Get me out command
If there's an insanely long function and we are done evaluating our
code of interest, we can just run the function to completion and
return to the caller using `finish` command. It gets you out of the
function being debugged but executes all the remaining code in function. 

Sometimes we may wish to exit a function immediately *without* executing the 
rest of the function code. `return` command lets us do that. We may also 
specify a return value while using the command.

```bash
16 int main(){
17  store *account = malloc(sizeof(store *));
18  credit(account, 200);
19  debit(account, 300);
20  printf("Balance in the store account = %u\n", account->balance);
21 }
Breakpoint 1, debit (account=0x602010, amount=300) at flow-alter.c:13
13  account->balance -= amount;
(gdb) return 
Make debit return now? (y or n) y
#0  main () at flow-alter.c:20
20  printf("Balance in the store account = %u\n", account->balance);
(gdb) p *account
$3 = {balance = 200}
```

### Examining memory areas
Examining memory areas can be very helpful to see the contents of a memory 
region pointed by a pointer. The ability to use examining tool also helps a lot 
in examining the stack contents and discover potential vulnerabilities.

**General syntax**
```bash
(gdb) x/nfu addr
(gdb) x addr
(gdb) x
```
Where,

* `n`, `f`, and `u` are all optional parameters that specify how much memory to 
  display and how to format it
* `addr` is an expression giving the address where you want to start displaying 
  memory
* If you use defaults for `nfu`, you need not type the slash `/`
* `n`: The repeat count is a decimal integer; the default is 1. It specifies 
  how much memory (counting by units u) to display
* `f`: the display format is one of the formats used by print 
  (`x`, `d`, `u`, `o`, `t`, `a`, `c`, `f`, `s`), and in addition `i` (for 
  machine instructions). The default is `x` (hexadecimal) initially
* `u`: the unit size. The unit size is any of
  * `b` Bytes
  * `h` Halfwords (two bytes)
  * `w` Words (four bytes) (Initial default)
  * `g` Giant words (eight bytes)

Examples
```bash
Breakpoint 1, main () at memory.c:11
11 int main(){
(gdb) n
12  char bytearray[6]={0x1,0x2,0x3,0x4,0x5,0x6};
(gdb) x bytearray
0x7fffffffe510: 0x04030201
(gdb) x/6xb bytearray
0x7fffffffe510: 0x01 0x02 0x03 0x04 0x05 0x06
(gdb) x/6db bytearray
0x7fffffffe510: 1 2 3 4 5 6
(gdb) x/6cb bytearray
0x7fffffffe510: 1 '\001' 2 '\002' 3 '\003' 4 '\004' 5 '\005' 6 '\006'
(gdb) x/6ub bytearray
0x7fffffffe510: 1 2 3 4 5 6
(gdb) x/6ob bytearray
0x7fffffffe510: 01 02 03 04 05 06
(gdb) x/6tb bytearray
0x7fffffffe510: 00000001 00000010 00000011 00000100 00000101 00000110
(gdb) x/6ab bytearray
0x7fffffffe510: 0x1 0x2 0x3 0x4 0x5 0x6
(gdb) x/6fb bytearray
0x7fffffffe510: 1 2 3 4 5 6
(gdb) x/6sb bytearray
0x7fffffffe510: "\001\002\003\004\005\006"
0x7fffffffe517: ""
0x7fffffffe518: ""
0x7fffffffe519: "a\247\360\024\352\252q"
0x7fffffffe521: ""
0x7fffffffe522: ""
(gdb) x/6xh bytearray
0x7fffffffe510: 0x0201 0x0403 0x0605 0x0000 0x6100 0xf0a7
(gdb) x/6xw bytearray
0x7fffffffe510: 0x04030201 0x00000605 0xf0a76100 0x71aaea14
0x7fffffffe520: 0x00000000 0x00000000
(gdb) x/6xg bytearray
0x7fffffffe510: 0x0000060504030201 0x71aaea14f0a76100
0x7fffffffe520: 0x0000000000000000 0x00007ffff7a32f45
0x7fffffffe530: 0x0000000000000000 0x00007fffffffe608
```


### Additional resources
* [A guide to GDB](http://www.cabrillo.edu/~shodges/cs19/progs/guide_to_gdb_1.1.pdf)
* [GDB documentation](https://www.gnu.org/software/gdb/documentation/)
* [GDB quick reference card](https://www.cs.princeton.edu/courses/archive/fall16/cos432/hw2/gdb-refcard.pdf)
* [Debugging with gdb -- Richard Stallman, Roland Pesch, Stan Shebs, et al.(PDF)](https://www.eecs.umich.edu/courses/eecs373/readings/Debugger.pdf)
* [Debugging with gdb HTML documentation](https://sourceware.org/gdb/onlinedocs/gdb/index.html#SEC_Contents)
* [Official GDB FAQ](https://sourceware.org/gdb/wiki/FAQ)


### Credits

* [Richard Stallman (Creator of GDB)](https://www.stallman.org/)
* [Fred Fish](https://sourceware.org/gdb/current/onlinedocs/gdb/In-Memoriam.html)
* [Michael Snyder for reverse debugging](https://sourceware.org/gdb/current/onlinedocs/gdb/In-Memoriam.html)
* [GDB Maintainers](https://www.gnu.org/software/gdb/committee/)

