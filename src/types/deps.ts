import Klass from './klass';
import Token from './token';

/**
 * Defines a module dependency by using Class definitions
 */
export interface KlassDeps extends Klass<any> {}

/**
 * Defines a module dependency by using Tokens
 */
export interface TokenDeps extends Token {}

export type Deps = KlassDeps | TokenDeps;