Course Dashboard
================

A simplified way of organizing all information and materials for a course

Inspiration
-----------

Quick Start
-----------

In a new terminal, execute

```
$ git clone https://github.com/nfischer/course-dashboard.git

$ sudo apt-get install sqlite3
$ sudo apt-get install python-pip

$ sudo pip install Flask
$ sudo pip install flask-restful
$ sudo pip install piazza_api

$ cd course-dashboard/backend
$ ./setup.sh
```

This should start the server, but with a blank database. in a new terminal,
execute the following:

```
./addSampleData.py
```

This should insert data from the sample JSON file located in frontend/ into the
database. At this point, you can visit
[localhost:5000/static/index.html](http://localhost:5000/static/index.html) to
see a running page.

Installation
------------

To run our database, you'll need `sqlite3` as well as `pip`:

```
$ sudo apt-get install sqlite3
$ sudo apt-get install python-pip
```

To install `flask` for the backend framework, you'll need to install three
packages with `pip`:

```
$ sudo pip install Flask
$ sudo pip install flask-restful
$ sudo pip install piazza_api
```

To install gulp for frontend work, you'll need to run:

```
$ sudo apt-get install npm
$ sudo npm install gulp -g
```

Backend
-------

To begin testing the backend by itself, you can try running the following
commands:

```
$ cd backend/
$ mkdir db/ # only do this once
$ sqlite3 db/course-dashboard.db < schema.sql # start a fresh database
$ python cdApp.py # launch the backend
```

### Python

Then in another terminal, you can launch python to interact with the database:

```Python
$ python
>>> from requests import put, get
>>> put('http://localhost:5000/nodes', data={'contents': 'foo', 'renderer': 'bar'}).json()
>>> # output should be: {u'message': u'New node was successfully created'}
>>> # more commands here...
>>> exit()
```

### HTML interface

As an alternative, you can launch your web browser and point it to
[http://localhost:5000/posterator](http://localhost:5000/posterator) and use the
interface there.

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
cd ../backend
ln -s ../frontend static
```

The page should now be available at
[http://localhost:5000/static/index.html](http://localhost:5000/static/index.html),
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
