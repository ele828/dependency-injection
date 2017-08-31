import { expect } from 'chai';
import ModuleFactory from '../src/decorators/module_factory';
import Module from '../src/decorators/module';
import Injector from '../src/injector';

describe('Module Decorator', () => {
  it ('should work', () => {
    class Logger {}
    @Module({
      deps: ['Logger', 'GlobalConfig']
    })
    class TestModule {}

    @ModuleFactory({
      providers: [
        Logger
      ]
    })
    class RootModule {}

    @ModuleFactory({
      providers: [
        TestModule,
        { provide: 'GlobalConfig', useValue: { appKey: '123' }, spread: true}
      ]
    })
    class EntryModuleFactory extends RootModule {}
    const instance = Injector.bootstrap(EntryModuleFactory);
  });
});

describe('ModuleFactory Decorator', () => {
  it ('should work', () => {
    @ModuleFactory({
      providers: []
    })
    class RootModuleFactory {}
    @ModuleFactory({
      providers: []
    })
    class Factory extends RootModuleFactory {}
  });
});