import { Request, Response } from 'express';
declare class SalleController {
    static create(req: Request, res: Response): Promise<void>;
    static getAll(req: Request, res: Response): Promise<void>;
    static getMesSalles(req: Request, res: Response): Promise<void>;
    static getById(req: Request, res: Response): Promise<void>;
    static update(req: Request, res: Response): Promise<void>;
    static uploadImage(req: Request, res: Response): Promise<void>;
    static delete(req: Request, res: Response): Promise<void>;
    static getDisponibilites(req: Request, res: Response): Promise<void>;
    static getReservations(req: Request, res: Response): Promise<void>;
}
export default SalleController;
