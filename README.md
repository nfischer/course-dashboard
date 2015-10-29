Course Dashboard
================

A simplified way of organizing all information and materials for a course

Inspiration
-----------

Installation
------------

To run our database, you'll need `sqlite3` as well as `pip`:

```
$ sudo apt-get install sqlite3
$ sudo apt-get install python-pip
```

To install `flask` for the backend framework, you'll need to install two
packages with `pip`:

```
$ sudo pip install Flask
$ sudo pip install flask-restful
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

The frontend is written using node.js and browserify. In order to build, execute the following commands from the frontend directory:

```
npm install
gulp build_browser
python -m SimpleHTTPServer
```

The page should now be available at [http://localhost:8000](http://localhost:8000).

### Migration

To serve the frontend code from a backend of your choice, simply copy index.html, the css directory, and the js directory to the location of your choice.

Contributing
------------

Please don't contribute (yet)! This is a school project, so we unfortunately
can't accept any contributions until after the term is over. As soon as the
quarter ends, we plan to make this completely open source and we'll permit (and
encourage) community involvement.
