import {
    parse_document,
} from "./pkg/deno.js";
import {
    assertEquals,
    assertArrayContains,
} from "https://deno.land/std/testing/asserts.ts";


function x(html: string, selector: string) {
    const d = parse_document(html); 
    const result = d.query_selector(selector);
    d.free();
    return result;
}


const HTML_1 = `
<!DOCTYPE html>
<meta charset="utf-8">
<title>Hello, world!</title>
<h1 class="content">Hello, <i>world!</i></h1>
<a href="http://google.com">google</a>
`;

Deno.test("select by element name", () => {
    const title = x(HTML_1, 'title');

    assertEquals(title, 'Hello, world!');
});

Deno.test("select by class name", () => {
    const content = x(HTML_1, '.content');

    assertEquals(content, 'Hello, <i>world!</i>');
});

Deno.test("select an attribute", () => {
    const content = x(HTML_1, 'a@href');

    assertEquals(content, 'http://google.com');
});
