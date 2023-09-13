import { currrentProfile } from "@/lib/current-profile";
import { prismadb } from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function PATCH(
    req : Request,
    { params } : { params : { serverId : string } }
){
    try {

        const profile = await currrentProfile();

        if (!params.serverId) {
            return new NextResponse("ServerId is missing", { status : 400 })
        }

        if (!profile){
            return new NextResponse("Unauthorized user", { status : 401 })
        }

        const deleteMember = await prismadb.server.update({
            where : {
                id : params.serverId,
                profileId : {
                    not : profile.id
                },
                members : {
                    some : {
                        profileId : profile.id
                    }
                }
            },
            data : {
                members : {
                    deleteMany : {
                        profileId : profile.id
                    }
                }
            }
        });

        return NextResponse.json(deleteMember)
        
    } catch (error) {
        return new NextResponse("intenal server error", { status : 500 })
    }

}