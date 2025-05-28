// src/lib/types.ts

export interface AgentSignature {
  type: string;
  created: string;
  verificationMethod: string;
  proofPurpose: string;
  proofValue: string;
}

export interface EndpointSet {
  "@type": string; // e.g., "nanda:EndpointSet"
  static_endpoint?: string[];
  adaptive_router_url?: string;
}

export interface ProtocolExtension {
  "@type": string; // e.g., "A2AAgentCard"
  name?: string; // Generic name for display
  details?: Record<string, any>; // Protocol-specific fields
}

export interface ProtocolExtensionSet {
  "@type": string; // e.g., "ans:ProtocolExtensionSet"
  a2a?: ProtocolExtension;
  mcp?: ProtocolExtension;
  acp?: ProtocolExtension;
}

// Represents the detailed information about an agent
export interface AgentFacts {
  id: string; // Agent's own DID, primary key
  ansName?: string; // Full ANS name, e.g., "a2a://myTranslator.DocumentTranslation.LinguaCorp.v1.2.certified"
  name: string; // User-friendly display name for the agent
  capability: string; // Primary capability for display
  capabilities?: string[]; // Full list of capabilities
  provider?: string;
  version?: string;
  extension?: string; // e.g., "certified" from ANS name
  description?: string;
  endpoints?: EndpointSet;
  attestations?: string[]; // Array of strings, could be DIDs or URLs to VCs
  protocolExtensions?: ProtocolExtensionSet;
  signature?: AgentSignature; // Signature by agent or publisher
  avatarUrl?: string; // Optional URL for agent's avatar image
  registeredAt?: string; // ISO date string
}

// Represents the pointer to AgentFacts stored in the NANDA+ANS registry
export interface AgentAddr {
  agent_id: string; // DID, should match AgentFacts.id
  facts_url: string;
  private_facts_url?: string;
  adaptive_router_url?: string;
  ttl: number;
  signature: AgentSignature; // Signature from the registry shard
}

// Combined Agent type primarily used for UI display and interactions.
// It merges essential fields from AgentFacts and AgentAddr.
export interface Agent extends AgentFacts {
  // AgentFacts fields are inherited.
  // We can add specific fields from AgentAddr if needed directly, or assume they are part of AgentFacts for simplicity in UI.
  // For example, ttl from AgentAddr might be useful to display.
  addr_ttl?: number;
  addr_facts_url?: string; // To distinguish from a facts_url possibly within AgentFacts itself.
  aiSummary?: string; // To be populated by GenAI
}
