Windows setup instructions
==========================

One-time Installation
---------------------

To install our project and its dependencies, please run:

1. Clone the project
```
> git clone https://github.com/nfischer/course-dashboard.git
```

2. Install `sqlite3`
  - Follow the steps laid out
    [here](http://www.tutorialspoint.com/sqlite/sqlite_installation.htm)

3. Install Python and Pip
  - `pip` is a package manager that is include with Python 2.7.9+ and 3.4+ and
    we use it to install the other technologies we use for this project.
  - Install [Python 2.7](https://www.python.org/downloads/windows/)
    - Make sure to specify to install Pip if given the option during
      installation
  - Then edit your `PATH` environmental variable to include the path to both
    `python` and `pip` following [this
    guide](http://www.computerhope.com/issues/ch000549.htm)

4. Installation of Python Packages
  - Execute the following commands from the command line:
```
> pip install Flask
> pip install flask-restful
> pip install piazza_api
```

Running the project
-------------------

To run our project, in your first terminal please run:

```
> cd course-dashboard/backend
> REM start the server with an empty database
> setup.bat
```

And in a second terminal, please run:

```
> REM Initialize the backend with sample data
> python addSampleData.py
```
