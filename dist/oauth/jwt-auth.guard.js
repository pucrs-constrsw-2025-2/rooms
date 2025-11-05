"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JwtAuthGuard = void 0;
const common_1 = require("@nestjs/common");
const rooms_constants_1 = require("../modules/rooms/rooms.constants");
const axios_1 = __importDefault(require("axios"));
let JwtAuthGuard = class JwtAuthGuard {
    canActivate(context) {
        return this.canActivateAsync(context);
    }
    async canActivateAsync(context) {
        const request = context.switchToHttp().getRequest();
        const token = this.extractToken(request);
        if (!token) {
            throw new common_1.UnauthorizedException('Missing bearer token');
        }
        const validationEndpoint = process.env.OAUTH_VALIDATE_URL ?? rooms_constants_1.JWT_VALIDATION_ENDPOINT_PLACEHOLDER;
        try {
            const response = await axios_1.default.post(validationEndpoint, null, { headers: { Authorization: `Bearer ${token}` } });
            request.user = response.data;
            request.oauthValidationEndpoint = validationEndpoint;
            return true;
        }
        catch (err) {
            throw new common_1.UnauthorizedException('Invalid or expired token');
        }
    }
    extractToken(request) {
        const authHeader = request.headers?.authorization;
        if (!authHeader) {
            return undefined;
        }
        const [, token] = authHeader.split(' ');
        return token;
    }
};
exports.JwtAuthGuard = JwtAuthGuard;
exports.JwtAuthGuard = JwtAuthGuard = __decorate([
    (0, common_1.Injectable)()
], JwtAuthGuard);
//# sourceMappingURL=jwt-auth.guard.js.map