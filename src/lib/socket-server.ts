import { Server as SocketIOServer } from "socket.io";
import type { Server as HTTPServer } from "http";

let io: SocketIOServer | null = null;

export function getIO(): SocketIOServer | null {
  return io;
}

export function initSocketServer(httpServer: HTTPServer): SocketIOServer {
  if (io) return io;

  io = new SocketIOServer(httpServer, {
    cors: {
      origin: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
      methods: ["GET", "POST"],
    },
    path: "/api/socketio",
  });

  io.on("connection", (socket) => {
    console.log("Client connected:", socket.id);

    socket.on("join-chat", (matchId: string) => {
      socket.join(`chat:${matchId}`);
      console.log(`Socket ${socket.id} joined chat:${matchId}`);
    });

    socket.on("leave-chat", (matchId: string) => {
      socket.leave(`chat:${matchId}`);
      console.log(`Socket ${socket.id} left chat:${matchId}`);
    });

    socket.on("send-message", (data: { matchId: string; message: unknown }) => {
      socket.to(`chat:${data.matchId}`).emit("new-message", data.message);
    });

    socket.on("typing", (matchId: string) => {
      socket.to(`chat:${matchId}`).emit("partner-typing");
    });

    socket.on("stop-typing", (matchId: string) => {
      socket.to(`chat:${matchId}`).emit("partner-stop-typing");
    });

    socket.on("reveal-request", (matchId: string) => {
      socket.to(`chat:${matchId}`).emit("reveal-requested");
    });

    socket.on("reveal-accepted", (matchId: string) => {
      socket.to(`chat:${matchId}`).emit("reveal-accepted");
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
    });
  });

  return io;
}
