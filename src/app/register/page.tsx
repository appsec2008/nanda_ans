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
import { BotMessageSquare } from "lucide-react";

const agentRegistrationSchema = z.object({
  agentName: z.string().min(3, { message: "Agent name must be at least 3 characters." }),
  agentDID: z.string().startsWith("did:", { message: "Must be a valid DID."}),
  capability: z.string().min(3, { message: "Primary capability is required." }),
  description: z.string().min(10, { message: "Description must be at least 10 characters." }).max(500, { message: "Description must not exceed 500 characters."}),
  factsUrl: z.string().url({ message: "Please enter a valid URL for AgentFacts." }),
  providerName: z.string().optional(),
  version: z.string().optional(),
});

type AgentRegistrationFormValues = z.infer<typeof agentRegistrationSchema>;

export default function RegisterAgentPage() {
  const form = useForm<AgentRegistrationFormValues>({
    resolver: zodResolver(agentRegistrationSchema),
    defaultValues: {
      agentName: "",
      agentDID: "did:nanda:",
      capability: "",
      description: "",
      factsUrl: "https://example.com/.well-known/agent-facts.jsonld",
      providerName: "",
      version: "1.0",
    },
  });

  function onSubmit(data: AgentRegistrationFormValues) {
    // This is a conceptual submission.
    // In a real app, this would interact with the NANDA+ANS backend.
    console.log("Agent Registration Data:", data);
    toast({
      title: "Registration Submitted (Conceptual)",
      description: (
        <div className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <p className="text-white">Agent {data.agentName} registration conceptually submitted.</p>
          <pre className="mt-2 w-full rounded-md bg-slate-900 p-2">
            <code className="text-white text-xs">{JSON.stringify(data, null, 2)}</code>
          </pre>
        </div>
      ),
      variant: "default",
    });
    // form.reset(); // Optionally reset form
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="shadow-lg">
        <CardHeader className="text-center">
          <div className="inline-flex items-center justify-center mb-4">
            <BotMessageSquare className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="text-3xl font-bold">Register New Agent</CardTitle>
          <CardDescription className="text-muted-foreground">
            Join the AgentVerse Registry by providing your agent's details.
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
                      <Input placeholder="e.g., MyAwesomeAgent" {...field} />
                    </FormControl>
                    <FormDescription>A user-friendly name for your agent.</FormDescription>
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
                      <Input placeholder="did:nanda:your-agent-identifier" {...field} />
                    </FormControl>
                    <FormDescription>The unique DID for your agent, e.g., did:nanda:xyz or did:web:example.com:agent.</FormDescription>
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
                      <Input placeholder="e.g., DataAnalysis, ImageGeneration" {...field} />
                    </FormControl>
                    <FormDescription>The main function or service your agent provides.</FormDescription>
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
                        placeholder="Describe your agent's purpose, features, and how it operates."
                        className="resize-y min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>A detailed description of your agent.</FormDescription>
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
                      <Input type="url" placeholder="https://example.com/.well-known/agent-facts.jsonld" {...field} />
                    </FormControl>
                    <FormDescription>The publicly accessible URL to your agent's AgentFacts JSON-LD document.</FormDescription>
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
                      <FormLabel>Provider Name (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., MyCompany AI" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="version"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Version (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., 1.0.0" {...field} />
                      </FormControl>
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
