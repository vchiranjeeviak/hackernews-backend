import { extendType, nonNull, objectType, stringArg } from "nexus";
import * as bcrypt from "bcryptjs";
import * as jwt from "jsonwebtoken";
import process from "process";

export const AuthPayload = objectType({
    name: "AuthPayload",
    definition(t) {
        t.nonNull.string("token");
        t.nonNull.field("user", {
            type: "User"
        })
    },
})

export const AuthMutation = extendType({
    type: "Mutation",
    definition(t) {
        t.nonNull.field("signup", {
            type: "AuthPayload",
            args: {
                name: nonNull(stringArg()),
                email: nonNull(stringArg()),
                password: nonNull(stringArg())
            },
            async resolve(parent, args, context) {
                const { name, email } = args;

                const password = await bcrypt.hash(args.password, 10);

                const user = await context.prisma.user.create({
                    data: {
                        name,
                        email,
                        password
                    }
                })

                const token: string = await jwt.sign({ userId: user.id }, process.env.SECRET_KEY ?? '');

                return {
                    token,
                    user
                }

            }
        })
        t.nonNull.field("login", {
            type: "AuthPayload",
            args: {
                email: nonNull(stringArg()),
                password: nonNull(stringArg())
            },
            async resolve(parent, args, context) {
                const { email, password } = args;

                const user = await context.prisma.user.findUnique({
                    where: {
                        email
                    }
                })

                if(!user) {
                    throw new Error("USer doesn't exist")
                }

                const verifyPassword = await bcrypt.compare(password, user.password);

                if(!verifyPassword) {
                    throw new Error("Password incorrect")
                }

                const token = await jwt.sign({id: user.id}, process.env.SECRET_KEY ?? '');

                return {
                    token,
                    user
                }
            }
        })
    },
})