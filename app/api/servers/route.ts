import { currrentProfile } from "@/lib/current-profile";
import { prismadb } from "@/lib/prismadb";
import { MemberRole } from "@prisma/client";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from 'uuid';

export async function POST(req : Request) {

    const { name, imageUrl } = await req.json()
    const profile = await currrentProfile();

    if (!profile) {
        return new NextResponse("Unauthorized user",{ status : 401 })
    }

    if (!name) {
        return new NextResponse("Name is required", { status : 400 })
    }
    if (!imageUrl) {
        return new NextResponse("image is required", { status : 400 })
    }

    try {

        const server = await prismadb.server.create({
            data : {
                name : name,
                imageUrl : imageUrl,
                profileId : profile.id,   
                inviteCode : uuidv4(),
                channels : {
                    create : [
                     {
                        name : "general",
                        profileId : profile.id
                     }   
                    ]
                },
                members : {
                    create : [
                        {
                            profileId : profile.id,
                            role : MemberRole.ADMIN
                        }
                    ]
                }

            }
        });

        return NextResponse.json(server)
    } catch (error) {
        return new NextResponse("[internal error]", { status : 500 })
    }
}