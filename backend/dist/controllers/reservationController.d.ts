import { Request, Response } from 'express';
declare class ReservationController {
    static create(req: Request, res: Response): Promise<void>;
    static getMesReservations(req: Request, res: Response): Promise<void>;
    static getOwnerReservations(req: Request, res: Response): Promise<void>;
    static getAll(req: Request, res: Response): Promise<void>;
    static getById(req: Request, res: Response): Promise<void>;
    static updateStatus(req: Request, res: Response): Promise<void>;
    static annuler(req: Request, res: Response): Promise<void>;
    static delete(req: Request, res: Response): Promise<void>;
}
export default ReservationController;
