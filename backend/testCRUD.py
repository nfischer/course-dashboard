#!/usr/bin/python

import unittest, json
from requests import get, post

class TestCRUD(unittest.TestCase):
	""" Test module for CRUD operations using Python's unittest """
	def setUp(self):
		self.classId = 0
		self.url = 'http://localhost:5000'
		self.nodeId = None

	""" Tests requests.get operation """
	def test_get(self):
		if self.nodeId:
			res = get(self.url + '/{0}/node/get/{1}'.format(self.classId, self.nodeId))
			self.assertEqual(res.status_code, 500)

		else:
			res = get(self.url + '/{0}/node/get/4'.format(self.classId))
			self.assertEqual(res.status_code, 400)
			jd = json.loads(res.text)

	def test_create(self):
		node_value = {'contents': 'foo{0}'.format(self.nodeId), 'renderer': 'rendition'}
		res = post(self.url + '/{0}/node/add/'.format(self.classId), data=node_value)
		self.assertEqual(res.status_code, 200)
		jd = json.loads(res.text)
		self.nodeId = int(jd['id'])
		self.assertGreater(self.nodeId, 0)


	def test_update(self):
		node_value = {'contents': 'foo{0}'.format(self.nodeId), 'renderer': 'time'}
		res = post(self.url + '/{0}/node/update/{1}/'.format(self.classId,self.nodeId), data=node_value)
		self.assertNotEqual(res.status_code, 400)
		self.assertNotEqual(res.status_code, 500)

	def test_delete(self):
		s = 'hello world'
		self.assertEqual(s.split(), ['hello', 'world'])
		# check that s.split fails when the separator is not a string
		with self.assertRaises(TypeError):
			s.split(2)


if __name__ == '__main__':
	unittest.main()
