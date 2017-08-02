import {AxiosPromise, AxiosRequestConfig, AxiosResponse} from 'axios';

import {MemberData} from '../';
import {HttpClient} from '../../http';
import TeamAPI from '../team/TeamAPI';

export default class MemberAPI {
  constructor(private client: HttpClient) {}

  static get URL() {
    return {
      MEMBERS: 'members',
    };
  }

  public getMembers(teamId: string): Promise<MemberData[]> {
    const config: AxiosRequestConfig = {
      method: 'get',
      url: `${TeamAPI.URL.TEAMS}/${teamId}/${MemberAPI.URL.MEMBERS}`,
    };

    return this.client.sendJSONRequest(config).then((response: AxiosResponse) => {
      return response.data;
    });
  }

  public deleteMember(teamId: string, userId: string, password: string): AxiosPromise {
    const config: AxiosRequestConfig = {
      data: {
        password,
      },
      method: 'delete',
      url: `${TeamAPI.URL.TEAMS}/${teamId}/${MemberAPI.URL.MEMBERS}/${userId}`,
    };

    return this.client.sendJSONRequest(config).then((response: AxiosResponse) => {
      return response.data;
    });
  }

  public postMembers(teamId: string, member: MemberData): AxiosPromise {
    const config: AxiosRequestConfig = {
      data: {
        member: member,
      },
      method: 'post',
      url: `${TeamAPI.URL.TEAMS}/${teamId}/${MemberAPI.URL.MEMBERS}`,
    };

    return this.client.sendJSONRequest(config).then((response: AxiosResponse) => {
      return response.data;
    });
  }

  public putMembers(teamId: string, member: MemberData): AxiosPromise {
    const config: AxiosRequestConfig = {
      data: {
        member: member,
      },
      method: 'put',
      url: `${TeamAPI.URL.TEAMS}/${teamId}/${MemberAPI.URL.MEMBERS}`,
    };

    return this.client.sendJSONRequest(config).then((response: AxiosResponse) => {
      return response.data;
    });
  }
}
