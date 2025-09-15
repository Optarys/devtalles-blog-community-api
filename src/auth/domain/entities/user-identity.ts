import { OAuthProvider } from "../value-objects/oauth-provider";
import { Entity } from "../value-objects/entity";
import { User } from "./user";

export class UserIdentity extends Entity<string> {
  private _provider: OAuthProvider;
  private _providerUserId: string;
  private _providerUserData?: Record<string, any>;
  private _user: User;

  private constructor(
    id: string,
    provider: OAuthProvider,
    providerUserId: string,
    user: User,
    providerUserData?: Record<string, any>
  ) {
    super(id);
    this._provider = provider;
    this._providerUserId = providerUserId;
    this._user = user;
    this._providerUserData = providerUserData;
  }

  public static create(props: {
    id: string;
    provider: OAuthProvider;
    providerUserId: string;
    user: User;
    providerUserData?: Record<string, any>;
  }): UserIdentity {
    return new UserIdentity(
      props.id,
      props.provider,
      props.providerUserId,
      props.user,
      props.providerUserData
    );
  }

  get provider(): OAuthProvider {
    return this._provider;
  }

  get providerUserId(): string {
    return this._providerUserId;
  }

  get providerUserData(): Record<string, any> | undefined {
    return this._providerUserData;
  }

  get user(): User {
    return this._user;
  }
}
