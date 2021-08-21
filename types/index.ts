/**
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

/**
 * Defines a task in a {@link Project}
 */
export interface Task extends ProjectChild {}

/**
 * Defines an asset in a {@link Project}
 */
export interface Asset extends ProjectChild {}

/**
 * Defines options for all search operations.
 */
export interface SearchOptions {
  /**
   * The start index for results.
   */
  from: number,

  /**
   * The number of results to return.
   */
  size: number
}
