import { expect } from 'chai';
import ModuleFactory from '../src/decorators/module_factory';

describe('ModuleFactory Decorator', () => {
  it ('should work', () => {
    @ModuleFactory()
    class RootModule {}
  })
});