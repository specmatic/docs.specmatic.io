---
layout: default
title: Syntax Highlighting
parent: Documentation
nav_order: 6
---
Syntax Highlighting
-------------------

Since majority of qontract's syntax is just Gherkin, you can leverage Cucumber plugins for syntax highlighting.
Below steps helps you work with the .qontract files in Intellij Idea with syntax highlighting, auto-suggest (only Gherkin keywords) and formatting.

* Install [Cucumber Plugin](https://plugins.jetbrains.com/plugin/7212-cucumber-for-java)
* Go to Preference > Editor > File Types and under recognized file types select "Cucumber Scenario"
* Under "Registered Patterns" add "*.qontract" as shown below

![](/images/ide_setup.jpg)

This should highlight the Gherkin keywords in your qontract file.

Similarly you should be able to setup your favourite IDE or text editor.

