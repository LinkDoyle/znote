export enum TokenType {
  Eof = -1,
  Unknown = 0,
  Text = 1,
  LineBreak, //'\r\n', '\n', '\r'
  Space, // ' '
  Tab, // '\t'
  Hash, // '#'
  Star, // '*'
  Dollar, // '$'
  GT, // '>'
  LT, // '<'
  Underscore, // '_'
  Backtick, // '`'
}

export class Token {
  private _type: TokenType;
  public get type(): TokenType {
    return this._type;
  }
  public set type(v: TokenType) {
    this._type = v;
  }

  private _value: string;
  public get value(): string {
    return this._value;
  }
  public set value(v: string) {
    this._value = v;
  }

  private _line: number;
  public get line(): number {
    return this._line;
  }
  public set line(v: number) {
    this._line = v;
  }

  private _column: number;
  public get column(): number {
    return this._column;
  }
  public set column(v: number) {
    this._column = v;
  }

  constructor(
    line: number,
    column: number,
    type: TokenType,
    value: string = `[${TokenType[type]}]`
  ) {
    this._type = type;
    this._value = value;
    this._line = line;
    this._column = column;
  }
}

/**
 * Document := Header | Block
 * Header := '#'{1, 6} Span
 *
 * Block := Paragraph | CodeBlock
 */
export class Scanner {
  static readonly EOF: number = -1;
  private _input: string;
  private _offset: number;
  private _line: number;
  private _column: number;

  constructor(input: string) {
    this._input = input;
    this._offset = 0;
    this._line = 1;
    this._column = 1;
  }

  private _lookahead(i: number = 0): string | -1 {
    if (this._offset + i >= this._input.length) {
      return -1;
    }
    return this._input[this._offset + i];
  }

  private _consumeCharacter() {
    this._offset += 1;
    this._column += 1;
  }

  private _consumeLine() {
    this._offset += 1;
    this._line += 1;
    this._column = 1;
  }

  private _hash(): Token {
    const maxLevel = 6;
    let value = '#';
    let i = 1;
    for(; i < maxLevel; ++i) {
        if(this._lookahead(i) !== '#') {
          break;
        }
        value += '#';
    }
    if(i === maxLevel) {
      return this._text();
    } else {
      for(let j = 0; j < i; ++j) {
        this._consumeCharacter();
      }
      return new Token(
        this._line,
        this._column,
        TokenType.Hash,
        value
      );
    }
  }

  private _text(): Token {
    let c = this._lookahead();
    let value = '';
    while (c !== -1 && c !== '\r' && c !== '\n') {
      value += c;
      this._consumeCharacter();
      c = this._lookahead();
    }
    return new Token(this._line, this._column, TokenType.Text, value);
  }

  private _lineBreak(): Token {
    let c = this._lookahead();
    if (c === '\r' && this._lookahead(1) === '\n') {
        this._consumeLine();
      }
      this._consumeLine();
      return new Token(
        this._line,
        this._column,
        TokenType.LineBreak,
        '\\n'
      );
  }

  nextToken(): Token {
    let offset = this._offset;
    const length = this._input.length;
    if (offset >= length) {
      return new Token(this._line, this._column, TokenType.Eof);
    }
    let c = this._lookahead();
    while (true) {
      switch (c) {
        case '#':
          return this._hash();
        case '\r':
        case '\n':
          return this._lineBreak();
        case ' ': {
          this._consumeLine();
          return new Token(this._line, this._column, TokenType.Space, ' ');
        }
        case '\t': {
          this._consumeLine();
          return new Token(this._line, this._column, TokenType.Tab, '\\t');
        }
        case '*': {
          this._consumeCharacter();
          return new Token(this._line, this._column, TokenType.Star, '*');
        }
        default:
          return this._text();
      }
    }
  }
}

export default Scanner;
