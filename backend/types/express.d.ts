declare global {
  namespace Express {
    interface Request {
      user?: {
        utilisateur_id: number;
        email: string;
        type: string;
      };
    }
  }
}

export {};
