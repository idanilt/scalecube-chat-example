import { createGatewayProxy } from "@scalecube/rsocket-ws-gateway/dist/createGatewayProxy";
import {ChatServiceDefinition, ChatServiceAPI} from "@scalecube-chat-example/api";
import {from} from "rxjs";
import {switchMap} from "rxjs/operators";

export const chatServicePromise = createGatewayProxy(
    `ws://localhost:8000`,
    ChatServiceDefinition
).then((s:ChatServiceAPI.ChatService) => (window as any).ChatService = s);

export const chatService = new Proxy(chatServicePromise, {
   get(target: Promise<ChatServiceAPI.ChatService>, p: string): any {
       if( !ChatServiceDefinition.methods[p] ) {
           return;
       }
       switch (ChatServiceDefinition.methods[p].asyncModel) {
           case "requestResponse":
               return (...args) => new Promise((res, rej)=>{
                   target
                       .then( o => o[p](...args).then(res).catch(rej) )
                       .catch(rej);
               });
           case "requestStream":
               return (...args) => from(target).pipe(
                   switchMap(svc => svc[p](...args))
               )
       }
   }
});
