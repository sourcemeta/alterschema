#include <gtest/gtest.h>

#include <sourcemeta/jsontoolkit/json.h>

#include "utils.h"

TEST(Lint_draft1, enum_with_type_1) {
  sourcemeta::jsontoolkit::JSON document =
      sourcemeta::jsontoolkit::parse(R"JSON({
    "$schema": "http://json-schema.org/draft-01/schema#",
    "type": "string",
    "enum": [ "foo", "bar" ]
  })JSON");

  LINT_AND_FIX(document);

  const sourcemeta::jsontoolkit::JSON expected =
      sourcemeta::jsontoolkit::parse(R"JSON({
    "$schema": "http://json-schema.org/draft-01/schema#",
    "enum": [ "foo", "bar" ]
  })JSON");

  EXPECT_EQ(document, expected);
}

TEST(Lint_draft1, single_type_array_1) {
  sourcemeta::jsontoolkit::JSON document =
      sourcemeta::jsontoolkit::parse(R"JSON({
    "$schema": "http://json-schema.org/draft-01/schema#",
    "type": [ "string" ]
  })JSON");

  LINT_AND_FIX(document);

  const sourcemeta::jsontoolkit::JSON expected =
      sourcemeta::jsontoolkit::parse(R"JSON({
    "$schema": "http://json-schema.org/draft-01/schema#",
    "type": "string"
  })JSON");

  EXPECT_EQ(document, expected);
}

TEST(Lint_draft1, additional_properties_default_1) {
  sourcemeta::jsontoolkit::JSON document =
      sourcemeta::jsontoolkit::parse(R"JSON({
    "$schema": "http://json-schema.org/draft-01/schema#",
    "additionalProperties": true
  })JSON");

  LINT_AND_FIX(document);

  const sourcemeta::jsontoolkit::JSON expected =
      sourcemeta::jsontoolkit::parse(R"JSON({
    "$schema": "http://json-schema.org/draft-01/schema#"
  })JSON");

  EXPECT_EQ(document, expected);
}

TEST(Lint_draft1, additional_properties_default_2) {
  sourcemeta::jsontoolkit::JSON document =
      sourcemeta::jsontoolkit::parse(R"JSON({
    "$schema": "http://json-schema.org/draft-01/schema#",
    "additionalProperties": {}
  })JSON");

  LINT_AND_FIX(document);

  const sourcemeta::jsontoolkit::JSON expected =
      sourcemeta::jsontoolkit::parse(R"JSON({
    "$schema": "http://json-schema.org/draft-01/schema#"
  })JSON");

  EXPECT_EQ(document, expected);
}

TEST(Lint_draft1, additional_properties_default_3) {
  sourcemeta::jsontoolkit::JSON document =
      sourcemeta::jsontoolkit::parse(R"JSON({
    "$schema": "http://json-schema.org/draft-01/schema#",
    "additionalProperties": false
  })JSON");

  LINT_AND_FIX(document);

  const sourcemeta::jsontoolkit::JSON expected =
      sourcemeta::jsontoolkit::parse(R"JSON({
    "$schema": "http://json-schema.org/draft-01/schema#",
    "additionalProperties": false
  })JSON");

  EXPECT_EQ(document, expected);
}

TEST(Lint_draft1, items_schema_default_1) {
  sourcemeta::jsontoolkit::JSON document =
      sourcemeta::jsontoolkit::parse(R"JSON({
    "$schema": "http://json-schema.org/draft-01/schema#",
    "items": {}
  })JSON");

  LINT_AND_FIX(document);

  const sourcemeta::jsontoolkit::JSON expected =
      sourcemeta::jsontoolkit::parse(R"JSON({
    "$schema": "http://json-schema.org/draft-01/schema#"
  })JSON");

  EXPECT_EQ(document, expected);
}

TEST(Lint_draft1, items_schema_default_2) {
  sourcemeta::jsontoolkit::JSON document =
      sourcemeta::jsontoolkit::parse(R"JSON({
    "$schema": "http://json-schema.org/draft-01/schema#",
    "items": {}
  })JSON");

  LINT_AND_FIX(document);

  const sourcemeta::jsontoolkit::JSON expected =
      sourcemeta::jsontoolkit::parse(R"JSON({
    "$schema": "http://json-schema.org/draft-01/schema#"
  })JSON");

  EXPECT_EQ(document, expected);
}

TEST(Lint_draft1, items_schema_default_3) {
  sourcemeta::jsontoolkit::JSON document =
      sourcemeta::jsontoolkit::parse(R"JSON({
    "$schema": "http://json-schema.org/draft-01/schema#",
    "items": { "type": "string" }
  })JSON");

  LINT_AND_FIX(document);

  const sourcemeta::jsontoolkit::JSON expected =
      sourcemeta::jsontoolkit::parse(R"JSON({
    "$schema": "http://json-schema.org/draft-01/schema#",
    "items": { "type": "string" }
  })JSON");

  EXPECT_EQ(document, expected);
}

TEST(Lint_draft1, items_array_default_1) {
  sourcemeta::jsontoolkit::JSON document =
      sourcemeta::jsontoolkit::parse(R"JSON({
    "$schema": "http://json-schema.org/draft-01/schema#",
    "items": []
  })JSON");

  LINT_AND_FIX(document);

  const sourcemeta::jsontoolkit::JSON expected =
      sourcemeta::jsontoolkit::parse(R"JSON({
    "$schema": "http://json-schema.org/draft-01/schema#"
  })JSON");

  EXPECT_EQ(document, expected);
}
