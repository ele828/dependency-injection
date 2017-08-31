/**
 * Valid metadata for Module decorator
 * TODO: needs to be more specific
 */
export interface ModuleMetadata extends Object {}

/**
 * Valid metadata for ModuleFactory decorator
 * TODO: needs to be more specific
 */
export interface ModuleFactoryMetadata extends Object {}

export type Metadata = ModuleMetadata | ModuleFactoryMetadata;