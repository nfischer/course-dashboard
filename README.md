Course Dashboard
================

[![Build Status](https://travis-ci.org/nfischer/course-dashboard.svg?branch=master)]
(https://travis-ci.org/nfischer/course-dashboard)

A simplified way of organizing all information and materials for a course

Quick Start
-----------

This will allow you to easily pre-make a sample course and test it.

If you want to test our course creation UI, please see the selection below.

Please follow our system-specific setup steps first:

 - [Linux](linux-setup.md)
 - [Mac OS X](mac-setup.md)
 - [Windows](windows-setup.md)

Before running the project, make sure you enter in your Piazza credentials in a
new file named `backend/sample_user.txt` following the two-line format:

```
myemail@domain.com
mypassword
```

If you're enrolled in CS 130 with that info, you're good to go and should have
no issues displaying piazza information on the web UI.

At this point, you can visit [127.0.0.1:5000/](http://127.0.0.1:5000/) to see a
running page of our project. If that's good enough for you, then you're done at
this point, and can skip the steps below.

Course Creation
---------------

To test this out, follow the same steps as in the above section, but do not run
`./addSampleData.py`. Open up the web browser to
[http://localhost:5000/](http://localhost:5000/) (note: this cannot be
`127.0.0.1`)

From there, fill out the course creation UI as you see fit (adding in weeks,
assignments, and resources). Adding empty elements in undefined, so don't do
that for now.

Running tests
-------------

Running backend unit tests is fairly simple. Below are the steps for Linux:

In one terminal, start the backend server by running:

```Bash
$ cd backend/
$ ./setup.sh
```

In a second terminal execute the tests by running:

```Bash
$ cd backend/
$ python testCRUD.py # all tests should pass
```

This should run all backend unit tests on CRUD operations (Create, read, update,
delete). All tests are also run by Travis CI (continuous integration) upon each
push and each pull request, so you can also check the build status at the top of
this README. Adapt these steps if you're running on a different system.

Installation for Development
----------------------------

### Users on Posix based Machines

To install gulp for frontend work, you'll need to run:

```Bash
$ cd course-dashboard/backend/frontend
$ sudo apt-get install npm
$ sudo npm install gulp -g
$ npm install
$ # or do similar commands for your system
```

### Users on Windows Machines

To install gulp for frontend work:

  1. Install Node
    - Download the MSI for your appropriate OS
      [here](https://nodejs.org/en/download/)
  2. Execute the following commands to install npm and gulp

    ```
    > cd course-dashboard/backend/frontend
    > npm install gulp -g
    > npm install
    ```

Backend
-------

### Python

Then in another terminal, you can launch python to interact with the database:

```Python
$ python
>>> from requests import post, get
>>> post('http://127.0.0.1:5000/1/node/add/', data={'contents': 'foo', 'renderer': 'bar'}).json()
>>> # output should be: {u'message': u'New node was successfully created'}
>>> # more commands here...
>>> # see rpc_specification.md for details on commands
>>> exit()
```

Frontend
--------

The frontend is written using node.js and browserify. In order to build, navigate
to the **frontend** directory and execute the following commands:

```
$ npm install
$ gulp build_browser
```

In order to have the backend serve frontend files and have the frontend talk to
the backend, execute the following commands:

```
$ cd ../backend
$ setup.sh
or
> cd ..\backend
> setup.bat
```

The page should now be available at [127.0.0.1:5000/](http://127.0.0.1:5000/),
served by the backend server.

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
