import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface Page { 'id' : bigint, 'title' : string, 'content' : string }
export interface _SERVICE {
  'createPage' : ActorMethod<[string], bigint>,
  'deletePage' : ActorMethod<[bigint], boolean>,
  'getPage' : ActorMethod<[bigint], [] | [Page]>,
  'getPages' : ActorMethod<[], Array<Page>>,
  'updatePage' : ActorMethod<[bigint, string, string], boolean>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
