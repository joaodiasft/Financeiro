import { cookies } from "next/headers";
import prisma from "@/lib/prisma";
import { SESSION_COOKIE } from "@/lib/constants";
import { verifySessionToken } from "@/lib/auth-utils";

export async function getCurrentUser() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE)?.value;
    
    if (!token) {
      console.log("No token found");
      return null;
    }
    
    const session = verifySessionToken(token);
    
    if (!session) {
      console.log("Invalid session token");
      return null;
    }
    
    const user = await prisma.user.findUnique({ 
      where: { id: session.userId } 
    });
    
    if (!user) {
      console.log("User not found:", session.userId);
      return null;
    }
    
    return user;
  } catch (error) {
    console.error("Error in getCurrentUser:", error);
    return null;
  }
}
