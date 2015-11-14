Course Dashboard
================

A simplified way of organizing all information and materials for a course

Quick Start
-----------

Please follow our system-specific setup steps first:

 - [Linux](linux-setup.md)
 - [Mac OS X](mac-setup.md)
 - [Windows](windows-setup.md)

Before running the project, make sure you enter in your Piazza credentials in a
new file named `backend/sample_user.txt' following the two-line format:

```
myemail@domain.com
mypassword
```

If you're enrolled in CS 130 with that info, you're good to go and should have
no issues displaying piazza information on the web UI.

At this point, you can visit [localhost:5000/](http://localhost:5000/) to see a
running page of our project.

Installation for Development
----------------------------

### Users on Posix based Machines

To install gulp for frontend work, you'll need to run:

```Bash
$ sudo apt-get install npm
$ sudo npm install gulp -g
$ npm i
$ # or do similar commands for your system
```

### Users on Windows Machines

To install gulp for frontend work:
  1. Install Node
    - Download the MSI for your appropriate OS
      [here](https://nodejs.org/en/download/)
  2. Execute the following commands to install npm and gulp
    ```
    > install npm
    > npm install gulp -g
    > npm i
    ```

Backend
-------

### Python

Then in another terminal, you can launch python to interact with the database:

```Python
$ python
>>> from requests import post, get
>>> post('http://localhost:5000/1/node/add/', data={'contents': 'foo', 'renderer': 'bar'}).json()
>>> # output should be: {u'message': u'New node was successfully created'}
>>> # more commands here...
>>> # see rpc_specification.md for details on commands
>>> exit()
```

Frontend
--------

The frontend is written using node.js and browserify. In order to build, execute
the following commands from the frontend directory:

```
npm install
gulp build_browser
```

in order to have the backend serve frontend files and have the frontend talk to
the backend, execute the following commands:

```
$ cd ../backend
$ setup.sh
```

The page should now be available at
[http://localhost:5000/](http://localhost:5000/), served by the backend server.

### Migration

To serve the frontend code from a backend of your choice, simply copy
index.html, the css directory, and the js directory to the location of your
choice.

Contributing
------------

Please don't contribute (yet)! This is a school project, so we unfortunately
can't accept any contributions until after the term is over. As soon as the
quarter ends, we plan to make this completely open source and we'll permit (and
encourage) community involvement.
