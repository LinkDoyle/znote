import { Document } from './ast';

export class Parser {
    constructor()
    {

    }

    parse(content: string) : Document {
        let document = new Document();
        return document;
    }
}

export default Parser;
