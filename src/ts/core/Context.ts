export default class Context {
  public clientID: string;
  public environment: string;
  public userID: string;

  constructor(userID: string, clientID?: string) {
    this.clientID = clientID;
    this.userID = userID;
  }
}