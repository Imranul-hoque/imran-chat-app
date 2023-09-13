import { NextResponse } from "next/server";
import { prismadb } from "@/lib/prismadb";
import { currrentProfile } from '@/lib/current-profile';


export async function PATCH (
    req : Request,
    { params } : { params : { serverId : string } }
){
    try {

        const profile = await currrentProfile();

        const { name, imageUrl } = await req.json();

        if (!profile) {
            return new NextResponse("Unauthorized user", { status : 401 })
        }

        const updatedServer = await prismadb.server.update({
            where : {
                id : params.serverId,
                profileId : profile.id
            },
            data : {
                name,
                imageUrl
            }
        });

        return NextResponse.json(updatedServer)
        
    } catch (error) {
        return new NextResponse("[inernal server error]", { status : 500 })
    }
} 


export async function DELETE(
    req: Request,
    { params }: { params: { serverId: string } }
  ) {
    try {
      const profile = await currrentProfile();
  
      if (!profile) {
        return new NextResponse("Unauthorized", { status: 401 });
      }
  
      const server = await prismadb.server.delete({
        where: {
          id: params.serverId,
          profileId: profile.id,
        }
      });
  
      return NextResponse.json(server);
    } catch (error) {
      console.log("[SERVER_ID_DELETE]", error);
      return new NextResponse("Internal Error", { status: 500 });
    }
  }
  