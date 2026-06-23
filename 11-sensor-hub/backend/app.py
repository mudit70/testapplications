"""Tornado HTTP API for the sensor hub.

Routes are stitched to the React Native client's fetch() URL literals.
Handlers delegate to peewee (device metadata), pymongo (raw readings),
kafka-python (ingestion queue) and Azure Blob (firmware images).
"""

import json

import tornado.web
import tornado.ioloop

import models
import readings_store
from queue_producer import publish_reading
from firmware_storage import upload_firmware, list_firmware


class DeviceListHandler(tornado.web.RequestHandler):
    async def get(self):
        devices = [{'id': d.id, 'name': d.name} for d in models.list_devices()]
        self.write({'devices': devices})

    async def post(self):
        body = json.loads(self.request.body or b'{}')
        device = models.register_device(body['name'], body['location'])
        self.write({'id': device.id})


class DeviceDetailHandler(tornado.web.RequestHandler):
    async def get(self, device_id):
        device = models.get_device(int(device_id))
        self.write({'id': device.id, 'name': device.name})

    async def delete(self, device_id):
        models.deactivate_device(int(device_id))
        readings_store.purge_device_readings(int(device_id))
        self.write({'ok': True})


class ReadingHandler(tornado.web.RequestHandler):
    async def get(self, device_id):
        rows = readings_store.list_readings(int(device_id))
        self.write({'count': len(rows)})

    async def post(self, device_id):
        body = json.loads(self.request.body or b'{}')
        value = float(body['value'])
        # Persist raw reading in MongoDB, then publish onto the Kafka topic.
        readings_store.insert_reading(int(device_id), value)
        publish_reading(json.dumps({'device_id': int(device_id), 'value': value}).encode())
        self.write({'queued': True})


class FirmwareHandler(tornado.web.RequestHandler):
    async def get(self):
        blobs = [b for b in list_firmware()]
        self.write({'count': len(blobs)})

    async def post(self):
        body = self.request.body or b''
        version = self.get_argument('version', '1')
        upload_firmware(version, body)
        models.bump_firmware(int(self.get_argument('device_id', '0')), int(version))
        self.write({'uploaded': True})


def make_app():
    return tornado.web.Application([
        (r'/api/devices', DeviceListHandler),
        (r'/api/devices/(\d+)', DeviceDetailHandler),
        (r'/api/devices/(\d+)/readings', ReadingHandler),
        (r'/api/firmware', FirmwareHandler),
    ])


if __name__ == '__main__':
    app = make_app()
    app.listen(8888)
    tornado.ioloop.IOLoop.current().start()
