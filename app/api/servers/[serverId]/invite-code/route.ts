import { currrentProfile } from '@/lib/current-profile';
import { prismadb } from '@/lib/prismadb';
import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

export async function PATCH (
    req : Request,
    {params} : { params : { serverId : string } }
) {
    try {
        const profile = await currrentProfile();
        if (!profile){
            return new NextResponse("Unauthorized user", { status : 401 })
        }

        if (!params.serverId) {
            return new NextResponse("Server id missing", { status : 400 })
        } 

        const updateServer = await prismadb.server.update({
            where : {
                id : params.serverId,
                profileId : profile.id
            },
            data : {
               inviteCode : uuidv4() 
            }
        })
        
    } catch (error) {
        return new NextResponse("[Internal server error]", { status : 500 })
    }
    

}