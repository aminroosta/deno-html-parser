import {
    parse_document,
    parse_fragment
} from "./pkg/deno.js";

let d = parse_document(`
<!DOCTYPE html>
<meta charset="utf-8">
<title>Hello, world!</title>
<h1 class="foo">Hello, <i>world!</i></h1>
`); 
// remember to free
d.free();


let f = parse_fragment(`<input name="foo" value="bar">`);
let r = f.attr(`input[name="foo"]`, 'value');

console.log(r);
