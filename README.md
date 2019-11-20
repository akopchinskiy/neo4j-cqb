# neo4j-cqb
Query builder for Cypher language

A flexible and intuitive query builder for Neo4j and Cypher. Write queries in Javascript just as you would write them in Cypher.

* Easy to use 
* Full Typescript support
  
```ts
const query = Cypher.MATCH()
    .node(`:user`, {
        age: 30
    })
    .relation(`r:works_in`)
    .implicit()
    .node(`:company`, {
        founded_on: '2010-05-12'
    })
    .RETURN('r')
    .end();


/*  Result:
    MATCH (:user{age:30})-[r:works_in]-(:company{founded_on:"2010-05-12"})
    RETURN r
*/
```

# Installation

`yarn add -D neo4j-cqb`

# Contributing

Please feel free to submit any bugs or questions you may have in an issue. I'm very open to discussing suggestions or new ideas so don't hesitate to reach out.

Maintaining the library does take some time out of my schedule so if you'd like to show your appreciation please consider donating. Even the smallest amount is really encouraging.