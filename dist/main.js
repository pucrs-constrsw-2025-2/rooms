"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const swagger_1 = require("@nestjs/swagger");
const axios_1 = __importDefault(require("axios"));
const rooms_constants_1 = require("./modules/rooms/rooms.constants");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const swaggerConfig = new swagger_1.DocumentBuilder()
        .setTitle('Rooms API')
        .setDescription('API documentation for the Rooms service')
        .setVersion('1.0')
        .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }, 'jwt')
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, swaggerConfig);
    const validationEndpoint = process.env.OAUTH_VALIDATE_URL ?? rooms_constants_1.JWT_VALIDATION_ENDPOINT_PLACEHOLDER;
    const requireAuth = async (req, res, next) => {
        try {
            const authHeader = req.headers?.authorization;
            if (!authHeader) {
                return res.status(401).send('Missing bearer token');
            }
            const [, token] = authHeader.split(' ');
            if (!token) {
                return res.status(401).send('Missing bearer token');
            }
            await axios_1.default.post(validationEndpoint, null, {
                headers: { Authorization: `Bearer ${token}` },
            });
            return next();
        }
        catch (err) {
            return res.status(401).send('Invalid or expired token');
        }
    };
    app.use('/api', requireAuth);
    app.use('/api-json', requireAuth);
    swagger_1.SwaggerModule.setup('api', app, document);
    const port = process.env.PORT ?? process.env.ROOMS_INTERNAL_API_PORT ?? 3000;
    const host = '0.0.0.0';
    await app.listen(port, host);
    console.log(`🚀 Rooms API is running on http://${host}:${port}`);
    console.log(`📚 Swagger UI available at http://${host}:${port}/api`);
}
bootstrap();
//# sourceMappingURL=main.js.map