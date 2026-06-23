export type TodoDto = {
  id: string;
  title: string;
  createdAt: string;
};

export type CreateTodoDto = {
  title: string;
};

export type UpdateTodoDto = {
  title: string;
};
