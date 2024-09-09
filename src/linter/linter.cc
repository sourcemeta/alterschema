#include <sourcemeta/alterschema/linter.h>

#include <cassert> // assert

// For built-in rules
#include <algorithm>
#include <cmath>
#include <iterator>
namespace sourcemeta::alterschema {
template <typename T>
auto contains_any(const T &container, const T &values) -> bool {
  return std::any_of(
      std::cbegin(container), std::cend(container),
      [&values](const auto &element) { return values.contains(element); });
}

// Modernize
#include "modernize/enum_to_const.h"
// AntiPattern
#include "antipattern/const_with_type.h"
#include "antipattern/duplicate_enum_values.h"
#include "antipattern/duplicate_required_values.h"
#include "antipattern/enum_with_type.h"
#include "antipattern/exclusive_maximum_number_and_maximum.h"
#include "antipattern/exclusive_minimum_number_and_minimum.h"
// Simplify
#include "simplify/dependencies_property_tautology.h"
#include "simplify/dependent_required_tautology.h"
#include "simplify/maximum_real_for_integer.h"
#include "simplify/minimum_real_for_integer.h"
#include "simplify/single_type_array.h"
// Redundant
#include "redundant/additional_properties_default.h"
#include "redundant/content_media_type_without_encoding.h"
#include "redundant/content_schema_default.h"
#include "redundant/content_schema_without_media_type.h"
#include "redundant/duplicate_allof_branches.h"
#include "redundant/duplicate_anyof_branches.h"
#include "redundant/else_without_if.h"
#include "redundant/empty_dependencies.h"
#include "redundant/empty_dependent_required.h"
#include "redundant/if_without_then_else.h"
#include "redundant/items_array_default.h"
#include "redundant/items_schema_default.h"
#include "redundant/max_contains_without_contains.h"
#include "redundant/min_contains_without_contains.h"
#include "redundant/min_properties_covered_by_required.h"
#include "redundant/pattern_properties_default.h"
#include "redundant/properties_default.h"
#include "redundant/then_without_if.h"
#include "redundant/unevaluated_items_default.h"
#include "redundant/unevaluated_properties_default.h"
} // namespace sourcemeta::alterschema

namespace sourcemeta::alterschema {

auto add(Bundle &bundle, const LinterCategory category) -> void {
  switch (category) {
    case LinterCategory::Modernize:
      bundle.add<EnumToConst>();
      break;
    case LinterCategory::AntiPattern:
      bundle.add<EnumWithType>();
      bundle.add<DuplicateEnumValues>();
      bundle.add<DuplicateRequiredValues>();
      bundle.add<ConstWithType>();
      bundle.add<ExclusiveMaximumNumberAndMaximum>();
      bundle.add<ExclusiveMinimumNumberAndMinimum>();
      break;
    case LinterCategory::Simplify:
      bundle.add<DependenciesPropertyTautology>();
      bundle.add<DependentRequiredTautology>();
      bundle.add<MaximumRealForInteger>();
      bundle.add<MinimumRealForInteger>();
      bundle.add<SingleTypeArray>();
      break;
    case LinterCategory::Redundant:
      bundle.add<AdditionalPropertiesDefault>();
      bundle.add<ContentMediaTypeWithoutEncoding>();
      bundle.add<ContentSchemaDefault>();
      bundle.add<ContentSchemaWithoutMediaType>();
      bundle.add<DuplicateAllOfBranches>();
      bundle.add<DuplicateAnyOfBranches>();
      bundle.add<ElseWithoutIf>();
      bundle.add<EmptyDependencies>();
      bundle.add<EmptyDependentRequired>();
      bundle.add<IfWithoutThenElse>();
      bundle.add<ItemsArrayDefault>();
      bundle.add<ItemsSchemaDefault>();
      bundle.add<MaxContainsWithoutContains>();
      bundle.add<MinContainsWithoutContains>();
      bundle.add<MinPropertiesCoveredByRequired>();
      bundle.add<PatternPropertiesDefault>();
      bundle.add<PropertiesDefault>();
      bundle.add<ThenWithoutIf>();
      bundle.add<UnevaluatedItemsDefault>();
      bundle.add<UnevaluatedPropertiesDefault>();
      break;
    default:
      // We should never get here
      assert(false);
      break;
  }
}

} // namespace sourcemeta::alterschema
