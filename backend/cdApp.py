import sqlite3
from flask import Flask, request, g, render_template, \
    jsonify, Response, send_from_directory
from flask_restful import Resource, Api
import json
from piazza_api import Piazza
from piazza_api.exceptions import AuthenticationError
import os

# configuration
DATABASE = 'db/course-dashboard.db'
DEBUG = True
SECRET_KEY = 'development key'
USERNAME = 'admin'
PASSWORD = 'default'
USER_FILE = 'sample_user.txt'

app = Flask(__name__, static_folder='frontend')
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

#---------------------HTTP Errors---------------------

class InvalidUsage(Exception):
    status_code = 400

    def __init__(self, message, status_code=None, payload=None):
        Exception.__init__(self)
        self.message = message
        if status_code is not None:
            self.status_code = status_code
        self.payload = payload

    def to_dict(self):
        http_resp = dict(self.payload or ())
        http_resp['message'] = self.message
        return http_resp

@app.errorhandler(InvalidUsage)
def handle_invalid_usage(error):
    response = jsonify(error.to_dict())
    response.status_code = error.status_code
    return response
#---------------------Rest API---------------------
class Node(Resource):
    def post(self, course_id, operation, node_id=0):
        """
        This inserts a new node or updates the node with <node_id>
        """
        if operation == 'add':
            DEFAULT_CHILDREN = '{}'
            g.db.execute('''INSERT INTO nodes
                            (contents, renderer, children, course_id, isalive) VALUES(?, ?, ?, ?, ?)''',
                         [request.form['contents'], request.form['renderer'],
                          DEFAULT_CHILDREN, int(course_id), 1])
            cursor = g.db.execute('''SELECT id
                                     FROM nodes
                                     WHERE course_id=(?) AND isalive=1
                                     ORDER BY id DESC limit 1''',
                                  [int(course_id)])
            g.db.commit()
            added_node = cursor.fetchone()
            return jsonify(message='New node was successfully created', id=added_node['id'])
        elif operation == 'update':
            try:
                node_id = str(node_id)
                contents = request.form['contents']
                renderer = request.form['renderer']
                children = request.form['children']
                cursor = g.db.execute('''UPDATE nodes
                                         SET contents=(?),renderer=(?),children=(?)
                                         WHERE id=(?) AND course_id=(?) AND isalive=1''',
                                      [contents, renderer, children, int(node_id), int(course_id)])
                g.db.commit()
                if cursor.rowcount == 0:
                    raise InvalidUsage('Unable to update node %s' % node_id)
            except InvalidUsage:
                raise # reraise this exception so it's public-facing
            except Exception as e:
                print str(e)
                raise InvalidUsage('Internal error', status_code=500)
            return jsonify(message='Node was successfully updated.', id=node_id)
        elif operation == 'delete':
            # Allows for repeated calls without failure
            cursor = g.db.execute('''UPDATE nodes
                                     SET isalive=0
                                     WHERE id=(?) AND course_id=(?)''',
                                  [int(node_id), int(course_id)])
            g.db.commit()
            if cursor.rowcount == 0:
                raise InvalidUsage('Unable to find node %s' % node_id)
            return jsonify(message='Node was successfully deleted.', id=node_id)
        else:
            raise InvalidUsage('Unknown operation type')

    def get(self, course_id, operation, node_id):
        """
        @param node_id
        @returns a single node
        @throws error if node is not in the database
        """
        if operation != 'get':
            raise InvalidUsage('Unknown operation')

        node_id = str(node_id)
        cursor = g.db.execute('''SELECT n.id, n.contents, n.renderer, n.children
                                 FROM nodes AS n
                                 WHERE n.id=(?) AND n.course_id=(?) AND n.isalive=1''',
                              [int(node_id), int(course_id)])

        return_val = cursor.fetchone()
        if return_val is None:
            raise InvalidUsage('node_id is out of range')
        return return_val

class Tree(Resource):
    def get(self, course_id):
        """
        Endpoint: /<course_id>/tree/
        Returns the tree of nodes
        rootId is hard coded right now. Need clarification on that
        """
        try:
            cursor = g.db.execute('''SELECT n.id, n.contents, n.renderer, n.children
                                     FROM nodes AS n
                                     WHERE n.course_id=(?) AND n.isalive=1''',
                                  [int(course_id)])
            tree = {}
            tree["nodes"] = cursor.fetchall()
            tree["rootId"] = '54' #this is a HACK. we will be adding a few more endpoints to address the root
            return tree
        except Exception:
            raise InvalidUsage('Unable to find the tree', status_code=500)

class Root(Resource):
    def post(self, course_id, operation, root_id):
        if operation == 'set':
            cursor = g.db.execute('''UPDATE nodes
                                     SET isroot=1
                                     WHERE id=(?) AND course_id=(?) AND isalive=1''',
                                  [int(root_id), int(course_id)])
            g.db.commit()
            if cursor.rowcount == 0:
                raise InvalidUsage('Could not find non-root node %s' % root_id)
            return jsonify(message='Successfully labeled node as a root.', id=root_id)

        elif operation == 'delete':
            cursor = g.db.execute('''UPDATE nodes
                                     SET isroot=0
                                     WHERE id=(?) AND course_id=(?) AND isalive=1 AND isroot=1''',
                                  [int(root_id), int(course_id)])
            g.db.commit()
            if cursor.rowcount == 0:
                raise InvalidUsage('Could not find root %s' % root_id)
            return jsonify(message='Successfully removed root label.', id=root_id)
        else:
            raise InvalidUsage('Unknown operation type')

    def get(self, course_id, operation):
        if operation != 'get':
            raise InvalidUsage('Unknown operation type')

        cursor = g.db.execute('''SELECT id, renderer
                                 FROM nodes
                                 WHERE course_id=(?) AND isalive=1 AND isroot=1''',
                              [int(course_id)])
        root_list = cursor.fetchall()
        if root_list == []:
            raise InvalidUsage('No root nodes have been set')
        return root_list

class Course(Resource):
    def post(self, course_id, operation):
        if operation == 'setpiazza':
            try:
                print request.form['piazza_cid']
                g.db.execute('''INSERT INTO courses
                                (course_id, piazza_cid) VALUES (?, ?)''',
                             [int(course_id), request.form['piazza_cid']])
                g.db.commit()
                return jsonify(message='Successfully added piazza ID for course', course_id=course_id)
            except Exception as e:
                raise InvalidUsage('Cannot set more than once')

        elif operation == 'resetpiazza':
            cursor = g.db.execute('''UPDATE courses
                                     SET piazza_cid=(?)
                                     WHERE course_id=(?)''',
                                  [request.form['piazza_cid'], int(course_id)])
            g.db.commit()
            if cursor.rowcount == 0:
                raise InvalidUsage('Entry not found in database. Please use `setpiazza` instead')
            return jsonify(message='Successfully updated piazza ID for course', course_id=course_id)

        else:
            raise InvalidUsage('Unknown operation type')

    def get(self, course_id, operation):
        if operation == 'getpiazza':
            cursor = g.db.execute('''SELECT piazza_cid
                                     FROM courses
                                     WHERE course_id=(?)''',
                                  [int(course_id)])

            piazza_id_row = cursor.fetchone()
            if piazza_id_row is None:
                raise InvalidUsage('Given course does not have a Piazza ID')
            else:
                piazza_id_str = piazza_id_row['piazza_cid']
                return jsonify(message='Returning piazza ID for course', course_id=course_id, piazza_cid=piazza_id_str)

        elif operation == 'getpiazzaposts':
            cursor = g.db.execute('''SELECT piazza_cid
                                     FROM courses
                                     WHERE course_id=(?)''',
                                  [int(course_id)])
            piazza_id_row = cursor.fetchone()
            if piazza_id_row is None:
                raise InvalidUsage('Given course does not have a Piazza ID')
            else:
                piazza_id_str = piazza_id_row['piazza_cid']
                p = Piazza()
                try:
                    with open(USER_FILE, 'r') as fname:
                        lines = fname.read().split('\n')
                        p.user_login(email=lines[0], password=lines[1])
                    piazza_class = p.network(piazza_id_str)
                except IOError:
                    raise InvalidUsage('Unable to find piazza credentials',
                                       status_code=500)
                except AuthenticationError:
                    raise InvalidUsage('Invalid pizza credentials')

                def get_posts():
                    for post in piazza_class.iter_all_posts():
                        yield json.dumps(post)

                return Response(get_posts(), mimetype="application/json")
        else:
            raise InvalidUsage('Unknown operation type')



# @app.route('/posterator', methods=['GET'])
# def posterator():
#     return render_template('posterator.html')

@app.route('/', methods=['GET'])
def index():
    return send_from_directory('frontend','index.html');

api.add_resource(Node, '/<course_id>/node/<operation>/', '/<course_id>/node/<operation>/<node_id>/')
# api.add_resource(Children, '/children/<operation>/<node_id>/')
api.add_resource(Tree, '/<course_id>/tree/')
# api.add_resource(Link, '/link/')
api.add_resource(Root, '/<course_id>/root/<operation>/', '/<course_id>/root/<operation>/<root_id>/')
api.add_resource(Course, '/<course_id>/course/<operation>/')

# @app.route('/addNode', methods=['POST'])

if __name__ == '__main__':
    app.run(debug=True)
