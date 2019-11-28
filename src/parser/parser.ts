import { Lexer } from './lexer';
import { Document } from './ast';

export class Parser {
  private _lexer: Lexer;
  public get lexer(): Lexer {
    return this._lexer;
  }
  public set lexer(v: Lexer) {
    this._lexer = v;
  }

  constructor(lexer: Lexer) {
    this._lexer = lexer;
  }

  parseDocument(): Document {
    const document = new Document();
    return document;
  }

  parse(): Node {
    return new Node();
  }
}

export default Parser;
