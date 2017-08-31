import Klass from './klass';
import Token from './token';

/**
 * Defines a module dependency by using Class definitions
 */
export interface KlassDependency extends Klass<any> {}

/**
 * Defines a module dependency by using Tokens
 */
export interface TokenDependency extends Token {}

export type Dependency = KlassDependency | TokenDependency;