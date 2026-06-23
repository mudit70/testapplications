"""Raw sensor readings persisted to MongoDB via pymongo."""

from pymongo import MongoClient

client = MongoClient('mongodb://localhost:27017')
db = client['sensorhub']
readings = db['readings']
alerts = db.alerts


def insert_reading(device_id: int, value: float):
    readings.insert_one({'device_id': device_id, 'value': value})


def insert_readings(docs):
    readings.insert_many(docs)


def list_readings(device_id: int):
    return list(readings.find({'device_id': device_id}))


def latest_reading(device_id: int):
    return readings.find_one({'device_id': device_id})


def count_readings(device_id: int):
    return readings.count_documents({'device_id': device_id})


def flag_reading(reading_id, level: str):
    readings.update_one({'_id': reading_id}, {'$set': {'level': level}})


def purge_device_readings(device_id: int):
    readings.delete_many({'device_id': device_id})


def aggregate_by_device():
    return list(readings.aggregate([{'$group': {'_id': '$device_id', 'avg': {'$avg': '$value'}}}]))


def record_alert(device_id: int, message: str):
    alerts.insert_one({'device_id': device_id, 'message': message})
