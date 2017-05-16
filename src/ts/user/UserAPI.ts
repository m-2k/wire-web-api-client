import axios, {AxiosInstance, AxiosPromise, AxiosRequestConfig, AxiosResponse} from 'axios';

import ContentType from '../http/ContentType';
import HttpClient from '../http/HttpClient';
import UserData from "./UserData";

export default class UserAPI {
  constructor(private client: HttpClient) {
  }

  static get URL() {
    return {
      CONNECTIONS: '/connections',
      PROPERTIES: '/properties',
      SELF: '/self',
      USERS: '/users'
    };
  }

  public getSelf(): Promise<UserData> {
    const config: AxiosRequestConfig = {
      baseURL: this.client.baseURL,
      method: 'get',
      url: UserAPI.URL.SELF
    };

    return this.client.sendJSONRequest(config).then((response: AxiosResponse) => new UserData(response.data));
  }
}
