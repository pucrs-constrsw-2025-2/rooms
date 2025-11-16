import { RoomsController } from './rooms.controller';
import { RoomsService } from './rooms.service';

describe('RoomsController', () => {
  let controller: RoomsController;
  let service: jest.Mocked<RoomsService>;

  beforeEach(() => {
    service = {
      create: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      patch: jest.fn(),
      remove: jest.fn(),
    } as unknown as jest.Mocked<RoomsService>;

    controller = new RoomsController(service);
  });

  it('should delegate create to RoomsService', async () => {
    const dto = { number: '101' } as any;
    const response = { _id: '1' };
    service.create.mockResolvedValue(response as any);

    await expect(controller.create(dto)).resolves.toBe(response);
    expect(service.create).toHaveBeenCalledWith(dto);
  });

  it('should delegate findAll with query params', async () => {
    const query = { building: 'Main' } as any;
    const expected = { items: [], meta: {} };
    service.findAll.mockResolvedValue(expected as any);

    await expect(controller.findAll(query)).resolves.toBe(expected);
    expect(service.findAll).toHaveBeenCalledWith(query);
  });

  it('should delegate findOne with id', async () => {
    const room = { _id: '1' };
    service.findOne.mockResolvedValue(room as any);

    await expect(controller.findOne('1')).resolves.toBe(room);
    expect(service.findOne).toHaveBeenCalledWith('1');
  });

  it('should delegate update and patch with payloads', async () => {
    const body = { number: '103' } as any;
    service.update.mockResolvedValue({} as any);
    service.patch.mockResolvedValue({} as any);

    await controller.update('1', body);
    await controller.patch('1', body);

    expect(service.update).toHaveBeenCalledWith('1', body);
    expect(service.patch).toHaveBeenCalledWith('1', body);
  });

  it('should call remove on the service', async () => {
    service.remove.mockResolvedValue(undefined);

    await controller.remove('1');

    expect(service.remove).toHaveBeenCalledWith('1');
  });
});
