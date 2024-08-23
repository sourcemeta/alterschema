#include <gtest/gtest.h>

#include <string>
#include <tuple>
#include <vector>

#include <sourcemeta/alterschema/engine.h>
#include <sourcemeta/jsontoolkit/json.h>

#include "rules.h"

TEST(Engine_bundle, flat_document_no_applicators) {
  sourcemeta::alterschema::Bundle bundle;
  bundle.add<ExampleRule1>();
  bundle.add<ExampleRule2>();

  sourcemeta::jsontoolkit::JSON document =
      sourcemeta::jsontoolkit::parse(R"JSON({
    "$schema": "https://json-schema.org/draft/2020-12/schema",
    "foo": "bar",
    "bar": "baz",
    "qux": "xxx"
  })JSON");

  bundle.apply(document, sourcemeta::jsontoolkit::default_schema_walker,
               sourcemeta::jsontoolkit::official_resolver);

  const sourcemeta::jsontoolkit::JSON expected =
      sourcemeta::jsontoolkit::parse(R"JSON({
    "$schema": "https://json-schema.org/draft/2020-12/schema",
    "qux": "xxx"
  })JSON");

  EXPECT_EQ(document, expected);
}

TEST(Engine_bundle, flat_document_no_applicators_no_walker) {
  sourcemeta::alterschema::Bundle bundle;
  bundle.add<ExampleRule1>();
  bundle.add<ExampleRule2>();

  sourcemeta::jsontoolkit::JSON document =
      sourcemeta::jsontoolkit::parse(R"JSON({
    "$schema": "https://json-schema.org/draft/2020-12/schema",
    "foo": "bar",
    "bar": "baz",
    "qux": "xxx"
  })JSON");

  bundle.apply(document, sourcemeta::jsontoolkit::schema_walker_none,
               sourcemeta::jsontoolkit::official_resolver);

  const sourcemeta::jsontoolkit::JSON expected =
      sourcemeta::jsontoolkit::parse(R"JSON({
    "$schema": "https://json-schema.org/draft/2020-12/schema",
    "qux": "xxx"
  })JSON");

  EXPECT_EQ(document, expected);
}

TEST(Engine_bundle, throw_if_no_dialect_invalid_default) {
  sourcemeta::alterschema::Bundle bundle;
  bundle.add<ExampleRule1>();
  bundle.add<ExampleRule2>();

  sourcemeta::jsontoolkit::JSON document =
      sourcemeta::jsontoolkit::parse(R"JSON({
    "foo": "bar",
    "bar": "baz",
    "qux": "xxx"
  })JSON");

  EXPECT_THROW(bundle.apply(document,
                            sourcemeta::jsontoolkit::default_schema_walker,
                            sourcemeta::jsontoolkit::official_resolver,
                            sourcemeta::jsontoolkit::empty_pointer,
                            "https://example.com/invalid"),
               sourcemeta::jsontoolkit::SchemaResolutionError);

  const sourcemeta::jsontoolkit::JSON expected =
      sourcemeta::jsontoolkit::parse(R"JSON({
    "foo": "bar",
    "bar": "baz",
    "qux": "xxx"
  })JSON");

  // Nothing should have been modified
  EXPECT_EQ(document, expected);
}

TEST(Engine_bundle, with_default_dialect) {
  sourcemeta::alterschema::Bundle bundle;
  bundle.add<ExampleRule1>();
  bundle.add<ExampleRule2>();

  sourcemeta::jsontoolkit::JSON document =
      sourcemeta::jsontoolkit::parse(R"JSON({
    "foo": "bar",
    "bar": "baz",
    "qux": "xxx"
  })JSON");

  bundle.apply(document, sourcemeta::jsontoolkit::default_schema_walker,
               sourcemeta::jsontoolkit::official_resolver,
               sourcemeta::jsontoolkit::empty_pointer,
               "https://json-schema.org/draft/2020-12/schema");

  const sourcemeta::jsontoolkit::JSON expected =
      sourcemeta::jsontoolkit::parse(R"JSON({
    "qux": "xxx"
  })JSON");

  EXPECT_EQ(document, expected);
}

TEST(Engine_bundle, with_explicit_default_dialect_same) {
  sourcemeta::alterschema::Bundle bundle;
  bundle.add<ExampleRule1>();
  bundle.add<ExampleRule2>();

  sourcemeta::jsontoolkit::JSON document =
      sourcemeta::jsontoolkit::parse(R"JSON({
    "$schema": "https://json-schema.org/draft/2020-12/schema",
    "foo": "bar",
    "bar": "baz",
    "qux": "xxx"
  })JSON");

  bundle.apply(document, sourcemeta::jsontoolkit::default_schema_walker,
               sourcemeta::jsontoolkit::official_resolver,
               sourcemeta::jsontoolkit::empty_pointer,
               "https://json-schema.org/draft/2020-12/schema");

  const sourcemeta::jsontoolkit::JSON expected =
      sourcemeta::jsontoolkit::parse(R"JSON({
    "$schema": "https://json-schema.org/draft/2020-12/schema",
    "qux": "xxx"
  })JSON");

  EXPECT_EQ(document, expected);
}

TEST(Engine_bundle, throw_on_rules_called_twice) {
  sourcemeta::alterschema::Bundle bundle;
  bundle.add<ExampleRule1>();
  bundle.add<ExampleRuleConflictsWith1>();

  sourcemeta::jsontoolkit::JSON document =
      sourcemeta::jsontoolkit::parse(R"JSON({
    "$schema": "https://json-schema.org/draft/2020-12/schema",
    "foo": "bar"
  })JSON");

  EXPECT_THROW(bundle.apply(document,
                            sourcemeta::jsontoolkit::default_schema_walker,
                            sourcemeta::jsontoolkit::official_resolver),
               std::runtime_error);
}

TEST(Engine_bundle, top_level_rule) {
  sourcemeta::alterschema::Bundle bundle;
  bundle.add<ExampleRule3>();

  sourcemeta::jsontoolkit::JSON document =
      sourcemeta::jsontoolkit::parse(R"JSON({
    "$schema": "https://json-schema.org/draft/2020-12/schema",
    "properties": {
      "foo": { "type": "string" }
    }
  })JSON");

  bundle.apply(document, sourcemeta::jsontoolkit::default_schema_walker,
               sourcemeta::jsontoolkit::official_resolver);

  const sourcemeta::jsontoolkit::JSON expected =
      sourcemeta::jsontoolkit::parse(R"JSON({
    "$schema": "https://json-schema.org/draft/2020-12/schema",
    "top": true,
    "properties": {
      "foo": { "type": "string" }
    }
  })JSON");

  EXPECT_EQ(document, expected);
}

TEST(Engine_bundle, walker_2020_12) {
  sourcemeta::alterschema::Bundle bundle;
  bundle.add<ExampleRule4>();

  sourcemeta::jsontoolkit::JSON document =
      sourcemeta::jsontoolkit::parse(R"JSON({
    "$schema": "https://json-schema.org/draft/2020-12/schema",
    "properties": {
      "foo": { "type": "string" },
      "bar": {
        "items": {
          "type": "number"
        }
      }
    }
  })JSON");

  bundle.apply(document, sourcemeta::jsontoolkit::default_schema_walker,
               sourcemeta::jsontoolkit::official_resolver);

  const sourcemeta::jsontoolkit::JSON expected =
      sourcemeta::jsontoolkit::parse(R"JSON({
    "$schema": "https://json-schema.org/draft/2020-12/schema",
    "here": true,
    "properties": {
      "foo": {
        "type": "string",
        "here": true
      },
      "bar": {
        "here": true,
        "items": {
          "here": true,
          "type": "number"
        }
      }
    }
  })JSON");

  EXPECT_EQ(document, expected);
}

TEST(Engine_bundle, none_walker) {
  sourcemeta::alterschema::Bundle bundle;
  bundle.add<ExampleRule4>();

  sourcemeta::jsontoolkit::JSON document =
      sourcemeta::jsontoolkit::parse(R"JSON({
    "$schema": "https://json-schema.org/draft/2020-12/schema",
    "properties": {
      "foo": { "type": "string" },
      "bar": {
        "items": {
          "type": "number"
        }
      }
    }
  })JSON");

  bundle.apply(document, sourcemeta::jsontoolkit::schema_walker_none,
               sourcemeta::jsontoolkit::official_resolver);

  const sourcemeta::jsontoolkit::JSON expected =
      sourcemeta::jsontoolkit::parse(R"JSON({
    "$schema": "https://json-schema.org/draft/2020-12/schema",
    "here": true,
    "properties": {
      "foo": { "type": "string" },
      "bar": {
        "items": { "type": "number" }
      }
    }
  })JSON");

  EXPECT_EQ(document, expected);
}

TEST(Engine_bundle, mismatch_default_dialect) {
  sourcemeta::alterschema::Bundle bundle;
  bundle.add<ExampleRule4>();

  sourcemeta::jsontoolkit::JSON document =
      sourcemeta::jsontoolkit::parse(R"JSON({
    "$schema": "https://json-schema.org/draft/2020-12/schema",
    "properties": {
      "foo": { "type": "string" },
      "bar": {
        "unevaluatedItems": {
          "type": "number"
        }
      }
    }
  })JSON");

  bundle.apply(document, sourcemeta::jsontoolkit::default_schema_walker,
               sourcemeta::jsontoolkit::official_resolver,
               sourcemeta::jsontoolkit::empty_pointer,
               "http://json-schema.org/draft-04/schema#");

  const sourcemeta::jsontoolkit::JSON expected =
      sourcemeta::jsontoolkit::parse(R"JSON({
    "$schema": "https://json-schema.org/draft/2020-12/schema",
    "here": true,
    "properties": {
      "foo": {
        "type": "string",
        "here": true
      },
      "bar": {
        "here": true,
        "unevaluatedItems": {
          "here": true,
          "type": "number"
        }
      }
    }
  })JSON");

  EXPECT_EQ(document, expected);
}

TEST(Engine_bundle, specific_subschema) {
  sourcemeta::alterschema::Bundle bundle;
  bundle.add<ExampleRule4>();

  sourcemeta::jsontoolkit::JSON document =
      sourcemeta::jsontoolkit::parse(R"JSON({
    "$schema": "https://json-schema.org/draft/2020-12/schema",
    "properties": {
      "foo": { "type": "string" },
      "bar": {
        "items": {
          "type": "number"
        }
      }
    }
  })JSON");

  bundle.apply(document, sourcemeta::jsontoolkit::default_schema_walker,
               sourcemeta::jsontoolkit::official_resolver,
               {"properties", "bar"});

  const sourcemeta::jsontoolkit::JSON expected =
      sourcemeta::jsontoolkit::parse(R"JSON({
    "$schema": "https://json-schema.org/draft/2020-12/schema",
    "properties": {
      "foo": {
        "type": "string"
      },
      "bar": {
        "here": true,
        "items": {
          "here": true,
          "type": "number"
        }
      }
    }
  })JSON");

  EXPECT_EQ(document, expected);
}

TEST(Engine_bundle, rule_pointers) {
  sourcemeta::alterschema::Bundle bundle;
  bundle.add<ExampleRule5>();

  sourcemeta::jsontoolkit::JSON document =
      sourcemeta::jsontoolkit::parse(R"JSON({
    "$schema": "https://json-schema.org/draft/2020-12/schema",
    "properties": {
      "foo": { "type": "string" },
      "bar": { "type": "string" },
      "baz": { "type": "string" }
    }
  })JSON");

  bundle.apply(document, sourcemeta::jsontoolkit::default_schema_walker,
               sourcemeta::jsontoolkit::official_resolver);

  const sourcemeta::jsontoolkit::JSON expected =
      sourcemeta::jsontoolkit::parse(R"JSON({
    "$schema": "https://json-schema.org/draft/2020-12/schema",
    "properties": {
      "foo": { "type": "string" },
      "bar": { "type": "string" },
      "baz": { "type": "string", "baz": true }
    }
  })JSON");

  EXPECT_EQ(document, expected);
}

TEST(Engine_bundle, multi_dialect_rules) {
  sourcemeta::alterschema::Bundle bundle;
  bundle.add<ExampleRule4>();

  sourcemeta::jsontoolkit::JSON document =
      sourcemeta::jsontoolkit::parse(R"JSON({
    "$schema": "https://json-schema.org/draft/2019-09/schema",
    "unevaluatedItems": { "type": "string" },
    "$defs": {
      "foo": {
        "$schema": "http://json-schema.org/draft-03/schema#",
        "additionalItems": {
          "type": "string"
        }
      }
    }
  })JSON");

  bundle.apply(document, sourcemeta::jsontoolkit::default_schema_walker,
               sourcemeta::jsontoolkit::official_resolver);

  const sourcemeta::jsontoolkit::JSON expected =
      sourcemeta::jsontoolkit::parse(R"JSON({
    "$schema": "https://json-schema.org/draft/2019-09/schema",
    "here": true,
    "unevaluatedItems": {
      "here": true,
      "type": "string"
    },
    "$defs": {
      "foo": {
        "$schema": "http://json-schema.org/draft-03/schema#",
        "here": true,
        "additionalItems": {
          "here": true,
          "type": "string"
        }
      }
    }
  })JSON");

  EXPECT_EQ(document, expected);
}

TEST(Engine_bundle, dialect_specific_rules) {
  sourcemeta::alterschema::Bundle bundle;
  bundle.add<ExampleRule6>();

  sourcemeta::jsontoolkit::JSON document =
      sourcemeta::jsontoolkit::parse(R"JSON({
    "$schema": "https://json-schema.org/draft/2019-09/schema",
    "$defs": {
      "foo": { "$schema": "http://json-schema.org/draft-03/schema#" },
      "bar": { "$schema": "http://json-schema.org/draft-02/schema#" },
      "baz": { "$schema": "http://json-schema.org/draft-01/schema#" }
    }
  })JSON");

  bundle.apply(document, sourcemeta::jsontoolkit::default_schema_walker,
               sourcemeta::jsontoolkit::official_resolver);

  const sourcemeta::jsontoolkit::JSON expected =
      sourcemeta::jsontoolkit::parse(R"JSON({
    "$schema": "https://json-schema.org/draft/2019-09/schema",
    "$defs": {
      "foo": { "$schema": "http://json-schema.org/draft-03/schema#", "draft": 3 },
      "bar": { "$schema": "http://json-schema.org/draft-02/schema#" },
      "baz": { "$schema": "http://json-schema.org/draft-01/schema#" }
    }
  })JSON");

  EXPECT_EQ(document, expected);
}

TEST(Engine_bundle, check_top_level) {
  sourcemeta::alterschema::Bundle bundle;
  bundle.add<ExampleRule1>();
  bundle.add<ExampleRule2>();

  sourcemeta::jsontoolkit::JSON document =
      sourcemeta::jsontoolkit::parse(R"JSON({
    "$schema": "https://json-schema.org/draft/2020-12/schema",
    "foo": "bar",
    "properties": {
      "xxx": {
        "bar": "baz"
      }
    }
  })JSON");

  std::vector<
      std::tuple<sourcemeta::jsontoolkit::Pointer, std::string, std::string>>
      entries;
  const bool result = bundle.check(
      document, sourcemeta::jsontoolkit::default_schema_walker,
      sourcemeta::jsontoolkit::official_resolver,
      [&entries](const auto &pointer, const auto &name, const auto &message) {
        entries.emplace_back(pointer, name, message);
      });

  EXPECT_FALSE(result);
  EXPECT_EQ(entries.size(), 2);

  EXPECT_EQ(std::get<0>(entries.at(0)), sourcemeta::jsontoolkit::Pointer{});
  EXPECT_EQ(std::get<1>(entries.at(0)), "example_rule_1");
  EXPECT_EQ(std::get<2>(entries.at(0)), "Keyword foo is not permitted");

  EXPECT_EQ(std::get<0>(entries.at(1)),
            sourcemeta::jsontoolkit::Pointer({"properties", "xxx"}));
  EXPECT_EQ(std::get<1>(entries.at(1)), "example_rule_2");
  EXPECT_EQ(std::get<2>(entries.at(1)), "Keyword bar is not permitted");
}

TEST(Engine_bundle, check_subschema) {
  sourcemeta::alterschema::Bundle bundle;
  bundle.add<ExampleRule1>();
  bundle.add<ExampleRule2>();

  sourcemeta::jsontoolkit::JSON document =
      sourcemeta::jsontoolkit::parse(R"JSON({
    "$schema": "https://json-schema.org/draft/2020-12/schema",
    "foo": "bar",
    "properties": {
      "xxx": {
        "bar": "baz"
      }
    }
  })JSON");

  std::vector<
      std::tuple<sourcemeta::jsontoolkit::Pointer, std::string, std::string>>
      entries;
  const bool result = bundle.check(
      document, sourcemeta::jsontoolkit::default_schema_walker,
      sourcemeta::jsontoolkit::official_resolver,
      [&entries](const auto &pointer, const auto &name, const auto &message) {
        entries.emplace_back(pointer, name, message);
      },
      {"properties", "xxx"});

  EXPECT_FALSE(result);
  EXPECT_EQ(entries.size(), 1);

  EXPECT_EQ(std::get<0>(entries.at(0)),
            sourcemeta::jsontoolkit::Pointer({"properties", "xxx"}));
  EXPECT_EQ(std::get<1>(entries.at(0)), "example_rule_2");
  EXPECT_EQ(std::get<2>(entries.at(0)), "Keyword bar is not permitted");
}

TEST(Engine_bundle, check_no_match) {
  sourcemeta::alterschema::Bundle bundle;
  bundle.add<ExampleRule1>();
  bundle.add<ExampleRule2>();

  sourcemeta::jsontoolkit::JSON document =
      sourcemeta::jsontoolkit::parse(R"JSON({
    "$schema": "https://json-schema.org/draft/2020-12/schema",
    "properties": {
      "xxx": {
        "type": "string"
      }
    }
  })JSON");

  std::vector<
      std::tuple<sourcemeta::jsontoolkit::Pointer, std::string, std::string>>
      entries;
  const bool result = bundle.check(
      document, sourcemeta::jsontoolkit::default_schema_walker,
      sourcemeta::jsontoolkit::official_resolver,
      [&entries](const auto &pointer, const auto &name, const auto &message) {
        entries.emplace_back(pointer, name, message);
      });

  EXPECT_TRUE(result);
  EXPECT_TRUE(entries.empty());
}

TEST(Engine_bundle, check_empty) {
  sourcemeta::alterschema::Bundle bundle;
  sourcemeta::jsontoolkit::JSON document =
      sourcemeta::jsontoolkit::parse(R"JSON({
    "$schema": "https://json-schema.org/draft/2020-12/schema",
    "foo": "bar"
  })JSON");

  std::vector<
      std::tuple<sourcemeta::jsontoolkit::Pointer, std::string, std::string>>
      entries;
  const bool result = bundle.check(
      document, sourcemeta::jsontoolkit::default_schema_walker,
      sourcemeta::jsontoolkit::official_resolver,
      [&entries](const auto &pointer, const auto &name, const auto &message) {
        entries.emplace_back(pointer, name, message);
      });

  EXPECT_TRUE(result);
  EXPECT_TRUE(entries.empty());
}

TEST(Engine_bundle, check_throw_if_no_dialect_invalid_default) {
  sourcemeta::alterschema::Bundle bundle;
  bundle.add<ExampleRule1>();
  bundle.add<ExampleRule2>();

  const sourcemeta::jsontoolkit::JSON document =
      sourcemeta::jsontoolkit::parse(R"JSON({
    "foo": "bar",
    "bar": "baz",
    "qux": "xxx"
  })JSON");

  EXPECT_THROW(bundle.check(document,
                            sourcemeta::jsontoolkit::default_schema_walker,
                            sourcemeta::jsontoolkit::official_resolver, nullptr,
                            sourcemeta::jsontoolkit::empty_pointer,
                            "https://example.com/invalid"),
               sourcemeta::jsontoolkit::SchemaResolutionError);
}

TEST(Engine_bundle, check_with_default_dialect) {
  sourcemeta::alterschema::Bundle bundle;
  bundle.add<ExampleRule1>();
  bundle.add<ExampleRule2>();

  sourcemeta::jsontoolkit::JSON document =
      sourcemeta::jsontoolkit::parse(R"JSON({
    "foo": "bar",
    "properties": {
      "xxx": {
        "bar": "baz"
      }
    }
  })JSON");

  std::vector<
      std::tuple<sourcemeta::jsontoolkit::Pointer, std::string, std::string>>
      entries;
  const bool result = bundle.check(
      document, sourcemeta::jsontoolkit::default_schema_walker,
      sourcemeta::jsontoolkit::official_resolver,
      [&entries](const auto &pointer, const auto &name, const auto &message) {
        entries.emplace_back(pointer, name, message);
      },
      sourcemeta::jsontoolkit::empty_pointer,
      "https://json-schema.org/draft/2020-12/schema");

  EXPECT_FALSE(result);
  EXPECT_EQ(entries.size(), 2);

  EXPECT_EQ(std::get<0>(entries.at(0)), sourcemeta::jsontoolkit::Pointer{});
  EXPECT_EQ(std::get<1>(entries.at(0)), "example_rule_1");
  EXPECT_EQ(std::get<2>(entries.at(0)), "Keyword foo is not permitted");

  EXPECT_EQ(std::get<0>(entries.at(1)),
            sourcemeta::jsontoolkit::Pointer({"properties", "xxx"}));
  EXPECT_EQ(std::get<1>(entries.at(1)), "example_rule_2");
  EXPECT_EQ(std::get<2>(entries.at(1)), "Keyword bar is not permitted");
}
