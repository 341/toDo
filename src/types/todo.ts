export type StatusFilter = 'all' | 'active' | 'completed';

export type TodoDto = {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  completed: boolean;
};

export type CreateTodoDto = {
  title: string;
  description?: string;
  completed?: boolean;
};

export type UpdateTodoDto = {
  title?: string;
  description?: string;
  completed?: boolean;
};
