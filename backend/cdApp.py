import sqlite3
from flask import Flask, request, session, g, redirect, url_for, \
     abort, flash, render_template, jsonify
from contextlib import closing

# configuration
DATABASE = 'db/course-dashboard.db'
DEBUG = True
SECRET_KEY = 'development key'
USERNAME = 'admin'
PASSWORD = 'default'

app = Flask(__name__)
app.config.from_object(__name__)

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
@app.route('/addNode', methods=['POST'])
def addNode():
    g.db.execute('insert into nodes (contents, renderer) values (?, ?)', 
                [request.form['contents'], request.form['renderer']])
    g.db.commit()
    # g.db.execute('insert into entries (title, text) values (?, ?)',
    #              [request.form['title'], request.form['text']])
    g.db.commit()
    #return redirect(url_for('posterator'), message='New node was successfully created')
    return jsonify(message='New node was successfully created')

@app.route('/addLink', methods=['POST'])
def addLink():
    res = ''
    try:
        g.db.execute('insert into links values (?, ?, ?)', 
            [request.form['origin'], request.form['name'], request.form['dest']]) 
        g.db.commit()
        res = 'New link was successfully created'
    except Exception, e:
        res = 'Origin or Destination Nodes do not exist!'
    
    return jsonify(message=res)

@app.route('/posterator', methods=['GET'])
def add_entry():
    return render_template('posterator.html')

if __name__ == '__main__':
    app.run(debug=True)