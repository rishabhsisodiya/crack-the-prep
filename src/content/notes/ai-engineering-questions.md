---
title: "AI Engineering Interview Questions"
track: "ai-engineering"
kind: "questions"
order: 1
slug: "questions"
description: "AI engineering interview questions — short answers with deep-dive links."
updated: 2026-09-29
---

Thirty questions covering the whole AI engineering track. Each has a short bolded answer you can say out loud, plus a deep-dive link for the full chapter. If you can answer all of these without notes, you are interview-ready.

**Sections:** Python for AI · LLM basics · Prompting · RAG · Agents · Memory · Voice and MCP · Production

### What is the GIL and when does it matter?

**Short answer:** The Global Interpreter Lock lets only one thread execute Python bytecode at a time. It matters for **CPU-bound** threads — they do not speed up with `threading`. It does not matter for **I/O-bound** work, because threads release the GIL while waiting — which is why threaded API calls and `asyncio` are fine, and CPU-heavy work needs `multiprocessing`.

**[Deep dive → Advanced Python](/ai-engineering/python/)**

### Threads vs asyncio — when do you use which?

**Short answer:** Use `threading` for I/O-bound work when you must integrate blocking libraries; use `asyncio` for high-concurrency I/O (thousands of connections, fan-out LLM calls) because coroutines are far cheaper than threads. Use `multiprocessing` for CPU-bound work. The rule: I/O-bound → asyncio, CPU-bound → processes.

```python
import asyncio

async def call_llm(prompt: str) -> str:
    await asyncio.sleep(0.1)  # stands in for an API call
    return f"answer to: {prompt}"

async def main():
    prompts = [f"question {i}" for i in range(100)]
    return await asyncio.gather(*(call_llm(p) for p in prompts))

asyncio.run(main())
```

**[Deep dive → Advanced Python](/ai-engineering/python/)**

### field_validator vs model_validator in Pydantic?

**Short answer:** `field_validator` validates a single field (use `mode="before"` or `"after"`); `model_validator` validates the whole model — reach for it when the rule spans fields, like "end_date must be after start_date".

```python
from pydantic import BaseModel, model_validator

class Booking(BaseModel):
    start: str
    end: str

    @model_validator(mode="after")
    def check_dates(self):
        if self.end <= self.start:
            raise ValueError("end must be after start")
        return self
```

**[Deep dive → Advanced Python](/ai-engineering/python/)**

### Why is Pydantic the standard for LLM structured outputs?

**Short answer:** LLMs return text; Pydantic turns it into validated, typed Python objects. Define a `BaseModel`, pass its JSON schema to the model (or parse the response through it), and you get parsing plus validation plus clear errors in one step — no regex on JSON in production.

**[Deep dive → Advanced Python](/ai-engineering/python/)**

### What is tokenization and why should you care?

**Short answer:** Tokenization splits text into tokens — the subword units the model actually processes. You care because context windows, API pricing, and latency are all measured in **tokens, not characters** — and a tokenizer mismatch between training and inference is a classic fine-tuning bug.

**[Deep dive → LLM Foundations](/ai-engineering/llm-foundations/)**

### What does self-attention do, in one paragraph?

**Short answer:** Self-attention lets every token weigh every other token's relevance when building its own representation, so "bank" in "river bank" gets a different vector than in "bank account". Multi-head attention runs several such weighting schemes in parallel to capture different relationships — syntax, coreference, and so on.

**[Deep dive → LLM Foundations](/ai-engineering/llm-foundations/)**

### What does temperature control?

**Short answer:** Temperature controls randomness in sampling: near 0 means deterministic, most-likely token — use it for extraction, classification, and structured output. Higher values (0.7–1.0) mean more diverse and creative output — use it for brainstorming and writing. It changes how the model samples, not what it knows.

**[Deep dive → LLM Foundations](/ai-engineering/llm-foundations/)**

### Embeddings vs tokens — what is the difference?

**Short answer:** Tokens are the discrete input units (chunks of text); embeddings are dense vectors representing meaning, where similar meanings sit close together. Retrieval works by comparing the query embedding to document embeddings with cosine similarity — that is the entire basis of vector search.

**[Deep dive → LLM Foundations](/ai-engineering/llm-foundations/)**

### Few-shot vs chain-of-thought — when do you use each?

**Short answer:** Few-shot (examples in the prompt) teaches **format and style**; chain-of-thought ("think step by step") unlocks **reasoning** on math and logic problems. Combine them — few-shot CoT examples — for hard reasoning tasks. Cost note: CoT burns output tokens, so use it only where reasoning actually matters.

**[Deep dive → Prompting](/ai-engineering/prompting/)**

### How do you get reliable JSON out of an LLM?

**Short answer:** Three layers: (1) use the API's structured-output or JSON mode with a schema, (2) validate with Pydantic and retry on failure, (3) keep the schema small — models degrade on huge nested schemas. Caveat: JSON mode guarantees valid JSON, not schema compliance — the model can still return the wrong fields, which is why layer 2 is not optional. Never regex-parse free text in production.

**[Deep dive → Prompting](/ai-engineering/prompting/)**

### What goes in the system message vs the user message?

**Short answer:** The system message holds the persistent role, rules, and output format ("You are a support agent. Answer in JSON."). The user message holds the task instance. Rule of thumb: anything that should not change across turns goes in system; the actual request goes in user. Security note: the system message is not secret — prompt injection targets it — so never put credentials or private instructions there without a guardrail in front.

**[Deep dive → Prompting](/ai-engineering/prompting/)**

### How do you choose chunk size and overlap?

**Short answer:** Chunk size trades context completeness against noise and cost: 500–1000 tokens with 10–20% overlap is the starting point. Small chunks give precision but fragment ideas; large chunks give context but dilute retrieval. Tune with evals (RAGAS context precision), not vibes — and chunk on semantic boundaries like sections, not mid-sentence.

**[Deep dive → RAG](/ai-engineering/rag/)**

### What is top-k and how do you tune it?

**Short answer:** Top-k is how many chunks you retrieve per query. Too low and you miss context (low recall); too high and you add noise and token cost. Start at 3–5 and tune against evals. With reranking in the pipeline, you can retrieve k=20 and rerank down to 5.

**[Deep dive → RAG](/ai-engineering/rag/)**

### What is hybrid search?

**Short answer:** Hybrid search combines dense vector search (semantic similarity) with sparse keyword search (BM25) and fuses the rankings, for example with reciprocal rank fusion. It fixes the classic dense-retrieval failure: exact terms like product codes or names that embeddings gloss over.

**[Deep dive → RAG](/ai-engineering/rag/)**

### Your RAG gives wrong answers — retriever or generator? How do you tell?

**Short answer:** Inspect the retrieved chunks first — always. If the chunks lack the answer, it is a **retriever** problem: fix chunking, embeddings, top-k, or add hybrid search. If the chunks contain the answer but the response is wrong, it is a **generator** problem: fix the prompt, add "answer only from context", or lower the temperature. RAGAS metrics make this split quantitative.

**[Deep dive → RAG](/ai-engineering/rag/)**

### What is reranking and where does it sit?

**Short answer:** Reranking is a second, more expensive relevance pass: retrieve top-k=20 cheaply with embeddings, then a cross-encoder model re-scores them and you keep the top 5 for the prompt. It sits between retrieval and generation and is the cheapest big win for RAG quality.

**[Deep dive → RAG](/ai-engineering/rag/)**

### Describe the ReAct loop.

**Short answer:** ReAct is Reason plus Act: the agent loops Thought → Action (tool call) → Observation (tool result) → Thought, until it can answer. Each "thought" is the LLM generating its next step given the full history so far, including what previous tool calls returned. The loop ends when the model decides it has enough to answer, or when you cap the iterations — always cap them, because an agent with no stop condition is an infinite billing loop. LangChain and LangGraph implement this loop for you.

**[Deep dive → Agents](/ai-engineering/agents/)**

### When should you NOT build an agent?

**Short answer:** When the workflow is deterministic — use code. Agents are for when the path cannot be enumerated upfront: open-ended research, variable tool sequences. Anthropic's rule stands: start with the simplest thing that works (prompt chains, routing), and escalate to agents only when needed. Agents cost more, fail more, and are harder to eval.

**[Deep dive → Agents](/ai-engineering/agents/)**

### In LangGraph, what are state, nodes, and edges?

**Short answer:** **State** is the shared data object passed through the graph — use reducers like `operator.add` for message lists so steps append instead of overwrite. **Nodes** are the steps (functions or agents). **Edges** connect them, and **conditional edges** route dynamically based on state — that is how you build loops and branching agent workflows.

**[Deep dive → Agents](/ai-engineering/agents/)**

### What is checkpointing in LangGraph and why does it matter?

**Short answer:** Checkpointing persists graph state after every step (for example to MongoDB via `MongoDBSaver`), keyed by thread_id. It gives you resumability, human-in-the-loop pauses, time-travel debugging, and crash recovery — the difference between a demo agent and one that survives real use.

**[Deep dive → Agents](/ai-engineering/agents/)**

### Name the types of agent memory and what each stores.

**Short answer:** **Short-term (working)** holds the current conversation inside the context window. **Long-term** persists facts across sessions ("the user's name is Rishabh"). **Semantic** stores general knowledge ("the user prefers morning deploys"). **Episodic** stores specific past events ("last Tuesday's deploy failed on a migration"). **Procedural** stores how-to knowledge — skills and playbooks. In practice: LangGraph checkpointers or MongoDB for short-term, Mem0 or a vector store for the long-term types, and scope everything by user so tenants never mix.

**[Deep dive → Memory](/ai-engineering/memory/)**

### What does Mem0 do?

**Short answer:** Mem0 is a memory layer for agents: `add()` extracts and stores memories from conversations, `search()` retrieves the relevant ones, all scoped by user_id. It handles the extraction, dedup, and update lifecycle so you do not hand-roll "remember this" logic with raw vector-database calls.

**[Deep dive → Memory](/ai-engineering/memory/)**

### Graph memory vs vector memory — when do you use which?

**Short answer:** Vector memory is similarity search over text — "find conversations about refunds". Graph memory (Neo4j, Kuzu) is relationship queries with multi-hop traversal — "which customers bought X and complained about Y" — and it is explainable. Use vector for semantic recall, graph when relationships and explainability matter.

**[Deep dive → Memory](/ai-engineering/memory/)**

### Chained vs speech-to-speech voice agents — what are the trade-offs?

**Short answer:** Chained is STT → LLM → TTS: 2–4 second latency, but debuggable, with swappable components and reusable text evals. Speech-to-speech is one audio-in/audio-out model: roughly half-second latency, but harder to debug and eval. Default to chained; move to S2S only when sub-second latency is the product requirement.

**[Deep dive → Voice, Multimodal, MCP and Agent SDK](/ai-engineering/voice-multimodal/)**

### Explain MCP's host, client, and server split.

**Short answer:** The **host** is the AI application the user interacts with (Claude Desktop, your agent). The **client** is a protocol client living inside the host — one per server connection. The **server** exposes tools, resources, and prompts. The client discovers capabilities via `list_tools()` at runtime, so one server works with any host. Transports: stdio locally, Streamable HTTP remotely.

**[Deep dive → Voice, Multimodal, MCP and Agent SDK](/ai-engineering/voice-multimodal/)**

### What can an MCP server expose, and how do clients reach it?

**Short answer:** Three primitives: **tools** (callable functions), **resources** (readable data addressed by URIs), and **prompts** (reusable templates). Transports are **stdio** for local servers and **Streamable HTTP** for remote ones. Security note for interviews: tool descriptions are untrusted model input, so only connect servers you trust.

**[Deep dive → Voice, Multimodal, MCP and Agent SDK](/ai-engineering/voice-multimodal/)**

### What are the four RAGAS metrics and what does each diagnose?

**Short answer:** **Faithfulness** — is the answer grounded in the retrieved context? Diagnoses generator hallucination. **Answer relevancy** — does it answer the question? Diagnoses off-topic generation. **Context precision** — are retrieved chunks relevant and well ranked? Diagnoses retriever junk. **Context recall** — is all needed information retrieved? Diagnoses retriever gaps. The split tells you whether to fix retrieval or generation.

**[Deep dive → Production AI](/ai-engineering/production/)**

### What does Langfuse give you that print statements do not?

**Short answer:** Structured traces with a span per step (retrieval, embedding, generation), token and cost tracking per trace, user, and model, latency breakdowns, prompt versioning, and eval datasets — all queryable in a dashboard instead of grepped from logs. It is how you discover that "the LLM is slow" is actually "embedding is slow".

**[Deep dive → Production AI](/ai-engineering/production/)**

### Where do guardrails sit and what do they block?

**Short answer:** Guardrails sit in front of the model (**input rails**) and behind it (**output rails**). They block jailbreaks like "ignore previous instructions", redact PII, enforce topical boundaries, and validate output format. NeMo Guardrails implements them as Colang flows. They are defense in depth — pair them with evals that include adversarial cases.

**[Deep dive → Production AI](/ai-engineering/production/)**

### vLLM vs Ollama — when do you use which?

**Short answer:** Ollama is the dev-grade local runtime — CPU-friendly, great for development and evals. vLLM is the production inference engine — PagedAttention, continuous batching, and prefix caching on GPU, served through an OpenAI-compatible `vllm serve` endpoint. Develop on Ollama, serve on vLLM.

**[Deep dive → Production AI](/ai-engineering/production/)**
