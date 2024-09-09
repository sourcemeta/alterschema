#include <gtest/gtest.h>

#include <sourcemeta/jsontoolkit/json.h>

#include "utils.h"

TEST(Lint_draft2, enum_with_type_1) {
  sourcemeta::jsontoolkit::JSON document =
      sourcemeta::jsontoolkit::parse(R"JSON({
    "$schema": "http://json-schema.org/draft-02/schema#",
    "type": "string",
    "enum": [ "foo", "bar" ]
  })JSON");

  LINT_AND_FIX(document);

  const sourcemeta::jsontoolkit::JSON expected =
      sourcemeta::jsontoolkit::parse(R"JSON({
    "$schema": "http://json-schema.org/draft-02/schema#",
    "enum": [ "foo", "bar" ]
  })JSON");

  EXPECT_EQ(document, expected);
}

TEST(Lint_draft2, single_type_array_1) {
  sourcemeta::jsontoolkit::JSON document =
      sourcemeta::jsontoolkit::parse(R"JSON({
    "$schema": "http://json-schema.org/draft-02/schema#",
    "type": [ "string" ]
  })JSON");

  LINT_AND_FIX(document);

  const sourcemeta::jsontoolkit::JSON expected =
      sourcemeta::jsontoolkit::parse(R"JSON({
    "$schema": "http://json-schema.org/draft-02/schema#",
    "type": "string"
  })JSON");

  EXPECT_EQ(document, expected);
}

TEST(Lint_draft2, additional_properties_default_1) {
  sourcemeta::jsontoolkit::JSON document =
      sourcemeta::jsontoolkit::parse(R"JSON({
    "$schema": "http://json-schema.org/draft-02/schema#",
    "additionalProperties": true
  })JSON");

  LINT_AND_FIX(document);

  const sourcemeta::jsontoolkit::JSON expected =
      sourcemeta::jsontoolkit::parse(R"JSON({
    "$schema": "http://json-schema.org/draft-02/schema#"
  })JSON");

  EXPECT_EQ(document, expected);
}

TEST(Lint_draft2, additional_properties_default_2) {
  sourcemeta::jsontoolkit::JSON document =
      sourcemeta::jsontoolkit::parse(R"JSON({
    "$schema": "http://json-schema.org/draft-02/schema#",
    "additionalProperties": {}
  })JSON");

  LINT_AND_FIX(document);

  const sourcemeta::jsontoolkit::JSON expected =
      sourcemeta::jsontoolkit::parse(R"JSON({
    "$schema": "http://json-schema.org/draft-02/schema#"
  })JSON");

  EXPECT_EQ(document, expected);
}

TEST(Lint_draft2, additional_properties_default_3) {
  sourcemeta::jsontoolkit::JSON document =
      sourcemeta::jsontoolkit::parse(R"JSON({
    "$schema": "http://json-schema.org/draft-02/schema#",
    "additionalProperties": false
  })JSON");

  LINT_AND_FIX(document);

  const sourcemeta::jsontoolkit::JSON expected =
      sourcemeta::jsontoolkit::parse(R"JSON({
    "$schema": "http://json-schema.org/draft-02/schema#",
    "additionalProperties": false
  })JSON");

  EXPECT_EQ(document, expected);
}

TEST(Lint_draft2, items_schema_default_1) {
  sourcemeta::jsontoolkit::JSON document =
      sourcemeta::jsontoolkit::parse(R"JSON({
    "$schema": "http://json-schema.org/draft-02/schema#",
    "items": {}
  })JSON");

  LINT_AND_FIX(document);

  const sourcemeta::jsontoolkit::JSON expected =
      sourcemeta::jsontoolkit::parse(R"JSON({
    "$schema": "http://json-schema.org/draft-02/schema#"
  })JSON");

  EXPECT_EQ(document, expected);
}

TEST(Lint_draft2, items_schema_default_2) {
  sourcemeta::jsontoolkit::JSON document =
      sourcemeta::jsontoolkit::parse(R"JSON({
    "$schema": "http://json-schema.org/draft-02/schema#",
    "items": {}
  })JSON");

  LINT_AND_FIX(document);

  const sourcemeta::jsontoolkit::JSON expected =
      sourcemeta::jsontoolkit::parse(R"JSON({
    "$schema": "http://json-schema.org/draft-02/schema#"
  })JSON");

  EXPECT_EQ(document, expected);
}

TEST(Lint_draft2, items_schema_default_3) {
  sourcemeta::jsontoolkit::JSON document =
      sourcemeta::jsontoolkit::parse(R"JSON({
    "$schema": "http://json-schema.org/draft-02/schema#",
    "items": { "type": "string" }
  })JSON");

  LINT_AND_FIX(document);

  const sourcemeta::jsontoolkit::JSON expected =
      sourcemeta::jsontoolkit::parse(R"JSON({
    "$schema": "http://json-schema.org/draft-02/schema#",
    "items": { "type": "string" }
  })JSON");

  EXPECT_EQ(document, expected);
}

TEST(Lint_draft2, items_array_default_1) {
  sourcemeta::jsontoolkit::JSON document =
      sourcemeta::jsontoolkit::parse(R"JSON({
    "$schema": "http://json-schema.org/draft-02/schema#",
    "items": []
  })JSON");

  LINT_AND_FIX(document);

  const sourcemeta::jsontoolkit::JSON expected =
      sourcemeta::jsontoolkit::parse(R"JSON({
    "$schema": "http://json-schema.org/draft-02/schema#"
  })JSON");

  EXPECT_EQ(document, expected);
}

TEST(Lint_draft2, duplicate_enum_values_2) {
  sourcemeta::jsontoolkit::JSON document =
      sourcemeta::jsontoolkit::parse(R"JSON({
    "$schema": "http://json-schema.org/draft-02/schema#",
    "enum": [ 1, {}, 2, 1, 1, 3, {} ]
  })JSON");

  LINT_AND_FIX(document);

  const sourcemeta::jsontoolkit::JSON expected =
      sourcemeta::jsontoolkit::parse(R"JSON({
    "$schema": "http://json-schema.org/draft-02/schema#",
    "enum": [ 1, 2, 3, {} ]
  })JSON");

  EXPECT_EQ(document, expected);
}

TEST(Lint_draft2, maximum_real_for_integer_1) {
  sourcemeta::jsontoolkit::JSON document =
      sourcemeta::jsontoolkit::parse(R"JSON({
    "$schema": "http://json-schema.org/draft-02/schema#",
    "type": "integer",
    "maximum": 3.2
  })JSON");

  LINT_AND_FIX(document);

  const sourcemeta::jsontoolkit::JSON expected =
      sourcemeta::jsontoolkit::parse(R"JSON({
    "$schema": "http://json-schema.org/draft-02/schema#",
    "type": "integer",
    "maximum": 3
  })JSON");

  EXPECT_EQ(document, expected);
}

TEST(Lint_draft2, minimum_real_for_integer_1) {
  sourcemeta::jsontoolkit::JSON document =
      sourcemeta::jsontoolkit::parse(R"JSON({
    "$schema": "http://json-schema.org/draft-02/schema#",
    "type": "integer",
    "minimum": 3.2
  })JSON");

  LINT_AND_FIX(document);

  const sourcemeta::jsontoolkit::JSON expected =
      sourcemeta::jsontoolkit::parse(R"JSON({
    "$schema": "http://json-schema.org/draft-02/schema#",
    "type": "integer",
    "minimum": 4
  })JSON");

  EXPECT_EQ(document, expected);
}

TEST(Lint_draft2, properties_default_1) {
  sourcemeta::jsontoolkit::JSON document =
      sourcemeta::jsontoolkit::parse(R"JSON({
    "$schema": "http://json-schema.org/draft-02/schema#",
    "properties": {}
  })JSON");

  LINT_AND_FIX(document);

  const sourcemeta::jsontoolkit::JSON expected =
      sourcemeta::jsontoolkit::parse(R"JSON({
    "$schema": "http://json-schema.org/draft-02/schema#"
  })JSON");

  EXPECT_EQ(document, expected);
}
