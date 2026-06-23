"""gRPC service exposing aggregate sensor statistics (grpcio)."""

import grpc
from concurrent import futures

import aggregates_pb2
import aggregates_pb2_grpc
from readings_store import aggregate_by_device, count_readings
from models import list_devices


# Service name = "Aggregates" (trailing "Servicer" stripped).
class Aggregates(aggregates_pb2_grpc.AggregatesServicer):
    def DeviceAverage(self, request, context):
        stats = {row['_id']: row['avg'] for row in aggregate_by_device()}
        avg = stats.get(request.device_id, 0.0)
        return aggregates_pb2.DeviceAverageReply(device_id=request.device_id, average=avg)

    def FleetSummary(self, request, context):
        devices = list(list_devices())
        total = sum(count_readings(d.id) for d in devices)
        return aggregates_pb2.FleetSummaryReply(total_devices=len(devices), total_readings=total)


def serve():
    server = grpc.server(futures.ThreadPoolExecutor(max_workers=10))
    aggregates_pb2_grpc.add_AggregatesServicer_to_server(Aggregates(), server)
    server.add_insecure_port("[::]:50051")
    server.start()
    server.wait_for_termination()
