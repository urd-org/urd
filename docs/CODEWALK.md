# Codewalk

## Architecture

```

                                       .-,(  ),-.    
                                    .-(          )-.
                                   (    Internet    )
                                    '-(          ).-'
                                        '-.( ).-'    
                                            |
                                            v
                    .-----------------------------------------------.
      Core API      |                  GraphQL API                  |
                    '-----------------------------------------------'
                                            |
                                            v
                    .................................................
    Internal API    .                   Plumbing?                   .
                    .................................................
                                            |
                                            v
                    .-----------------------------------------------.
                    |                     Node                      |
      Interface     |-----------------------------------------------|
         for        | .---------. .-----------.                     |
       modules      | | Network | | Consensus |                     |
                    | '---------' '-----------'                     |
                    '-----------------------------------------------'
                                            .
                                            |
                                            |
                             .--------------------------------------.
                             |              |           |           |
                             |              |           |           |
                             v              v           v           v
                      .------------.     .-----.   .--------.  .---------.
       Modules        | Blockchain |     | Net |   | Wallet |  | Mempool |
                      '------------'     '-----'   '--------'  '---------'
                             |              |
                             v              |
                       .----------.         |
                       | Database |         v
                       '----------'     .------.
                             |          | Pool |
                             v          '------'
                       .----------.
                       | LevelDB  |
                       '----------'

```

### Node

The node is a controller of the modules (e.g. blockchain, net, wallet, mempool, etc.). The modules can run by themselves fine without a node. A node can run with any combination of modules, irrelevant of which are disabled or not, but might lead to undesirable behaviour.

### Peer management

For peer management there are two layers, one for saving peer data in a database for long-term storage and second layer for managing the current active peer pool.

As LevelDB is already used for storing blockchain related data, it can also be used for storing peer data remove redundant complexity. The active peer pool lives on the networking layer and talks with the peer storage layer. Given that a connection between your node and another peer is formed, the other peer's data will be stored in LevelDB as a key-value map.

### Internal details

For calling functions or sending data between modules, the `EventEmitter` class is used. Callbacks is an alternative, but does not seem to give much upside, but rather makes the code base more complicated. Callbacks makes it clear which functions is called when but makes it harder to code as you have to import callback functions.

Instead, when it's a network based application, events make more sense. The biggest crux of event driven code is that you need to have a clear structure for where the `.on` and `.emit` functions are defined and called. Because there's no clear endpoint for a `.on`, they can live almost anywhere in the code and you can get unintended side-effects. Events are synchronous, so no need to think too much about race-conditions or order per se, but it can be easy to forget in which order everything is executed. That's why try to keep the event code separate and in contained in their respective modules.

### API layer
