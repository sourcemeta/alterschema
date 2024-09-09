#include <gtest/gtest.h>

#include <sourcemeta/jsontoolkit/json.h>

#include "utils.h"

TEST(Lint_2020_12, enum_to_const_1) {
  sourcemeta::jsontoolkit::JSON document =
      sourcemeta::jsontoolkit::parse(R"JSON({
    "$schema": "https://json-schema.org/draft/2020-12/schema",
    "enum": [ 1 ]
  })JSON");

  LINT_AND_FIX(document);

  const sourcemeta::jsontoolkit::JSON expected =
      sourcemeta::jsontoolkit::parse(R"JSON({
    "$schema": "https://json-schema.org/draft/2020-12/schema",
    "const": 1
  })JSON");

  EXPECT_EQ(document, expected);
}

TEST(Lint_2020_12, const_with_type_1) {
  sourcemeta::jsontoolkit::JSON document =
      sourcemeta::jsontoolkit::parse(R"JSON({
    "$schema": "https://json-schema.org/draft/2020-12/schema",
    "type": "string",
    "const": "foo"
  })JSON");

  LINT_AND_FIX(document);

  const sourcemeta::jsontoolkit::JSON expected =
      sourcemeta::jsontoolkit::parse(R"JSON({
    "$schema": "https://json-schema.org/draft/2020-12/schema",
    "const": "foo"
  })JSON");

  EXPECT_EQ(document, expected);
}

TEST(Lint_2020_12, enum_with_type_1) {
  sourcemeta::jsontoolkit::JSON document =
      sourcemeta::jsontoolkit::parse(R"JSON({
    "$schema": "https://json-schema.org/draft/2020-12/schema",
    "type": "string",
    "enum": [ "foo", "bar" ]
  })JSON");

  LINT_AND_FIX(document);

  const sourcemeta::jsontoolkit::JSON expected =
      sourcemeta::jsontoolkit::parse(R"JSON({
    "$schema": "https://json-schema.org/draft/2020-12/schema",
    "enum": [ "foo", "bar" ]
  })JSON");

  EXPECT_EQ(document, expected);
}

TEST(Lint_2020_12, single_type_array_1) {
  sourcemeta::jsontoolkit::JSON document =
      sourcemeta::jsontoolkit::parse(R"JSON({
    "$schema": "https://json-schema.org/draft/2020-12/schema",
    "type": [ "string" ]
  })JSON");

  LINT_AND_FIX(document);

  const sourcemeta::jsontoolkit::JSON expected =
      sourcemeta::jsontoolkit::parse(R"JSON({
    "$schema": "https://json-schema.org/draft/2020-12/schema",
    "type": "string"
  })JSON");

  EXPECT_EQ(document, expected);
}

TEST(Lint_2020_12, content_media_type_without_encoding_1) {
  sourcemeta::jsontoolkit::JSON document =
      sourcemeta::jsontoolkit::parse(R"JSON({
    "$schema": "https://json-schema.org/draft/2020-12/schema",
    "contentMediaType": "application/json"
  })JSON");

  LINT_AND_FIX(document);

  const sourcemeta::jsontoolkit::JSON expected =
      sourcemeta::jsontoolkit::parse(R"JSON({
    "$schema": "https://json-schema.org/draft/2020-12/schema"
  })JSON");

  EXPECT_EQ(document, expected);
}

TEST(Lint_2020_12, content_schema_without_media_type_1) {
  sourcemeta::jsontoolkit::JSON document =
      sourcemeta::jsontoolkit::parse(R"JSON({
    "$schema": "https://json-schema.org/draft/2020-12/schema",
    "contentEncoding": "base64",
    "contentSchema": {}
  })JSON");

  LINT_AND_FIX(document);

  const sourcemeta::jsontoolkit::JSON expected =
      sourcemeta::jsontoolkit::parse(R"JSON({
    "$schema": "https://json-schema.org/draft/2020-12/schema",
    "contentEncoding": "base64"
  })JSON");

  EXPECT_EQ(document, expected);
}

TEST(Lint_2020_12, max_contains_without_contains_1) {
  sourcemeta::jsontoolkit::JSON document =
      sourcemeta::jsontoolkit::parse(R"JSON({
    "$schema": "https://json-schema.org/draft/2020-12/schema",
    "maxContains": 1
  })JSON");

  LINT_AND_FIX(document);

  const sourcemeta::jsontoolkit::JSON expected =
      sourcemeta::jsontoolkit::parse(R"JSON({
    "$schema": "https://json-schema.org/draft/2020-12/schema"
  })JSON");

  EXPECT_EQ(document, expected);
}

TEST(Lint_2020_12, max_contains_without_contains_2) {
  sourcemeta::jsontoolkit::JSON document =
      sourcemeta::jsontoolkit::parse(R"JSON({
    "$schema": "https://json-schema.org/draft/2020-12/schema",
    "contains": true,
    "maxContains": 1
  })JSON");

  LINT_AND_FIX(document);

  const sourcemeta::jsontoolkit::JSON expected =
      sourcemeta::jsontoolkit::parse(R"JSON({
    "$schema": "https://json-schema.org/draft/2020-12/schema",
    "contains": true,
    "maxContains": 1
  })JSON");

  EXPECT_EQ(document, expected);
}

TEST(Lint_2020_12, min_contains_without_contains_1) {
  sourcemeta::jsontoolkit::JSON document =
      sourcemeta::jsontoolkit::parse(R"JSON({
    "$schema": "https://json-schema.org/draft/2020-12/schema",
    "minContains": 1
  })JSON");

  LINT_AND_FIX(document);

  const sourcemeta::jsontoolkit::JSON expected =
      sourcemeta::jsontoolkit::parse(R"JSON({
    "$schema": "https://json-schema.org/draft/2020-12/schema"
  })JSON");

  EXPECT_EQ(document, expected);
}

TEST(Lint_2020_12, min_contains_without_contains_2) {
  sourcemeta::jsontoolkit::JSON document =
      sourcemeta::jsontoolkit::parse(R"JSON({
    "$schema": "https://json-schema.org/draft/2020-12/schema",
    "contains": true,
    "minContains": 1
  })JSON");

  LINT_AND_FIX(document);

  const sourcemeta::jsontoolkit::JSON expected =
      sourcemeta::jsontoolkit::parse(R"JSON({
    "$schema": "https://json-schema.org/draft/2020-12/schema",
    "contains": true,
    "minContains": 1
  })JSON");

  EXPECT_EQ(document, expected);
}

TEST(Lint_2020_12, then_without_if_1) {
  sourcemeta::jsontoolkit::JSON document =
      sourcemeta::jsontoolkit::parse(R"JSON({
    "$schema": "https://json-schema.org/draft/2020-12/schema",
    "then": true
  })JSON");

  LINT_AND_FIX(document);

  const sourcemeta::jsontoolkit::JSON expected =
      sourcemeta::jsontoolkit::parse(R"JSON({
    "$schema": "https://json-schema.org/draft/2020-12/schema"
  })JSON");

  EXPECT_EQ(document, expected);
}

TEST(Lint_2020_12, then_without_if_2) {
  sourcemeta::jsontoolkit::JSON document =
      sourcemeta::jsontoolkit::parse(R"JSON({
    "$schema": "https://json-schema.org/draft/2020-12/schema",
    "if": true,
    "then": true
  })JSON");

  LINT_AND_FIX(document);

  const sourcemeta::jsontoolkit::JSON expected =
      sourcemeta::jsontoolkit::parse(R"JSON({
    "$schema": "https://json-schema.org/draft/2020-12/schema",
    "if": true,
    "then": true
  })JSON");

  EXPECT_EQ(document, expected);
}

TEST(Lint_2020_12, else_without_if_1) {
  sourcemeta::jsontoolkit::JSON document =
      sourcemeta::jsontoolkit::parse(R"JSON({
    "$schema": "https://json-schema.org/draft/2020-12/schema",
    "else": true
  })JSON");

  LINT_AND_FIX(document);

  const sourcemeta::jsontoolkit::JSON expected =
      sourcemeta::jsontoolkit::parse(R"JSON({
    "$schema": "https://json-schema.org/draft/2020-12/schema"
  })JSON");

  EXPECT_EQ(document, expected);
}

TEST(Lint_2020_12, else_without_if_2) {
  sourcemeta::jsontoolkit::JSON document =
      sourcemeta::jsontoolkit::parse(R"JSON({
    "$schema": "https://json-schema.org/draft/2020-12/schema",
    "if": true,
    "else": true
  })JSON");

  LINT_AND_FIX(document);

  const sourcemeta::jsontoolkit::JSON expected =
      sourcemeta::jsontoolkit::parse(R"JSON({
    "$schema": "https://json-schema.org/draft/2020-12/schema",
    "if": true,
    "else": true
  })JSON");

  EXPECT_EQ(document, expected);
}

TEST(Lint_2020_12, unevaluated_properties_default_1) {
  sourcemeta::jsontoolkit::JSON document =
      sourcemeta::jsontoolkit::parse(R"JSON({
    "$schema": "https://json-schema.org/draft/2020-12/schema",
    "unevaluatedProperties": true
  })JSON");

  LINT_AND_FIX(document);

  const sourcemeta::jsontoolkit::JSON expected =
      sourcemeta::jsontoolkit::parse(R"JSON({
    "$schema": "https://json-schema.org/draft/2020-12/schema"
  })JSON");

  EXPECT_EQ(document, expected);
}

TEST(Lint_2020_12, unevaluated_properties_default_2) {
  sourcemeta::jsontoolkit::JSON document =
      sourcemeta::jsontoolkit::parse(R"JSON({
    "$schema": "https://json-schema.org/draft/2020-12/schema",
    "unevaluatedProperties": {}
  })JSON");

  LINT_AND_FIX(document);

  const sourcemeta::jsontoolkit::JSON expected =
      sourcemeta::jsontoolkit::parse(R"JSON({
    "$schema": "https://json-schema.org/draft/2020-12/schema"
  })JSON");

  EXPECT_EQ(document, expected);
}

TEST(Lint_2020_12, unevaluated_properties_default_3) {
  sourcemeta::jsontoolkit::JSON document =
      sourcemeta::jsontoolkit::parse(R"JSON({
    "$schema": "https://json-schema.org/draft/2020-12/schema",
    "unevaluatedProperties": { "type": "string" }
  })JSON");

  LINT_AND_FIX(document);

  const sourcemeta::jsontoolkit::JSON expected =
      sourcemeta::jsontoolkit::parse(R"JSON({
    "$schema": "https://json-schema.org/draft/2020-12/schema",
    "unevaluatedProperties": { "type": "string" }
  })JSON");

  EXPECT_EQ(document, expected);
}

TEST(Lint_2020_12, unevaluated_items_default_1) {
  sourcemeta::jsontoolkit::JSON document =
      sourcemeta::jsontoolkit::parse(R"JSON({
    "$schema": "https://json-schema.org/draft/2020-12/schema",
    "unevaluatedItems": true
  })JSON");

  LINT_AND_FIX(document);

  const sourcemeta::jsontoolkit::JSON expected =
      sourcemeta::jsontoolkit::parse(R"JSON({
    "$schema": "https://json-schema.org/draft/2020-12/schema"
  })JSON");

  EXPECT_EQ(document, expected);
}

TEST(Lint_2020_12, unevaluated_items_default_2) {
  sourcemeta::jsontoolkit::JSON document =
      sourcemeta::jsontoolkit::parse(R"JSON({
    "$schema": "https://json-schema.org/draft/2020-12/schema",
    "unevaluatedItems": {}
  })JSON");

  LINT_AND_FIX(document);

  const sourcemeta::jsontoolkit::JSON expected =
      sourcemeta::jsontoolkit::parse(R"JSON({
    "$schema": "https://json-schema.org/draft/2020-12/schema"
  })JSON");

  EXPECT_EQ(document, expected);
}

TEST(Lint_2020_12, unevaluated_items_default_3) {
  sourcemeta::jsontoolkit::JSON document =
      sourcemeta::jsontoolkit::parse(R"JSON({
    "$schema": "https://json-schema.org/draft/2020-12/schema",
    "unevaluatedItems": { "type": "string" }
  })JSON");

  LINT_AND_FIX(document);

  const sourcemeta::jsontoolkit::JSON expected =
      sourcemeta::jsontoolkit::parse(R"JSON({
    "$schema": "https://json-schema.org/draft/2020-12/schema",
    "unevaluatedItems": { "type": "string" }
  })JSON");

  EXPECT_EQ(document, expected);
}

TEST(Lint_2020_12, additional_properties_default_1) {
  sourcemeta::jsontoolkit::JSON document =
      sourcemeta::jsontoolkit::parse(R"JSON({
    "$schema": "https://json-schema.org/draft/2020-12/schema",
    "additionalProperties": true
  })JSON");

  LINT_AND_FIX(document);

  const sourcemeta::jsontoolkit::JSON expected =
      sourcemeta::jsontoolkit::parse(R"JSON({
    "$schema": "https://json-schema.org/draft/2020-12/schema"
  })JSON");

  EXPECT_EQ(document, expected);
}

TEST(Lint_2020_12, additional_properties_default_2) {
  sourcemeta::jsontoolkit::JSON document =
      sourcemeta::jsontoolkit::parse(R"JSON({
    "$schema": "https://json-schema.org/draft/2020-12/schema",
    "additionalProperties": {}
  })JSON");

  LINT_AND_FIX(document);

  const sourcemeta::jsontoolkit::JSON expected =
      sourcemeta::jsontoolkit::parse(R"JSON({
    "$schema": "https://json-schema.org/draft/2020-12/schema"
  })JSON");

  EXPECT_EQ(document, expected);
}

TEST(Lint_2020_12, additional_properties_default_3) {
  sourcemeta::jsontoolkit::JSON document =
      sourcemeta::jsontoolkit::parse(R"JSON({
    "$schema": "https://json-schema.org/draft/2020-12/schema",
    "additionalProperties": false
  })JSON");

  LINT_AND_FIX(document);

  const sourcemeta::jsontoolkit::JSON expected =
      sourcemeta::jsontoolkit::parse(R"JSON({
    "$schema": "https://json-schema.org/draft/2020-12/schema",
    "additionalProperties": false
  })JSON");

  EXPECT_EQ(document, expected);
}

TEST(Lint_2020_12, content_schema_default_1) {
  sourcemeta::jsontoolkit::JSON document =
      sourcemeta::jsontoolkit::parse(R"JSON({
    "$schema": "https://json-schema.org/draft/2020-12/schema",
    "contentEncoding": "base64",
    "contentMediaType": "application/json",
    "contentSchema": true
  })JSON");

  LINT_AND_FIX(document);

  const sourcemeta::jsontoolkit::JSON expected =
      sourcemeta::jsontoolkit::parse(R"JSON({
    "$schema": "https://json-schema.org/draft/2020-12/schema",
    "contentEncoding": "base64",
    "contentMediaType": "application/json"
  })JSON");

  EXPECT_EQ(document, expected);
}

TEST(Lint_2020_12, content_schema_default_2) {
  sourcemeta::jsontoolkit::JSON document =
      sourcemeta::jsontoolkit::parse(R"JSON({
    "$schema": "https://json-schema.org/draft/2020-12/schema",
    "contentEncoding": "base64",
    "contentMediaType": "application/json",
    "contentSchema": {}
  })JSON");

  LINT_AND_FIX(document);

  const sourcemeta::jsontoolkit::JSON expected =
      sourcemeta::jsontoolkit::parse(R"JSON({
    "$schema": "https://json-schema.org/draft/2020-12/schema",
    "contentEncoding": "base64",
    "contentMediaType": "application/json"
  })JSON");

  EXPECT_EQ(document, expected);
}

TEST(Lint_2020_12, content_schema_default_3) {
  sourcemeta::jsontoolkit::JSON document =
      sourcemeta::jsontoolkit::parse(R"JSON({
    "$schema": "https://json-schema.org/draft/2020-12/schema",
    "contentEncoding": "base64",
    "contentMediaType": "application/json",
    "contentSchema": { "type": "string" }
  })JSON");

  LINT_AND_FIX(document);

  const sourcemeta::jsontoolkit::JSON expected =
      sourcemeta::jsontoolkit::parse(R"JSON({
    "$schema": "https://json-schema.org/draft/2020-12/schema",
    "contentEncoding": "base64",
    "contentMediaType": "application/json",
    "contentSchema": { "type": "string" }
  })JSON");

  EXPECT_EQ(document, expected);
}

TEST(Lint_2020_12, items_schema_default_1) {
  sourcemeta::jsontoolkit::JSON document =
      sourcemeta::jsontoolkit::parse(R"JSON({
    "$schema": "https://json-schema.org/draft/2020-12/schema",
    "items": true
  })JSON");

  LINT_AND_FIX(document);

  const sourcemeta::jsontoolkit::JSON expected =
      sourcemeta::jsontoolkit::parse(R"JSON({
    "$schema": "https://json-schema.org/draft/2020-12/schema"
  })JSON");

  EXPECT_EQ(document, expected);
}

TEST(Lint_2020_12, items_schema_default_2) {
  sourcemeta::jsontoolkit::JSON document =
      sourcemeta::jsontoolkit::parse(R"JSON({
    "$schema": "https://json-schema.org/draft/2020-12/schema",
    "items": {}
  })JSON");

  LINT_AND_FIX(document);

  const sourcemeta::jsontoolkit::JSON expected =
      sourcemeta::jsontoolkit::parse(R"JSON({
    "$schema": "https://json-schema.org/draft/2020-12/schema"
  })JSON");

  EXPECT_EQ(document, expected);
}

TEST(Lint_2020_12, items_schema_default_3) {
  sourcemeta::jsontoolkit::JSON document =
      sourcemeta::jsontoolkit::parse(R"JSON({
    "$schema": "https://json-schema.org/draft/2020-12/schema",
    "items": false
  })JSON");

  LINT_AND_FIX(document);

  const sourcemeta::jsontoolkit::JSON expected =
      sourcemeta::jsontoolkit::parse(R"JSON({
    "$schema": "https://json-schema.org/draft/2020-12/schema",
    "items": false
  })JSON");

  EXPECT_EQ(document, expected);
}

TEST(Lint_2020_12, duplicate_enum_values_1) {
  sourcemeta::jsontoolkit::JSON document =
      sourcemeta::jsontoolkit::parse(R"JSON({
    "$schema": "https://json-schema.org/draft/2020-12/schema",
    "enum": [ 1, {}, 2, 1, 1, 3, {} ]
  })JSON");

  LINT_AND_FIX(document);

  const sourcemeta::jsontoolkit::JSON expected =
      sourcemeta::jsontoolkit::parse(R"JSON({
    "$schema": "https://json-schema.org/draft/2020-12/schema",
    "enum": [ 1, 2, 3, {} ]
  })JSON");

  EXPECT_EQ(document, expected);
}

TEST(Lint_2020_12, duplicate_required_values_1) {
  sourcemeta::jsontoolkit::JSON document =
      sourcemeta::jsontoolkit::parse(R"JSON({
    "$schema": "https://json-schema.org/draft/2020-12/schema",
    "required": [ "foo", "bar", "baz", "foo" ]
  })JSON");

  LINT_AND_FIX(document);

  const sourcemeta::jsontoolkit::JSON expected =
      sourcemeta::jsontoolkit::parse(R"JSON({
    "$schema": "https://json-schema.org/draft/2020-12/schema",
    "required": [ "bar", "baz", "foo" ]
  })JSON");

  EXPECT_EQ(document, expected);
}
