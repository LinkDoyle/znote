import { Lexer } from './../parser/lexer';
import { Parser } from '../parser/parser';

describe('parser header', () => {
  const markdown = `# h1
## h2
### h3
`;
  const lexer = new Lexer(markdown);
  const parser = new Parser(lexer);
  it('header', () => {
    const root = parser.parse();
    console.log(root);
  });
});

describe('parser paragraph', () => {
  const markdown = `
paragraph1

paragraph2

`;
  const lexer = new Lexer(markdown);
  const parser = new Parser(lexer);
  it('paragraph', () => {
    const root = parser.parse();
    console.log(root);
  });
});
