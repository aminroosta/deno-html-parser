use scraper::{ElementRef, Html, Selector};
use std::fmt::Debug;
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(js_namespace = console)]
    fn log(s: &str);
}

fn dbg(arg: &impl Debug) {
    log(&format!("{:?}", arg));
}

#[wasm_bindgen]
pub struct Document {
    doc: scraper::html::Html,
}

#[wasm_bindgen]
impl Document {
    fn element(&self, query: &str) -> Option<ElementRef> {
        match Selector::parse(query) {
            Ok(selector) => self.doc.select(&selector).next(),
            _ => None,
        }
    }
    pub fn query_selector(&self, selector: &str) -> String {
        let vec: Vec<&str> = selector.split('@').collect();

        match vec.as_slice() {
            [query, "html"] => match self.element(query) {
                Some(el) => el.html(),
                None => String::new(),
            },
            [query, attr] => match self.element(query) {
                Some(el) => match el.value().attr(attr) {
                    Some(v) => v.into(),
                    None => String::new(),
                },
                None => String::new(),
            },
            [query] => match self.element(query) {
                Some(el) => el.inner_html(),
                None => String::new(),
            },
            _ => String::new(),
        }
    }

    pub fn query_scoped(&self, jsonstr: &str) -> String {
        return String::new();
    }
}

#[wasm_bindgen]
pub fn parse_document(html: &str) -> Document {
    Document {
        doc: Html::parse_document(html),
    }
}
