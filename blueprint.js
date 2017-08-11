import Client from './Client'

// Needs some configuration to the DI framework

@Module({
  providers: [
    Client,
    Log4JS,
    RecentCalls,
    // Token and Class is different
    { provide: Logger, useClass: WinstonLogger },
    // Replace provider by a new implementation
    // Or change to use an existing one
    { provide: Logger, useExisting: Log4JS },
    // Inject values (usually used for configurations)
    { provide: Options, useValue: { appKey: '' }, spread: true },
    { provide: AnalyticsOptions, useValue: { appKey: '' }, spread: true },
    { provide: Brand },
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
  bootstrap: [Phone]
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

@Module({
  providers: [ 'Logger', 'Client', 'MessageStore', 'Options' ],
  metadata: { registerProxyReducer: true }
})
class RecentCalls extends RcModule {
  constructor({
    logger,
    client,
    messageStore,
    ...options 
  }) {
    this.logger = logger;
    this.client = client;
    this.messageStore = messageStore;
  }
}

// Create Token