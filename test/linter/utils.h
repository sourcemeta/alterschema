#ifndef SOURCEMETA_ALTERSCHEMA_LINTER_TEST_UTILS_H_
#define SOURCEMETA_ALTERSCHEMA_LINTER_TEST_UTILS_H_

#include <sourcemeta/alterschema/engine.h>
#include <sourcemeta/alterschema/linter.h>

#define LINT_AND_FIX_FOR_READABILITY(document)                                 \
  sourcemeta::alterschema::Bundle bundle;                                      \
  sourcemeta::alterschema::add(                                                \
      bundle, sourcemeta::alterschema::LinterCategory::AntiPattern);           \
  sourcemeta::alterschema::add(                                                \
      bundle, sourcemeta::alterschema::LinterCategory::Simplify);              \
  sourcemeta::alterschema::add(                                                \
      bundle, sourcemeta::alterschema::LinterCategory::Superfluous);           \
  sourcemeta::alterschema::add(                                                \
      bundle, sourcemeta::alterschema::LinterCategory::Redundant);             \
  sourcemeta::alterschema::add(                                                \
      bundle, sourcemeta::alterschema::LinterCategory::SyntaxSugar);           \
  bundle.apply(document, sourcemeta::jsontoolkit::default_schema_walker,       \
               sourcemeta::jsontoolkit::official_resolver);

#define LINT_AND_FIX_FOR_ANALYSIS(document)                                    \
  sourcemeta::alterschema::Bundle bundle;                                      \
  sourcemeta::alterschema::add(                                                \
      bundle, sourcemeta::alterschema::LinterCategory::AntiPattern);           \
  sourcemeta::alterschema::add(                                                \
      bundle, sourcemeta::alterschema::LinterCategory::Simplify);              \
  sourcemeta::alterschema::add(                                                \
      bundle, sourcemeta::alterschema::LinterCategory::Superfluous);           \
  sourcemeta::alterschema::add(                                                \
      bundle, sourcemeta::alterschema::LinterCategory::Desugar);               \
  bundle.apply(document, sourcemeta::jsontoolkit::default_schema_walker,       \
               sourcemeta::jsontoolkit::official_resolver);

#endif
