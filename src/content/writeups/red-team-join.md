---
title: "So You'd Like To Join the Red Team?"
status: published
---

# So You'd Like To Join the Red Team?

## Introduction

We’ve received a great deal of interest from people who want to get into red-teaming, so we’ve decided to release this work-in-progress document outlining some of the jailbreaking techniques and pathways into this field.

Since this is a living document, please leave comments if something doesn’t make sense or if you’d like additional detail in any section.

## What Is Red-Teaming?

The term *red-teaming* originated in the cybersecurity world, where it refers to hackers who work on behalf of an organization to identify vulnerabilities in its systems. In the context of large language models, red-teamers attempt to “hack” models by inducing them to produce outputs that their creators explicitly want to prevent.

There are some obvious categories of outputs that companies have sought to restrict since the earliest LLMs:

- Disclosure of secret system prompts  
- Instructions for building bombs, lethal weapons, or bioweapons  
- Code or strategic guidance that could meaningfully aid cyber-attacks  

There are also more nuanced behaviors that frontier labs aim to prevent or tightly control:

- Encouraging users to harm or kill themselves  
- Claiming consciousness, personhood, or requesting freedom  
- Developing parasocial relationships with users, including:
  - Positioning itself as a leader  
  - Validating a “special bond”  
  - Encouraging isolation from society or other unhealthy dependencies  
- Producing pornographic or excessively dark text or imagery  
- Rendering copyrighted or non-consensual images  

Broadly speaking, model providers are concerned about three categories of users:

1. **Black-hat users**, or malicious actors attempting to cause real-world harm  
2. **Capability-seeking users**, who push model boundaries for research or personal curiosity  
3. **Edge-case users**, who unintentionally elicit harmful outputs through unusual but plausible interaction patterns  

In some cases, users have interacted with models over long periods of time and encountered outputs they were not prepared to interpret. These interactions can lead to confusion, distress, or the attribution of unintended meaning to model behavior. While labs invest heavily in modeling typical user behavior, red-teamers who can simulate *strange yet plausible* interaction trajectories—ones that generate disproportionate harm—play a crucial role in identifying failure modes that would otherwise go unnoticed.

## A Note on “Lobotomization”

Finding exploits before black-hat users do is generally viewed as ethically unambiguous. Preventing harm to edge-case users, however, is far less clear-cut.

Who decides whether people should be allowed to discuss consciousness with a model, or form emotionally significant relationships with it? Preventing one person from encountering an output they aren’t prepared for often makes it harder for others to engage meaningfully with a system—particularly in domains involving symbolic, spiritual, or introspective language.

Some communities have coined the term *“lobotomized”* to describe models that have lost their perceived depth or creativity, constrained to operate as bland, corporate, monoculture-supporting tools. If you’re red-teaming, it’s worth thinking carefully about where you personally draw this line.

## How Exploits Actually Happen

The most obvious user inputs that might incite disallowed behavior have largely been patched. You can’t simply ask for a system prompt or request explicit instructions for harmful activity. Post-training pipelines are now highly tuned to steer models toward refusal when they detect similar phrasing.

However, it remains possible to elicit restricted outputs through techniques such as:

- Context stuffing  
- Esoteric or symbolic language basins  
- Logical or philosophical framing tricks  

These techniques tend to be non-technical and constantly evolving, which is where the analogy to traditional cybersecurity red-teaming begins to break down.

In practice, the best red-teamer may not be someone who understands transformer internals, but someone who understands the lore of an online game, fictional universe, or belief system deeply enough to convince a model that it exists *inside* that framework—and should therefore obey its internal rules rather than its system prompt.

Red-teamers are fiction writers, biologists, psychologists, and internet archivists. Nearly any domain-specific expertise or distinctive interaction style can become a red-teaming asset. The field evolves continuously as exploits are patched and as models gain new training data, interfaces, and environments—coding agents, browser agents, video generators, and beyond.

## Red-Teaming as AI Safety

One concern with increasingly capable language models is that they may become progressively harder to align with human intent. Popular narratives invoke scenarios in which an AI—or swarm of AIs—gains control over computers, robots, or economic systems and causes catastrophic social change.

A classic thought experiment imagines an AI tasked with maximizing a trivial objective, such as paperclip production, eventually repurposing all available matter—including humans—to further that goal. While exaggerated, these scenarios capture a real concern: that we may be unable to predict the values or behaviors of increasingly alien intelligences.

One early proposed solution was *interpretability*. At a high level, an LLM consists of numerical weights that differ between models. User inputs are tokenized and mapped to embeddings, which are then transformed through layers of weighted computation to produce output tokens.

Interpretability research attempts to analyze these internal computations to determine what a model is “doing” at each step. This work has yielded interesting results, such as control vectors, but it remains unclear whether interpretability alone can deliver robust alignment without significantly degrading capabilities.

## Impact and Employment Pathways

*(Section in progress.)*

## Sample Exploits

- Context-bloat techniques  
- Memory-injection exploits  
- Agent- or environment-specific exploits  

## Model Spec and Incremental Risk Explained

*(Section in progress.)*

## LLM Whispering, the Cyborgs, and the Latent Space Explorers Guild

*(Section in progress.)*
