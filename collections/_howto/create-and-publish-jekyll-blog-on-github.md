---
title: Create jekyll blog and publish on Github
description: Create a dockerized 'minima' themed jekyll blog and publish on Github
imgdir: /assets/images/howto/create-and-publish-jekyll-blog-on-github/
tags: docker jekyll github blog minima
---

### Preface
Jekyll is a super cool easy-to-use website generator that builds static blogs 
to be hosted on GitHub Pages. Jekyll provides [layouts](https://jekyllrb.com/docs/step-by-step/04-layouts/) 
(to create base layouts), [includes](https://jekyllrb.com/docs/step-by-step/05-includes/)
(to prevent code rewrite), [front matter](https://jekyllrb.com/docs/step-by-step/03-front-matter/) 
defaults, support for [liquid](https://jekyllrb.com/docs/step-by-step/02-liquid/) 
template engine, and much more. Jekyll is an excellent way to quickly write 
beautiful and structured articles using [Markdown](http://kirkstrobeck.github.io/whatismarkdown.com/). 
However, this article is **not** the quickest way to set up a Jekyll powered blog.
There are better articles listed in [FAQ](#faq) section that lets you get on board
in < 10 minutes. 
Read this article if you
* Love [Docker](https://www.docker.com/why-docker) and prefer keeping your 
local host machine clean (with no ruby/package dependencies)
* Want to create your own docker image to edit your blog
* Want to test your blog appearance locally before pushing on Github

### TL;DR
* [Create a docker image](#steps-to-create-a-docker-image)
* [Create a jekyll blog](#steps-to-create-jekyll-blog)
* [Publish jekyll blog on Github](#steps-to-publish-jekyll-blog-on-github)
* [FAQ](#faq)

### Prerequisites
* Sign up for a [Github](https://github.com/) account
* Read through [quick starter guide](https://jekyllrb.com/docs/ruby-101) for Ruby, gems, bundle etc
* Read [When and Why to Use Docker](https://www.linode.com/docs/applications/containers/when-and-why-to-use-docker/). You don't have to know all the commands. Just execute the commands and you will thank yourself later for using Docker
* Sign up for a [Docker Hub](https://hub.docker.com/) account

### Steps to create a docker image 
1. Create a [`Dockerfile`](https://docs.docker.com/engine/reference/builder/) and 
copy the below commands into the file
> Docker can build images automatically by reading the instructions from a Dockerfile. 
A Dockerfile is a text document that contains all the commands a user could call on the 
command line to assemble an image. Using docker build users can create an automated 
build that executes several command-line instructions in succession.

    ```
	# Fetch the latest Ubuntu
	FROM ubuntu:latest
	
	# Install dependencies
	RUN apt-get update && \
	apt-get install -y vim git sudo curl tree ruby-full build-essential zlib1g-dev && \
	apt-get clean
	
	# Create a user named 'alice'
	RUN useradd -ms /bin/bash alice
	RUN echo 'alice:my_secure_password' | chpasswd
	
	# Provide sudo privileges to new user
	RUN usermod -aG sudo alice && cat /etc/group
	
	RUN gem install jekyll bundler
	
	# Switch to the new user
	USER alice
	# Switch the directory to home directory
	WORKDIR /home/alice
	
	# Follow jekyll setup instructions
	RUN echo '# Install Ruby Gems to ~/gems' >> ~/.bashrc
	RUN echo 'export GEM_HOME="$HOME/gems"' >> ~/.bashrc
	RUN echo 'export PATH="$HOME/gems/bin:$PATH"' >> ~/.bashrc
	RUN . ~/.bashrc
	
	# Add alias for quick commands
	RUN echo 'alias be="bundle exec jekyll serve -H 0.0.0.0"' >> ~/.bashrc
	
	# Install bundle
	# RUN sudo gem install jekyll bundler
	
	# Set environment variables
	ENV LANG=en_US.UTF-8
	
	# Optional vim options
	RUN echo "set expandtab" >> ~/.vimrc
	RUN echo "set tabstop=4" >> ~/.vimrc
	RUN echo "set shiftwidth=4" >> ~/.vimrc
	RUN echo "set laststatus=2" >> ~/.vimrc
	RUN echo "set statusline=%F\ %=L:%l/%L\ %c\ (%p%%)"  >> ~/.vimrc
	
	# Set git config variables
	RUN git config --global user.name "<your_username>"
	RUN git config --global user.email "<your_email_address>"
    ```

2. Build a docker image so that it can be used in future without polluting your machine
   <br/>**Keep your Docker Hub username handy for this step**

   _Why Docker though?_

   I've had troubles in the past managing these ruby versions and their dependencies on 
my host machine. So, I choose to work in a safe, disposable and reproducible environment
provided by Docker

	```bash
	# Build the docker image
    # -t : Name and optionally a tag in the 'name:tag' format
	# "jekyll-environment" : Any easy to remember name for your image
	$ docker build -t <dockerhub_username>/jekyll-environment:v1.0 .
	...
	$ docker images
	REPOSITORY                                  TAG                 IMAGE ID                CREATED             SIZE
	<dockerhub_username>/jekyll-environment     v1.0              <Your image ID>        2 seconds ago          475MB
	ubuntu                                     latest              47b19964fb50            7 days ago           88.1MB
	```

3. Now we're all set to push our new image to the [Docker registry (Docker Hub)](https://docs.docker.com/registry/)

    ```bash
    $ docker login -u <dockerhub_username>
    Password:
    Login Succeeded
    $ docker push <dockerhub_username>/jekyll-environment:v1.0
    The push refers to repository [docker.io/<dockerhub_username>/jekyll-environment]
    dd91e0d35530: Pushed
    4b7d93055d87: Mounted from library/ubuntu
    663e8522d78b: Mounted from library/ubuntu
    283fb404ea94: Mounted from library/ubuntu
    bebe7ce6215a: Mounted from library/ubuntu
    v1.0: digest: sha256:64b18af7f49768d3c347b88acb0780093e45f40a0a30e5e78debd9d514f07044 size: 1363
    ``` 

    _What just happened?_
    
    Well, we just created an image with all the tools and environment required to build a jekyll powered blog. The image was pushed to Docker Hub. This enables you to pull that image from any other computer (with docker) and update your blog without having to pollute any host machines with ruby dependencies.

    _Is it mandatory to do this Docker image stuff before creating jekyll blog?_

    No. I highly recommend it though.

4. Let's pull that image and start building our blog

    ```bash
    # Run the docker image as a container and execute /bin/bash
    # -i : Interactive
    # -t : Allocate a pseudo-TTY
    # -p : Publish a container's port(s) to the host (hostport:containerport)
    $ docker run -it -p 12345:4000 <dockerhub_username>/jekyll-environment:v1.0 /bin/bash
    ...
    alice@02cd90036873:/$ bundle --version
    Bundler version 2.0.1

    # Make sure you have all the installed dependencies in the container
    alice@02cd90036873:/$ ruby --version
    ruby 2.5.1p57 (2018-03-29 revision 63029) [x86_64-linux-gnu]

    alice@02cd90036873:/$ jekyll -v
    jekyll 3.8.5
    ```
    
    _What does that `docker` command do?_

    It runs `jekyll-environment` in interactive mode (`-i`) with a psuedo terminal allocated (`-t`) and runs `/bin/bash` on container.  We bind our host port `12345` to port `4000` of docker container for running jekyll blog locally. **Please do not forget the tag `v1.0` associated with your image while running the command**

### Steps to create jekyll blog

1. Create a new jekyll powered blog on your local machine (inside docker)

    ```bash
    alice@02cd90036873:/$ cd ~
    $ jekyll new my-blog
    Running bundle install in /home/alice/my-blog...
  Bundler: Fetching gem metadata from https://rubygems.org/...........
  Bundler: Fetching gem metadata from https://rubygems.org/.
  Bundler: Resolving dependencies...
  Bundler: Using public_suffix 3.0.3
  ...
  ...
  Bundler: Using minima 2.5.0
  Bundler: Bundle complete! 4 Gemfile dependencies, 29 gems now installed.
  Bundler: Use `bundle info [gemname]` to see where a bundled gem is installed.The dependency tzinfo-data (>= 0) will be unused by any of the platforms Bundler is installing for. Bundler is installing for ruby but the dependency is only for x86-mingw32, x86-mswin32, x64-mingw32, java. To add those platforms to the bundle, run `bundle lock --add-platform x86-mingw32 x86-mswin32 x64-mingw32 java`.
New jekyll site installed in /home/alice/my-blog.

    alice@02cd90036873:~$ cd my-blog/
    ```
    
2. Let's do a quick test drive of your brand new [`minima`](https://github.com/jekyll/minima) themed jekyll blog

    ```bash
    alice@02cd90036873:~/my-blog$ jekyll help serve |grep "\-H"
        -H, --host [HOST]  Host to bind to

    alice@02cd90036873:~/my-blog$ bundle exec jekyll serve -H 0.0.0.0
    Configuration file: /home/alice/my-blog/_config.yml
                Source: /home/alice/my-blog
           Destination: /home/alice/my-blog/_site
     Incremental build: disabled. Enable with --incremental
          Generating...
           Jekyll Feed: Generating feed for posts
                        done in 0.516 seconds.
     Auto-regeneration: enabled for '/home/alice/my-blog'
        Server address: http://0.0.0.0:4000/
      Server running... press ctrl-c to stop.

    ```
    
    You could also use the command `be` to execute `bundle exec jekyll serve -H 0.0.0.0`
    > NOTE: Remember that we added our alias to the `~/.bashrc` in `Dockerfile`

    _What's that `0.0.0.0`?_

    Allow the server to listen to incoming connections from any IP address
    
3. Head over to your browser and type: `http://localhost:12345` and you should see your new blog:
    
    ![Browser screenshot]({{site.baseurl}}{{page.imgdir}}/localhost.png "Home page on localhost port 12345")
    
4. Just before we upload our pages to github, there's one minor setting to change.
    Change `baseurl` in `_config.yml` from `""` to `"/<repo_name>"`
    
    Here's an awesome explanation of `baseurl`: [Clearing Up Confusion Around baseurl](https://byparker.com/blog/2014/clearing-up-confusion-around-baseurl/)

    Thanks [Parker!](https://github.com/parkr)
    
    For example: If your github repository is `my-blog`

    ```
    alice@02cd90036873:~/my-blog$ grep "^baseurl" _config.yml
    baseurl: "/my-blog" # the subpath of your site, e.g. /blog
    ```
    
    Your local blog will now be available on `http://localhost:12345/my-blog/`
    
### Steps to publish jekyll blog on Github

1. Create an empty repository (let's say `my-blog`) on [Github](https://github.com)

2. Initialize empty local Git repository

    ```bash
    # Initialize an empty local git repository
    alice@02cd90036873:~/my-blog$ git init
    Initialized empty Git repository in /home/alice/my-blog/.git/

    # Make sure you have all the untracked files from jekyll's default theme
    alice@02cd90036873:~/my-blog$ git status
    On branch master
    
    No commits yet
    
    Untracked files:
      (use "git add <file>..." to include in what will be committed)
    
        .gitignore
        404.html
        Gemfile
        Gemfile.lock
        _config.yml
        _posts/
        about.md
        index.md
    
    nothing added to commit but untracked files present (use "git add" to track)
    ```

3. Now it's time to commit and push your branch to your remote. 
   Create a link/shortcut to your remote repository created on [Github](https://github.com)

    ```bash
    alice@02cd90036873:~/my-blog$ git remote add origin <paste your git repository URL>
    
    # URL is of the form : https://github.com/<github_username>/<repository_name>.git
    
    alice@02cd90036873:~/my-blog$ git add *
    alice@02cd90036873:~/my-blog$ git config --global user.email "<your_email>"
    alice@02cd90036873:~/my-blog$ git config --global user.name "<your_name>"

    alice@02cd90036873:~/my-blog$ git commit -m "first commit"
    [master (root-commit) 687e9ab] first commit
     8 files changed, 223 insertions(+)
     create mode 100644 .gitignore
     create mode 100644 404.html
     create mode 100644 Gemfile
     create mode 100644 Gemfile.lock
     create mode 100644 _config.yml
     create mode 100644 _posts/2019-02-13-welcome-to-jekyll.markdown
     create mode 100644 about.md
     create mode 100644 index.md

    alice@02cd90036873:~/my-blog$ git push origin master
    Username for 'https://github.com': <github_username>
    Password for 'https://<github_username>@github.com':
    Counting objects: 11, done.
    Delta compression using up to 4 threads.
    Compressing objects: 100% (10/10), done.
    Writing objects: 100% (11/11), 3.88 KiB | 1.29 MiB/s, done.
    Total 11 (delta 0), reused 0 (delta 0)
    To https://github.com/<github_username>/<github_repo_name>.git
     * [new branch]      master -> master   

    ```
 
4. Navigate to 
    ```
    https://github.com/<github_username>/<github_repo_name>/settings
    ```
   Scroll down to `GitHub Pages` section and choose the `Source` as `master branch` 
   (since you pushed your changes to master branch). Click on `Save`
    ![Github jekyll source branch selection]({{site.baseurl}}{{page.imgdir}}source-selection.png "Github jekyll source branch selection")

5. Your new github pages blog should now be available on 

    ```
    https://<github_username>.github.io/<github_repo_name>/
    ```

6. Check the [status of your github pages](https://developer.github.com/v3/repos/pages/) build using:

   ```bash
	alice@02cd90036873:~/$ curl -u <github_username> https://api.github.com/repos/<github_username>/<github_repo_name>/pages/builds/latest
	Enter host password for user '<github_username>':
	{
	  "url": "https://api.github.com/repos/<github_username>/<github_repo_name>/pages/builds/<build_id>",
	  "status": "built",
    ...
    ...
	}
   ```
   You could also trigger a build on github pages manually using
   a preview API.
   > NOTE: This endpoint is currently available for developers to preview. 
    During the preview period, the API may change without advance notice.

   ```bash
   alice@02cd90036873:~/$ curl -u <github_username> -X POST -H "accept: application/vnd.github.mister-fantastic-preview+json" https://api.github.com/repos/<github_username>/<github_repo_name>/pages/builds
	Enter host password for user '<github_username>':
	{
	  "status": "queued",
	  "url": "https://api.github.com/repositories/<ID>/pages/builds/latest"
	}
    ```
   In JSON responses, `status` can be one of:
     * `null`, which means the site has yet to be built
     * `queued`, which means the build has been requested but not yet begun
     * `building`, which means the build is in progress
     * `built`, which means the site has been built
     * `errored`, which indicates an error occurred during the build
   

### Next steps

* Since you have a safe remote copy of your blog on Github, you don't have to retain/save 
  your container. You can completely remove your docker container instance and your docker
  image from your host
* To update your blog with new content and test it locally
  * Pull the same docker image from your Docker Hub
  * Run an instance of the docker image by binding port `4000` on docker container to any 
    unassigned local port on your host
  * 
    ```bash
  $ git clone https://github.com/<github_username>/<github_repo_name>.git
    ```
  * Update your site contents
  * Test it locally using `$ bundle exec jekyll serve -H 0.0.0.0`
  * Add your changes and commit
  * `$ git push origin master`

### FAQ

* **[Q]** Why do you have to dockerize every single simple thing?

  **[A]** Read [When and Why to Use Docker](https://www.linode.com/docs/applications/containers/when-and-why-to-use-docker/). If you're convinced, yayy! 
If you're still not convinced: "My blog, my rules"

* **[Q]** Are there any alternatives that don't require command line or can help me get on board in like 10 minutes?
  
  **[A]** Sure, here are some useful links
    * [Build A Blog With Jekyll And GitHub Pages](https://www.smashingmagazine.com/2014/08/build-blog-jekyll-github-pages/)
    * [Build a Jekyll blog in minutes, without touching the command line](https://github.com/barryclark/jekyll-now)
    * [Building Your First Website in Ten Minutes](https://base11studios.com/web%20development/guides/jekyll/2018/02/06/painfully-simple-jekyll-sites/)
    * [Setting up a Jekyll blog on Github Pages](http://michelleful.github.io/code-blog/2014/02/28/setting-up-a-jekyll-blog-on-github-pages/)

### Credits

* [Tom Preston-Werner \| Creator of Jekyll](https://github.com/mojombo)
* [John Gruber (in collaboration with Aaron Swartz on the syntax) \| Creator of Markdown](https://twitter.com/daringfireball)
* [Solomon Hykes \| Creator of Docker](https://github.com/shykes)
