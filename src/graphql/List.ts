import { objectType } from "nexus";

export const List = objectType({
    name: "List",
    definition(t) {
        t.nonNull.int("id");
        t.nonNull.string("url");
        t.nonNull.string("description");
    },
})