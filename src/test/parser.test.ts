import { Lexer } from './../parser/lexer';
import { Parser } from '../parser/parser';

describe('parser header', () => {
  const markdown = '# header';
  const lexer = new Lexer(markdown);
  const parser = new Parser(lexer);
  it('header', () => {
    const root = parser.parse();
    console.log(root);
  });
});
