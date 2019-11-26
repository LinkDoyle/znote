export enum TokenType {
    Eof = -1,
    Unknown = 0,
    Text = 1,
    LineBreak, // \n
    Hash, // #
    Star, // *
    Dollar, // $
    GT, // >
    LT, // <
    Underscore, // _
    Backtick, // `
}

export class Token {
    private _type : TokenType;
    public get type() : TokenType {
        return this._type;
    }
    public set type(v : TokenType) {
        this._type = v;
    }
    
    
    private _value : string;
    public get value() : string {
        return this._value;
    }
    public set value(v : string) {
        this._value = v;
    }

    
    private _line : number;
    public get line() : number {
        return this._line;
    }
    public set line(v : number) {
        this._line = v;
    }
    
    
    private _column : number;
    public get column() : number {
        return this._column;
    }
    public set column(v : number) {
        this._column = v;
    }
    
    constructor(line: number, column: number, type: TokenType, value: string = `[${TokenType[type]}]`) {
        this._type = type;
        this._value = value;
        this._line = line;
        this._column = column;
    }
}

export class Scanner {
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

    nextToken(): Token {
        let offset = this._offset;
        const length = this._input.length;
        if(offset > length)
        {
            return new Token(this._line, this._column, TokenType.Eof);
        }
        let next = this._input[offset];
        while(true) {
            switch (next) {
                case '#':
                    {
                        let level = 0;
                        do {
                            level += 1;
                            offset += 1;
                            next = this._input[offset];
                        } while (offset < length && level < 6 && next == '#');
                        this._offset = offset;
                        this._column += 1;
                        return new Token(this._line, this._column, TokenType.Hash, '#'.repeat(level));
                    }
                 case '\n':
                    this._offset += 1;
                    this._line += 1;
                    this._column = 1;
                    next = this._input[this._offset];
                    return new Token(this._line, this._column, TokenType.LineBreak, '\\n');
                case ' ':
                    {
                        const start = offset;
                        while((next = this._input[++offset]) == ' ' && offset < length)
                            ;
                        this._offset = offset;
                        this._column += offset - start;
                        continue;
                    }
                default:
                    const start = offset;
                    while('\n*_`'.indexOf(next) == -1 && offset < length) {
                        next = this._input[++offset];
                    }
                    if(start == offset)
                    {
                        return new Token(this._line, this._column, TokenType.Unknown, next);
                    }
                    this._offset = offset;
                    return new Token(this._line, this._column, TokenType.Text, this._input.substring(start, offset));
            }
        }
    }
};

export default Scanner;
