/***
 * Defines a crowdsourcing Project.
 */
export interface Project {
  /**
   * The client name for the project.
   */
  name: string;
}

export interface ProjectChild {
  id?: string;
  project?: string;
}

export interface Task extends ProjectChild {}

export interface Asset extends ProjectChild {}
