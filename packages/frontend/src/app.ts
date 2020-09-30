import {fromEvent} from "rxjs";
import {filter, map, switchMap, tap} from "rxjs/operators";
import { chatService } from './index'

/// helpers
const value = (id, value = undefined) => {
    // @ts-ignore
    const ret = document.getElementById(id).value || '';
    if(value !== undefined){
        // @ts-ignore
        document.getElementById(id).value = value;
    }
    return ret;
}
/// events
const create$ = fromEvent(document.getElementById('create'), 'click');
const ch$ = fromEvent(document.getElementById('channel-list'), 'change');
const msg$ = fromEvent(document.getElementById('message'), 'keypress').pipe(
    filter( e => e.code === "Enter" )
);

/// epics
create$
    .pipe(
        map(()=>value('new', '')),
        tap( (v) => v && chatService.createChannel({topic: v}) )
    )
    .subscribe();

ch$
    .pipe(
        tap(() => value('chat', '')),
        switchMap(() => chatService.messages$({ch: value('channel-list')})),
        tap(msg => value('chat', value('chat') + '\n' + msg.message))
    )
    .subscribe();

msg$
    .pipe(
        map(() => ({ch: value('channel-list'), msg: value('message', '')})),
        filter( i => i.ch && i.msg ),
        tap(i => chatService.message(i))
    )
    .subscribe();

chatService
    .channels$({})
    .subscribe(
        ch => document
            .getElementById('channel-list')
            .insertAdjacentHTML('beforeend', `<option value="${ch.id}">${ch.topic}</option>`)
    )