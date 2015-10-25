import sqlite3
from flask import Flask, request, session, g, redirect, url_for, \
     abort, flash, render_template, jsonify
from contextlib import closing
from flask_restful import Resource, Api, reqparse

# configuration
DATABASE = 'db/course-dashboard.db'
DEBUG = True
SECRET_KEY = 'development key'
USERNAME = 'admin'
PASSWORD = 'default'

app = Flask(__name__)
app.config.from_object(__name__)
api = Api(app)

#---------------------DB Support methods---------------------
def connect_db():
    return sqlite3.connect(app.config['DATABASE'])

@app.before_request
def before_request():
    g.db = connect_db()
    g.db.execute("PRAGMA foreign_keys = ON;")

@app.teardown_request
def teardown_request(exception):
    db = getattr(g, 'db', None)
    if db is not None:
        db.close()

#---------------------Rest API---------------------
class Node(Resource):
    def post(self):
        if request.form['_method'] == 'put':
            return self.put()
        else:
            # g.db.execute('insert into nodes (contents, renderer) values (?, ?)',
            #             [request.form['contents'], request.form['renderer']])
            # g.db.commit()
            return "FOO" #jsonify(message='New node was successfully created')
    def put(self):
        g.db.execute('insert into nodes (contents, renderer) values (?, ?)',
                     [request.form['contents'], request.form['renderer']])
        g.db.commit()
        return jsonify(message='New node was successfully created')

class Link(Resource):
    def post(self):
        if request.form['_method'] == 'put':
            return self.put()
        else:
            # g.db.execute('insert into nodes (contents, renderer) values (?, ?)',
            #             [request.form['contents'], request.form['renderer']])
            # g.db.commit()
            return "FOO" #jsonify(message='New node was successfully created')
    def put(self):
        res = ''
        try:
            g.db.execute('insert into links values (?, ?, ?)',
                         [request.form['origin'], request.form['name'],
                          request.form['dest']])
            g.db.commit()
            res = 'New link was successfully created'
        except Exception, e:
            res = 'Origin or Destination Nodes do not exist!'

        return jsonify(message=res)

@app.route('/posterator', methods=['GET'])
def posterator():
    return render_template('posterator.html')

api.add_resource(Node, '/nodes')
api.add_resource(Link, '/nodeLinks')

# @app.route('/addNode', methods=['POST'])

if __name__ == '__main__':
    app.run(debug=True)
