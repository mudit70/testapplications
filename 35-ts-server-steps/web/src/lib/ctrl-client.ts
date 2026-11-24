import type { DescService } from "@bufbuild/protobuf";
import { type Client, createClient } from "@connectrpc/connect";
import { createConnectTransport } from "@connectrpc/connect-web";

/** A client of one of the ctrl service's Connect services, at the URL configuration gives. */
export function createCtrlClient<T extends DescService>(service: T): Client<T> {
  const baseUrl = process.env.CTRL_URL;
  if (!baseUrl) throw new Error("ctrl is not configured");
  return createClient(service, createConnectTransport({ baseUrl }));
}
