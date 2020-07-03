import {
    parse_document,
} from "./pkg/deno.js";
import {
    assertEquals,
    assertArrayContains,
} from "https://deno.land/std/testing/asserts.ts";


function x(html: string, selector: string | object) {
    const d = parse_document(html); 
    let result;
    if(typeof selector === 'string') {
        result = d.query_selector(selector);
    } else {
        result = d.query_scoped(JSON.stringify(selector));
        result = result && JSON.parse(result);
    }
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
    <li class=".item">
        <p>one<p>
        <b>ONE<b>
    </li>
    <li class=".item">
        <p>two<p>
        <b>TWO<b>
    </li>
</ul>
`;

Deno.test("select by element name", () => {
    const title = x(HTML_1, 'title');

    assertEquals(title, 'Hello, world!');
});

Deno.test("select outer html", () => {
    const content = x(HTML_1, 'title@html');

    assertEquals(content, '<title>Hello, world!</title>');
});

Deno.test("select by class name", () => {
    const content = x(HTML_1, '.content i');

    assertEquals(content, 'world!');
});

Deno.test("select an attribute", () => {
    const content = x(HTML_1, 'a@href');

    assertEquals(content, 'http://google.com');
});

Deno.test("scoping selection", () => {
    const content = x(HTML_1, {
        title: 'title',
        items: x.x('item', [
            {
                p: 'p',
                b: 'b'
            }
        ])
    });

    assertEquals(content, {
        title: 'Hello, world!',
        items: [
            {p: 'one', b: 'ONE'},
            {p: 'two', b: 'TWO'},
        ]
    });
});


