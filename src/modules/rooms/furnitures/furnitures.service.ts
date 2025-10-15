// NOTE: resources are served by another microservice. Do not implement here.
import { Injectable, NotImplementedException } from '@nestjs/common';

@Injectable()
export class FurnituresService {
  // TODO: implement furnitures CRUD
  async create(): Promise<never> {
    throw new NotImplementedException('Furnitures creation is not yet implemented.');
  }

  // TODO: implement furnitures CRUD
  async findAll(): Promise<never> {
    throw new NotImplementedException('Listing furnitures is not yet implemented.');
  }

  // TODO: implement furnitures CRUD
  async findOne(): Promise<never> {
    throw new NotImplementedException('Fetching a furniture item is not yet implemented.');
  }

  // TODO: implement furnitures CRUD
  async update(): Promise<never> {
    throw new NotImplementedException('Updating a furniture item is not yet implemented.');
  }

  // TODO: implement furnitures CRUD
  async remove(): Promise<never> {
    throw new NotImplementedException('Removing a furniture item is not yet implemented.');
  }
}

