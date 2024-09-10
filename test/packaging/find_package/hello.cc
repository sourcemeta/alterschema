#include <sourcemeta/alterschema/engine.h>
#include <sourcemeta/alterschema/linter.h>

#include <sourcemeta/jsontoolkit/json.h>

#include <cstdlib>  // EXIT_SUCCESS
#include <iostream> // std::cout

auto main() -> int {
  sourcemeta::alterschema::Bundle bundle;
  sourcemeta::alterschema::add(
      bundle, sourcemeta::alterschema::LinterCategory::Simplify);

  auto schema = sourcemeta::jsontoolkit::parse(R"JSON({
    "$schema": "https://json-schema.org/draft/2020-12/schema",
    "foo": 1,
    "items": {
      "type": "string",
      "foo": 2
    }
  })JSON");

  bundle.apply(schema, sourcemeta::jsontoolkit::default_schema_walker,
               sourcemeta::jsontoolkit::official_resolver);

  sourcemeta::jsontoolkit::prettify(schema, std::cout);
  std::cout << std::endl;
  return EXIT_SUCCESS;
}
