import { Scanner } from './scanner';
import { Document } from './ast';

export class Parser {
  private _scanner: Scanner;
  public get scanner(): Scanner {
    return this._scanner;
  }
  public set scanner(v: Scanner) {
    this._scanner = v;
  }

  constructor(scanner: Scanner) {
    this._scanner = scanner;
  }

  parseDocument(content: string): Document {
    const document = new Document();
    return document;
  }
}

export default Parser;
