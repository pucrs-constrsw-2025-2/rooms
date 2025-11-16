import { NotImplementedException } from '@nestjs/common';
import { FurnituresService } from './furnitures.service';

describe('FurnituresService', () => {
  let service: FurnituresService;

  beforeEach(() => {
    service = new FurnituresService();
  });

  it.each([
    ['create', () => service.create()],
    ['findAll', () => service.findAll()],
    ['findOne', () => service.findOne()],
    ['update', () => service.update()],
    ['remove', () => service.remove()],
  ])('should throw NotImplementedException for %s', async (_name, callFn) => {
    await expect(callFn()).rejects.toBeInstanceOf(NotImplementedException);
  });
});
