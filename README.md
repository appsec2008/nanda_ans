# AgentVerse Registry - NANDA+ANS

This is a NextJS starter in Firebase Studio for the AgentVerse Registry, a federated registry for secure, capability-aware AI agent discovery. It is built upon the NANDA+ANS Security Blueprint, which establishes a tamper-evident, dual-trust foundation supporting both CA-signed and DID-based identities.

A cornerstone of this architecture is a decoupled, two-hop lookup model:
1.  **Anchor Tier (NANDA+ANS Core Registry):** Provides lightweight, signed pointers (AgentAddr).
2.  **Metadata Distribution Tier:** Hosts detailed, cryptographically verifiable AgentFacts.

This separation significantly enhances security by minimizing the core registry's attack surface and enables dynamic, richly attested metadata to be managed at the edge, improving both privacy and resilience. The solution emphasizes cryptographic assurance for agent capabilities using verifiable credentials and supports privacy-preserving discovery techniques.

To get started, explore the agent discovery on the main page or look at `src/app/page.tsx`.
