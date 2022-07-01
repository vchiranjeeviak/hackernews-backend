import { Prisma } from "@prisma/client";
import { arg, enumType, extendType, inputObjectType, list, nonNull, objectType, stringArg } from "nexus";

export const LinkOrderByInput = inputObjectType({
    name: "LinkOrderByInput",
    definition(t) {
        t.field("description", { type: Sort }),
        t.field("url", { type: Sort })
    },
})

export const Sort = enumType({
    name: "Sort",
    members: ["asc", "desc"]
})

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
            args: {
                filter: stringArg(),
                orderBy: arg({ type: list(nonNull(LinkOrderByInput))})
            },
            resolve(parent, args, context, info) {
                const where = args.filter ? {
                    OR: [
                        { description: { contains: args.filter}},
                        { url: { contains: args.filter}}
                    ],
                } : {}; 
                return context.prisma.link.findMany({
                    where,
                    orderBy: args?.orderBy as Prisma.Enumerable<Prisma.LinkOrderByWithRelationInput> | undefined
                });
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