cmake_minimum_required(VERSION 3.16)
project(alterschema VERSION 0.0.1 LANGUAGES CXX
  DESCRIPTION "Perform advanced transformations on JSON Schemas"
  HOMEPAGE_URL "https://alterschema.sourcemeta.com")
list(APPEND CMAKE_MODULE_PATH "${PROJECT_SOURCE_DIR}/cmake")
include(vendor/noa/cmake/noa.cmake)

# Options
option(ALTERSCHEMA_ENGINE "Build the Alterschema Engine library" ON)
option(ALTERSCHEMA_LINTER "Build the Alterschema Linter library" ON)
option(ALTERSCHEMA_TESTS "Build the Alterschema tests" OFF)
option(ALTERSCHEMA_DOCS "Build the Alterschema docs" OFF)
option(ALTERSCHEMA_INSTALL "Install the Alterschema library" ON)
option(ALTERSCHEMA_ADDRESS_SANITIZER "Build Alterschema with an address sanitizer" OFF)
option(ALTERSCHEMA_UNDEFINED_SANITIZER "Build Alterschema with an undefined behavior sanitizer" OFF)

if(ALTERSCHEMA_INSTALL)
  include(GNUInstallDirs)
  include(CMakePackageConfigHelpers)
  configure_package_config_file(
    config.cmake.in
    "${CMAKE_CURRENT_BINARY_DIR}/${PROJECT_NAME}-config.cmake"
    INSTALL_DESTINATION "${CMAKE_INSTALL_LIBDIR}/cmake/${PROJECT_NAME}")
  write_basic_package_version_file(
    "${CMAKE_CURRENT_BINARY_DIR}/${PROJECT_NAME}-config-version.cmake"
    COMPATIBILITY SameMajorVersion)
  install(FILES
    "${CMAKE_CURRENT_BINARY_DIR}/${PROJECT_NAME}-config-version.cmake"
    "${CMAKE_CURRENT_BINARY_DIR}/${PROJECT_NAME}-config.cmake"
    DESTINATION "${CMAKE_INSTALL_LIBDIR}/cmake/${PROJECT_NAME}"
    COMPONENT sourcemeta_alterschema_dev)
endif()

if(ALTERSCHEMA_ENGINE OR ALTERSCHEMA_LINTER)
  find_package(JSONToolkit REQUIRED)
  add_subdirectory(src/engine)
endif()

if(ALTERSCHEMA_LINTER)
  add_subdirectory(src/linter)
endif()

if(ALTERSCHEMA_ADDRESS_SANITIZER)
  noa_sanitizer(TYPE address)
elseif(ALTERSCHEMA_UNDEFINED_SANITIZER)
  noa_sanitizer(TYPE undefined)
endif()

if(ALTERSCHEMA_DOCS)
  # TODO
endif()

if(PROJECT_IS_TOP_LEVEL)
  noa_target_clang_format(SOURCES
    src/*.h src/*.cc
    test/*.h test/*.cc)
  noa_target_clang_tidy(SOURCES
    src/*.h src/*.cc)
endif()

# Testing
if(ALTERSCHEMA_TESTS)
  find_package(GoogleTest REQUIRED)
  enable_testing()

  if(ALTERSCHEMA_ENGINE)
    add_subdirectory(test/engine)
  endif()

  if(ALTERSCHEMA_LINTER)
    add_subdirectory(test/linter)
  endif()
endif()
