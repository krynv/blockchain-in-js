const Blockchain = require('./Blockchain');
const Block = require('./Block');

const myChain = new Blockchain();
myChain.addBlock(new Block(Date.now().toString(), ['I am block 1']));

console.log(myChain.chain);
console.log(myChain.isValid());