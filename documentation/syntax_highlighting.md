---
layout: default
title: Syntax Highlighting
parent: Documentation
nav_order: 9
---
Syntax Highlighting
===================

Since majority of specmatic's syntax is just Gherkin, you can leverage Cucumber plugins for syntax highlighting.
Below steps helps you work with the .spec files in Intellij Idea with syntax highlighting, auto-suggest (only Gherkin keywords) and formatting.

We've covered 2 of the most popular editors below. But most well known editors and IDEs should have a way to enable syntax highlighting for files containing Gherkin text.

## Intellij Idea
* Install [Cucumber Plugin](https://plugins.jetbrains.com/plugin/7212-cucumber-for-java)
* Go to Preference > Editor > File Types and under recognized file types select "Cucumber Scenario"
* Under "Registered Patterns" add "*.spec" as shown below

![](/images/ide_setup.jpg)

This should highlight the Gherkin keywords in your specmatic file.

## VS Code

* Install the Cucumber (Gherkin) Full Support plugin
* Open a .spec file
* Open the command palette by pressing Ctrl+Shift+P on Windows and Cmd+Shift+P on MacOS.
* Select Change Language Mode
* Select feature

In future, .spec files should open up in this language mode automatically.
