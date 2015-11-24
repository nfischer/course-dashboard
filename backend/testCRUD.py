#!/usr/bin/env python

import unittest, json
from requests import get, post
import os
URL = 'http://localhost:5000'
UNICODE_TYPE = type(u'unicode string')
INT_TYPE = type(int())
USER_FILE = 'sample_user.txt'
TMP_NAME = 'tmp_sample_user.txt'

class CourseTests(unittest.TestCase):
    """ Test the Course end point and various piazza operations """

    def setUp(self):
        self.url = URL
        # Rename the credentials file to something else if it exists
        if os.path.exists(USER_FILE):
            os.rename(USER_FILE, TMP_NAME)

    def tearDown(self):
        # Fix the name change for the credentials file
        if os.path.exists(USER_FILE):
            os.remove(USER_FILE)
        if os.path.exists(TMP_NAME):
            os.rename(TMP_NAME, USER_FILE)

    def test_create(self):
        course_name = 'CS130'
        res = post(self.url + '/0/course/add/', data={'name': course_name})
        self.assertEqual(res.status_code, 200)
        cid = res.json()['course_id']
        self.assertEqual(type(cid), INT_TYPE)
        self.assertGreater(cid, 0)
        self.assertEqual(type(res.json()['course_name']), UNICODE_TYPE)
        self.assertEqual(course_name, res.json()['course_name'])

    def test_get_piazzaposts(self):
        # Create course
        course_name = 'CS130'
        res = post(self.url + '/0/course/add/', data={'name': course_name})
        self.assertEqual(res.status_code, 200)
        cid = res.json()['course_id']
        self.assertGreater(cid, 0)
        self.assertEqual(type(res.json()['course_name']), UNICODE_TYPE)
        self.assertEqual(course_name, res.json()['course_name'])
        # set the piazza ID to something to begin with
        fake_id = 'ielkajf48l2k3'
        real_id = 'if44ov1fn5a505' # the ID for CS 130 Fall 2015
        res = post(self.url + '/{0}/course/setpiazza/'.format(cid), data={'piazza_cid': real_id})
        self.assertEqual(res.status_code, 200)
        self.assertEqual(type(res.json()['course_id']), UNICODE_TYPE)
        self.assertEqual(cid, int(res.json()['course_id']))
        # If we don't have credentials saved on file, expect failure (this can
        # be assumed due to the setUp() method)
        res = get(self.url + '/{0}/course/getpiazzaposts/'.format(cid))
        self.assertEqual(res.status_code, 500)
        # Try to authenticate with made-up credentials, expect failure
        with open(USER_FILE, 'w') as fname:
            fname.write('\n'.join(['fake_user@gmail.com', 'password', '']))
        res = get(self.url + '/{0}/course/getpiazzaposts/'.format(cid))
        self.assertEqual(res.status_code, 400)
        # Try using improperly formatted credentials
        with open(USER_FILE, 'w') as fname:
            fname.write('\n'.join(['fake_user@gmail.com']))
        res = get(self.url + '/{0}/course/getpiazzaposts/'.format(cid))
        self.assertEqual(res.status_code, 501)
        # test piazza call failure for an ID that is not yet set
        with open(USER_FILE, 'w') as fname:
            fname.write('\n'.join(['fake_user@gmail.com', 'password', '']))
        res = get(self.url + '/{0}/course/getpiazzaposts/'.format(cid))
        self.assertEqual(res.status_code, 400)
        # If there were credentials initally stored, assume these are valid.
        # Note: this won't run on continuous integration, but might run on an
        # individual tester's local machine. This will give false negatives if
        # the local credentials are NOT valid for CS 130. This is extremely
        # slow, however, so I'm leaving the code commented out for now
        # if os.path.exists(USER_FILE):
        #     res = get(self.url + '/{0}/course/getpiazzaposts/'.format(cid))
        #     self.assertEqual(res.status_code, 200)

    def test_set_piazza(self):
        # Create course
        course_name = 'CS130'
        res = post(self.url + '/0/course/add/', data={'name': course_name})
        self.assertEqual(res.status_code, 200)
        cid = res.json()['course_id']
        self.assertGreater(cid, 0)
        self.assertEqual(type(res.json()['course_name']), UNICODE_TYPE)
        self.assertEqual(course_name, res.json()['course_name'])
        # test piazza call success
        res = post(self.url + '/{0}/course/setpiazza/'.format(cid), data={'piazza_cid': 'ielkajf48l2k3'})
        self.assertEqual(res.status_code, 200)
        self.assertEqual(type(res.json()['course_id']), UNICODE_TYPE)
        self.assertEqual(cid, int(res.json()['course_id']))

    def test_reset_piazza(self):
        # Create course
        course_name = 'CS130'
        res = post(self.url + '/0/course/add/', data={'name': course_name})
        self.assertEqual(res.status_code, 200)
        cid = res.json()['course_id']
        self.assertGreater(cid, 0)
        self.assertEqual(type(res.json()['course_name']), UNICODE_TYPE)
        self.assertEqual(course_name, res.json()['course_name'])
        # set the piazza ID to something to begin with
        res = post(self.url + '/{0}/course/setpiazza/'.format(cid), data={'piazza_cid': 'ielkajf48l2k3'})
        self.assertEqual(res.status_code, 200)
        self.assertEqual(type(res.json()['course_id']), UNICODE_TYPE)
        self.assertEqual(cid, int(res.json()['course_id']))
        # reset the piazza ID to something
        res = post(self.url + '/{0}/course/resetpiazza/'.format(cid), data={'piazza_cid': 'ielkajf48l2k3'})
        self.assertEqual(res.status_code, 200)
        self.assertEqual(cid, int(res.json()['course_id']))
        # test piazza call failure for an ID that is not yet set
        res = post(self.url + '/{0}/course/resetpiazza/'.format(cid+1), data={'piazza_cid': 'ielkajf48l2k3'})
        self.assertEqual(res.status_code, 400)

    def test_reset_name(self):
        # Create course
        course_name = 'CS130'
        res = post(self.url + '/0/course/add/', data={'name': course_name})
        self.assertEqual(res.status_code, 200)
        cid = res.json()['course_id']
        self.assertGreater(cid, 0)
        self.assertEqual(type(res.json()['course_name']), UNICODE_TYPE)
        self.assertEqual(course_name, res.json()['course_name'])
        # reset the name to something else
        course_name = 'CS111'
        res = post(self.url + '/{0}/course/resetname/'.format(cid), data={'course_name': course_name})
        self.assertEqual(res.status_code, 200)
        self.assertEqual(type(res.json()['course_id']), UNICODE_TYPE)
        self.assertEqual(cid, int(res.json()['course_id']))
        res = get(self.url + '/{0}/course/get/'.format(cid))
        self.assertEqual(type(res.json()['course_name']), UNICODE_TYPE)
        self.assertEqual(course_name, res.json()['course_name'])
        self.assertEqual(type(res.json()['course_id']), UNICODE_TYPE)
        self.assertEqual(cid, int(res.json()['course_id']))
        # attempt to reset the name for a non-existent course
        res = post(self.url + '/{0}/course/resetname/'.format(cid+1), data={'course_name': course_name})
        self.assertEqual(res.status_code, 400)

    def test_get_name(self):
        # Create course
        course_name = 'CS130'
        res = post(self.url + '/0/course/add/', data={'name': course_name})
        self.assertEqual(res.status_code, 200)
        cid = res.json()['course_id']
        self.assertGreater(cid, 0)
        self.assertEqual(type(res.json()['course_name']), UNICODE_TYPE)
        self.assertEqual(course_name, res.json()['course_name'])
        # get the course name
        res = get(self.url + '/{0}/course/getname/'.format(cid))
        self.assertEqual(res.status_code, 200)
        self.assertEqual(type(res.json()['course_id']), UNICODE_TYPE)
        self.assertEqual(cid, int(res.json()['course_id']))
        self.assertEqual(type(res.json()['course_name']), UNICODE_TYPE)
        self.assertEqual(course_name, str(res.json()['course_name']))
        # make sure this fails for courses that don't exist
        res = get(self.url + '/{0}/course/getname/'.format(cid+1))
        self.assertEqual(res.status_code, 400)

    def test_get_course_info(self):
        # Create course
        course_name = 'CS130'
        res = post(self.url + '/0/course/add/', data={'name': course_name})
        self.assertEqual(res.status_code, 200)
        cid = res.json()['course_id']
        self.assertGreater(cid, 0)
        self.assertEqual(type(res.json()['course_name']), UNICODE_TYPE)
        self.assertEqual(course_name, res.json()['course_name'])
        # set the piazza ID to something to begin with
        piazza_id = 'ielkajf48l2k3'
        res = post(self.url + '/{0}/course/setpiazza/'.format(cid), data={'piazza_cid': piazza_id})
        self.assertEqual(res.status_code, 200)
        self.assertEqual(type(res.json()['course_id']), UNICODE_TYPE)
        self.assertEqual(cid, int(res.json()['course_id']))
        # test piazza call success
        res = get(self.url + '/{0}/course/get/'.format(cid))
        self.assertEqual(res.status_code, 200)
        self.assertEqual(type(res.json()['course_id']), UNICODE_TYPE)
        self.assertEqual(cid, int(res.json()['course_id']))
        self.assertEqual(type(res.json()['piazza_cid']), UNICODE_TYPE)
        self.assertEqual(piazza_id, str(res.json()['piazza_cid']))
        self.assertEqual(type(res.json()['course_name']), UNICODE_TYPE)
        self.assertEqual(course_name, str(res.json()['course_name']))
        # test piazza call failure for an ID that is not yet set
        res = get(self.url + '/{0}/course/getpiazza/'.format(cid+1))
        self.assertEqual(res.status_code, 400)

    def test_get_piazza(self):
        # Create course
        course_name = 'CS130'
        res = post(self.url + '/0/course/add/', data={'name': course_name})
        self.assertEqual(res.status_code, 200)
        cid = res.json()['course_id']
        self.assertGreater(cid, 0)
        self.assertEqual(type(res.json()['course_name']), UNICODE_TYPE)
        self.assertEqual(course_name, res.json()['course_name'])
        # set the piazza ID to something to begin with
        piazza_id = 'ielkajf48l2k3'
        res = post(self.url + '/{0}/course/setpiazza/'.format(cid), data={'piazza_cid': piazza_id})
        self.assertEqual(res.status_code, 200)
        self.assertEqual(type(res.json()['course_id']), UNICODE_TYPE)
        self.assertEqual(cid, int(res.json()['course_id']))
        # test piazza call success
        res = get(self.url + '/{0}/course/getpiazza/'.format(cid))
        self.assertEqual(res.status_code, 200)
        self.assertEqual(type(res.json()['course_id']), UNICODE_TYPE)
        self.assertEqual(cid, int(res.json()['course_id']))
        self.assertEqual(type(res.json()['piazza_cid']), UNICODE_TYPE)
        self.assertEqual(piazza_id, str(res.json()['piazza_cid']))
        # test piazza call failure for an ID that is not yet set
        res = get(self.url + '/{0}/course/getpiazza/'.format(cid+1))
        self.assertEqual(res.status_code, 400)

class NodeTests(unittest.TestCase):
    """
    Test module for CRUD operations on the Node end point using Python's
    unittest
    """

    def setUp(self):
        self.url = 'http://localhost:5000'

    def test_create(self):
        # Create course
        course_name = 'CS130'
        res = post(self.url + '/0/course/add/', data={'name': course_name})
        self.assertEqual(res.status_code, 200)
        cid = res.json()['course_id']
        self.assertGreater(cid, 0)
        self.assertEqual(type(res.json()['course_name']), UNICODE_TYPE)
        self.assertEqual(course_name, res.json()['course_name'])
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
        course_name = 'CS130'
        res = post(self.url + '/0/course/add/', data={'name': course_name})
        self.assertEqual(res.status_code, 200)
        cid = res.json()['course_id']
        self.assertGreater(cid, 0)
        self.assertEqual(type(res.json()['course_name']), UNICODE_TYPE)
        self.assertEqual(course_name, res.json()['course_name'])
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
        course_name = 'CS130'
        res = post(self.url + '/0/course/add/', data={'name': course_name})
        self.assertEqual(res.status_code, 200)
        cid = res.json()['course_id']
        self.assertGreater(cid, 0)
        self.assertEqual(type(res.json()['course_name']), UNICODE_TYPE)
        self.assertEqual(course_name, res.json()['course_name'])
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
        self.assertEqual(type(res.json()['id']), UNICODE_TYPE)
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
        course_name = 'CS130'
        res = post(self.url + '/0/course/add/', data={'name': course_name})
        self.assertEqual(res.status_code, 200)
        cid = res.json()['course_id']
        self.assertGreater(cid, 0)
        self.assertEqual(type(res.json()['course_name']), UNICODE_TYPE)
        self.assertEqual(course_name, res.json()['course_name'])
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
        self.assertEqual(type(res.json()['id']), UNICODE_TYPE)
        self.assertEqual(node_id, int(res.json()['id']))
        # Try to access the dead node
        res = get(self.url + '/{0}/node/get/{1}/'.format(cid, node_id))
        self.assertEqual(res.status_code, 400)
        # Redelete the node (which should be successful)
        res = post(self.url + '/{0}/node/delete/{1}/'.format(cid, node_id))
        self.assertEqual(res.status_code, 200)
        self.assertEqual(type(res.json()['id']), UNICODE_TYPE)
        self.assertEqual(node_id, int(res.json()['id']))
        # Try to delete a node that doesn't exist
        res = post(self.url + '/{0}/node/delete/{1}/'.format(cid, node_id+1))
        self.assertEqual(res.status_code, 400)

class TreeTests(unittest.TestCase):
    """ Test module for the tree end point """

    def setUp(self):
        self.url = URL

    def test_get_tree(self):
        node_list = []
        # Create course
        course_name = 'CS130'
        res = post(self.url + '/0/course/add/', data={'name': course_name})
        self.assertEqual(res.status_code, 200)
        cid = res.json()['course_id']
        self.assertGreater(cid, 0)
        self.assertEqual(type(res.json()['course_name']), UNICODE_TYPE)
        self.assertEqual(course_name, res.json()['course_name'])
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
            self.assertEqual(type(tnode['id']), INT_TYPE)
            self.assertEqual(tnode['id'], nid)
            self.assertEqual(tnode['contents'], u'foo{0}'.format(counter))
            self.assertEqual(tnode['renderer'], u'rendition{0}'.format(counter))
            counter = counter + 1
        self.assertEqual(counter, len(node_list))
        self.assertEqual(counter, len(tree_nodes))

class RootTests(unittest.TestCase):
    """ Test module for the Root end point """

    def setUp(self):
        self.url = URL

    def test_get_root(self):
        # Create course
        course_name = 'CS130'
        res = post(self.url + '/0/course/add/', data={'name': course_name})
        self.assertEqual(res.status_code, 200)
        cid = res.json()['course_id']
        self.assertGreater(cid, 0)
        self.assertEqual(type(res.json()['course_name']), UNICODE_TYPE)
        self.assertEqual(course_name, res.json()['course_name'])
        # Create a node
        node_value = {'contents': 'foo', 'renderer': 'rendition'}
        res = post(self.url + '/{0}/node/add/'.format(cid), data=node_value)
        self.assertEqual(res.status_code, 200)
        jd = json.loads(res.text)
        node_id = int(jd['id'])
        self.assertGreater(node_id, 0)
        # Attempt to view a root (and fail)
        res = get(self.url + '/{0}/root/get/'.format(cid))
        self.assertEqual(res.status_code, 400)
        # Set a root
        res = post(self.url + '/{0}/root/set/{1}/'.format(cid, node_id))
        self.assertEqual(res.status_code, 200)
        self.assertEqual(type(res.json()['id']), UNICODE_TYPE)
        self.assertEqual(int(res.json()['id']), node_id)
        # Get a root (which should be successful)
        res = get(self.url + '/{0}/root/get/'.format(cid))
        self.assertEqual(res.status_code, 200)
        self.assertEqual(type(res.json()), type(list()))
        root_list = res.json()
        self.assertEqual(len(root_list), 1)
        root = root_list[0]
        self.assertEqual(type(root['id']), INT_TYPE)
        self.assertEqual(root['id'], node_id)
        self.assertEqual(root['renderer'], u'rendition')

    def test_set_root(self):
        # Create course
        course_name = 'CS130'
        res = post(self.url + '/0/course/add/', data={'name': course_name})
        self.assertEqual(res.status_code, 200)
        cid = res.json()['course_id']
        self.assertGreater(cid, 0)
        self.assertEqual(type(res.json()['course_name']), UNICODE_TYPE)
        self.assertEqual(course_name, res.json()['course_name'])
        # Create a node
        node_value = {'contents': 'foo', 'renderer': 'rendition'}
        res = post(self.url + '/{0}/node/add/'.format(cid), data=node_value)
        self.assertEqual(res.status_code, 200)
        jd = json.loads(res.text)
        node_id = int(jd['id'])
        self.assertGreater(node_id, 0)
        # Set a root
        res = post(self.url + '/{0}/root/set/{1}/'.format(cid, node_id))
        self.assertEqual(res.status_code, 200)
        self.assertEqual(type(res.json()['id']), UNICODE_TYPE)
        self.assertEqual(int(res.json()['id']), node_id)
        # Try to set a node that doesn't exist
        res = post(self.url + '/{0}/root/set/{1}/'.format(cid, node_id+1))
        self.assertEqual(res.status_code, 400)

    def test_delete_root(self):
        # Create course
        course_name = 'CS130'
        res = post(self.url + '/0/course/add/', data={'name': course_name})
        self.assertEqual(res.status_code, 200)
        cid = res.json()['course_id']
        self.assertGreater(cid, 0)
        self.assertEqual(type(res.json()['course_name']), UNICODE_TYPE)
        self.assertEqual(course_name, res.json()['course_name'])
        # Create a node
        node_value = {'contents': 'foo', 'renderer': 'rendition'}
        res = post(self.url + '/{0}/node/add/'.format(cid), data=node_value)
        self.assertEqual(res.status_code, 200)
        jd = json.loads(res.text)
        node_id = int(jd['id'])
        self.assertGreater(node_id, 0)
        # Set a root
        res = post(self.url + '/{0}/root/set/{1}/'.format(cid, node_id))
        self.assertEqual(res.status_code, 200)
        self.assertEqual(type(res.json()['id']), UNICODE_TYPE)
        self.assertEqual(int(res.json()['id']), node_id)
        # Unset a root
        res = post(self.url + '/{0}/root/delete/{1}/'.format(cid, node_id))
        self.assertEqual(res.status_code, 200)
        self.assertEqual(type(res.json()['id']), UNICODE_TYPE)
        self.assertEqual(int(res.json()['id']), node_id)
        # Unset a root that doesn't exist
        res = post(self.url + '/{0}/root/delete/{1}/'.format(cid, node_id+1))
        self.assertEqual(res.status_code, 400)

if __name__ == '__main__':
    unittest.main()
