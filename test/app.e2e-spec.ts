import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { JwtAuthGuard } from '../src/oauth/jwt-auth.guard';
import { PrismaService } from '../src/prisma/prisma.service';
import { RoomStatus } from '@prisma/client';

describe('RoomsController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let roomId: string;
  let room2Id: string;
  let room3Id: string;

  beforeAll(async () => {
    // Set the DATABASE_URL for the test environment
    // This should point to your test database
    process.env.DATABASE_URL =
      'postgresql://postgres:postgres@postgresql:5432/rooms_test?schema=public';

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true }) // Mock the guard
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, transform: true }),
    );
    await app.init();

    prisma = app.get<PrismaService>(PrismaService);
    // Clean up database before running tests
    await prisma.room.deleteMany({});
  });

  afterAll(async () => {
    // Clean up database after all tests
    if (prisma) {
      await prisma.room.deleteMany({});
      await prisma.$disconnect();
    }
    if (app) {
      await app.close();
    }
  });

  describe('POST /api/v1/rooms', () => {
    it('should create a new room with required fields', () => {
      return request(app.getHttpServer())
        .post('/api/v1/rooms')
        .send({
          number: '101',
          building: 'Main',
          capacity: 20,
          category: 'Classroom',
          floor: 1,
        })
        .expect(201)
        .then((res) => {
          expect(res.body).toHaveProperty('_id');
          expect(res.body.number).toBe('101');
          expect(res.body.building).toBe('Main');
          expect(res.body.capacity).toBe(20);
          expect(res.body.category).toBe('Classroom');
          expect(res.body.floor).toBe(1);
          expect(res.body.status).toBe(RoomStatus.ACTIVE); // Default status
          expect(res.body).toHaveProperty('createdAt');
          expect(res.body).toHaveProperty('updatedAt');
          roomId = res.body._id; // Save for later tests
        });
    });

    it('should create a room with optional description', () => {
      return request(app.getHttpServer())
        .post('/api/v1/rooms')
        .send({
          number: '102',
          building: 'Main',
          capacity: 30,
          category: 'Lab',
          floor: 2,
          description: 'Computer lab with 30 workstations',
        })
        .expect(201)
        .then((res) => {
          expect(res.body.description).toBe('Computer lab with 30 workstations');
          room2Id = res.body._id;
        });
    });

    it('should create a room with custom status', () => {
      return request(app.getHttpServer())
        .post('/api/v1/rooms')
        .send({
          number: '103',
          building: 'Annex',
          capacity: 15,
          category: 'Office',
          floor: 1,
          status: RoomStatus.MAINTENANCE,
        })
        .expect(201)
        .then((res) => {
          expect(res.body.status).toBe(RoomStatus.MAINTENANCE);
          room3Id = res.body._id;
        });
    });

    it('should create rooms with same number in different buildings', () => {
      return request(app.getHttpServer())
        .post('/api/v1/rooms')
        .send({
          number: '101',
          building: 'East',
          capacity: 25,
          category: 'Classroom',
          floor: 1,
        })
        .expect(201)
        .then((res) => {
          expect(res.body.number).toBe('101');
          expect(res.body.building).toBe('East');
        });
    });

    it('should fail if a required field is missing (capacity)', () => {
      return request(app.getHttpServer())
        .post('/api/v1/rooms')
        .send({
          number: '104',
          building: 'Main',
          category: 'Lab',
          floor: 1,
        })
        .expect(400);
    });

    it('should fail if a required field is missing (floor)', () => {
      return request(app.getHttpServer())
        .post('/api/v1/rooms')
        .send({
          number: '105',
          building: 'Main',
          capacity: 20,
          category: 'Lab',
        })
        .expect(400);
    });

    it('should fail to create a duplicate room (same number and building)', () => {
      return request(app.getHttpServer())
        .post('/api/v1/rooms')
        .send({
          number: '101',
          building: 'Main',
          capacity: 25,
          category: 'Lab',
          floor: 1,
        })
        .expect(409);
    });

    it('should fail with invalid capacity (zero)', () => {
      return request(app.getHttpServer())
        .post('/api/v1/rooms')
        .send({
          number: '106',
          building: 'Main',
          capacity: 0,
          category: 'Lab',
          floor: 1,
        })
        .expect(400);
    });

    it('should fail with invalid capacity (negative)', () => {
      return request(app.getHttpServer())
        .post('/api/v1/rooms')
        .send({
          number: '107',
          building: 'Main',
          capacity: -5,
          category: 'Lab',
          floor: 1,
        })
        .expect(400);
    });

    it('should fail with number exceeding max length (20 chars)', () => {
      return request(app.getHttpServer())
        .post('/api/v1/rooms')
        .send({
          number: 'A'.repeat(21),
          building: 'Main',
          capacity: 20,
          category: 'Lab',
          floor: 1,
        })
        .expect(400);
    });

    it('should fail with building exceeding max length (10 chars)', () => {
      return request(app.getHttpServer())
        .post('/api/v1/rooms')
        .send({
          number: '108',
          building: 'A'.repeat(11),
          capacity: 20,
          category: 'Lab',
          floor: 1,
        })
        .expect(400);
    });

    it('should fail with category exceeding max length (10 chars)', () => {
      return request(app.getHttpServer())
        .post('/api/v1/rooms')
        .send({
          number: '109',
          building: 'Main',
          capacity: 20,
          category: 'A'.repeat(11),
          floor: 1,
        })
        .expect(400);
    });

    it('should fail with description exceeding max length (255 chars)', () => {
      return request(app.getHttpServer())
        .post('/api/v1/rooms')
        .send({
          number: '110',
          building: 'Main',
          capacity: 20,
          category: 'Lab',
          floor: 1,
          description: 'A'.repeat(256),
        })
        .expect(400);
    });

    it('should fail with invalid status enum', () => {
      return request(app.getHttpServer())
        .post('/api/v1/rooms')
        .send({
          number: '111',
          building: 'Main',
          capacity: 20,
          category: 'Lab',
          floor: 1,
          status: 'INVALID_STATUS',
        })
        .expect(400);
    });

    it('should accept negative floor numbers (basements)', () => {
      return request(app.getHttpServer())
        .post('/api/v1/rooms')
        .send({
          number: 'B01',
          building: 'Main',
          capacity: 10,
          category: 'Storage',
          floor: -1,
        })
        .expect(201)
        .then((res) => {
          expect(res.body.floor).toBe(-1);
        });
    });
  });

  describe('GET /api/v1/rooms', () => {
    it('should return a list of rooms with pagination metadata', () => {
      return request(app.getHttpServer())
        .get('/api/v1/rooms')
        .expect(200)
        .then((res) => {
          expect(res.body).toHaveProperty('items');
          expect(res.body).toHaveProperty('meta');
          expect(res.body.items).toBeInstanceOf(Array);
          expect(res.body.items.length).toBeGreaterThan(0);
          expect(res.body.meta).toHaveProperty('page');
          expect(res.body.meta).toHaveProperty('limit');
          expect(res.body.meta).toHaveProperty('total');
          expect(res.body.meta).toHaveProperty('totalPages');
        });
    });

    it('should return default pagination (page 1)', () => {
      return request(app.getHttpServer())
        .get('/api/v1/rooms')
        .expect(200)
        .then((res) => {
          expect(res.body.meta.page).toBe(1);
        });
    });

    it('should support custom pagination', () => {
      return request(app.getHttpServer())
        .get('/api/v1/rooms?page=1&limit=2')
        .expect(200)
        .then((res) => {
          expect(res.body.meta.page).toBe(1);
          expect(res.body.meta.limit).toBe(2);
          expect(res.body.items.length).toBeLessThanOrEqual(2);
        });
    });

    it('should filter rooms by building', () => {
      return request(app.getHttpServer())
        .get('/api/v1/rooms?building=Main')
        .expect(200)
        .then((res) => {
          expect(res.body.items.length).toBeGreaterThan(0);
          res.body.items.forEach((room) => {
            expect(room.building).toBe('Main');
          });
        });
    });

    it('should filter rooms by category', () => {
      return request(app.getHttpServer())
        .get('/api/v1/rooms?category=Lab')
        .expect(200)
        .then((res) => {
          expect(res.body.items.length).toBeGreaterThan(0);
          res.body.items.forEach((room) => {
            expect(room.category).toBe('Lab');
          });
        });
    });

    it('should filter rooms by status', () => {
      return request(app.getHttpServer())
        .get(`/api/v1/rooms?status=${RoomStatus.MAINTENANCE}`)
        .expect(200)
        .then((res) => {
          expect(res.body.items.length).toBeGreaterThan(0);
          res.body.items.forEach((room) => {
            expect(room.status).toBe(RoomStatus.MAINTENANCE);
          });
        });
    });

    it('should filter rooms by exact number', () => {
      return request(app.getHttpServer())
        .get('/api/v1/rooms?number=101')
        .expect(200)
        .then((res) => {
          expect(res.body.items.length).toBeGreaterThan(0);
          res.body.items.forEach((room) => {
            expect(room.number).toBe('101');
          });
        });
    });

    it('should filter rooms by minCapacity', () => {
      return request(app.getHttpServer())
        .get('/api/v1/rooms?minCapacity=25')
        .expect(200)
        .then((res) => {
          res.body.items.forEach((room) => {
            expect(room.capacity).toBeGreaterThanOrEqual(25);
          });
        });
    });

    it('should filter rooms by maxCapacity', () => {
      return request(app.getHttpServer())
        .get('/api/v1/rooms?maxCapacity=20')
        .expect(200)
        .then((res) => {
          res.body.items.forEach((room) => {
            expect(room.capacity).toBeLessThanOrEqual(20);
          });
        });
    });

    it('should filter rooms by capacity range (min and max)', () => {
      return request(app.getHttpServer())
        .get('/api/v1/rooms?minCapacity=15&maxCapacity=25')
        .expect(200)
        .then((res) => {
          res.body.items.forEach((room) => {
            expect(room.capacity).toBeGreaterThanOrEqual(15);
            expect(room.capacity).toBeLessThanOrEqual(25);
          });
        });
    });

    it('should fail when minCapacity > maxCapacity', () => {
      return request(app.getHttpServer())
        .get('/api/v1/rooms?minCapacity=50&maxCapacity=20')
        .expect(400);
    });

    it('should combine multiple filters', () => {
      return request(app.getHttpServer())
        .get('/api/v1/rooms?building=Main&category=Lab&minCapacity=20')
        .expect(200)
        .then((res) => {
          res.body.items.forEach((room) => {
            expect(room.building).toBe('Main');
            expect(room.category).toBe('Lab');
            expect(room.capacity).toBeGreaterThanOrEqual(20);
          });
        });
    });

    it('should return empty results for non-matching filters', () => {
      return request(app.getHttpServer())
        .get('/api/v1/rooms?category=NonMatch')
        .expect(200)
        .then((res) => {
          expect(res.body.items).toBeInstanceOf(Array);
          expect(res.body.items.length).toBe(0);
          expect(res.body.meta.total).toBe(0);
        });
    });

    it('should return results sorted by room number', () => {
      return request(app.getHttpServer())
        .get('/api/v1/rooms?building=Main')
        .expect(200)
        .then((res) => {
          const numbers = res.body.items.map((room) => room.number);
          const sortedNumbers = [...numbers].sort();
          expect(numbers).toEqual(sortedNumbers);
        });
    });
  });

  describe('GET /api/v1/rooms/:id', () => {
    it('should return a specific room by id with all fields', () => {
      return request(app.getHttpServer())
        .get(`/api/v1/rooms/${roomId}`)
        .expect(200)
        .then((res) => {
          expect(res.body._id).toBe(roomId);
          expect(res.body.number).toBe('101');
          expect(res.body.building).toBe('Main');
          expect(res.body.capacity).toBe(20);
          expect(res.body.category).toBe('Classroom');
          expect(res.body.floor).toBe(1);
          expect(res.body.status).toBe(RoomStatus.ACTIVE);
          expect(res.body).toHaveProperty('createdAt');
          expect(res.body).toHaveProperty('updatedAt');
        });
    });

    it('should include timestamps in response', () => {
      return request(app.getHttpServer())
        .get(`/api/v1/rooms/${roomId}`)
        .expect(200)
        .then((res) => {
          expect(res.body).toHaveProperty('createdAt');
          expect(res.body).toHaveProperty('updatedAt');
          expect(new Date(res.body.createdAt).getTime()).not.toBeNaN();
          expect(new Date(res.body.updatedAt).getTime()).not.toBeNaN();
        });
    });

    it('should return 404 for a non-existent room id', () => {
      const nonExistentId = 'clzclzclzclzclzclz';
      return request(app.getHttpServer())
        .get(`/api/v1/rooms/${nonExistentId}`)
        .expect(404);
    });

    it('should return 404 for invalid UUID format', () => {
      return request(app.getHttpServer())
        .get('/api/v1/rooms/invalid-id-format')
        .expect(404);
    });
  });

  describe('PUT /api/v1/rooms/:id', () => {
    it('should fully update a room', () => {
      return request(app.getHttpServer())
        .put(`/api/v1/rooms/${roomId}`)
        .send({
          number: '101-A',
          building: 'Annex',
          capacity: 30,
          category: 'Auditorium',
          floor: 2,
          status: RoomStatus.MAINTENANCE,
        })
        .expect(200)
        .then((res) => {
          expect(res.body.number).toBe('101-A');
          expect(res.body.building).toBe('Annex');
          expect(res.body.capacity).toBe(30);
          expect(res.body.category).toBe('Auditorium');
          expect(res.body.floor).toBe(2);
          expect(res.body.status).toBe(RoomStatus.MAINTENANCE);
        });
    });

    it('should update updatedAt timestamp', () => {
      return request(app.getHttpServer())
        .get(`/api/v1/rooms/${roomId}`)
        .expect(200)
        .then((initialRes) => {
          const initialUpdatedAt = new Date(initialRes.body.updatedAt);
          
          // Wait a bit to ensure timestamp difference
          return new Promise((resolve) => setTimeout(resolve, 100))
            .then(() => {
              return request(app.getHttpServer())
                .put(`/api/v1/rooms/${roomId}`)
                .send({
                  number: '101-B',
                  building: 'Annex',
                  capacity: 35,
                  category: 'Auditorium',
                  floor: 2,
                  status: RoomStatus.ACTIVE,
                })
                .expect(200);
            })
            .then((updateRes) => {
              const newUpdatedAt = new Date(updateRes.body.updatedAt);
              expect(newUpdatedAt.getTime()).toBeGreaterThan(initialUpdatedAt.getTime());
            });
        });
    });

    it('should return 404 when updating non-existent room', () => {
      const fakeId = 'clzclzclzclzclzclz';
      return request(app.getHttpServer())
        .put(`/api/v1/rooms/${fakeId}`)
        .send({
          number: '999',
          building: 'Test',
          capacity: 10,
          category: 'Test',
          floor: 1,
        })
        .expect(404);
    });

    it('should fail with missing required fields', () => {
      return request(app.getHttpServer())
        .put(`/api/v1/rooms/${roomId}`)
        .send({
          number: '101-C',
          building: 'Annex',
          // Missing capacity, category, floor
        })
        .expect(400);
    });

    it('should fail with invalid data (negative capacity)', () => {
      return request(app.getHttpServer())
        .put(`/api/v1/rooms/${roomId}`)
        .send({
          number: '101-D',
          building: 'Annex',
          capacity: -10,
          category: 'Lab',
          floor: 1,
        })
        .expect(400);
    });

    it('should fail when creating duplicate (number+building conflict)', () => {
      return request(app.getHttpServer())
        .put(`/api/v1/rooms/${roomId}`)
        .send({
          number: '102', // Same as room2Id
          building: 'Main',
          capacity: 20,
          category: 'Lab',
          floor: 1,
        })
        .expect(409);
    });

    it('should allow updating to same number+building as current', () => {
      return request(app.getHttpServer())
        .put(`/api/v1/rooms/${roomId}`)
        .send({
          number: '101-B', // Current number
          building: 'Annex', // Current building
          capacity: 40,
          category: 'Auditorium',
          floor: 2,
        })
        .expect(200);
    });
  });

  describe('PATCH /api/v1/rooms/:id', () => {
    it('should partially update a single field', () => {
      return request(app.getHttpServer())
        .patch(`/api/v1/rooms/${roomId}`)
        .send({ capacity: 50 })
        .expect(200)
        .then((res) => {
          expect(res.body.capacity).toBe(50);
          expect(res.body.number).toBe('101-B'); // Should not have changed
          expect(res.body.building).toBe('Annex'); // Should not have changed
        });
    });

    it('should partially update multiple fields', () => {
      return request(app.getHttpServer())
        .patch(`/api/v1/rooms/${roomId}`)
        .send({ 
          capacity: 45,
          status: RoomStatus.INACTIVE,
          description: 'Under renovation',
        })
        .expect(200)
        .then((res) => {
          expect(res.body.capacity).toBe(45);
          expect(res.body.status).toBe(RoomStatus.INACTIVE);
          expect(res.body.description).toBe('Under renovation');
          expect(res.body.number).toBe('101-B'); // Should not have changed
        });
    });

    it('should update only status', () => {
      return request(app.getHttpServer())
        .patch(`/api/v1/rooms/${room2Id}`)
        .send({ status: RoomStatus.ACTIVE })
        .expect(200)
        .then((res) => {
          expect(res.body.status).toBe(RoomStatus.ACTIVE);
          expect(res.body.number).toBe('102'); // Should remain
        });
    });

    it('should return 404 for non-existent room', () => {
      const fakeId = 'clzclzclzclzclzclz';
      return request(app.getHttpServer())
        .patch(`/api/v1/rooms/${fakeId}`)
        .send({ capacity: 100 })
        .expect(404);
    });

    it('should fail with invalid capacity value', () => {
      return request(app.getHttpServer())
        .patch(`/api/v1/rooms/${roomId}`)
        .send({ capacity: -5 })
        .expect(400);
    });

    it('should fail with invalid status enum', () => {
      return request(app.getHttpServer())
        .patch(`/api/v1/rooms/${roomId}`)
        .send({ status: 'INVALID' })
        .expect(400);
    });

    it('should fail when creating duplicate via partial update', () => {
      return request(app.getHttpServer())
        .patch(`/api/v1/rooms/${roomId}`)
        .send({ 
          number: '102',
          building: 'Main',
        })
        .expect(409);
    });

    it('should accept empty body (no changes)', () => {
      return request(app.getHttpServer())
        .patch(`/api/v1/rooms/${roomId}`)
        .send({})
        .expect(200)
        .then((res) => {
          expect(res.body._id).toBe(roomId);
        });
    });

    it('should update description to null', () => {
      return request(app.getHttpServer())
        .patch(`/api/v1/rooms/${roomId}`)
        .send({ description: null })
        .expect(200)
        .then((res) => {
          expect(res.body.description).toBeNull();
        });
    });
  });

  describe('DELETE /api/v1/rooms/:id', () => {
    it('should delete a room', () => {
      return request(app.getHttpServer())
        .delete(`/api/v1/rooms/${roomId}`)
        .expect(204);
    });

    it('should return 404 when trying to get the deleted room', () => {
      return request(app.getHttpServer())
        .get(`/api/v1/rooms/${roomId}`)
        .expect(404);
    });

    it('should return 404 when deleting already deleted room', () => {
      return request(app.getHttpServer())
        .delete(`/api/v1/rooms/${roomId}`)
        .expect(404);
    });

    it('should return 404 for non-existent room', () => {
      const fakeId = 'clzclzclzclzclzclz';
      return request(app.getHttpServer())
        .delete(`/api/v1/rooms/${fakeId}`)
        .expect(404);
    });

    it('should return 404 for invalid UUID format', () => {
      return request(app.getHttpServer())
        .delete('/api/v1/rooms/invalid-uuid')
        .expect(404);
    });

    it('should delete room and allow creating with same number+building', () => {
      return request(app.getHttpServer())
        .delete(`/api/v1/rooms/${room2Id}`)
        .expect(204)
        .then(() => {
          // Now we should be able to create a room with the same number+building
          return request(app.getHttpServer())
            .post('/api/v1/rooms')
            .send({
              number: '102',
              building: 'Main',
              capacity: 40,
              category: 'Conference',
              floor: 2,
            })
            .expect(201);
        });
    });
  });
});
