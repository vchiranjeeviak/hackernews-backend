import { objectType } from "nexus";

export const Link = objectType({
    name: "Link",
    definition(t) {
        t.nonNull.int("id");
        t.nonNull.string("url");
        t.nonNull.string("description");
    },
})