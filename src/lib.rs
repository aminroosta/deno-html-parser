use scraper::{Html, Selector};
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub struct Document {
    doc: scraper::html::Html,
}

#[wasm_bindgen]
impl Document {
    pub fn attr(&self, query: &str, attr: &str) -> String {
        let mut r = vec![];

        if let Ok(selector) = Selector::parse(query) {
            for element in self.doc.select(&selector) {
                if let Some(v) = element.value().attr(attr) {
                    r.push(v);
                }
            }
        }

        r.join(";")
    }
}

#[wasm_bindgen]
pub fn parse_document(html: &str) -> Document {
    Document {
        doc: Html::parse_document(html),
    }
}

#[wasm_bindgen]
pub fn parse_fragment(html: &str) -> Document {
    Document {
        doc: Html::parse_fragment(html),
    }
}
