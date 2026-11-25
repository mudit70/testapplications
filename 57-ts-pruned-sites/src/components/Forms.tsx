"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { api } from "~/lib/trpc";

const whatsappSchema = z.object({ provider: z.literal("whatsapp"), phone: z.string() });

type WhatsAppValues = z.infer<typeof whatsappSchema>;

/**
 * The WhatsApp form: its type, inferred from the schema, fixes the provider (z.literal); read with
 * getValues.
 */
export function FormWhatsApp() {
  const form = useForm<WhatsAppValues>({
    resolver: zodResolver(whatsappSchema),
    defaultValues: { provider: "whatsapp" as const, phone: "" },
  });
  const sendTest = api.notification.sendTest.useMutation();
  const test = () => {
    const provider = form.getValues("provider");
    sendTest.mutateAsync({ provider, to: form.getValues("phone") });
  };
  return <button onClick={test}>Send WhatsApp test</button>;
}

/** Telegram: the provider written as a literal. */
export function FormTelegram() {
  const sendTest = api.notification.sendTest.useMutation();
  return (
    <button onClick={() => sendTest.mutateAsync({ provider: "telegram", to: "@ops" })}>
      Send Telegram test
    </button>
  );
}

/** Any provider the user picks: every branch may run. */
export function FormGrafana({ webhookUrl }: { webhookUrl: string }) {
  const sendTest = api.notification.sendTest.useMutation();
  return (
    <button onClick={() => sendTest.mutateAsync({ provider: "grafana", to: webhookUrl })}>
      Send Grafana test
    </button>
  );
}

export function FormAny({ provider }: { provider: "telegram" | "whatsapp" | "slack" | "grafana" }) {
  const sendTest = api.notification.sendTest.useMutation();
  return <button onClick={() => sendTest.mutateAsync({ provider, to: "x" })}>Send test</button>;
}
