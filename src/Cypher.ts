

/**
 * @description Class for construction Cypher queries
 */
export abstract class Cypher {
    // private static query: string[] = [];
    private static isRelated = false;

    private static buffer = {
        operator: '',
        startNode: '',
        relationDirectionStart: '',
        relation: '',
        relationDirectionEnd: '',
        endNode: '',
        returnOp: ''
    };
    private static nodePointer = 0; // 0 = start, 1 = end


    private static stringify(obj: object) {
        let result: string;

        if (Object.keys(obj).length > 0) {
            result = obj ? JSON.stringify(obj) : '';
        }
        else {
            result = '';
        }

        return result ? result.replace(/"([$\w]+)":/g, '$1:') : '';
    }

    private static parseBlock(block: string) {
        const result = /^(([\d\w]+)+)?:([\d\w]+)$/i.exec(block);

        if (result) {
            const [, , name = '', type = ''] = result;
            return { name, type };
        }
        else {
            return {
                name: '',
                type: ''
            };
        }
    }


    static CREATE() {
        Cypher.buffer.operator = 'CREATE';

        return {
            node: Cypher.node,
            relation: Cypher.relation
        };
    }

    static MATCH() {
        Cypher.buffer.operator = 'MATCH';

        return {
            node: Cypher.node,
            relation: Cypher.relation
        };
    }

    static INSERT() {
        Cypher.buffer.operator = 'INSERT';

        return { node: Cypher.node };
    }

    static RETURN(key: string) {
        Cypher.buffer.returnOp = `RETURN ${key}`;

        return { complete: Cypher.complete };
    }


    static node(
        block: string,
        where = {}
    ) {
        const { name, type } = Cypher.parseBlock(block);

        if (type) {
            block = `${name}:${type}`;
        }
        else {
            block = '';
        }

        const node = `(${block}${Cypher.stringify(where)})`;

        if (Cypher.nodePointer === 0) {
            Cypher.buffer.startNode = node;
        }
        else if (Cypher.nodePointer === 1) {
            Cypher.buffer.endNode = node;
        }

        return {
            to: Cypher.to,
            and: Cypher.and,
            then: Cypher.then,
            complete: Cypher.complete
        };
    }

    static relation(
        block?: string,
        where = {}
    ) {
        let name, type;

        Cypher.isRelated = true;

        if (block) {
            const result = Cypher.parseBlock(block);

            name = result.name;
            type = result.type;
        }

        if (type) {
            block = `${name}:${type}`;
        }
        else {
            block = '';
        }

        if (block)
            Cypher.buffer.relation = `[${block}${Cypher.stringify(where)}]`;
        else
            Cypher.buffer.relation = '';

        return {
            from: Cypher.from,
            between: Cypher.between
        };
    }


    private static from() {
        Cypher.buffer.relationDirectionStart = '<-';
        Cypher.buffer.relationDirectionEnd = '-';
        Cypher.nodePointer = 0;

        return { node: Cypher.node };
    }
    private static to() {
        Cypher.buffer.relationDirectionStart = '-';
        Cypher.buffer.relationDirectionEnd = '->';
        Cypher.nodePointer = 1;

        console.log('to');

        return { node: Cypher.node };
    }
    private static between() {
        Cypher.buffer.relationDirectionStart = '-';
        Cypher.buffer.relationDirectionEnd = '-';
        Cypher.nodePointer = 0;

        return { node: Cypher.node };
    }
    private static and() {
        Cypher.nodePointer = 1;

        return { node: Cypher.node };
    }
    private static get then() {
        return { RETURN: Cypher.RETURN };
    }

    //static implicit() {
    //    return { node: Cypher.node };
    //}

    private static complete() {
        const {
            operator,
            startNode,
            relationDirectionStart,
            relation,
            relationDirectionEnd,
            endNode,
            returnOp
        } = Cypher.buffer;

        const query = `${operator} ${startNode}${Cypher.isRelated ? relationDirectionStart : ''}${relation}${Cypher.isRelated ? relationDirectionEnd : ''}${endNode} ${returnOp}`.trim();

        // Cypher.query = [];
        Cypher.buffer = {
            operator: '',
            startNode: '',
            relationDirectionStart: '',
            relation: '',
            relationDirectionEnd: '',
            endNode: '',
            returnOp: ''
        };

        return query;
    }
}