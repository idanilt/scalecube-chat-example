import { createMicroservice } from "@scalecube/browser";
import { ChatService } from './ChatService';
import {ChatServiceDefinition} from "@scalecube-chat-example/api";


const ms = createMicroservice({
    seedAddress: ["seed"],
    debug: true,
    services:[
        {
            reference: new ChatService(),
            definition: ChatServiceDefinition
        }
    ]
});

export const chatService = ms.createProxy({
    serviceDefinition: ChatServiceDefinition
})
