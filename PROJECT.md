### Software Versions Used
```bash
> node -v
v14.17.0

> npm -v
6.14.13

> npm install truffle -g
> truffle version
Truffle v5.4.10 (core: 5.4.10)
Solidity v0.5.16 (solc-js)
Node v14.17.0
Web3.js v1.5.2

> npm install --save  @openzeppelin/contracts

> npm install --save @truffle/hdwallet-provider

### Deploying Contract 

#### Testing locally

1. Run ganache (AppImage)
> ./ganache-2.5.4-linux-x86_64.AppImage

2. Run truffle testsuite
> cd app
> truffle test

```
Using network 'development'.


Compiling your contracts...
===========================
> Everything is up to date, there is nothing to compile.



  ✓ can Create a Star (192ms)
  ✓ lets user1 put up their star for sale (274ms)
  ✓ lets user1 get the funds after the sale (346ms)
  ✓ lets user2 buy a star, if it is put up for sale (395ms)
  ✓ lets user2 buy a star and decreases its balance in ether (286ms)
  ✓ can add the star name and star symbol properly (79ms)
  ✓ lets 2 users exchange stars (549ms)
  ✓ lets a user transfer a star (265ms)
  ✓ lookUptokenIdToStarInfo test (114ms)

  9 passing (3s)
```


#### Deploy to rinkeby
1. Ensuring rinkeby configuration in truffle
 - Noting here that the mnemonic and the infuraKey are read from disk to files not committed to the repository.
  - .infurakey (The PROJECT ID of the app created in infura)
  - .secret (metamask wallet tokens)

```
const infuraKey = fs.readFileSync(".infurakey").toString().trim();
const mnemonic  = fs.readFileSync(".secret").toString().trim();

...

  networks: {
    rinkeby: {
      provider: () => new HDWalletProvider(mnemonic, `https://rinkeby.infura.io/v3/${infuraKey}`),
        network_id: 4,       // rinkeby's id
        gas: 4500000,        // rinkeby has a lower block limit than mainnet
        gasPrice: 10000000000
    }
  }
```

2. Deploy to rinkeby
> truffle migrate --reset --network rinkeby

```
Compiling your contracts...
===========================
> Everything is up to date, there is nothing to compile.



Migrations dry-run (simulation)
===============================
> Network name:    'rinkeby-fork'
> Network id:      4
> Block gas limit: 29970648 (0x1c950d8)


1_initial_migration.js
======================

   Deploying 'Migrations'
   ----------------------
   > block number:        9498108
   > block timestamp:     1634731213
   > account:             0x4b3E79411233668Af1D46cf790a463EBB07351c0
   > balance:             18.74764314499796412
   > gas used:            210237 (0x3353d)
   > gas price:           10 gwei
   > value sent:          0 ETH
   > total cost:          0.00210237 ETH

   -------------------------------------
   > Total cost:          0.00210237 ETH


2_deploy_contracts.js
=====================

   Deploying 'StarNotary'
   ----------------------
^C[ttobin@fedora app]$ truffle migrate --reset --network rinkeby

Compiling your contracts...
===========================
> Everything is up to date, there is nothing to compile.



Migrations dry-run (simulation)
===============================
> Network name:    'rinkeby-fork'
> Network id:      4
> Block gas limit: 29941410 (0x1c8dea2)


1_initial_migration.js
======================

   Deploying 'Migrations'
   ----------------------
   > block number:        9498113
   > block timestamp:     1634731297
   > account:             0x4b3E79411233668Af1D46cf790a463EBB07351c0
   > balance:             18.74764314499796412
   > gas used:            210237 (0x3353d)
   > gas price:           10 gwei
   > value sent:          0 ETH
   > total cost:          0.00210237 ETH

   -------------------------------------
   > Total cost:          0.00210237 ETH


2_deploy_contracts.js
=====================

   Deploying 'StarNotary'
   ----------------------
   > block number:        9498115
   > block timestamp:     1634731327
   > account:             0x4b3E79411233668Af1D46cf790a463EBB07351c0
   > balance:             18.72594836499796412
   > gas used:            2142115 (0x20afa3)
   > gas price:           10 gwei
   > value sent:          0 ETH
   > total cost:          0.02142115 ETH

   -------------------------------------
   > Total cost:          0.02142115 ETH


Summary
=======
> Total deployments:   2
> Final cost:          0.02352352 ETH





Starting migrations...
======================
> Network name:    'rinkeby'
> Network id:      4
> Block gas limit: 29941438 (0x1c8debe)


1_initial_migration.js
======================

   Deploying 'Migrations'
   ----------------------
   > transaction hash:    0x3c24febd368313264c80cd98a06ca9ce7c2e45d037ae7170ba4a66ca9ba71062
   > Blocks: 1            Seconds: 17
   > contract address:    0x37bf2F14b0dD3EBA069715A86BEaEAe978C052d9
   > block number:        9498118
   > block timestamp:     1634731369
   > account:             0x4b3E79411233668Af1D46cf790a463EBB07351c0
   > balance:             18.74748014499796412
   > gas used:            226537 (0x374e9)
   > gas price:           10 gwei
   > value sent:          0 ETH
   > total cost:          0.00226537 ETH


   > Saving migration to chain.
   > Saving artifacts
   -------------------------------------
   > Total cost:          0.00226537 ETH


2_deploy_contracts.js
=====================

   Deploying 'StarNotary'
   ----------------------
   > transaction hash:    0xe4c41ade3238e25b89bb5b44b902c2f508119ff430411dc6eb2a80e1b2aa7ee4
   > Blocks: 2            Seconds: 18
   > contract address:    0x08661d04e2eAEF7cd8a484F6FB72720FF0B1e871
   > block number:        9498122
   > block timestamp:     1634731429
   > account:             0x4b3E79411233668Af1D46cf790a463EBB07351c0
   > balance:             18.72527536499796412
   > gas used:            2174715 (0x212efb)
   > gas price:           10 gwei
   > value sent:          0 ETH
   > total cost:          0.02174715 ETH


   > Saving migration to chain.
   > Saving artifacts
   -------------------------------------
   > Total cost:          0.02174715 ETH


Summary
=======
> Total deployments:   2
> Final cost:          0.02401252 ETH
```

#### Deployment details
1. Deployed by address 0x4b3E79411233668Af1D46cf790a463EBB07351c0
2. Deployed contract address 0x08661d04e2eAEF7cd8a484F6FB72720FF0B1e871