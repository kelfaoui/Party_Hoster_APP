import { Request, Response } from 'express';
declare class UtilisateurController {
    static register(req: Request, res: Response): Promise<void>;
    static login(req: Request, res: Response): Promise<void>;
    static getProfile(req: Request, res: Response): Promise<void>;
    static updateProfile(req: Request, res: Response): Promise<void>;
    static getAll(req: Request, res: Response): Promise<void>;
    static getById(req: Request, res: Response): Promise<void>;
    static updateStatus(req: Request, res: Response): Promise<void>;
    static toggleActivation(req: Request, res: Response): Promise<void>;
    static activate(req: Request, res: Response): Promise<void>;
    static deactivate(req: Request, res: Response): Promise<void>;
    static update(req: Request, res: Response): Promise<void>;
}
export default UtilisateurController;
