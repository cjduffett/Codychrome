# Codychrome
Integrates Cody Coursework problems with GitHub.

Description
-----------
[Cody Coursework](https://coursework.mathworks.com/) is an online courseware platform developed by The MathWorks where users can learn to code in MATLAB. Cody Coursework assignments include both problem descriptions and MATLAB scripts to automatically grade student solutions. Currently there is no convenient solution for managing these problems or grading scripts in source control. That's where **Codychrome** comes in!

Codychrome allows instructors to conveniently sync Cody Coursework assignments with [GitHub](https://github.com/). Codychrome parses the latest version of each problem out of the Cody Coursework site and commits these problems (in JSON format) to the user's GitHub repository of choice. Now instructors are free to develop Cody Coursework assignments with the security of source control.

Getting Started
---------------
You will need an active GitHub account to use Codychrome. If you don't already have one you can create one [here](https://github.com/join).

You will also need a MathWorks account and a Cody Coursework course to play with. Follow these [instructions](http://www.mathworks.com/academia/cody-coursework/) to get set up.

If you don't have [Google Chrome](www.google.com/chrome) you can download and install it [here](https://www.google.com/chrome/browser/desktop/).

Once you have Google Chrome installed, you can install the Codychrome extension from the [Chrome Web Store](https://chrome.google.com/webstore/detail/codychrome/kmdeaaobgiomikgphacbmecklepekhgi?hl=en-US&gl=US).

How to Use Codychrome
---------------------
On valid Cody Coursework web pages the Codychrome extension will become available:

![Codychrome Screenshot](https://raw.githubusercontent.com/cjduffett/Codychrome/master/screenshots/1280x800.png)

Start by authorizing Codychrome to connect to your GitHub account. From a Cody Coursework page open Codychrome, navigate to the "GitHub" tab (indicated by GitHub's Octocat icon), and click "Authorize GitHub".

Once authorized, Codychrome can create GitHub repositories and files on your behalf. By default, Codychrome synchronizes all of your Cody Coursework problems in your "cody-coursework" repository, organizing problems by course, assignment, and problem name.

From any Cody Coursework problem's "Edit" tab, you can add the problem to GitHub by:

1. Clicking "Parse Problem" to scrape the problem definition off of the Cody Coursework page
2. Adding a comment describing any changes you made
3. Clicking "Commit to GitHub" to send the parsed problem to GitHub

If everything goes smoothly the latest version of your Cody Coursework problem should now be safely and securely stored on GitHub!

Features
--------
You can customize which GitHub repository Codychrome uses and how Codychrome organizes that repository from the "GitHub" tab.

Codychrome creates a separate folder for each Cody Coursework course, keeping your problems neatly organized.

When not in use Codychrome quietly waits in the background, leaving your browser uncluttered and free to use.

Coming Soon
-----------
Currently Codychrome only supports creating and maintaining your problems on GitHub. I plan to add features in future versions that let you pull other people's publicly available problems from GitHub to create your own course.

All problems managed by Codychrome are currently stored in public repositories, visible to everyone. I plan to support private repositories (visible to only you) in future versions. It's worth noting that GitHub charges its users for private repositories though.

License
-------
Copyright (C) 2016 Carlton Duffett  
Licensed under GPL ([https://github.com/cjduffett/Codychrome/blob/master/LICENSE](https://github.com/cjduffett/Codychrome/blob/master/LICENSE))


Acknowledgements
----------------

Created and maintained by **Carlton Duffett**.  
Contact: <carlton.duffett@gmail.com>

Inspired by my work as a TA in EK127: Introduction to Engineering Computation, taught at Boston University by Professor **Stormy Attaway**.

May 29th, 2016