import { FurnituresController } from './furnitures.controller';
import { FurnituresService } from './furnitures.service';

describe('FurnituresController', () => {
  let controller: FurnituresController;
  let service: jest.Mocked<FurnituresService>;

  beforeEach(() => {
    service = {
      create: jest.fn().mockRejectedValue(new Error('not implemented')),
      findAll: jest.fn().mockRejectedValue(new Error('not implemented')),
      findOne: jest.fn().mockRejectedValue(new Error('not implemented')),
      update: jest.fn().mockRejectedValue(new Error('not implemented')),
      remove: jest.fn().mockRejectedValue(new Error('not implemented')),
    } as unknown as jest.Mocked<FurnituresService>;

    controller = new FurnituresController(service);
  });

  it('should call service.create', async () => {
    await expect(controller.create('room', {})).rejects.toBeDefined();
    expect(service.create).toHaveBeenCalled();
  });

  it('should call service.findAll', async () => {
    await expect(controller.findAll('room')).rejects.toBeDefined();
    expect(service.findAll).toHaveBeenCalled();
  });

  it('should call service.findOne', async () => {
    await expect(controller.findOne('room', 'furniture')).rejects.toBeDefined();
    expect(service.findOne).toHaveBeenCalled();
  });

  it('should reuse update implementation for PATCH', async () => {
    await expect(controller.update('room', 'f', {})).rejects.toBeDefined();
    await expect(controller.patch('room', 'f', {})).rejects.toBeDefined();
    expect(service.update).toHaveBeenCalledTimes(2);
  });

  it('should call service.remove', async () => {
    await expect(controller.remove('room', 'f')).rejects.toBeDefined();
    expect(service.remove).toHaveBeenCalled();
  });
});
