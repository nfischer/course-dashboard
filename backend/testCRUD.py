#!/usr/bin/env python

import unittest, json
from requests import get, post
URL = 'http://localhost:5000'

class CourseTests(unittest.TestCase):
    """ Test module """
    def setUp(self):
        self.url = URL

    def test_create(self):
        res = post(self.url + '/0/course/add/', data={})
        self.assertEqual(res.status_code, 200)
        cid = res.json()['course_id']
        self.assertEqual(type(cid), type(1))
        self.assertGreater(cid, 0)

    def test_set_piazza(self):
        # Create course
        res = post(self.url + '/0/course/add/', data={})
        self.assertEqual(res.status_code, 200)
        cid = res.json()['course_id']
        self.assertGreater(cid, 0)
        # test piazza call success
        res = post(self.url + '/{0}/course/setpiazza/'.format(cid), data={'piazza_cid': 'ielkajf48l2k3'})
        self.assertEqual(res.status_code, 200)
        self.assertEqual(type(res.json()['course_id']), type(u'unicode string'))
        self.assertEqual(cid, int(res.json()['course_id']))

    def test_reset_piazza(self):
        # Create course
        res = post(self.url + '/0/course/add/', data={})
        self.assertEqual(res.status_code, 200)
        cid = res.json()['course_id']
        self.assertGreater(cid, 0)
        # set the piazza ID to something to begin with
        res = post(self.url + '/{0}/course/setpiazza/'.format(cid), data={'piazza_cid': 'ielkajf48l2k3'})
        self.assertEqual(res.status_code, 200)
        self.assertEqual(type(res.json()['course_id']), type(u'unicode string'))
        self.assertEqual(cid, int(res.json()['course_id']))
        # reset the piazza ID to something
        res = post(self.url + '/{0}/course/resetpiazza/'.format(cid), data={'piazza_cid': 'ielkajf48l2k3'})
        self.assertEqual(res.status_code, 200)
        self.assertEqual(cid, int(res.json()['course_id']))
        # test piazza call failure for an ID that is not yet set
        res = post(self.url + '/{0}/course/resetpiazza/'.format(cid+1), data={'piazza_cid': 'ielkajf48l2k3'})
        self.assertEqual(res.status_code, 400)

    def test_get_piazza(self):
        # Create course
        res = post(self.url + '/0/course/add/', data={})
        self.assertEqual(res.status_code, 200)
        cid = res.json()['course_id']
        self.assertGreater(cid, 0)
        # set the piazza ID to something to begin with
        piazza_id = 'ielkajf48l2k3'
        res = post(self.url + '/{0}/course/setpiazza/'.format(cid), data={'piazza_cid': piazza_id})
        self.assertEqual(res.status_code, 200)
        self.assertEqual(type(res.json()['course_id']), type(u'unicode string'))
        self.assertEqual(cid, int(res.json()['course_id']))
        # test piazza call success
        res = get(self.url + '/{0}/course/getpiazza/'.format(cid))
        self.assertEqual(res.status_code, 200)
        self.assertEqual(type(res.json()['course_id']), type(u'unicode string'))
        self.assertEqual(cid, int(res.json()['course_id']))
        self.assertEqual(type(res.json()['piazza_cid']), type(u'unicode string'))
        self.assertEqual(piazza_id, str(res.json()['piazza_cid']))
        # test piazza call failure for an ID that is not yet set
        res = get(self.url + '/{0}/course/getpiazza/'.format(cid+1), data={'piazza_cid': 'ielkajf48l2k3'})
        self.assertEqual(res.status_code, 400)

class NodeTests(unittest.TestCase):
    """ Test module for CRUD operations using Python's unittest """
    def setUp(self):
        self.url = 'http://localhost:5000'

    def test_create(self):
        # Create course
        res = post(self.url + '/0/course/add/', data={})
        self.assertEqual(res.status_code, 200)
        cid = res.json()['course_id']
        self.assertGreater(cid, 0)
        # Create a node
        node_value = {'contents': 'foo', 'renderer': 'rendition'}
        res = post(self.url + '/{0}/node/add/'.format(cid), data=node_value)
        self.assertEqual(res.status_code, 200)
        jd = json.loads(res.text)
        node_id = int(jd['id'])
        self.assertGreater(node_id, 0)

    """ Tests requests.get operation """
    def test_get(self):
        # Create course
        res = post(self.url + '/0/course/add/', data={})
        self.assertEqual(res.status_code, 200)
        cid = res.json()['course_id']
        self.assertGreater(cid, 0)
        # Create a node
        node_value = {'contents': 'foo', 'renderer': 'rendition'}
        res = post(self.url + '/{0}/node/add/'.format(cid), data=node_value)
        self.assertEqual(res.status_code, 200)
        jd = json.loads(res.text)
        node_id = int(jd['id'])
        self.assertGreater(node_id, 0)
        # Get the node
        res = get(self.url + '/{0}/node/get/{1}/'.format(cid, node_id))
        self.assertEqual(res.status_code, 200)
        self.assertEqual(node_id, res.json()['id'])
        # Fail to get a node that doesn't exist yet
        res = get(self.url + '/{0}/node/get/{1}/'.format(cid, node_id+1))
        self.assertEqual(res.status_code, 400)
        # Fail to get a node if we use the wrong course ID
        res = get(self.url + '/{0}/node/get/{1}/'.format(cid+1, node_id))
        self.assertEqual(res.status_code, 400)

    def test_update(self):
        # Create course
        res = post(self.url + '/0/course/add/', data={})
        self.assertEqual(res.status_code, 200)
        cid = res.json()['course_id']
        self.assertGreater(cid, 0)
        # Create a node
        node_value = {'contents': 'foo', 'renderer': 'rendition'}
        res = post(self.url + '/{0}/node/add/'.format(cid), data=node_value)
        self.assertEqual(res.status_code, 200)
        jd = json.loads(res.text)
        node_id = int(jd['id'])
        self.assertGreater(node_id, 0)
        # Update the node
        node_value = {'contents': 'foobar'}
        res = post(self.url + '/{0}/node/update/{1}/'.format(cid, node_id), data=node_value)
        self.assertEqual(res.status_code, 200)
        self.assertEqual(type(res.json()['id']), type(u'unicode string'))
        self.assertEqual(node_id, int(res.json()['id']))
        # Attempt to update no values of a node
        node_value = {}
        res = post(self.url + '/{0}/node/update/{1}/'.format(cid, node_id), data=node_value)
        self.assertEqual(res.status_code, 400)
        # Attempt to update a node that doesn't exist
        node_value = {'contents': 'foobar'}
        res = post(self.url + '/{0}/node/update/{1}/'.format(cid, node_id+1), data=node_value)
        self.assertEqual(res.status_code, 400)

    def test_delete(self):
        # Create course
        res = post(self.url + '/0/course/add/', data={})
        self.assertEqual(res.status_code, 200)
        cid = res.json()['course_id']
        self.assertGreater(cid, 0)
        # Create a node
        node_value = {'contents': 'foo', 'renderer': 'rendition'}
        res = post(self.url + '/{0}/node/add/'.format(cid), data=node_value)
        self.assertEqual(res.status_code, 200)
        jd = json.loads(res.text)
        node_id = int(jd['id'])
        self.assertGreater(node_id, 0)
        # Delete a node that's there
        res = post(self.url + '/{0}/node/delete/{1}/'.format(cid, node_id))
        self.assertEqual(res.status_code, 200)
        self.assertEqual(type(res.json()['id']), type(u'unicode string'))
        self.assertEqual(node_id, int(res.json()['id']))
        # Try to access the dead node
        res = get(self.url + '/{0}/node/get/{1}/'.format(cid, node_id))
        self.assertEqual(res.status_code, 400)
        # Redelete the node (which should be successful)
        res = post(self.url + '/{0}/node/delete/{1}/'.format(cid, node_id))
        self.assertEqual(res.status_code, 200)
        self.assertEqual(type(res.json()['id']), type(u'unicode string'))
        self.assertEqual(node_id, int(res.json()['id']))
        # Try to delete a node that doesn't exist
        res = post(self.url + '/{0}/node/delete/{1}/'.format(cid, node_id+1))
        self.assertEqual(res.status_code, 400)

class TreeTests(unittest.TestCase):
    """ Test module """
    def setUp(self):
        self.url = URL

    def test_get_tree(self):
        node_list = []
        # Create course
        res = post(self.url + '/0/course/add/', data={})
        self.assertEqual(res.status_code, 200)
        cid = res.json()['course_id']
        self.assertGreater(cid, 0)
        # Create a node
        node_value = {'contents': 'foo0', 'renderer': 'rendition0'}
        res = post(self.url + '/{0}/node/add/'.format(cid), data=node_value)
        self.assertEqual(res.status_code, 200)
        jd = json.loads(res.text)
        node_id = int(jd['id'])
        node_list.append(node_id)
        self.assertGreater(node_id, 0)
        # Create another node
        node_value = {'contents': 'foo1', 'renderer': 'rendition1'}
        res = post(self.url + '/{0}/node/add/'.format(cid), data=node_value)
        self.assertEqual(res.status_code, 200)
        jd = json.loads(res.text)
        node_id = int(jd['id'])
        node_list.append(node_id)
        # Create another node
        node_value = {'contents': 'foo2', 'renderer': 'rendition2'}
        res = post(self.url + '/{0}/node/add/'.format(cid), data=node_value)
        self.assertEqual(res.status_code, 200)
        jd = json.loads(res.text)
        node_id = int(jd['id'])
        node_list.append(node_id)
        # Check that nodes are in increasing order
        self.assertTrue(sorted(node_list))
        # Get the tree
        res = get(self.url + '/{0}/tree/'.format(cid))
        self.assertEqual(res.status_code, 200)
        tree_nodes = res.json()['nodes']
        self.assertEqual(type(tree_nodes), type(node_list))
        tree_nodes.sort()
        counter = 0
        for tnode, nid in zip(tree_nodes, node_list):
            self.assertEqual(type(tnode['id']), type(1))
            self.assertEqual(tnode['id'], nid)
            self.assertEqual(tnode['contents'], u'foo{0}'.format(counter))
            self.assertEqual(tnode['renderer'], u'rendition{0}'.format(counter))
            counter = counter + 1
        self.assertEqual(counter, len(node_list))
        self.assertEqual(counter, len(tree_nodes))

if __name__ == '__main__':
    unittest.main()
