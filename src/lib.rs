use scraper::{ElementRef, Html, Selector};
use serde_json::{self, Map, Result, Value};
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
fn query_str(elem: &ElementRef, selector: &str) -> Value {
    let vec: Vec<&str> = selector.split('@').collect();

    match vec.as_slice() {
        [query, "html"] => Selector::parse(query)
            .ok()
            .map(|s| elem.select(&s).map(|e| e.html()).collect::<Vec<_>>())
            .map(|e| e.into())
            .unwrap_or_default(),
        [query, attr] => Selector::parse(query)
            .ok()
            .map(|s| {
                elem.select(&s)
                    .filter_map(|e| e.value().attr(attr))
                    .collect::<Vec<_>>()
            })
            .map(|s| s.into())
            .unwrap_or_default(),
        [query] => Selector::parse(query)
            .ok()
            .map(|s| elem.select(&s).map(|e| e.inner_html()).collect::<Vec<_>>())
            .map(|s| s.into())
            .unwrap_or_default(),
        _ => Default::default(),
    }
}

fn query_arr(elem: &ElementRef, values: &Vec<Value>) -> Value {
    values
        .iter()
        .filter_map(|v| match &v {
            Value::String(s) => Some(query_str(elem, &s)),
            _ => None,
        })
        .collect::<Vec<_>>()
        .into()
}

#[wasm_bindgen]
impl Document {
    pub fn query(&self, jsonstr: &str) -> String {
        let mut result: Value = Default::default();
        if let Ok(value) = serde_json::from_str::<Value>(jsonstr) {
            result = match value {
                Value::String(str) => query_str(&self.doc.root_element(), &str),
                Value::Array(arr) => query_arr(&self.doc.root_element(), &arr),
                _ => Default::default(),
            };
        }
        return serde_json::to_string(&result).unwrap();
    }
}

#[wasm_bindgen]
pub fn parse_document(html: &str) -> Document {
    Document {
        doc: Html::parse_document(html),
    }
}
