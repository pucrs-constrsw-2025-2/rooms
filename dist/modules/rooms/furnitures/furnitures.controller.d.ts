import { FurnituresService } from './furnitures.service';
export declare class FurnituresController {
    private readonly furnituresService;
    constructor(furnituresService: FurnituresService);
    create(_roomId: string, _payload: unknown): Promise<never>;
    findAll(_roomId: string): Promise<never>;
    findOne(_roomId: string, _furnitureId: string): Promise<never>;
    update(_roomId: string, _furnitureId: string, _payload: unknown): Promise<never>;
    patch(_roomId: string, _furnitureId: string, _payload: unknown): Promise<never>;
    remove(_roomId: string, _furnitureId: string): Promise<never>;
}
