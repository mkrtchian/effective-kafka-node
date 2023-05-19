# Effective Kafka Node

![Tests](https://github.com/mkrtchian/humble-object-pattern/workflows/Tests/badge.svg?branch=main)

This project implements examples from Effective Kafka book, but using **Node.js**.

It uses things from the [Effective Kafka Java repository](https://github.com/ekoutanov/effectivekafka).

## How to run

You need a Kafka instance running, which can be done with docker-compose:

```bash
cd docker-compose/single-broker
docker-compose up -d
```

Kafdrop will be available at `http://localhost:9000`.

Then, you can run the examples:

### 1 - Produce and consume messages:

A very simple exemple of producer and consumer.

The code is in `src/simpleFlow`.

```bash
yarn start:publisher-simple
```

```bash
yarn start:consumer-simple
```

### 2 - Produce and consume serialized messages:

This example serializes the messages in JSON format, parsed with Zod. It is organized in hexagonal architecture.

The code is in `src/serializedFlow`.

```bash
yarn start:publisher-serialized
```

```bash
yarn start:consumer-serialized
```
