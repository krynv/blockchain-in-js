const Blockchain = require('./Blockchain');
const Block = require('./Block');

const myChain = new Blockchain();
myChain.addBlock(new Block(Date.now().toString(), ['I am block 1']));
myChain.addBlock(new Block(Date.now().toString(), ['I am block 2']));
myChain.addBlock(new Block(Date.now().toString(), ['I am block 3']));

console.dir(myChain, { depth: null });
console.log(myChain.isValid());