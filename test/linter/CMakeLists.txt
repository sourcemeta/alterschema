add_executable(sourcemeta_alterschema_linter_unit
  2020_12_test.cc
  2019_09_test.cc
  draft7_test.cc
  draft6_test.cc
  draft4_test.cc
  draft3_test.cc
  draft2_test.cc
  draft1_test.cc
  draft0_test.cc
  utils.h)

noa_add_default_options(PRIVATE sourcemeta_alterschema_linter_unit)
target_link_libraries(sourcemeta_alterschema_linter_unit
  PRIVATE GTest::gtest)
target_link_libraries(sourcemeta_alterschema_linter_unit
  PRIVATE GTest::gtest_main)
target_link_libraries(sourcemeta_alterschema_linter_unit
  PRIVATE sourcemeta::jsontoolkit::json)
target_link_libraries(sourcemeta_alterschema_linter_unit
  PRIVATE sourcemeta::alterschema::engine)
target_link_libraries(sourcemeta_alterschema_linter_unit
  PRIVATE sourcemeta::alterschema::linter)
add_test(NAME linter COMMAND sourcemeta_alterschema_linter_unit --gtest_brief=1)
set_target_properties(sourcemeta_alterschema_linter_unit
  PROPERTIES FOLDER "AlterSchema/Linter")
