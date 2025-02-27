const StarNotary = artifacts.require("StarNotary");

var accounts;
var owner;

contract('StarNotary', (accs) => {
    accounts = accs;
    owner = accounts[0];
});

it('can Create a Star', async() => {
    let tokenId = 1;
    let instance = await StarNotary.deployed();
    await instance.createStar('Awesome Star!', tokenId, {from: accounts[0]})
    assert.equal(await instance.tokenIdToStarInfo.call(tokenId), 'Awesome Star!')
});

it('lets user1 put up their star for sale', async() => {
    let instance = await StarNotary.deployed();
    let user1 = accounts[1];
    let starId = 2;
    let starPrice = web3.utils.toWei(".01", "ether");
    await instance.createStar('awesome star', starId, {from: user1});
    await instance.putStarUpForSale(starId, starPrice, {from: user1});
    assert.equal(await instance.starsForSale.call(starId), starPrice);
});

it('lets user1 get the funds after the sale', async() => {
    let instance = await StarNotary.deployed();
    let user1 = accounts[1];
    let user2 = accounts[2];
    let starId = 3;
    let starPrice = web3.utils.toWei(".01", "ether");
    let balance = web3.utils.toWei(".05", "ether");
    await instance.createStar('awesome star', starId, {from: user1});
    await instance.putStarUpForSale(starId, starPrice, {from: user1});
    let balanceOfUser1BeforeTransaction = await web3.eth.getBalance(user1);
    await instance.buyStar(starId, {from: user2, value: balance});
    let balanceOfUser1AfterTransaction = await web3.eth.getBalance(user1);
    let value1 = Number(balanceOfUser1BeforeTransaction) + Number(starPrice);
    let value2 = Number(balanceOfUser1AfterTransaction);
    assert.equal(value1, value2);
});

it('lets user2 buy a star, if it is put up for sale', async() => {
    let instance = await StarNotary.deployed();
    let user1 = accounts[1];
    let user2 = accounts[2];
    let starId = 4;
    let starPrice = web3.utils.toWei(".01", "ether");
    let balance = web3.utils.toWei(".05", "ether");
    await instance.createStar('awesome star', starId, {from: user1});
    await instance.putStarUpForSale(starId, starPrice, {from: user1});
    let balanceOfUser1BeforeTransaction = await web3.eth.getBalance(user2);
    await instance.buyStar(starId, {from: user2, value: balance});
    assert.equal(await instance.ownerOf.call(starId), user2);
});

it('lets user2 buy a star and decreases its balance in ether', async() => {
    let instance = await StarNotary.deployed();
    let user1 = accounts[1];
    let user2 = accounts[2];
    let starId = 5;
    let starPrice = web3.utils.toWei(".01", "ether");
    let balance = web3.utils.toWei(".05", "ether");
    await instance.createStar('awesome star', starId, {from: user1});
    await instance.putStarUpForSale(starId, starPrice, {from: user1});
    let balanceOfUser1BeforeTransaction = await web3.eth.getBalance(user2);
    const balanceOfUser2BeforeTransaction = await web3.eth.getBalance(user2);
    await instance.buyStar(starId, {from: user2, value: balance, gasPrice:0});
    const balanceAfterUser2BuysStar = await web3.eth.getBalance(user2);
    let value = Number(balanceOfUser2BeforeTransaction) - Number(balanceAfterUser2BuysStar);
    assert.equal(value, starPrice);
});

it('can add the star name and star symbol properly', async() => {
    let instance = await StarNotary.deployed();

    // name and symbol functions from from the IERC721Metadata contract
    let star_name   = await instance.name.call();
    let star_symbol = await instance.symbol.call();

    assert.equal(star_name, "StarNotary Token");
    assert.equal(star_symbol, "SNT");
});

it('lets 2 users exchange stars', async() => {
    let instance = await StarNotary.deployed();

    let user1 = accounts[1];
    let user2 = accounts[2];
    let starId1 = 6;
    let starId2 = 7;

    // Create Star tokens for each user
    await instance.createStar('Star One', starId1, {from: user1});
    await instance.createStar('Star Two', starId2, {from: user2});

    // Sanity check the owners before exchanging
    assert.equal(await instance.ownerOf.call(starId1), user1);
    assert.equal(await instance.ownerOf.call(starId2), user2);

    // Exchange the stars - originating from user1
    await instance.exchangeStars(starId1, starId2, {from: user1});

    // Sanity check the owners after exchanging
    assert.equal(await instance.ownerOf.call(starId1), user2);
    assert.equal(await instance.ownerOf.call(starId2), user1);

    // Also should work for message originating from user2
    await instance.exchangeStars(starId1, starId2, {from: user1});

    // Sanity check the owners after second exchange
    assert.equal(await instance.ownerOf.call(starId1), user1);
    assert.equal(await instance.ownerOf.call(starId2), user2);

});

it('lets a user transfer a star', async() => {
    let instance = await StarNotary.deployed();

    let user1 = accounts[1];
    let user2 = accounts[2];
    let starId = 8;

    // Create Star token for transfer
    await instance.createStar('Transfer Star', starId, {from: user1});

    // Sanity check the owner of the star before transfer
    assert.equal(await instance.ownerOf.call(starId), user1);

    // Transfer the star
    await instance.transferStar(user2, starId, {from: user1});

    // Sanity check the owner of the star after transfer
    assert.equal(await instance.ownerOf.call(starId), user2);
});

it('lookUptokenIdToStarInfo test', async() => {
    let instance = await StarNotary.deployed();

    let user1 = accounts[1];
    let starId = 9;
    let starName = 'Star Info';

    // Create Star token for testing the info
    await instance.createStar(starName, starId, {from: user1});

    // Get the star info from the contract
    let ret_name = await instance.lookUptokenIdToStarInfo(starId, {from: user1});

    // Sanity check the star info matches what was created
    assert.equal(ret_name, starName);
});