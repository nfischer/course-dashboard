# Course Dashboard

[![Build Status](https://img.shields.io/travis/nfischer/course-dashboard/master.svg?style=flat-square)](https://travis-ci.org/nfischer/course-dashboard)

A simplified way of organizing all information and materials for a course

## Quick Start

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

If you're enrolled in UCLA's Fall 2015 CS 130 with that info, you're good to go
and should have no issues displaying piazza information on the web UI.

At this point, you can visit [127.0.0.1:5000/](http://127.0.0.1:5000/) to see a
running page of our project. Click on the link for **CS 130** to be taken to the
course page. If that's good enough for you, then you're done at this point, and
can skip the steps below.

## Course Creation

To test this out, follow the same steps as in the above section, but do not run
`./addSampleData.py`. Open up the web browser to
[http://localhost:5000/](http://localhost:5000/)

From there, fill out the course creation UI as you see fit (adding in weeks,
assignments, and resources). We don't support leaving any elements on the page
as empty, so if you want to not add something (i.e. you want to create a course
with no assignments initially), click the "minus" sign.

## Running tests

### Backend

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
this README. If you're running on Windows, replace `setup.sh` with `setup.bat`,
and you should be able to get the tests running as well.

### Frontend

We've recently added mocha unit tests for frontend code! To get these running,
please follow the below steps (again, these are for Ubuntu, but similar steps
should work for any system).

  1. Look at the "Installation for Development" section for steps on installing
     NodeJS
  2. Make sure NodeJS is updated to v5 (we've noticed that some of our tests
     will timeout with older versions of Node)
    - If you're having trouble getting node updated, I found some success using
      the [Node Version Manager](https://github.com/creationix/nvm) and then
      running `nvm install 5.0` from within the `frontend/` directory (see our
      [Travis CI config](.travis.yml) for details on how we got this to work.
    - Run `node --version` and make sure you see `v5.0.0` as the output. **Do
      not proceed if your output differs significantly.**
  3. Then run the following code to install all dependencies:

     ```Bash
     $ cd backend/frontend/ # unless you're already there
     $ npm install
     $ npm list --depth=0 # should return with status 0
     ```

  4. If `npm list --depth=0` succeeds, continue on to step 5. Otherwise, please
     manually install the dependencies it lists as missing:

     ```Bash
     $ npm install babel-runtime@^5.8.25 # for example, if this dep is missing
     ```

  5. If `npm list --depth=0` now succeeds, you can run the actual tests with
     `npm test`.

### Selenium

We've written out UI tests using the Selenium framework. To use these please
follow these steps:

  1. Look at the "Installation for Development" section for steps on installing
     NodeJS
  2. Make sure NodeJS is updated to v5 (Look above for more details on this)
  3. Run the following commands in your first terminal:

     ```Bash
     $ cd backend/
     $ ./setup.sh
     ```

  4. In your second terminal, run the following commands:

     ```Bash
     $ cd backend/
     $ ./addSampleData.py
     $ cd frontend/
     $ npm install
     $ npm list --depth=0 # make sure this succeeds
     $ npm install mocha -g
     $ mocha selenium-test.js --compilers js:babel-core/register --timeout 10000
     ```

## Installation for Development

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

## Interacting directly with the backend

If you want to interact directly with our backend (and bypass the web
interface), you can do so via python.

In your first terminal, launch the backend as done previously (with
`./setup.sh`). Then in another terminal, you can launch python to interact with
the database through the API calls:

```Python
$ python
>>> from requests import post, get
>>> post('http://127.0.0.1:5000/0/course/add/').json()
>>> # output should be: {u'message': u'New course was successfully initialized', u'course_id': '1'}
>>> post('http://127.0.0.1:5000/1/node/add/', data={'contents': 'foo', 'renderer': 'bar'}).json()
>>> # We use a '/1/node/add/' here because '1' is the course ID of the course we just created
>>> # output should be: {u'message': u'New node was successfully created'}
>>> # more commands here...
>>> # see rpc_specification.md for details on commands
>>> exit()
```

## Contributing

Now that this course has ended, we can officially accept contributions from the
open source community! If you like our project and want to contribute, feel free
to open a pull request and one of us will review it.
