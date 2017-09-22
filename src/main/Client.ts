import AccessTokenStore from './auth/AccessTokenStore';
import Config from './Config';
import {AccessTokenData, AuthAPI, Context, LoginData, RegisterData} from './auth';
import {AssetAPI} from './asset/';
import {Backend} from './env';
import {ClientAPI} from './client/';
import {ConnectionAPI} from './connection/';
import {ConversationAPI} from './conversation/';
import {GiphyAPI} from './giphy/';
import {HttpClient} from './http/';
import {MemoryEngine} from '@wireapp/store-engine/dist/commonjs/engine';
import {SelfAPI} from './self/';
import {MemberAPI, PaymentAPI, TeamAPI, TeamInvitationAPI} from './team/';
import {UserAPI} from './user/';
import {WebSocketClient} from './tcp/';

class Client {
  public asset: {api: AssetAPI} = {
    api: undefined,
  };

  public auth: {api: AuthAPI} = {
    api: undefined,
  };

  public client: {api: ClientAPI; http: HttpClient; ws: WebSocketClient} = {
    api: undefined,
    http: undefined,
    ws: undefined,
  };

  public context: Context = undefined;

  public connection: {api: ConnectionAPI} = {
    api: undefined,
  };

  public conversation: {api: ConversationAPI} = {
    api: undefined,
  };

  public giphy: {api: GiphyAPI} = {
    api: undefined,
  };

  public self: {api: SelfAPI} = {
    api: undefined,
  };

  public teams: {
    team: {api: TeamAPI};
    member: {api: MemberAPI};
    invitation: {api: TeamInvitationAPI};
    payment: {api: PaymentAPI};
  } = {
    team: {api: undefined},
    member: {api: undefined},
    invitation: {api: undefined},
    payment: {api: undefined},
  };

  public user: {api: UserAPI} = {
    api: undefined,
  };

  public static BACKEND = Backend;
  public VERSION: string;

  private accessTokenStore: AccessTokenStore;
  private config: Config;

  constructor(config: Config) {
    this.config = {
      store: new MemoryEngine('wire'),
      urls: Client.BACKEND.PRODUCTION,
      ...config,
    };

    this.accessTokenStore = new AccessTokenStore(this.config.store);

    this.client.http = new HttpClient(this.config.urls.rest, this.accessTokenStore);
    this.client.ws = new WebSocketClient(this.config.urls.ws, this.client.http);

    this.asset.api = new AssetAPI(this.client.http);
    this.auth.api = new AuthAPI(this.client.http, this.config.store);
    this.client.api = new ClientAPI(this.client.http);
    this.connection.api = new ConnectionAPI(this.client.http);
    this.conversation.api = new ConversationAPI(this.client.http);
    this.giphy.api = new GiphyAPI(this.client.http);
    this.self.api = new SelfAPI(this.client.http);
    this.teams.invitation.api = new TeamInvitationAPI(this.client.http);
    this.teams.member.api = new MemberAPI(this.client.http);
    this.teams.payment.api = new PaymentAPI(this.client.http);
    this.teams.team.api = new TeamAPI(this.client.http);
    this.user.api = new UserAPI(this.client.http);

    this.client.http.authAPI = this.auth.api;
  }

  public init(): Promise<Context> {
    return this.accessTokenStore
      .init()
      .then((accessToken: AccessTokenData) => (accessToken ? accessToken : this.auth.api.postAccess()))
      .then((accessToken: AccessTokenData) => this.accessTokenStore.updateToken(accessToken))
      .then((accessToken: AccessTokenData) => this.createContext(accessToken.user));
  }

  public login(loginData: LoginData): Promise<Context> {
    return Promise.resolve()
      .then(() => this.context && this.logout())
      .then(() => this.auth.api.postLogin(loginData))
      .then((accessToken: AccessTokenData) => this.accessTokenStore.updateToken(accessToken))
      .then((accessToken: AccessTokenData) => this.createContext(accessToken.user));
  }

  public register(registerData: RegisterData): Promise<Context> {
    return Promise.resolve()
      .then(() => this.context && this.logout())
      .then(() => this.auth.api.postRegister(registerData))
      .then(() => this.init());
  }

  public logout(): Promise<void> {
    return this.auth.api
      .postLogout()
      .then(() => this.disconnect())
      .then(() => this.accessTokenStore.delete())
      .then(() => (this.context = undefined));
  }

  public connect(): Promise<WebSocketClient> {
    return this.client.ws.connect(this.context.clientID);
  }

  private createContext(userID: string): Context {
    if (this.context) {
      throw new Error(`There is already a context with user ID '${userID}'.`);
    }

    this.context = new Context(userID);
    return this.context;
  }

  public disconnect(): void {
    this.client.ws.disconnect();
  }
}

Client.prototype.VERSION = require('../../package.json').version;

export = Client;
