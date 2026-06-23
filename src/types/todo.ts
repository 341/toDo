export type TodoDto = {
  id: string;
  title: string;
  createdAt: string;
  completed: boolean;
};

export type CreateTodoDto = {
  title: string;
  completed?: boolean;
};

export type UpdateTodoDto = {
  title?: string;
  completed?: boolean;
};
