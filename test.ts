import {
    parse_document,
} from "./pkg/deno.js";
import {
    assertEquals,
    assertArrayContains,
} from "https://deno.land/std/testing/asserts.ts";


function x(html: string, selector: string | object | Array<any>) {
    const d = parse_document(html); 
    let result = JSON.parse(
        d.query(JSON.stringify(selector))
    );

    // let result;
    // if(typeof selector === 'string') {
    //     result = d.query_selector(selector);
    // } else if(Array.isArray(selector)) {
    //     result = d.query_selector_all(JSON.stringify(selector));

    // } else {
    //     result = d.query_scoped(JSON.stringify(selector));
    //     result = result && JSON.parse(result);
    // }
    d.free();
    return result;
}
x.x = function (query: string, result: object) {
    return {
        _query: query,
        _result: result
    }
}


const HTML_1 = `
<!DOCTYPE html>
<meta charset="utf-8">
<title>Hello, world!</title>
<h1 class="content">Hello, <i>world!</i></h1>
<a href="http://google.com">google</a>
<ul>
    <li class="item">
        <div>one</div>
        <strong>ONE</strong>
    </li>
    <li class="item">
        <div>two</div>
        <strong>TWO</strong>
    </li>
</ul>
`;

Deno.test('tag name', () =>
  assertEquals(
    x(HTML_1, 'title'),
    ['Hello, world!'],
  ));

Deno.test('outer html', () =>
  assertEquals(
    x(HTML_1, 'title@html'),
    ['<title>Hello, world!</title>']
  ));

Deno.test('class name', () =>
  assertEquals(
    x(HTML_1, '.content i'),
    ['world!']
  ));

Deno.test("attribute", () =>
  assertEquals(
    x(HTML_1, "a@href"),
    ["http://google.com"],
  ));

Deno.test("attribute", () =>
  assertEquals(
    x(HTML_1, ["ul li div", "ul li strong"]),
    [["one", "two"], ["ONE", "TWO"]],
  ));

// Deno.test("scoping selection", () => {
//     const content = x(HTML_1, {
//         title: 'title',
//         li_list: ['.item'],
//         li_inner: [{
//             p: '.item p',
//             b: '.item b'
//         }]

//         items: x.x('item', [
//             {
//                 p: 'p',
//                 b: 'b'
//             }
//         ])
//     });

//     assertEquals(content, {
//         title: 'Hello, world!',
//         items: [
//             {p: 'one', b: 'ONE'},
//             {p: 'two', b: 'TWO'},
//         ]
//     });
// });


