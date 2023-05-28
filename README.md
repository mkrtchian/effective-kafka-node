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

### 1 - Produce and consume messages

A very simple exemple of producer and consumer.

The code is in `src/simpleFlow`.

```bash
yarn start:simple:publisher
```

```bash
yarn start:simple:consumer
```

### 2 - Serialized and deserialize

This example serializes the messages in JSON format, parsed with Zod. It is organized in hexagonal architecture, with the core part being unit tested.

The code is in `src/serializedFlow`.

```bash
yarn start:serialized:publisher
```

```bash
yarn start:serialized:consumer
```

### 3 - Use transactions

This example uses a Kafka transaction to ensure the publication of a message is done _exactly-once_.

The code is in `src/transactionalFlow`.

The first stage consumes messages from the input topic, computes the square of a value, and publishes them to the output topic.

With idempotence activated on the publisher, and retries activated on the consumer and on the publisher, the only way the messages could be published twice is if the client process crashes. And specifically crashes after the a message is published and before having commited the offset as a consumer.

#### 1. Create events for stage 1

This use case just creates 10 events in stage 1 topic, to trigger the next job that will use the transaction.

```bash
yarn start:transactional:publish-to-stage1
```

#### 2. Consume from stage 1 topic, publish transactionnally to stage 2 topic

This use case consumes from stage 1 topic, computes the square of the value, and publishes to stage 2 topic.

**The transaction has not been added yet**
