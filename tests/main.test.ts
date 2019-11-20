import { suite, test } from 'mocha-typescript';
import { expect } from 'chai';
import { Cypher } from '../src/Cypher';

@suite
export class CypherQueryTests {
    @test
    stringify() {
        const ob1 = {
            property: 'value',
            property2: 123,
            property3: '123',
            property4: NaN,
            property5: null,
            property6: undefined
        };

        const expectedResult = `{
            property: "value",
            property2: 123,
            property3: "123",
            property4: null,
            property5: null
        }`.replace(/[\n ]/ig, '').trim();

        // @ts-ignore
        const result = Cypher.stringify(ob1);

        expect(result).to.be.equal(expectedResult);
    }

    @test
    parseBlock() {
        const block1 = 'b1:company';
        const block2 = ':person';

        // @ts-ignore
        const result1 = Cypher.parseBlock(block1);
        // @ts-ignore
        const result2 = Cypher.parseBlock(block2);

        expect(result1).to.be.deep.equal({
            name: 'b1',
            type: 'company'
        });

        expect(result2).to.be.deep.equal({
            name: '',
            type: 'person'
        });
    }

    @test
    create() {
        const queries = [
            Cypher.CREATE().node('c:company').complete(),
            Cypher.CREATE().relation(':has_employee').from().node('c:company').to().node('p:person').complete(),
            Cypher.CREATE().relation(':has_employer').from().node('p:person').to().node('c:company').complete(),
            Cypher.CREATE().relation(':has_employee').between().node('c:company').and().node('p:person').complete(),
            Cypher.CREATE().relation().between().node('c:company').and().node('p:person').complete(),
            Cypher.CREATE().relation().from().node('c:company').to().node('p:person').complete()
        ];

        expect(queries).to.be.deep.equal([
            'CREATE (c:company)',
            'CREATE (c:company)-[:has_employee]->(p:person)',
            'CREATE (p:person)-[:has_employer]->(c:company)',
            'CREATE (c:company)-[:has_employee]-(p:person)',
            'CREATE (c:company)--(p:person)',
            'CREATE (c:company)-->(p:person)'
        ]);
    }

    @test
    match() {
        const queries = [
            Cypher.MATCH().node('c:company').complete(),
            Cypher.MATCH().relation(':has_employee').between().node('c:company').and().node('p:person', {_id: '123'}).complete()
        ];

        expect(queries).to.be.deep.equal([
            'MATCH (c:company)',
            'MATCH (c:company)-[:has_employee]-(p:person{_id:"123"})'
        ]);
    }

    @test
    insert() {
        const queries = [
            Cypher.INSERT().node('p:person').complete(),
            Cypher.INSERT().node('c:company', {_id: 'megaCompany'}).complete()
        ];

        expect(queries).to.be.deep.equal([
            'INSERT (p:person)',
            'INSERT (c:company{_id:"megaCompany"})'
        ]);
    }

    @test
    merge() {
        const queries = [
            Cypher.INSERT().node('p:person').complete(),
            Cypher.INSERT().node('c:company', {_id: 'megaCompany'}).complete()
        ];

        expect(queries).to.be.deep.equal([
            'INSERT (p:person)',
            'INSERT (c:company{_id:"megaCompany"})'
        ]);
    }
} 