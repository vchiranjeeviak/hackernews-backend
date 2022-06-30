import { extendType, objectType } from "nexus";

export const Link = objectType({
    name: "Link",
    definition(t) {
        t.nonNull.int("id");
        t.nonNull.string("url");
        t.nonNull.string("description");
    },
})

export const LinkQuery = extendType({
    type: "Query",
    definition(t) {
        t.nonNull.list.nonNull.field("feed", {
            type: "Link",
            async resolve(parent, args, context, info) {
                return await context.prisma.link.findMany();
            }
        })
    },
})