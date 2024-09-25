declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PORT: number;
      DATABASE_URL: string;
      NODE_URL: string;
      NODE_SOCKET: string;
    }
  }
}

export {};
