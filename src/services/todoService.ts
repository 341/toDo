import type { CreateTodoDto, TodoDto, UpdateTodoDto } from '@/types/todo';

const BASE_URL = 'https://6a3ad3fe917c7b14c74e2173.mockapi.io';
const RESOURCE_PATH = '/todo';

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${BASE_URL}${path}`, {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...init?.headers,
    },
    ...init,
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `Request failed with status ${response.status}`);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}

export const todoService = {
  getAll(): Promise<TodoDto[]> {
    return request<TodoDto[]>(RESOURCE_PATH);
  },

  getById(id: string): Promise<TodoDto> {
    return request<TodoDto>(`${RESOURCE_PATH}/${id}`);
  },

  create(data: CreateTodoDto): Promise<TodoDto> {
    return request<TodoDto>(RESOURCE_PATH, {
      method: 'POST',
      body: JSON.stringify({
        completed: false,
        ...data,
      }),
    });
  },

  update(id: string, data: UpdateTodoDto): Promise<TodoDto> {
    return request<TodoDto>(`${RESOURCE_PATH}/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  delete(id: string): Promise<void> {
    return request<void>(`${RESOURCE_PATH}/${id}`, {
      method: 'DELETE',
    });
  },
};
