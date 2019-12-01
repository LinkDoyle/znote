import { Lexer, TokenType, Token } from './lexer';
import { Document, Node, Header, Code, Text } from './ast';

export class Parser {
  private _lexer: Lexer;
  public get lexer(): Lexer {
    return this._lexer;
  }
  public set lexer(v: Lexer) {
    this._lexer = v;
  }

  private _currentToken: Token;
  public get currentToken(): Token {
    return this._currentToken;
  }

  constructor(lexer: Lexer) {
    this._lexer = lexer;
    this._currentToken = this.lexer.nextToken();
  }

  private consume() {
    this._currentToken = this.lexer.nextToken();
  }

  private parseDocument(): Document {
    let document = new Document();

    while (this._currentToken.type !== TokenType.Eof) {
      switch (this._currentToken.type) {
        case TokenType.Hash:
          document.children.push(this.parseHeader());
          break;
        case TokenType.Text:
          document.children.push(this.parseText());
          break;
        default:
          this.consume();
      }
    }
    return document;
  }

  private parseHeader(): Header {
    let header = new Header();
    header.level = this._currentToken.value.length;
    this.consume();
    while (this._currentToken.type === TokenType.LeadingSpace) {
      this.consume();
    }
    header.text = this.parseText();
    return header;
  }

  private parseText() {
    let text = new Text();
    while (this._currentToken.type === TokenType.Text) {
      text.value = this._currentToken.value;
      this.consume();
    }
    return text;
  }

  private parseCode() {
    let code = new Code();
    this.consume();
    return code;
  }

  parse(): Node {
    return this.parseDocument();
  }
}

export default Parser;
