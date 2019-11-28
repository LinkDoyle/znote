import { Lexer } from './lexer';
import { Document, Node, Header } from './ast';

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

  private _document(): Document {
    let document = new Document();
    return document;
  }

  private _header(): Header {
    let header = new Header();
    return header;
  }

  private _text() {}

  private _code() {}

  parseDocument(): Document {
    const document = new Document();
    return document;
  }

  parse(): Node {
    return this._document();
  }
}

export default Parser;
