export interface Category {
  id: string;
  name: string;
  color: string; // Para que se vea genial en la UI
}

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  categoryId: string;
}