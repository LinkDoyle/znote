import Parser from '../parser/parser';
import { Scanner, TokenType } from '../parser/scanner';
import fs from 'fs';

it('scanner', () => {
  const f = fs.readFileSync(`${__dirname}/examples/example-0.md`, 'utf-8');
  const scanner = new Scanner(f);

  const tokens = [
    (TokenType.Hash, '#'),
    (TokenType.Space, ' '),
    (TokenType.Text, 'header'),
  ];

  tokens.forEach(token => {
    const t = scanner.nextToken();
    expect((t.type, t.value)).toBe(token);
  });
});

fit('scanner test', () => {
  const f = fs.readFileSync(`${__dirname}/examples/example-0.md`, 'utf-8');
  const scanner = new Scanner(f);

  let tokens_actual = [];
  let t = scanner.nextToken();
  while (t.type !== TokenType.Eof && t.type !== TokenType.Unknown) {
    tokens_actual.push(t);
    t = scanner.nextToken();
  }
  tokens_actual.push(t);
  console.log(
    tokens_actual.map(
      t =>
        `${t.line}:${t.column}`.padStart(8).padEnd(12) +
        `${TokenType[t.type]}`.padEnd(16) +
        `'${t.value}'`
    )
  );
});
