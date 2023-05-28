import { stage1TopicName, stage2TopicName } from "../../constants.js";
import { ComputeSquareValuesPort } from "../ports/in/ComputeSquareValuesPort.js";
import {
  Stage1Message,
  StreamingConsumerPort,
} from "../ports/out/StreamingConsumerPort.js";
import { LoggerPort } from "../ports/out/LoggerPort.js";
import { StreamingPublisherPort } from "../ports/out/StreamingPublisherPort.js";
import { Stage1Event, Stage2Event, stage1EventSchema } from "./events.js";

export class ComputeSquareValues implements ComputeSquareValuesPort {
  constructor(
    private readonly _streamingConsumer: StreamingConsumerPort,
    private readonly _streamingPublisher: StreamingPublisherPort,
    private readonly _logger: LoggerPort
  ) {}

  async handle() {
    await this._initStreamingAdapters();
    await this._streamingConsumer.runConsumer(async (message: Stage1Message) =>
      this._handleMessage.bind(this)(message)
    );
    await this._cleanupStreamingAdapters();
  }

  private async _initStreamingAdapters() {
    await this._streamingConsumer.connect();
    await this._streamingConsumer.subscribe(stage1TopicName, {
      fromBeginning: true,
    });
  }

  private async _handleMessage(message: Stage1Message) {
    const stage1Event = this._parseMessage(message.value);
    this._logger.log("Recieved stage 1 event:", stage1Event);
    const stage2Event = this._computeStage2Event(stage1Event);
    const metadata = await this._publishToStage2(stage2Event);
    this._logger.log(
      "Published stage 2 event, with offset:",
      metadata[0].baseOffset
    );
  }

  private _parseMessage(value: Buffer | null) {
    const unparsedStage1Event: unknown = JSON.parse(value?.toString() ?? "");
    return stage1EventSchema.parse(unparsedStage1Event);
  }

  private _computeStage2Event(stage1Event: Stage1Event) {
    const stage2Event: Stage2Event = {
      id: stage1Event.id,
      squaredValue: stage1Event.value ** 2,
    };
    return stage2Event;
  }

  private async _publishToStage2(stage2Event: Stage2Event) {
    const metadata = await this._streamingPublisher.publish(
      stage2TopicName,
      stage2Event
    );
    return metadata;
  }

  private async _cleanupStreamingAdapters() {
    await this._streamingPublisher.disconnect();
  }
}
