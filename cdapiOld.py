import sqlite3
from flask import Flask, request, session, g, redirect, url_for, \
     abort, flash, render_template, jsonify
from flask_restful import Resource, Api, reqparse
from contextlib import closing

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

@app.teardown_request
def teardown_request(exception):
    db = getattr(g, 'db', None)
    if db is not None:
        db.close()

#---------------------Rest API---------------------
parser = reqparse.RequestParser()
parser.add_argument('contents')
parser.add_argument('renderer')

class addNode(Resource):
    def put(self):
        g.db.execute('insert into nodes (contents, renderer) values (?, ?)',
                 [request.form['contents'],request.form['renderer']])
        g.db.commit()
        return {'message' : 'New node was successfully created'}

class addLink(Resource):
    def put(self, origin, destination):
        g.db.execute('insert into links values (?, ?)',
                 [request.form['origin'], request.form['name'], request.form['dest']])
        g.db.commit()
        return {'message' : 'New link was successfully created'}

api.add_resource(addNode, '/addNode')
api.add_resource(addLink, '/addLink')

@app.route('/puterator', methods=['GET'])
def add_entry():
        return render_template('puterator.html')

if __name__ == '__main__':
    app.run(debug=True)