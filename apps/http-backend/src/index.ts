
import express from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/config"
import { CreateRoomSchema, CreateUserSchema, SigninSchema } from "@repo/common/types"
import { middleware } from "./middleware";
import bcrypt from "bcrypt";
import { prismaClient } from "@repo/db/client";

const app = express();
app.use(express.json())

app.post("/signup", async (req, res) => {

    const parsedData = CreateUserSchema.safeParse(req.body);

    if (!parsedData.success) {
        console.log(parsedData.error)
        res.json({
            message: "Incorrect inputs"
        })
        return;
    };

    try {
        const hashedPassword = await bcrypt.hash(parsedData.data.password, 10);
        const user = await prismaClient.user.create({
            data: {
                email: parsedData.data?.username,
                password: hashedPassword,
                name: parsedData.data.name
            }
        });
        res.json({
            userId: user.id
        })
    } catch (e) {
        res.status(411).json({
            message: "User Already exists with this username"
        })
    }

    res.json({
        userId: "123"
    })
})

app.post("/signin", (req, res) => {

    const data = SigninSchema.safeParse(req.body);
    if (!data.success) {
        res.json({
            message: "Incorrect inputs"
        })
        return;
    }

    const userId = 1;
    const token = jwt.sign({
        userId
    }, JWT_SECRET);

    res.json({
        token
    })
})

app.post("/room", middleware, (req, res) => {

    const data = CreateRoomSchema.safeParse(req.body);
    if (!data.success) {
        res.json({
            message: "Incorrect inputs"
        })
        return;
    }

    res.json({
        roomId: 123
    })
})

app.listen(3001)