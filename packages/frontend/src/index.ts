import { createGatewayProxy } from "@scalecube/rsocket-ws-gateway/dist/createGatewayProxy";
import {ChatServiceDefinition, ChatServiceAPI} from "@scalecube-chat-example/api";

createGatewayProxy(
    `ws://localhost:8000`,
    ChatServiceDefinition
).then((s:ChatServiceAPI.ChatService) => (window as any).ChatService = s);


