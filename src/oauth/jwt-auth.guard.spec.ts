import axios from 'axios';
import { UnauthorizedException } from '@nestjs/common';
import { ExecutionContext } from '@nestjs/common';
import { JwtAuthGuard } from './jwt-auth.guard';

jest.mock('axios');

const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('JwtAuthGuard', () => {
  let guard: JwtAuthGuard;
  const originalEnv = process.env;

  const createContext = (request: Record<string, any>): ExecutionContext =>
    ({
      switchToHttp: () => ({
        getRequest: () => request,
      }),
    } as unknown as ExecutionContext);

  beforeEach(() => {
    jest.resetAllMocks();
    guard = new JwtAuthGuard();
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it('should short-circuit when DISABLE_AUTH=true', async () => {
    process.env.DISABLE_AUTH = 'true';
    const request: any = { headers: {} };

    const result = await guard.canActivate(createContext(request));

    expect(result).toBe(true);
    expect(request.user).toEqual({ sub: 'dev', roles: [] });
  });

  it('should reject requests without bearer token', async () => {
    process.env.DISABLE_AUTH = 'false';
    const request: any = { headers: {} };

    await expect(guard.canActivate(createContext(request))).rejects.toBeInstanceOf(
      UnauthorizedException,
    );
  });

  it('should call OAuth service and attach user data on success', async () => {
    const payload = { sub: 'user-1' };
    mockedAxios.post.mockResolvedValue({ data: payload } as any);
    process.env.OAUTH_INTERNAL_PROTOCOL = 'http';
    process.env.OAUTH_INTERNAL_HOST = 'oauth';
    process.env.OAUTH_INTERNAL_API_PORT = '8180';

    const request: any = { headers: { authorization: 'Bearer token-123' } };

    const result = await guard.canActivate(createContext(request));

    expect(result).toBe(true);
    expect(mockedAxios.post).toHaveBeenCalledWith(
      'http://oauth:8180/api/v1/validate',
      null,
      { headers: { Authorization: 'Bearer token-123' } },
    );
    expect(request.user).toEqual(payload);
    expect(request.oauthValidationEndpoint).toBe('http://oauth:8180/api/v1/validate');
  });

  it('should honor OAUTH_VALIDATE_URL when provided', async () => {
    const payload = { sub: 'custom-url' };
    mockedAxios.post.mockResolvedValue({ data: payload } as any);
    process.env.OAUTH_VALIDATE_URL = 'https://auth.example.com/validate';

    const request: any = { headers: { authorization: 'Bearer token-custom' } };

    await guard.canActivate(createContext(request));

    expect(mockedAxios.post).toHaveBeenCalledWith(
      'https://auth.example.com/validate',
      null,
      { headers: { Authorization: 'Bearer token-custom' } },
    );
  });

  it('should fallback to default OAuth endpoint when env vars are missing', async () => {
    delete process.env.OAUTH_INTERNAL_PROTOCOL;
    delete process.env.OAUTH_INTERNAL_HOST;
    delete process.env.OAUTH_INTERNAL_API_PORT;
    mockedAxios.post.mockResolvedValue({ data: { sub: 'default' } } as any);
    const request: any = { headers: { authorization: 'Bearer token-default' } };

    await guard.canActivate(createContext(request));

    expect(mockedAxios.post).toHaveBeenCalledWith(
      'http://oauth:8000/api/v1/validate',
      null,
      { headers: { Authorization: 'Bearer token-default' } },
    );
  });

  it('should translate OAuth errors to UnauthorizedException', async () => {
    mockedAxios.post.mockRejectedValue(new Error('invalid token'));
    const request: any = { headers: { authorization: 'Bearer bad' } };

    await expect(guard.canActivate(createContext(request))).rejects.toBeInstanceOf(
      UnauthorizedException,
    );
  });
});
