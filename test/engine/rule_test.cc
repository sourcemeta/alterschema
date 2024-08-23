#include <gtest/gtest.h>

#include <memory>

#include <sourcemeta/alterschema/engine.h>
#include <sourcemeta/jsontoolkit/json.h>

#include "rules.h"

TEST(Engine_rule, instances_of_same_rule_are_equal) {
  const ExampleRule1 foo{};
  const ExampleRule1 bar{};
  EXPECT_EQ(foo, bar);
}

TEST(Engine_rule, instances_of_same_rule_are_equal_with_unique_ptr) {
  const std::unique_ptr<ExampleRule1> foo{};
  const std::unique_ptr<ExampleRule1> bar{};
  EXPECT_EQ(foo, bar);
}

TEST(Engine_rule, instances_of_different_rules_are_different) {
  const ExampleRule1 foo{};
  const ExampleRule2 bar{};
  EXPECT_NE(foo, bar);
}

TEST(Engine_rule, default_message) {
  const ExampleRule4 rule{};
  EXPECT_EQ(rule.message(), "Condition matched");
}

TEST(Engine_rule, custom_message) {
  const ExampleRule7 rule{};
  EXPECT_EQ(rule.message(), "My custom message");
}
