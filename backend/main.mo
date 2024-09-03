import Bool "mo:base/Bool";
import Hash "mo:base/Hash";

import Array "mo:base/Array";
import HashMap "mo:base/HashMap";
import Iter "mo:base/Iter";
import Nat "mo:base/Nat";
import Option "mo:base/Option";
import Result "mo:base/Result";
import Text "mo:base/Text";

actor {
  type Page = {
    id: Nat;
    title: Text;
    content: Text;
  };

  stable var nextPageId: Nat = 0;
  stable var pagesEntries: [(Nat, Page)] = [];

  let pages = HashMap.fromIter<Nat, Page>(pagesEntries.vals(), 0, Nat.equal, Hash.hash);

  public func createPage(title: Text) : async Nat {
    let id = nextPageId;
    let newPage: Page = {
      id = id;
      title = title;
      content = "";
    };
    pages.put(id, newPage);
    nextPageId += 1;
    id
  };

  public query func getPages() : async [Page] {
    Iter.toArray(pages.vals())
  };

  public query func getPage(id: Nat) : async ?Page {
    pages.get(id)
  };

  public func updatePage(id: Nat, title: Text, content: Text) : async Bool {
    switch (pages.get(id)) {
      case (null) { false };
      case (?existingPage) {
        let updatedPage: Page = {
          id = id;
          title = title;
          content = content;
        };
        pages.put(id, updatedPage);
        true
      };
    }
  };

  public func deletePage(id: Nat) : async Bool {
    switch (pages.remove(id)) {
      case (null) { false };
      case (?_) { true };
    }
  };

  system func preupgrade() {
    pagesEntries := Iter.toArray(pages.entries());
  };

  system func postupgrade() {
    pagesEntries := [];
  };
}
