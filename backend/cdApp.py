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

app = Flask(__name__, static_url_path='/static')
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
            g.db.execute('INSERT INTO nodes (contents, renderer, children, course_id, isalive) VALUES(?, ?, ?, ?, ?)',
                         [request.form['contents'], request.form['renderer'], DEFAULT_CHILDREN, course_id, 1])
            cursor = g.db.execute('SELECT id FROM nodes WHERE course_id=%s AND isalive=1 ORDER BY id DESC limit 1' % course_id)
            g.db.commit()
            added_node = cursor.fetchone()
            return jsonify(message='New node was successfully created', id=added_node['id'])
        elif operation == 'update':
            try:
                node_id = str(node_id)
                contents = request.form['contents']
                renderer = request.form['renderer']
                children = request.form['children']
                g.db.execute('''UPDATE nodes 
                                SET contents=(?),renderer=(?),children=(?) 
                                WHERE id=%s AND course_id=%s AND isalive=1''' % (node_id, course_id),
                             [contents, renderer, children])
            except Exception as e:
                print str(e)
                raise InvalidUsage('Internal error', status_code=500)
            g.db.commit()
            return jsonify(message='Node was successfully updated.', id=node_id)
        elif operation == 'delete':
            g.db.execute('''UPDATE nodes 
                            SET isalive=0 
                            WHERE id=%s AND course_id=%s''' % (node_id, course_id))
            g.db.commit()
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
                              WHERE n.id=%s AND n.course_id=%s AND n.isalive=1''' % (node_id, course_id))
        return_val = cursor.fetchone()
        if return_val is None:
            raise InvalidUsage('node_id is out of range')
        return return_val

# @deprecated
# class Children(Resource):
    # def put(self, node_id):
    #     # TODO(nfischer): Fix this to work with multi-digit node_ids (use %s
    #     # formatting)
    #     g.db.execute('INSERT INTO children (parent_id, children) values (?, ?)',
    #                  [node_id, request.form['children']])
    #     g.db.commit()
    #     return jsonify(message='Children were successfully added to the node', id=node_id)

    # def post(self, operation, node_id):
    #     """
    #     This updates/adds children to <node_id>, regardless of if it had
    #     children before or not
    #     """
    #     # TODO(nfischer): Fix this to work with multi-digit node_ids (use %s
    #     # formatting)
    #     g.db.execute('''UPDATE children 
    #                     SET children=(?) 
    #                     WHERE parent_id=(?)''', [request.form['children'], node_id])
    #     g.db.commit()
    #     return jsonify(message='Children were successfully updated.', id=node_id)


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
                                  WHERE n.course_id = %s AND n.isalive=1''' % course_id)
            tree = {}
            tree["nodes"] = cursor.fetchall()
            tree["rootId"] = '54' #this is a HACK. we will be adding a few more endpoints to address the root
            return tree
        except Exception:
            raise InvalidUsage('Unable to find the tree', status_code=500)

# @deprecated
# class Link(Resource):
#     def post(self):
#         if request.form['_method'] == 'put':
#             return self.put()
#         else:
#             # g.db.execute('insert into nodes (contents, renderer) values (?, ?)',
#             #             [request.form['contents'], request.form['renderer']])
#             # g.db.commit()
#             raise InvalidUsage('Not implemented: Editing a link', status_code=500)
#             # return 'Not implemented: Editing a link' #jsonify(message='New node was successfully created')

#     def put(self):
#         try:
#             g.db.execute('insert into links values (?, ?, ?)',
#                          [request.form['origin'], request.form['name'],
#                           request.form['dest']])
#             g.db.commit()
#             result = 'New link was successfully created'
#             return jsonify(message=result)
#         except Exception:
#             raise InvalidUsage('Origin or destination nodes could not be found')

@app.route('/posterator', methods=['GET'])
def posterator():
    return render_template('posterator.html')


api.add_resource(Node, '/<course_id>/node/<operation>/', '/<course_id>/node/<operation>/<node_id>/')
# api.add_resource(Children, '/children/<operation>/<node_id>/')
api.add_resource(Tree, '/<course_id>/tree/')
# api.add_resource(Link, '/link/')

# @app.route('/addNode', methods=['POST'])

if __name__ == '__main__':
    app.run(debug=True)
