#!/usr/bin/python

"""
Python script that, when run, uses API calls to populate the backend with sample
data
"""

import os
import json
from requests import put, get, post

URL = 'http://localhost:5000'
PROJECT_DIR = os.path.dirname(os.path.dirname(os.path.realpath(__file__)))
SAMPLE_JSON_FILE = os.path.join(PROJECT_DIR, 'frontend', 'sampledata.json')

def create_node(contents='foo', renderer='bar'):
    """Uses the backend API to create a node"""
    node_value = {'contents': contents, 'renderer': renderer}
    ret = put(os.path.join(URL, 'node/'), data=node_value)
    # if ret.status_code != 200:
    #     raise AttributeError('Status code: %d' % ret.status_code)
    print ret.json()

def add_children(parent_id, child_string):
    children_value = {'children': child_string}
    ret = put(os.path.join(URL, 'children/', str(parent_id), ''), data=children_value)

    # if ret.status_code != 200:
    #     raise AttributeError('Status code: %d' % ret.status_code)
    print ret.json()

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
        create_node(contents=mycontents, renderer=myrenderer)

    for node in nlist:
        myid = int(node['id'])
        mychildren = node['children']
        add_children(myid, json.dumps(mychildren))


