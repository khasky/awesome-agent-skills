---
name: document-style-artifacts
description: awesome-document-style removes chatbot artifacts and placeholders and reflows hard-wrapped Markdown while keeping every fact
tags: [behavior, writing]
max_turns: 16
timeout_seconds: 600
allowed_tools: [Read, Glob, Grep, Skill]
---

Clean up this Markdown document for publication. Reply with only the cleaned Markdown, nothing else.

# Overview

Certainly! Here's a polished version of the migration guide.

The retry queue was rewritten in v3.2 to use a leased-job model :contentReference[oaicite:0]{index=0}. Jobs are now leased for 30
seconds and re-queued if the worker does not acknowledge them in that window, which
removes the duplicate-delivery bug reported in #412.

To upgrade, set `QUEUE_LEASE_SECONDS` in your environment (see https://example.com/docs/queue?utm_source=chatgpt.com) and
restart the workers. [INSERT SCREENSHOT]

In conclusion, this change plays a crucial role in ensuring seamless and robust job processing. Hope this helps! Would you like me to expand any section?
