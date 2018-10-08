export interface IUserInfo {
  id?: string;
  username: string;
  email?: string;
  phone?: string;
  password?: string;
  role?: string;
  // user JWT token
  token?: string;
  // private key for this identity
  privateKey?: string;
  // certificate for this identity
  certificate?: string;
  // root certificate for this ca
  rootCertificate?: string;
  // mspId
  mspId?: string;
}

