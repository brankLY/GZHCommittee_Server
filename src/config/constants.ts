import * as path from 'path';

const networkConfigPath = path.resolve(__dirname, './network.yaml');
const org1ConfigPath = path.resolve(__dirname, './org1.yaml');
export const FabricNetConfigPath: string[] = [ networkConfigPath, org1ConfigPath ];

export const MSP_URL: string = process.env.MSP_URL || 'http://114.115.158.243:3001/api/v1';
