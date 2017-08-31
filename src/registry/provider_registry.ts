import Token from "../types/token";
import { Provider } from "../types/provider";

/**
 * ProviderRegistry is a centralized structure for storing provider metadata.
 * It's a map data structure mapping Token to Provider.
 */
export default class ProviderRegistry extends Map<Token, Provider[]> {
  get(token: Token) {
    if (!this.has(token)) {
      throw new Error(`Can not find token {${token}} in ProviderRegistry`);
    }
    return super.get(token);
  }

  set(token: Token, providers: Provider[]) {
    if (this.has(token)) {
      throw new Error(`Can only register {${token}} once`);
    }
    return super.set(token, providers);
  }
}