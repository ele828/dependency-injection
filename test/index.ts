import { expect } from 'chai';
import ModuleFactory from '../src/decorators/module_factory';
import Module from '../src/decorators/module';
import Injector from '../src/injector';

describe('Module Decorator', () => {
  it ('should work', () => {
    @Module()
    class Logger {}

    @Module({
      deps: ['Logger', 'GlobalConfig']
    })
    class TestModule {
      constructor({ Logger, appKey }) {
        console.log('-> Logger:', Logger);
        console.log('-> appKey:', appKey);
      }
    }

    @ModuleFactory({
      providers: [
        Logger
      ]
    })
    class RootModule {
      constructor({ Logger }) {
        console.log('-> Logger:', Logger);
      }
      static bootstrap() {
        return Injector.bootstrap(this);
      }
    }

    @ModuleFactory({
      providers: [
        TestModule,
        { provide: 'GlobalConfig', useValue: { appKey: '123' }, spread: true }
      ]
    })
    class EntryModule extends RootModule {
      constructor(params) {
        super(params);
      }
    }
    const instance = EntryModule.bootstrap();
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