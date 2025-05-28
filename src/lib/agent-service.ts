
// src/lib/agent-service.ts
import type { Agent } from '@/lib/types';
import { db } from '@/lib/firebase';
import { collection, getDocs, doc, getDoc, writeBatch } from 'firebase/firestore';

// The mockAgents array can be kept for fallback or initial seeding.
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
  {
    id: 'did:nanda:agent-dbquery-005',
    name: 'DataOracle',
    ansName: 'acp://DataOracle.DatabaseQuery.QueryWorks.v1.2.trusted',
    capability: 'Database Query',
    capabilities: ['SQL Query Execution', 'NoSQL Data Retrieval', 'Data Aggregation'],
    provider: 'QueryWorks Inc.',
    version: '1.2',
    extension: 'trusted',
    description: 'A powerful AI agent for securely querying various types of databases and retrieving structured data. Supports natural language queries and returns results in multiple formats.',
    endpoints: {
      "@type": "nanda:EndpointSet",
      static_endpoint: ["https://api.queryworks.com/query/v1.2"],
      adaptive_router_url: "https://router.queryworks.com/query"
    },
    attestations: ["did:nanda:attestation-queryworks-pci-dss-v1"],
    protocolExtensions: {
      "@type": "ans:ProtocolExtensionSet",
      acp: { "@type": "ACPProfile", name: "DataOracle ACP", details: { supportedDatabases: ["PostgreSQL", "MongoDB", "MySQL"] } }
    },
    avatarUrl: 'https://placehold.co/100x100.png',
    dataAiHint: 'database tech',
    registeredAt: new Date(2023, 8, 5).toISOString(), // Sep 5, 2023
    addr_ttl: 3000,
    addr_facts_url: "https://queryworks.com/.well-known/agent-facts-dataoracle.jsonld"
  }
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
  const FETCH_TIMEOUT = 10000; // 10 seconds

  const timeoutPromise = new Promise<never>((_, reject) =>
    setTimeout(() => reject(new Error('Firestore fetch timed out')), FETCH_TIMEOUT)
  );

  const firestoreFetchOperation = async (): Promise<Agent[]> => {
    const agentsCollectionRef = collection(db, "agents");
    const agentSnapshot = await getDocs(agentsCollectionRef);
    let agentsList = agentSnapshot.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() } as Agent));
    
    if (agentsList.length === 0 && mockAgents.length > 0) {
        console.log("No agents found in Firestore. Seeding database with mock data...");
        try {
            const batch = writeBatch(db);
            mockAgents.forEach(agent => {
                const agentRef = doc(db, "agents", agent.id);
                // Ensure all fields are defined, especially registeredAt which might be generated
                const agentData = { ...agent, registeredAt: agent.registeredAt || new Date().toISOString() };
                batch.set(agentRef, agentData);
            });
            await batch.commit();
            console.log("Mock data seeded successfully to Firestore.");
            // Re-fetch after seeding to ensure we return the live data
            const freshSnapshot = await getDocs(agentsCollectionRef);
            agentsList = freshSnapshot.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() } as Agent));
            return agentsList; // Return the freshly seeded and fetched data
        } catch (seedError) {
            console.error("Error seeding mock data to Firestore:", seedError);
            // If seeding fails, return the mockAgents array as a fallback for the UI to display something
            console.log("Falling back to returning local mock agents due to seeding error.");
            return mockAgents; 
        }
    }
    return agentsList;
  };

  try {
    // Race the fetch operation (which includes initial fetch and potential seeding) against the timeout
    const result = await Promise.race([firestoreFetchOperation(), timeoutPromise]);
    return result;
  } catch (error: any) {
    if (error && error.message === 'Firestore fetch timed out') {
      console.warn(`Firestore operation timed out after ${FETCH_TIMEOUT / 1000} seconds. Falling back to mock agents.`);
    } else {
      console.error("Error during Firestore operation or timeout:", error);
      console.log("Falling back to returning local mock agents due to an unexpected error or timeout.");
    }
    return mockAgents; 
  }
};
