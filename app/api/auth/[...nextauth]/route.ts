import { handlers } from "@/auth";

// NextAuth's GET/POST handlers run in the Node.js runtime (they use bcrypt + fs).
export const { GET, POST } = handlers;
