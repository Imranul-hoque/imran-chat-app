import { auth, redirectToSignIn } from '@clerk/nextjs';
import { prismadb } from './prismadb';

export const currrentProfile = async () => {
    const { userId } = auth();

    if (!userId) {
        return null;
    }

    const profile = await prismadb.profile.findUnique({
        where : {
           userId : userId
        }
    });

    return profile;

}

