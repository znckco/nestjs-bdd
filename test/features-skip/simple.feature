Feature: Number Operations

  Scenario: sum of two numbers
    Given a is 5
    And b is 10
    Then sum of a and b should be 15
  
  @skip
  Scenario: this should be skipped
    Given a is 5
    And b is 10
    Then product of a and b should be 15
    But it should not fail
