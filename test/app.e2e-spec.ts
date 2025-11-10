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

  beforeAll(async () => {
    // Set the DATABASE_URL for the test environment
    // This should point to your test database
    process.env.DATABASE_URL =
      'postgresql://postgres:postgres@localhost:5432/rooms_test?schema=public';

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
    it('should create a new room', () => {
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
          expect(res.body.status).toBe(RoomStatus.ACTIVE); // Default status
          roomId = res.body._id; // Save for later tests
        });
    });

    it('should fail if a required field is missing', () => {
      return request(app.getHttpServer())
        .post('/api/v1/rooms')
        .send({
          number: '102',
          building: 'Main',
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
  });

  describe('GET /api/v1/rooms', () => {
    it('should return a list of rooms', () => {
      return request(app.getHttpServer())
        .get('/api/v1/rooms')
        .expect(200)
        .then((res) => {
          expect(res.body.items).toBeInstanceOf(Array);
          expect(res.body.items.length).toBeGreaterThan(0);
          expect(res.body.items[0].number).toBe('101');
        });
    });

    it('should filter rooms by building', () => {
      return request(app.getHttpServer())
        .get('/api/v1/rooms?building=Main')
        .expect(200)
        .then((res) => {
          expect(res.body.items[0].building).toBe('Main');
        });
    });
  });

  describe('GET /api/v1/rooms/:id', () => {
    it('should return a specific room by id', () => {
      return request(app.getHttpServer())
        .get(`/api/v1/rooms/${roomId}`)
        .expect(200)
        .then((res) => {
          expect(res.body._id).toBe(roomId);
          expect(res.body.number).toBe('101');
        });
    });

    it('should return 404 for a non-existent room id', () => {
      const nonExistentId = 'clzclzclzclzclzclz';
      return request(app.getHttpServer()).get(`/api/v1/rooms/${nonExistentId}`).expect(404);
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
          expect(res.body.status).toBe(RoomStatus.MAINTENANCE);
        });
    });
  });

  describe('PATCH /api/v1/rooms/:id', () => {
    it('should partially update a room', () => {
      return request(app.getHttpServer())
        .patch(`/api/v1/rooms/${roomId}`)
        .send({ capacity: 35 })
        .expect(200)
        .then((res) => {
          expect(res.body.capacity).toBe(35);
          expect(res.body.number).toBe('101-A'); // Should not have changed
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
  });
});