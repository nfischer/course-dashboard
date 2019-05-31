#!/usr/bin/env python

"""
Python script that, when run, uses API calls to populate the backend with sample
data
"""

import os
from posixpath import join as urljoin
import json
from requests import get, post

URL = 'http://127.0.0.1:5000'
PROJECT_DIR = os.path.dirname(os.path.dirname(os.path.realpath(__file__)))
SAMPLE_JSON_FILE = os.path.join(PROJECT_DIR, 'backend/frontend', 'sampledata.json')

def create_node(course_id, contents='foo', renderer='bar'):
    """Uses the backend API to create a node"""
    node_value = {'contents': contents, 'renderer': renderer}
    course_id = str(course_id)
    ret = post(urljoin(URL, course_id, 'node/add/'), data=node_value)
    if ret.status_code != 200:
        raise ValueError('Unable to create node')
    return ret

def get_node(course_id, node_id):
    """Uses the backend API to request a node"""
    node_id = str(node_id)
    course_id = str(course_id)
    full_url = urljoin(URL, course_id, 'node/get', node_id, '')
    ret = get(full_url)
    if ret.status_code != 200:
        raise ValueError('Unable to access node %s' % node_id)
    return ret

def update_node(course_id, node_id, contents='', renderer='', children=''):
    """Uses the backend API to update a node that already exists"""
    node_id = str(node_id)
    course_id = str(course_id)
    old_node = get_node(course_id, node_id).json()
    if contents == '':
        contents = old_node['contents']
    if renderer == '':
        renderer = old_node['renderer']
    if children == '':
        children = old_node['children']
    node_value = {'contents': contents, 'renderer': renderer, 'children': children}
    ret = post(urljoin(URL, course_id, 'node/update', node_id, ''), data=node_value)
    if ret.status_code != 200:
        raise ValueError('Unable to update node %s' % node_id)
    return ret

def delete_node(course_id, node_id):
    """Uses the backend API to delete a node that already exists"""
    node_id = str(node_id)
    course_id = str(course_id)
    ret = post(urljoin(URL, course_id, 'node/delete', node_id, ''), data={})
    if ret.status_code != 200:
        raise ValueError('Unable to delete node %s' % node_id)
    return ret

def add_root(course_id, root_id):
    """Uses the backend API to add a root to the tree"""
    root_id = str(root_id)
    course_id = str(course_id)
    ret = post(urljoin(URL, course_id, 'root/set', root_id, ''), data={})
    if ret.status_code != 200:
        raise ValueError('Unable to add root %s' % root_id)
    return ret

def initialize_course(name):
    """
    Uses the backend API to create a new course in the backend.
    @returns JSON containing course_id field
    """
    if name == '':
        name = 'CS 130' # default
    ret = post(urljoin(URL, '0/course/add/'), data={'name': name})
    if ret.status_code != 200:
        raise ValueError('Unable to create a new course')
    return ret

def set_piazza(course_id, piazza_id):
    """Uses the backend API to add a course to the course list"""
    course_id = str(course_id)
    ret = post(urljoin(URL, course_id, 'course/setpiazza/'), data={'piazza_cid': piazza_id})
    if ret.status_code != 200:
        raise ValueError('Unable to add piazza id %s' % piazza_id)
    return ret

if __name__ == '__main__':
    with open(SAMPLE_JSON_FILE) as data_file:
        data = json.load(data_file)

    nlist = data['nodes']
    nlist.sort(key=lambda node: node['id'])

    # Get an initial course
    val = initialize_course('CS 130')
    mycid = val.json()['course_id']

    for node in nlist:
        mycontents = node['contents']
        myrenderer = node['renderer']
        print(create_node(course_id=mycid, contents=mycontents, renderer=myrenderer).json())

    for node in nlist:
        myid = int(node['id'])
        mychildren = json.dumps(node['children'])
        print(update_node(mycid, myid, children=mychildren).json())

    # add the cs 130 piazza ID
    print(set_piazza(mycid, 'if44ov1fn5a505').json())
    # Set the root to be node 54
    print(add_root(mycid, 54).json())
