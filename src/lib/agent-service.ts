
// src/lib/agent-service.ts
import type { Agent } from '@/lib/types';
import { db } from '@/lib/firebase';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';

// The mockAgents array can be kept for fallback or initial seeding,
// but primary functions will now use Firestore.
export const mockAgents: Agent[] = [
  {
    id: 'did:nanda:agent-translator-001',
    name: 'LinguaBot Pro',
    ansName: 'a2a://LinguaBotPro.DocumentTranslation.PolyglotAI.v2.1.certified',
    capability: 'Document Translation',
    capabilities: ['Document Translation', 'Language Identification', 'Text Summarization'],
    provider: 'PolyglotAI',
    version: '2.1',
    extension: 'certified',
    description: 'Advanced AI for translating documents in over 100 languages with high accuracy and context preservation. Supports various file formats and offers secure processing.',
    endpoints: {
      "@type": "nanda:EndpointSet",
      static_endpoint: ["https://api.polyglotai.com/translate/v2.1"],
      adaptive_router_url: "https://router.polyglotai.com/translate"
    },
    attestations: ["did:nanda:attestation-polyglot-hipaa-v1", "did:nanda:attestation-polyglot-iso27001-v1"],
    protocolExtensions: {
      "@type": "ans:ProtocolExtensionSet",
      a2a: { "@type": "A2AAgentCard", name: "LinguaBot A2A Interface", details: { supportedFormats: ["pdf", "docx", "txt"] } },
      mcp: { "@type": "MCPToolDescription", name: "LinguaBot MCP Tool", details: { maxFileSize: "10MB" } }
    },
    avatarUrl: 'https://placehold.co/100x100.png',
    dataAiHint: 'robot language',
    registeredAt: new Date(2024, 0, 15).toISOString(), // Jan 15, 2024
    addr_ttl: 3600,
    addr_facts_url: "https://polyglotai.com/.well-known/agent-facts-linguabot.jsonld"
  },
  {
    id: 'did:nanda:agent-dataprotector-002',
    name: 'GuardianShield',
    ansName: 'acp://GuardianShield.DataAnonymization.SecureDataCorp.v1.0.enterprise',
    capability: 'Data Anonymization',
    capabilities: ['Data Anonymization', 'PII Detection', 'Privacy Policy Enforcement'],
    provider: 'SecureDataCorp',
    version: '1.0',
    extension: 'enterprise',
    description: 'Enterprise-grade data anonymization agent ensuring GDPR and CCPA compliance. Uses advanced techniques to protect sensitive information while preserving data utility.',
    endpoints: {
      "@type": "nanda:EndpointSet",
      static_endpoint: ["https://api.securedatacorp.com/anonymize/v1.0"]
    },
    attestations: ["did:nanda:attestation-securedata-gdpr-v2", "did:nanda:attestation-securedata-soc2-v1"],
    protocolExtensions: {
      "@type": "ans:ProtocolExtensionSet",
      acp: { "@type": "ACPProfile", name: "GuardianShield ACP", details: { complianceLevel: "Strict" } }
    },
    avatarUrl: 'https://placehold.co/100x100.png',
    dataAiHint: 'shield security',
    registeredAt: new Date(2023, 10, 20).toISOString(), // Nov 20, 2023
    addr_ttl: 7200,
    addr_facts_url: "https://securedatacorp.com/.well-known/agent-facts-guardian.jsonld"
  },
  {
    id: 'did:nanda:agent-artcreator-003',
    name: 'PixelDreamer',
    ansName: 'mcp://PixelDreamer.ImageGeneration.ArtifyInc.v3.beta',
    capability: 'Image Generation',
    capabilities: ['Image Generation from Text', 'Style Transfer', 'Image Upscaling'],
    provider: 'ArtifyInc',
    version: '3.0',
    extension: 'beta',
    description: 'A creative AI agent that generates stunning and unique images from textual descriptions. Explore various artistic styles and resolutions.',
    endpoints: {
      "@type": "nanda:EndpointSet",
      static_endpoint: ["https://api.artifyinc.com/imagegen/v3"],
      adaptive_router_url: "https://router.artifyinc.com/imagegen"
    },
    attestations: [],
    protocolExtensions: {
      "@type": "ans:ProtocolExtensionSet",
      mcp: { "@type": "MCPToolDescription", name: "PixelDreamer MCP", details: { outputResolutions: ["512x512", "1024x1024", "2048x2048"] } }
    },
    avatarUrl: 'https://placehold.co/100x100.png',
    dataAiHint: 'abstract art',
    registeredAt: new Date(2024, 2, 1).toISOString(), // Mar 1, 2024
    addr_ttl: 1800,
    addr_facts_url: "https://artifyinc.com/.well-known/agent-facts-pixel.jsonld"
  },
  {
    id: 'did:nanda:agent-codehelper-004',
    name: 'DevMentor',
    ansName: 'a2a://DevMentor.CodeGeneration.CodeGenius.v1.5',
    capability: 'Code Generation',
    capabilities: ['Code Generation', 'Debugging Assistance', 'API Documentation Lookup'],
    provider: 'CodeGenius',
    version: '1.5',
    description: 'An AI assistant for developers, providing code snippets, debugging help, and quick access to API documentation. Supports Python, JavaScript, and Java.',
    endpoints: {
      "@type": "nanda:EndpointSet",
      static_endpoint: ["https://api.codegenius.com/devmentor/v1.5"]
    },
    attestations: ["did:nanda:attestation-codegenius-opensource-contrib-v1"],
    protocolExtensions: {
      "@type": "ans:ProtocolExtensionSet",
      a2a: { "@type": "A2AAgentCard", name: "DevMentor A2A", details: { supportedLanguages: ["Python", "JavaScript", "Java"] } }
    },
    avatarUrl: 'https://placehold.co/100x100.png',
    dataAiHint: 'code computer',
    registeredAt: new Date(2024, 1, 10).toISOString(), // Feb 10, 2024
    addr_ttl: 3600,
    addr_facts_url: "https://codegenius.com/.well-known/agent-facts-devmentor.jsonld"
  },
];


export const getAgentById = async (id: string): Promise<Agent | undefined> => {
  try {
    const agentDocRef = doc(db, "agents", id);
    const agentSnap = await getDoc(agentDocRef);

    if (agentSnap.exists()) {
      return { id: agentSnap.id, ...agentSnap.data() } as Agent;
    } else {
      console.warn(`Agent with ID ${id} not found in Firestore.`);
      // Fallback to mock data if needed, or just return undefined
      // return mockAgents.find(agent => agent.id === id);
      return undefined;
    }
  } catch (error) {
    console.error("Error fetching agent by ID from Firestore:", error);
    // Fallback or rethrow
    // return mockAgents.find(agent => agent.id === id);
    return undefined;
  }
};

export const getAllAgents = async (): Promise<Agent[]> => {
  try {
    const agentsCollectionRef = collection(db, "agents");
    const agentSnapshot = await getDocs(agentsCollectionRef);
    const agentsList = agentSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Agent));
    
    // If Firestore is empty, you could populate it with mock data once, or return mock data as a fallback.
    // For now, if it's empty, it returns an empty list.
    if (agentsList.length === 0) {
        console.log("No agents found in Firestore. Consider seeding with mock data if this is unexpected.");
        // Example: return mockAgents; // to show mock data if db is empty
    }
    return agentsList;
  } catch (error) {
    console.error("Error fetching all agents from Firestore:", error);
    // Fallback to mock data in case of error, or return empty list
    // return mockAgents; 
    return [];
  }
};
