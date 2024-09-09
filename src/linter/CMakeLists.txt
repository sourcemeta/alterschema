noa_library(NAMESPACE sourcemeta PROJECT alterschema NAME linter
  FOLDER "AlterSchema/Linter"
  SOURCES linter.cc
    # Modernize
    modernize/enum_to_const.h

    # Antipattern
    antipattern/const_with_type.h
    antipattern/duplicate_enum_values.h
    antipattern/duplicate_required_values.h
    antipattern/exclusive_maximum_number_and_maximum.h
    antipattern/exclusive_minimum_number_and_minimum.h
    antipattern/enum_with_type.h

    # Simplify
    simplify/dependent_required_tautology.h
    simplify/maximum_real_for_integer.h
    simplify/minimum_real_for_integer.h
    simplify/single_type_array.h

    # Redundant
    redundant/additional_properties_default.h
    redundant/content_media_type_without_encoding.h
    redundant/content_schema_default.h
    redundant/content_schema_without_media_type.h
    redundant/duplicate_allof_branches.h
    redundant/duplicate_anyof_branches.h
    redundant/else_without_if.h
    redundant/empty_dependent_required.h
    redundant/items_array_default.h
    redundant/items_schema_default.h
    redundant/max_contains_without_contains.h
    redundant/min_contains_without_contains.h
    redundant/then_without_if.h
    redundant/unevaluated_items_default.h
    redundant/unevaluated_properties_default.h)

if(ALTERSCHEMA_INSTALL)
  noa_library_install(NAMESPACE sourcemeta PROJECT alterschema NAME linter)
endif()

target_link_libraries(sourcemeta_alterschema_linter PUBLIC
  sourcemeta::alterschema::engine)
