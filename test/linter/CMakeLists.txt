noa_googletest(NAMESPACE sourcemeta PROJECT alterschema NAME linter
  FOLDER "AlterSchema/Linter"
  SOURCES
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

target_link_libraries(sourcemeta_alterschema_linter_unit
  PRIVATE sourcemeta::jsontoolkit::json)
target_link_libraries(sourcemeta_alterschema_linter_unit
  PRIVATE sourcemeta::alterschema::engine)
target_link_libraries(sourcemeta_alterschema_linter_unit
  PRIVATE sourcemeta::alterschema::linter)
