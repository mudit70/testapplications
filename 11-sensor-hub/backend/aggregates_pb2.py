"""Hand-stubbed generated message module (normally from grpcio-tools)."""


class DeviceAverageReply:
    def __init__(self, device_id=0, average=0.0):
        self.device_id = device_id
        self.average = average


class FleetSummaryReply:
    def __init__(self, total_devices=0, total_readings=0):
        self.total_devices = total_devices
        self.total_readings = total_readings
