"""Device metadata persisted with the peewee ORM (SQLite)."""

from peewee import Model, CharField, IntegerField, BooleanField, SqliteDatabase

db = SqliteDatabase('sensorhub.db')


class Device(Model):
    name = CharField()
    location = CharField()
    firmware_version = IntegerField()
    active = BooleanField(default=True)

    class Meta:
        database = db


class SensorType(Model):
    label = CharField()
    unit = CharField()

    class Meta:
        database = db


def register_device(name: str, location: str):
    return Device.create(name=name, location=location, firmware_version=1)


def list_devices():
    return Device.select()


def get_device(device_id: int):
    return Device.get(Device.id == device_id)


def find_device(device_id: int):
    return Device.get_or_none(Device.id == device_id)


def bump_firmware(device_id: int, version: int):
    return Device.update(firmware_version=version).where(Device.id == device_id).execute()


def deactivate_device(device_id: int):
    return Device.update(active=False).where(Device.id == device_id).execute()


def remove_device(device_id: int):
    return Device.delete().where(Device.id == device_id).execute()


def create_sensor_type(label: str, unit: str):
    return SensorType.create(label=label, unit=unit)


def list_sensor_types():
    return SensorType.select()
