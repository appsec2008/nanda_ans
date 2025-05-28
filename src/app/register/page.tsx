// src/app/register/page.tsx
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle }  from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { BotMessageSquare, ShieldPlus } from "lucide-react";

const realisticDefaults = {
  agentName: "My New AI Agent",
  agentDID: "did:nanda:new-agent-placeholder-123",
  capability: "Generic AI Task",
  description: "This is a newly registered AI agent. Its purpose is to perform general tasks and integrate within the NANDA+ANS ecosystem. Specific capabilities and details will be updated in its AgentFacts.",
  factsUrl: "https://example.com/.well-known/agent-facts-default.jsonld",
  providerName: "Independent Developer",
  version: "0.1.0-alpha",
};

const agentRegistrationSchema = z.object({
  agentName: z.string().min(3, { message: "Agent name must be at least 3 characters if provided." }).optional().or(z.literal("")),
  agentDID: z.string().startsWith("did:", { message: "Must be a valid DID (e.g., did:nanda:xyz) if provided." }).optional().or(z.literal("")),
  capability: z.string().min(3, { message: "Primary capability must be at least 3 characters if provided." }).optional().or(z.literal("")),
  description: z.string()
    .min(10, { message: "Description must be at least 10 characters if provided." })
    .max(500, { message: "Description must not exceed 500 characters if provided." })
    .optional().or(z.literal("")),
  factsUrl: z.string().url({ message: "Please enter a valid URL for AgentFacts if provided." }).optional().or(z.literal("")),
  providerName: z.string().optional().or(z.literal("")),
  version: z.string().optional().or(z.literal("")),
});

type AgentRegistrationFormValues = z.infer<typeof agentRegistrationSchema>;

export default function RegisterAgentPage() {
  const form = useForm<AgentRegistrationFormValues>({
    resolver: zodResolver(agentRegistrationSchema),
    defaultValues: realisticDefaults,
  });

  function onSubmit(data: AgentRegistrationFormValues) {
    // Use realistic defaults for any fields left empty by the user
    const finalData = {
      agentName: data.agentName?.trim() || realisticDefaults.agentName,
      agentDID: data.agentDID?.trim() || realisticDefaults.agentDID,
      capability: data.capability?.trim() || realisticDefaults.capability,
      description: data.description?.trim() || realisticDefaults.description,
      factsUrl: data.factsUrl?.trim() || realisticDefaults.factsUrl,
      providerName: data.providerName?.trim() || realisticDefaults.providerName,
      version: data.version?.trim() || realisticDefaults.version,
    };

    console.log("Agent Registration Data (Final):", finalData);
    toast({
      title: "Registration Submitted (Conceptual)",
      description: (
        <div className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <p className="text-white">Agent {finalData.agentName} registration submitted.</p>
          <p className="text-white text-xs mt-1">This process would typically create a NANDA AgentAddr (a signed pointer including DID, Facts URL, TTL) to your AgentFacts, secured within the NANDA+ANS dual-trust framework using default or provided values.</p>
          <pre className="mt-2 w-full rounded-md bg-slate-900 p-2">
            <code className="text-white text-xs">{JSON.stringify(finalData, null, 2)}</code>
          </pre>
        </div>
      ),
      variant: "default",
    });
    // form.reset(realisticDefaults); // Optionally reset form to defaults after submission
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="shadow-lg">
        <CardHeader className="text-center">
          <div className="inline-flex items-center justify-center mb-4">
            <ShieldPlus className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="text-3xl font-bold">Register New Agent</CardTitle>
          <CardDescription className="text-muted-foreground">
            Add your agent to the NANDA+ANS ecosystem. Registration involves creating a NANDA `AgentAddr` (a lightweight, signed pointer) that directs to your detailed `AgentFacts` (verifiable metadata). All fields are optional; if left blank, sensible defaults will be used. This establishes your agent's identity (CA-signed or DID-based) and cryptographically assured capabilities.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="agentName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Agent Name</FormLabel>
                    <FormControl>
                      <Input placeholder={realisticDefaults.agentName} {...field} />
                    </FormControl>
                    <FormDescription>A user-friendly name for your agent. (Optional, defaults will be used if blank)</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="agentDID"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Agent DID (Decentralized Identifier)</FormLabel>
                    <FormControl>
                      <Input placeholder={realisticDefaults.agentDID} {...field} />
                    </FormControl>
                    <FormDescription>The agent's unique DID, its NANDA root identity. (Optional, defaults will be used if blank)</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="capability"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Primary Capability</FormLabel>
                    <FormControl>
                      <Input placeholder={realisticDefaults.capability} {...field} />
                    </FormControl>
                    <FormDescription>The main function your agent provides. (Optional, defaults will be used if blank)</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder={realisticDefaults.description}
                        className="resize-y min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>Detailed description for AgentFacts. (Optional, defaults will be used if blank)</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="factsUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>AgentFacts URL</FormLabel>
                    <FormControl>
                      <Input type="url" placeholder={realisticDefaults.factsUrl} {...field} />
                    </FormControl>
                    <FormDescription>Publicly accessible URL to your AgentFacts (JSON-LD). (Optional, defaults will be used if blank)</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="providerName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Provider Name</FormLabel>
                      <FormControl>
                        <Input placeholder={realisticDefaults.providerName} {...field} />
                      </FormControl>
                      <FormDescription>(Optional)</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="version"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Version</FormLabel>
                      <FormControl>
                        <Input placeholder={realisticDefaults.version} {...field} />
                      </FormControl>
                      <FormDescription>(Optional)</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <Button type="submit" className="w-full" size="lg">
                Register Agent (Conceptual)
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
