#!/usr/bin/env python

import unittest, json
from requests import get, post
URL = 'http://localhost:5000'

class CreateCourse(unittest.TestCase):
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

# class TestCRUD(unittest.TestCase):
#     """ Test module for CRUD operations using Python's unittest """
#     def setUp(self):
#         self.classId = 1
#         self.url = 'http://localhost:5000'
#         self.nodeId = None

#     """ Tests requests.get operation """
#     def test_get(self):
#         if self.nodeId:
#             res = get(self.url + '/{0}/node/get/{1}/'.format(self.classId, self.nodeId))
#             self.assertEqual(res.status_code, 500)
#         else:
#             res = get(self.url + '/{0}/node/get/1/'.format(self.classId))
#             self.assertEqual(res.status_code, 200)
#             jd = json.loads(res.text)

#     def test_create(self):
#         node_value = {'contents': 'foo{0}'.format(self.nodeId), 'renderer': 'rendition'}
#         res = post(self.url + '/{0}/node/add/'.format(self.classId), data=node_value)
#         self.assertEqual(res.status_code, 200)
#         jd = json.loads(res.text)
#         self.nodeId = int(jd['id'])
#         self.assertGreater(self.nodeId, 0)


#     def test_update(self):
#         node_value = {}
#         if not self.nodeId:
#             self.nodeId = 1

#         res = post(self.url + '/{0}/node/update/{1}/'.format(self.classId,self.nodeId), data=node_value)
#         self.assertEqual(res.status_code, 400)

#         # at this point there is at least one node in the Nodes table
#         node_value = {'contents': 'foo'}
#         res = post(self.url + '/{0}/node/update/1/'.format(self.classId), data=node_value)
#         self.assertNotEqual(res.status_code, 400)

#         if self.nodeId:
#             node_value = {'contents': 'foo{0}'.format(self.nodeId), 'renderer': 'test renderer'}
#             res = post(self.url + '/{0}/node/update/{1}/'.format(self.classId,self.nodeId), data=node_value)
#             self.assertNotEqual(res.status_code, 400)

#         node_value = {'contents': 'foo{0}'.format(self.nodeId), 
#                     'renderer': 'test renderer', 'children' : "{'week1':2, 'week1':3}"}
#         res = post(self.url + '/{0}/node/update/{1}/'.format(self.classId,self.nodeId), data=node_value)
#         self.assertNotEqual(res.status_code, 400)

#     def test_delete(self):
#         if self.nodeId:
#             res = post(self.url + '/{0}/node/delete/2/'.format(self.classId))
#             self.assertEqual(res.status_code, 500)
#             res = post(self.url + '/{0}/node/update/2/'.format(self.classId), data={'isalive' : '1'})

#         else:
#             res = post(self.url + '/{0}/node/delete/2/'.format(self.classId))
#             self.assertEqual(res.status_code, 200)
#             jd = json.loads(res.text)
#             res = post(self.url + '/{0}/node/update/2/'.format(self.classId), data={'isalive' : '1'})


if __name__ == '__main__':
    unittest.main()
