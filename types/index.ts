export interface Project {
  name: string;
}

interface ProjectChild {
  id?: string;
  project?: string;
}

export interface Task extends ProjectChild {}

export interface Asset extends ProjectChild {}
