import sqlite3
from flask import Flask, request, g, render_template, \
    jsonify #, flash, url_for, session, abort, redirect
# from contextlib import closing
from flask_restful import Resource, Api # , reqparse

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
    g.db.row_factory = dict_factory
    g.db.execute("PRAGMA foreign_keys = ON;")

@app.teardown_request
def teardown_request(exception):
    db = getattr(g, 'db', None)
    if db is not None:
        db.close()


def dict_factory(cursor, row):
    d = {}
    for idx, col in enumerate(cursor.description):
        d[col[0]] = row[idx]
    return d

#---------------------Rest API---------------------
class Node(Resource):
    def post(self):
        if request.form['_method'] == 'put':
            return self.put()
        else:
            # g.db.execute('insert into nodes (contents, renderer) values (?, ?)',
            #             [request.form['contents'], request.form['renderer']])
            # g.db.commit()
            return 'Not implemented' #jsonify(message='New node was successfully created')
    def put(self):
        """
        This inserts a new node into the database, with the node_id
        automatically assigned
        """
        g.db.execute('INSERT INTO nodes (contents, renderer) values (?, ?)',
                     [request.form['contents'], request.form['renderer']])
        g.db.commit()
        return jsonify(message='New node was successfully created', id='1')

class Tree(Resource):
    def post(self, node_id):
        """This rpc updates/edits a node"""
        try:
            g.db.execute('UPDATE nodes SET contents=(?), renderer=(?) WHERE node_id = (?)', [request.form['contents'], request.form['renderer'],  node_id])

            # Delete the old links
            g.db.execute('DELETE FROM links WHERE origin = (?)', node_id)

            # TODO(nfischer): fix this to add links (currently not working)
            # for child in request.form['children']:
                # print type(jsonify(child))
                # print request.form['children']
                # child_name = child.key()
                # child_id = child.value()
                # g.db.execute('INSERT INTOlinks VALUES (?, ?, ?)', [node_id, child_name, child_id])
            g.db.commit() # Only commit if everything succeeds
        except Exception as e:
            print str(e)
            return jsonify(message='Error when editing your node')
        return jsonify(message='Successfully updated node %s' % node_id)

    def get(self, node_id):
        """This will access a node referenced by node_id"""

        # Fetch a sqlite3.Cursor from the database
        cursor = g.db.execute("SELECT * FROM nodes WHERE node_id=(?) ", node_id)

        if cursor.rowcount > 1:
            return jsonify(message='Node ID is not unique')

        try:
            ret_node = cursor.fetchall()[0]
        except IndexError:
            return jsonify(message='Node %s is not present in table' % node_id)

        # Find the children of this node
        cursor = g.db.execute("SELECT name, dest FROM links WHERE origin=(?) ", node_id)
        children = {}
        # for k, val in enumerate(cursor.fetchall()):

        # Map each child name to an ID
        for child in cursor.fetchall():
            children[child['name']] = child['dest']
        ret_node['children'] = children
        cursor.close()
        return ret_node

class Link(Resource):
    def post(self):
        if request.form['_method'] == 'put':
            return self.put()
        else:
            # g.db.execute('insert into nodes (contents, renderer) values (?, ?)',
            #             [request.form['contents'], request.form['renderer']])
            # g.db.commit()
            return 'Not implemented: Editing a link' #jsonify(message='New node was successfully created')

    def put(self):
        res = ''
        try:
            g.db.execute('insert into links values (?, ?, ?)',
                         [request.form['origin'], request.form['name'],
                          request.form['dest']])
            g.db.commit()
            res = 'New link was successfully created'
        except Exception, e:
            res = 'Origin or destination nodes do not exist!'

        return jsonify(message=res)

@app.route('/posterator', methods=['GET'])
def posterator():
    return render_template('posterator.html')

api.add_resource(Node, '/nodes')
api.add_resource(Tree, '/nodes/tree', '/nodes/tree/<node_id>')
api.add_resource(Link, '/nodeLinks')

# @app.route('/addNode', methods=['POST'])

if __name__ == '__main__':
    app.run(debug=True)
