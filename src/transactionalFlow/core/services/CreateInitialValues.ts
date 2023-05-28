import { stage1TopicName } from "../../constants.js";
import { CreateInitialValuesPort } from "../ports/in/CreateInitialValuesPort.js";
import { StreamingPublisherPort } from "../ports/out/StreamingPublisherPort.js";
import { Stage1Event } from "./events.js";

export class CreateInitialValues implements CreateInitialValuesPort {
  constructor(private readonly _streamingPublisher: StreamingPublisherPort) {}

  async handle() {
    const events: Stage1Event[] = [
      { id: "2f3163f3-afe1-447b-a2b7-1796e65639c6", value: 2.8 },
      { id: "e567e8df-a144-49b8-915d-e521301ca2a7", value: -4.38 },
      { id: "50bf597a-a629-431a-af01-5e9b448d8db9", value: 5.03 },
      { id: "b0e0b2a3-0b0a-4b0e-8b0a-3b0a0b0a0b0a", value: 1.2 },
      { id: "ba8b3e7f-4f5e-442c-9068-df137f2717e2", value: 37.2 },
      { id: "7c94b2b2-db8b-4c86-a205-d7b978c70181", value: -17.8 },
      { id: "d914c1bc-d52b-4030-8f73-f6784253e491", value: 21.5 },
      { id: "e84c04a0-033b-4527-9f81-7b68d9bb04fb", value: 0.5 },
      { id: "4717fe57-6962-444b-8dad-a7e36291d53c", value: 10.71 },
      { id: "8fc7cf33-d7b5-4f4a-a08e-4c4b2942e72a", value: -5.34 },
    ];
    for (const event of events) {
      await this._streamingPublisher.publish(stage1TopicName, event);
    }
    await this._streamingPublisher.disconnect();
  }
}
