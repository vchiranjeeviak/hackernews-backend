import { extendType, nonNull, objectType, stringArg } from "nexus";

export const Link = objectType({
    name: "Link",
    definition(t) {
        t.nonNull.int("id");
        t.nonNull.string("url");
        t.nonNull.string("description");
        t.field("postedBy", {
            type: "User",
            resolve(parent, args, context) {
                return context.prisma.link.findUnique({
                    where: {id: parent.id}
                }).postedBy();
            }
        });
    },
})

export const LinkQuery = extendType({
    type: "Query",
    definition(t) {
        t.nonNull.list.nonNull.field("feed", {
            type: "Link",
            resolve(parent, args, context, info) {
                return context.prisma.link.findMany();
            }
        })
    },
})

export const LinkMutation = extendType({
    type: "Mutation",
    definition(t) {
        t.nonNull.field("post", {
            type: "Link",
            args: {
                url: nonNull(stringArg()),
                description: nonNull(stringArg())
            },
            resolve(parent, args, context) {
                const { userId } = context;
                
                if(!userId) {
                    throw new Error("Login to post");
                }

                const newLink = context.prisma.link.create({
                    data: {
                        description: args.description,
                        url: args.url,
                        postedBy: { connect: { id: userId } }
                    }
                })

                return newLink
            }
        })
    },
})