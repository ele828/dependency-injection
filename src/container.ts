import Token from "./types/token";

export default class Container<T> extends Map<Token, T> {
  get(token: Token) {
    if (!this.has(token)) {
      throw new Error(`Can not find token {${token}} in Container`);
    }
    return super.get(token);
  }

  set(token: Token, metadata: T) {
    if (this.has(token)) {
      throw new Error(`Can not save duplicated token {${token}} to Container`);
    }
    return super.set(token, metadata);
  }
}