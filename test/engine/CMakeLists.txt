noa_googletest(NAMESPACE sourcemeta PROJECT alterschema NAME engine
  FOLDER "AlterSchema/Engine"
  SOURCES transformer_test.cc rule_test.cc bundle_test.cc rules.h)

target_link_libraries(sourcemeta_alterschema_engine_unit
  PRIVATE sourcemeta::jsontoolkit::json)
target_link_libraries(sourcemeta_alterschema_engine_unit
  PRIVATE sourcemeta::alterschema::engine)
