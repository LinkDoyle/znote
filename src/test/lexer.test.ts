import { Lexer, TokenType } from '../parser/lexer';
import fs from 'fs';

describe('lexer header', () => {
  const markdown = `
# h1
## h2
### h3
#### h4
##### h5
###### h6
####### h7`;

  const lexer = new Lexer(markdown);

  const tokens = [
    (TokenType.LineBreak, '\\n'),
    (TokenType.Hash, '#'),
    (TokenType.LeadingSpace, ' '),
    (TokenType.Text, 'h1'),
    (TokenType.LineBreak, '\\n'),
    (TokenType.Hash, '##'),
    (TokenType.LeadingSpace, ' '),
    (TokenType.Text, 'h2'),
    (TokenType.LineBreak, '\\n'),
    (TokenType.Hash, '###'),
    (TokenType.LeadingSpace, ' '),
    (TokenType.Text, 'h3'),
    (TokenType.LineBreak, '\\n'),
    (TokenType.Hash, '####'),
    (TokenType.LeadingSpace, ' '),
    (TokenType.Text, 'h4'),
    (TokenType.LineBreak, '\\n'),
    (TokenType.Hash, '#####'),
    (TokenType.LeadingSpace, ' '),
    (TokenType.Text, 'h5'),
    (TokenType.LineBreak, '\\n'),
    (TokenType.Hash, '######'),
    (TokenType.LeadingSpace, ' '),
    (TokenType.Text, 'h6'),
    (TokenType.LineBreak, '\\n'),
    (TokenType.Text, '####### h7'),
    (TokenType.Eof, '[EOF]'),
  ];

  tokens.forEach(token => {
    const t = lexer.nextToken();
    it(`@ ${t.line}:${t.column}`, () => expect((t.type, t.value)).toBe(token));
  });
});

it('lexer test', () => {
  const f = fs.readFileSync(`${__dirname}/examples/example-0.md`, 'utf-8');
  const lexer = new Lexer(f);

  let tokens_actual = [];
  let t = lexer.nextToken();
  while (t.type !== TokenType.Eof && t.type !== TokenType.Unknown) {
    tokens_actual.push(t);
    t = lexer.nextToken();
  }
  tokens_actual.push(t);
  console.log(
    tokens_actual
      .map(
        t =>
          `${t.line}`.padStart(4) +
          ':' +
          `${t.column}`.padEnd(8) +
          `${TokenType[t.type]}`.padEnd(16) +
          `'${t.value}'`
      )
      .join('\n')
  );
});
