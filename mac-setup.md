Mac setup instructions
======================

One-time Installation
---------------------

To install our project and its dependencies, please run:

```Bash
$ git clone https://github.com/nfischer/course-dashboard.git

$ sudo brew install sqlite3
$ sudo easy-install pip

$ sudo pip install Flask
$ sudo pip install flask-restful
$ sudo pip install piazza_api
```

Running the project
-------------------

To run our project, in your first terminal please run:

```
$ cd course-dashboard/backend
$ ./setup.sh # this starts the server with an empty database
```

And in a second terminal, please run:

```Bash
$ ./addSampleData.py # initialize the backend with sample data
```
