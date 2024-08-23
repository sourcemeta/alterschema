#ifndef SOURCEMETA_ALTERSCHEMA_LINTER_H_
#define SOURCEMETA_ALTERSCHEMA_LINTER_H_

#include "linter_export.h"

#include <sourcemeta/alterschema/engine.h>

namespace sourcemeta::alterschema {

/// @ingroup linter
/// The category of a built-in transformation rule
enum class LinterCategory {
  /// Rules that make use of newer features within the same dialect
  Modernize,

  /// Rules that detect common anti-patterns
  AntiPattern,

  /// Rules that simplify the given schema
  Simplify,

  /// Rules that remove schema redundancies
  Redundant
};

/// Add a set of built-in linter rules given a category
SOURCEMETA_ALTERSCHEMA_LINTER_EXPORT
auto add(Bundle &bundle, const LinterCategory category) -> void;

} // namespace sourcemeta::alterschema

#endif
