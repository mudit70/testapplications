"""Hand-stubbed generated module (normally produced by grpcio-tools).

Mirrors what `python -m grpc_tools.protoc` emits from aggregates.proto.
"""


class AggregatesServicer:
    """Base class generated from the Aggregates service in aggregates.proto."""

    def DeviceAverage(self, request, context):
        raise NotImplementedError()

    def FleetSummary(self, request, context):
        raise NotImplementedError()


def add_AggregatesServicer_to_server(servicer, server):
    pass


class AggregatesStub:
    def __init__(self, channel):
        self.channel = channel
