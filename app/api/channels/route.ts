import { currrentProfile } from "@/lib/current-profile";
import { prismadb } from "@/lib/prismadb";
import { MemberRole } from "@prisma/client";
import { NextResponse } from "next/server";

export async function POST(
    req : Request
) {
    try {
        const { name, type } = await req.json();
        const profile = await currrentProfile();
        const { searchParams } = new URL(req.url);
        const serverId = searchParams.get("serverId");
        
        if (!profile) {
            return new NextResponse("Unauthorized user", { status : 401 })
        }
        if (!name) {
            return new NextResponse("Channel name is required", { status : 400 })
        }

        if (!type) {
            return new NextResponse("Channel type is required", { status : 400 })
        }

        if (!serverId) { 
            return new NextResponse("serverId is missing", { status : 400 })
        }

        const createChannel = await prismadb.server.update({
            where : {
                id : serverId,
                members : {
                   some : {
                    profileId : profile.id,
                    role : {
                        in : [MemberRole.ADMIN, MemberRole.MODERATOR]
                    }
                   }
                }
            },
            data : {
                channels : {
                    create : {
                        name : name,
                        type : type,
                        profileId : profile.id
                    }
                }
            }
        });

        return NextResponse.json(createChannel)
        
    } catch (error) {
        return new NextResponse("[internal server error]", { status : 500 })
    }

}