import assert from 'assert';

export enum TokenType {
  Eof = -1,
  Unknown = 0,
  Text = 1,
  Code,
  LineBreak, //'\r\n', '\n', '\r'
  LeadingSpace, // ' '
  LeadingTab, // '\t'
  Hash, // '#'
  Underlines,
  Dashes,
  Star, // '*'
  Dollar, // '$'
  GreaterThan, // '>'
  LessThan, // '<'
  LParenthesis, // '('
  RParenthesis, // ')'
  LBracket, // '['
  RBracket, // ']'
  LBrace, // '{'
  RBrace, // '}'
  Underscore, // '_'
  Backtick, // '`'
  TripleBacktick, // '```'
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

  toString(): string {
    return `${this._line}:${this._column} [${
      TokenType[this._type]
    }] "${this._value.replace(/[\\"']/g, '\\$&')}"`;
  }
}

enum Channel {
  Default,
  CodeBlock,
}

/**
 * Document := Header | Block
 * Header := '#'{1, 6} Span
 *
 * Block := Paragraph | CodeBlock
 */
export class Lexer {
  static readonly EOF: number = -1;
  private _input: string;
  private _offset: number;
  private _line: number;
  private _column: number;
  private _channel: Channel;

  constructor(input: string) {
    this._input = input;
    this._offset = 0;
    this._line = 1;
    this._column = 1;
    this._channel = Channel.Default;
  }

  private _lookahead(i: number = 0, j: number = i + 1): string | -1 {
    if (this._offset + i >= this._input.length) {
      return -1;
    }
    if (this._offset + j > this._input.length) {
      j = this._input.length - this._offset;
    }
    return this._input.substring(this._offset + i, this._offset + j);
  }

  private _consumeCharacter(count: number = 1) {
    // EOF is at `_input[_input.length]`
    if (this._offset + count > this._input.length) {
      throw "couldn't consume more character.";
    }
    this._offset += count;
    this._column += count;
  }

  private _consumeLine(characterCount: number = 1) {
    // EOF is at `_input[_input.length]`
    if (this._offset + characterCount > this._input.length) {
      throw "couldn't consume more character.";
    }
    this._offset += characterCount;
    this._line += 1;
    this._column = 1;
  }

  private _hash(): Token {
    const maxLevel = 6;
    let value = '#';
    let level = 1;
    for (; level <= maxLevel; ++level) {
      const c = this._lookahead(level);
      if (c === -1 || c !== '#') {
        break;
      }
      value += '#';
    }
    if (level > maxLevel) {
      return this._text();
    } else {
      this._consumeCharacter(level);
      return new Token(this._line, this._column, TokenType.Hash, value);
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
      this._consumeLine(2);
    } else {
      this._consumeLine();
    }
    return new Token(this._line, this._column, TokenType.LineBreak, '\\n');
  }

  private _underlines(): Token {
    let c = this._lookahead();
    let value = '';
    while (c === '=') {
      value += c;
      this._consumeCharacter();
      c = this._lookahead();
    }
    return new Token(this._line, this._column, TokenType.Underlines, value);
  }

  private _dashes(): Token {
    let c = this._lookahead();
    let value = '';
    while (c === '-') {
      value += c;
      this._consumeCharacter();
      c = this._lookahead();
    }
    return new Token(this._line, this._column, TokenType.Dashes, value);
  }

  private _tripleBacktick(): Token {
    assert.strictEqual(this._lookahead(), '`');
    this._consumeCharacter();
    assert.strictEqual(this._lookahead(), '`');
    this._consumeCharacter();
    assert.strictEqual(this._lookahead(), '`');
    this._consumeCharacter();
    return new Token(this._line, this._column, TokenType.TripleBacktick, '```');
  }

  private _enterCodeBlockChannel() {
    this._channel = Channel.CodeBlock;
  }

  private _exitCodeBlockChannel() {
    this._channel = Channel.Default;
  }

  private _codeBlockChannel(): Token {
    if (
      this._lookahead(0) === '`' &&
      this._lookahead(1) === '`' &&
      this._lookahead(2) === '`'
    ) {
      this._consumeCharacter(3);
      this._exitCodeBlockChannel();
      return new Token(
        this._line,
        this._column,
        TokenType.TripleBacktick,
        '```'
      );
    }
    let start = this._offset;
    let end = this._offset;
    for (
      let lookahead = this._lookahead(0, 3);
      lookahead !== -1 && lookahead !== '```';
      ++end
    ) {
      this._consumeCharacter();
      lookahead = this._lookahead(0, 3);
    }
    return new Token(
      this._line,
      this._column,
      TokenType.Code,
      this._input.substring(start, end)
    );
  }

  private _defaultChannel(): Token {
    let c = this._lookahead();
    switch (c) {
      case '\r':
      case '\n':
        return this._lineBreak();
      case ' ': {
        this._consumeCharacter();
        return new Token(this._line, this._column, TokenType.LeadingSpace, ' ');
      }
      case '\t': {
        this._consumeCharacter();
        return new Token(this._line, this._column, TokenType.LeadingTab, '\\t');
      }
      case '#':
        return this._hash();
      case '*': {
        this._consumeCharacter();
        return new Token(this._line, this._column, TokenType.Star, '*');
      }
      case '=':
        return this._underlines();
      case '-':
        return this._dashes();
      case '>':
        this._consumeCharacter();
        return new Token(this._line, this._column, TokenType.GreaterThan, '>');
      case '`': {
        if (this._lookahead(1) === '`' && this._lookahead(2) === '`') {
          this._enterCodeBlockChannel();
          return this._tripleBacktick();
        }
      }
      default:
        return this._text();
    }
  }

  nextToken(): Token {
    if (this._offset >= this._input.length) {
      return new Token(this._line, this._column, TokenType.Eof, '[EOF]');
    }
    let token: Token;
    switch (this._channel) {
      case Channel.Default:
        token = this._defaultChannel();
        break;
      case Channel.CodeBlock:
        token = this._codeBlockChannel();
        break;
      default:
        throw 'Unknown channel value:' + this._channel;
    }
    console.log(token.toString());
    return token;
  }
}

export default Lexer;
