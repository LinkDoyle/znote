import Parser from '../parser/parser'
import {Scanner, TokenType} from '../parser/scanner'
import fs from 'fs';

it('scanner', () => {
    const f = fs.readFileSync(`${__dirname}/examples/example-0.md`, 'utf-8');
    console.log(f);
    const scanner = new Scanner('# header');

    const tokens = [
        (TokenType.Hash, '#'),
        (TokenType.Text, 'header'),
    ];

    tokens.forEach(token => {
        const t = scanner.nextToken();
        expect((t.type, t.value), `${token.line}:${token.column}`).toBe(token);
    });
});
