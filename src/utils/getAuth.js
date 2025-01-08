import { auth } from '@clerk/nextjs/server'
async function getAuth() {
    const {userId, redirectToSignIn} = await auth();
    return {userId, redirectToSignIn}

}

export default getAuth;