/* eslint-disable @typescript-eslint/ban-ts-comment */
import { authenticate } from '../src/auth/index';

jest.mock('../src/client/create.client', () => ({
  createApiRoot: jest.fn(),
}));

describe('authenticate', () => {
  test('should call createApiRoot().login().post() with the correct parameters', async () => {
    const email = 'testuser@abc.com';
    const password = 'testpassword';
    const mockPost = jest.fn().mockReturnValue({
      execute: jest.fn().mockResolvedValueOnce({ asd: 234 }),
    });
    const mockApiRoot = {
      login: jest.fn().mockReturnValue({
        post: mockPost,
      }),
    };

    require('../src/client/create.client').createApiRoot.mockReturnValue(
      mockApiRoot
    );

    await authenticate(email, password);

    expect(mockApiRoot.login).toHaveBeenCalledTimes(1);
    expect(mockApiRoot.login).toHaveBeenCalledWith();

    expect(mockPost).toHaveBeenCalledTimes(1);
    expect(mockPost).toHaveBeenCalledWith({
      body: { email, password },
    });
  });
});
