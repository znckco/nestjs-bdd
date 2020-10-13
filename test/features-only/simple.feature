Feature: Number Operations

  @only
  Scenario: sum of two numbers
    Given a is 5
    And b is 10
    Then sum of a and b should be 15
  
  Scenario: this should not run
    Given a is 5
    And b is 10
    Then product of a and b should be 15
    But it should not fail
