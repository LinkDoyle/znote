/**
 * Node
 */
export class Node {
  constructor() {
    this._line = 0;
    this._begin = 0;
    this._end = 0;
    this._textBegin = 0;
    this._textEnd = 0;
  }

  protected _line: number;
  public get line(): number {
    return this._line;
  }
  public set line(v: number) {
    this._line = v;
  }

  protected _begin: number;
  public get begin(): number {
    return this._begin;
  }
  public set begin(v: number) {
    this._begin = v;
  }

  protected _end: number;
  public get end(): number {
    return this._end;
  }
  public set end(v: number) {
    this._end = v;
  }

  protected _textBegin: number;
  public get textBegin(): number {
    return this._textBegin;
  }
  public set textBegin(v: number) {
    this._textBegin = v;
  }

  protected _textEnd: number;
  public get textEnd(): number {
    return this._textEnd;
  }
  public set textEnd(v: number) {
    this._textEnd = v;
  }

  accept(visitor: IVisitor) {
    visitor.visit(this);
  }
}

/**
 * Document
 */
export class Document extends Node {
  constructor() {
    super();
    this._title = 'document';
    this._children = [];
  }

  private _title: string;
  public get title(): string {
    return this._title;
  }
  public set title(v: string) {
    this._title = v;
  }

  private readonly _children: Node[];
  public get children(): Node[] {
    return this._children;
  }
}

/**
 * # Header
 * `#` to `######`
 */
export class Header extends Node {
  constructor() {
    super();
    this._level = 1;
    this._text = null;
  }

  private _level: number;
  public get level(): number {
    return this._level;
  }
  public set level(v: number) {
    this._level = v;
  }

  private _text: Text | null;
  public get text(): Text | null {
    return this._text;
  }
  public set text(v: Text | null) {
    this._text = v;
  }
}

/**
 * > blockquote
 */
export class Blockquote extends Node {}

/**
 * List
 */
export class List extends Node {
  constructor() {
    super();
    this._items = [];
  }

  private _items: ListItem[];
  public get items(): ListItem[] {
    return this._items;
  }
  public set items(v: ListItem[]) {
    this._items = v;
  }
}

/**
 * * ListItem
 */
export class ListItem extends Node {
  constructor() {
    super();
  }
}

/**
 * ```code
 *    ...
 * ```
 */
export class CodeBlock extends Node {
  constructor() {
    super();
    this._language = '';
  }

  private _language: string;
  public get language(): string {
    return this._language;
  }
  public set language(v: string) {
    this._language = v;
  }
}

/**
 * Horizontal
 */
export class Horizontal extends Node {
  constructor() {
    super();
  }
}

/**
 * Span
 */
export class Span extends Node {
  constructor() {
    super();
  }
}

/**
 * Text
 */
export class Text extends Node {
  constructor() {
    super();
  }
}

/**
 * Link
 */
export class Link extends Span {
  constructor() {
    super();
  }
}

/**
 * `*emphasis*`, `_emphasis_`
 * `**emphasis**`, `__emphasis__`
 * `~emphasis~`
 * `=emphasis=`
 */
export class Emphasis extends Span {
  constructor() {
    super();
    this._decorator = '';
  }

  private _decorator: string;
  public get decorator(): string {
    return this._decorator;
  }
  public set decorator(v: string) {
    this._decorator = v;
  }
}

/**
 * `code`
 */
export class Code extends Span {
  constructor() {
    super();
  }
}

/**
 * ![img](href)
 */
export class Image extends Node {
  constructor() {
    super();
  }
}

/**
 * `$math$`
 */
export class Math extends Span {}

/**
 * Block
 */
export class Block extends Node {}

/**
 * ```
 * \begin{foo}
 *   math
 * \end{foo}
 * ```
 */
export class MathBlock extends Block {}

/**
 * Extension
 */
export class Extension extends Block {}

/**
 * IVisitor
 */
export interface IVisitor {
  visit(node: Node): void;
  visit(node: Block): void;
  visit(node: Document): void;
  visit(node: Header): void;
  visit(node: Span): void;
  visit(node: Text): void;
  visit(node: Emphasis): void;
  visit(node: List): void;
  visit(node: ListItem): void;
  visit(node: Code): void;
  visit(node: CodeBlock): void;
  visit(node: Math): void;
  visit(node: MathBlock): void;
  visit(node: Extension): void;
}
