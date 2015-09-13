fluentglobe
===========

Fluent Globe website


The default layout is landscape mode with portrait mode rendered specifically for phone and iPad.


Build approach / ideas,

http://dontkry.com/posts/code/angular-browserify-grunt.html



> npm install -g grunt
> npm install -g typescript



http://www.thomasboyt.com/2013/06/21/es6-module-transpiler


http://danielkummer.github.io/git-flow-cheatsheet/



Encoding the ProtectServe URLs with sha256

http://www.freeformatter.com/hmac-generator.html


local development setup
=======================

1. install Jekyll used to serve GitHub Pages (fluentglobe.com) using the Terminal
2. install grunt command globally
3. install node modules
4. install bower modules
4. Run default 'grunt' task locally on http://localhost:4000 using the Terminal
5. Open ~/Sites/fluentglobe.github.io in Text Editor(atom)
6. Open http://localhost:4400 in Safari

    sudo gem install jekyll
    .. enter password
    sudo npm install -g grunt
    cd ~/Sites/fluentglobe.github.io
    npm install
    node_modules/.bin/bower install
    grunt

You may need to install Homebrew (http://brew.sh) and node/npm (nodejs.org)

    ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
    brew install node
