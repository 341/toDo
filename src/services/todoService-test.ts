import { todoService } from '@/services/todoService';
import type { TodoDto } from '@/types/todo';

const mockTodo: TodoDto = {
  id: '1',
  title: 'Buy milk',
  description: 'Whole milk',
  createdAt: '2026-06-23T12:00:00.000Z',
  completed: false,
};

describe('todoService', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('getAll returns todos from the API', async () => {
    const fetchMock = jest.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => [mockTodo],
    });
    global.fetch = fetchMock;

    const result = await todoService.getAll();

    expect(fetchMock).toHaveBeenCalledWith(
      'https://6a3ad3fe917c7b14c74e2173.mockapi.io/todo',
      expect.objectContaining({
        headers: expect.objectContaining({
          Accept: 'application/json',
        }),
      }),
    );
    expect(result).toEqual([mockTodo]);
  });

  it('getById returns a single todo', async () => {
    const fetchMock = jest.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => mockTodo,
    });
    global.fetch = fetchMock;

    const result = await todoService.getById('1');

    expect(fetchMock).toHaveBeenCalledWith(
      'https://6a3ad3fe917c7b14c74e2173.mockapi.io/todo/1',
      expect.any(Object),
    );
    expect(result).toEqual(mockTodo);
  });

  it('create sends defaults for completed and description', async () => {
    const createdTodo = { ...mockTodo, title: 'New todo' };
    const fetchMock = jest.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => createdTodo,
    });
    global.fetch = fetchMock;

    const result = await todoService.create({ title: 'New todo' });

    expect(fetchMock).toHaveBeenCalledWith(
      'https://6a3ad3fe917c7b14c74e2173.mockapi.io/todo',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({
          completed: false,
          description: '',
          title: 'New todo',
        }),
      }),
    );
    expect(result).toEqual(createdTodo);
  });

  it('update sends the provided fields', async () => {
    const updatedTodo = { ...mockTodo, completed: true };
    const fetchMock = jest.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => updatedTodo,
    });
    global.fetch = fetchMock;

    const result = await todoService.update('1', { completed: true });

    expect(fetchMock).toHaveBeenCalledWith(
      'https://6a3ad3fe917c7b14c74e2173.mockapi.io/todo/1',
      expect.objectContaining({
        method: 'PUT',
        body: JSON.stringify({ completed: true }),
      }),
    );
    expect(result).toEqual(updatedTodo);
  });

  it('delete calls the delete endpoint', async () => {
    const fetchMock = jest.fn().mockResolvedValue({
      ok: true,
      status: 204,
    });
    global.fetch = fetchMock;

    await todoService.delete('1');

    expect(fetchMock).toHaveBeenCalledWith(
      'https://6a3ad3fe917c7b14c74e2173.mockapi.io/todo/1',
      expect.objectContaining({
        method: 'DELETE',
      }),
    );
  });

  it('throws when the API responds with an error', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 500,
      text: async () => 'Server error',
    });

    await expect(todoService.getAll()).rejects.toThrow('Server error');
  });
});
