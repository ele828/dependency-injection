import Client from './Client'

// Needs some configuration to the DI framework

@ModuleFactory({
  providers: [
    Client,
    Log4JS,
    RecentCalls,
    { provide: Logger },
    // Token and Class is different
    { provide: Logger, useClass: WinstonLogger },
    // Replace provider by a new implementation
    // Or change to use an existing one
    { provide: Logger, useExisting: Log4JS },
    // Inject values (usually used for configurations)
    { provide: 'Options', useValue: { appKey: '' }, spread: true },
    { provide: AnalyticsOptions, useValue: { appKey: '' }, spread: true },

    { provide: MyPhoneOptions, useValue: { brandId: 1}, spread: true },
    // Factory method can be used to instantiate special class
    // like external class or configuration class, etc.
    // Also, instances is decided at runtime should also be init in Factory
    { provide: UsersService, 
      useFactory: (chatService) => {
          return Promise.resolve(chatService.getValue());
      },
      deps: [ ChatService ] }
  ],
  // Set entrypoint of modules
})
class Phone extends RcModule {
  constructor(...submodules) {
    for (const module of submodules) {
      const moduleName = module.constructor.name
      this.addModule(moduleName, module)
      if (module._metadata.registerReducer)
        this._reducer[moduleName] = module.reducer
      if (module._metadata.registerProxyReducer)
        this._proxyReducer[moduleName] = module.reducer
      module._getState = () => this.state[moduleName]
    }
  }
}

/**
 * Module inheritance
 */
@ModuleFactory({
  providers: []
})
class MyPhone extends Phone {

}

Injector.bootstrap(MyPhone)
const phone = Injector.get('Phone')

@Module({
  deps: [ Logger, Client, messageStore ]
})
class TestModule {}

class SimplePhone {}

@Module({
  deps: [
     'Options',
     'MyPhoneOptions'
  ],
})
MyPhone._metadata = {
  params: {

  }
}

class MyPhone extends SimplePhone {

}

@Module({
  deps: [ 'Logger', 'Client', 'MessageStore', 'Options' ],
  metadata: { registerProxyReducer: true, registerReducer: false }
})
class RecentCalls extends RcModule {
  constructor({
    logger,
    client,
    messageStore,
    ...options 
  }) {
    super();
    this.logger = logger;
    this.client = client;
    this.messageStore = messageStore;
  }
}

// Create Token