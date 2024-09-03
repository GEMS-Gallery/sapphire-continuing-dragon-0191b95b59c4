export const idlFactory = ({ IDL }) => {
  const Page = IDL.Record({
    'id' : IDL.Nat,
    'title' : IDL.Text,
    'content' : IDL.Text,
  });
  return IDL.Service({
    'createPage' : IDL.Func([IDL.Text], [IDL.Nat], []),
    'deletePage' : IDL.Func([IDL.Nat], [IDL.Bool], []),
    'getPage' : IDL.Func([IDL.Nat], [IDL.Opt(Page)], ['query']),
    'getPages' : IDL.Func([], [IDL.Vec(Page)], ['query']),
    'updatePage' : IDL.Func([IDL.Nat, IDL.Text, IDL.Text], [IDL.Bool], []),
  });
};
export const init = ({ IDL }) => { return []; };
