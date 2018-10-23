import { v4 }  from 'uuid';

export class IdGenerator {
  static NEW_ID() {
    return v4();
  }
}
