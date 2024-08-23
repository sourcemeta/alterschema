add_executable(sourcemeta_alterschema_engine_unit
  transformer_test.cc rule_test.cc bundle_test.cc rules.h)
noa_add_default_options(PRIVATE sourcemeta_alterschema_engine_unit)
target_link_libraries(sourcemeta_alterschema_engine_unit
  PRIVATE GTest::gtest)
target_link_libraries(sourcemeta_alterschema_engine_unit
  PRIVATE GTest::gtest_main)
target_link_libraries(sourcemeta_alterschema_engine_unit
  PRIVATE sourcemeta::jsontoolkit::json)
target_link_libraries(sourcemeta_alterschema_engine_unit
  PRIVATE sourcemeta::alterschema::engine)
add_test(NAME Engine COMMAND sourcemeta_alterschema_engine_unit --gtest_brief=1)
set_target_properties(sourcemeta_alterschema_engine_unit
  PROPERTIES FOLDER "AlterSchema/Engine")
