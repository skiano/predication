
import { createAnd, createOr, createNot } from './';

const a = createAnd();
const o = createOr();
const n = createNot();

a('hello world');
o('hello world');
n('hello world');
