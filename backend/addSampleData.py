#!/usr/bin/python

"""
Python script that, when run, uses API calls to populate the backend with sample
data
"""

import os
import json
from requests import get, post

URL = 'http://localhost:5000/42'
PROJECT_DIR = os.path.dirname(os.path.dirname(os.path.realpath(__file__)))
SAMPLE_JSON_FILE = os.path.join(PROJECT_DIR, 'frontend', 'sampledata.json')

def create_node(contents='foo', renderer='bar'):
    """Uses the backend API to create a node"""
    node_value = {'contents': contents, 'renderer': renderer}
    ret = post(os.path.join(URL, 'node/add/'), data=node_value)
    return ret

def get_node(node_id):
    """Uses the backend API to request a node"""
    node_id = str(node_id)
    full_url = os.path.join(URL, 'node/get', node_id, '')
    ret = get(full_url)
    return ret

def update_node(node_id, contents='', renderer='', children=''):
    """Uses the backend API to update a node that already exists"""
    node_id = str(node_id)
    old_node = get_node(node_id).json()
    if contents == '':
        contents = old_node['contents']
    if renderer == '':
        renderer = old_node['renderer']
    if children == '':
        children = old_node['children']
    node_value = {'contents': contents, 'renderer': renderer, 'children': children}
    ret = post(os.path.join(URL, 'node/update', node_id, ''), data=node_value)
    return ret

def delete_node(node_id):
    """Uses the backend API to delete a node that already exists"""
    node_id = str(node_id)
    ret = post(os.path.join(URL, 'node/delete', node_id, ''), data={})
    return ret

## @private
def node_compare(node1, node2):
    id1 = int(node1['id'])
    id2 = int(node2['id'])
    if id1 < id2:
        return -1
    elif id1 == id2:
        return 0
    else:
        return 1

if __name__ == '__main__':
    with open(SAMPLE_JSON_FILE) as data_file:
        data = json.load(data_file)

    nlist = data['nodes']
    nlist.sort(cmp=node_compare)

    for node in nlist:
        mycontents = node['contents']
        myrenderer = node['renderer']
        print create_node(contents=mycontents, renderer=myrenderer).json()

    for node in nlist:
        myid = int(node['id'])
        mychildren = json.dumps(node['children'])
        print update_node(myid, children=mychildren).json()
