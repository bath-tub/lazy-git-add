# Lazy Git Add Staging Tool
  
Simplifiy the process of staging files in a Git repository. Utilizing a checkbox style format and arrow / enter key selection, easily select multiple files quickly and at a glance without typing in `git add` dozens of times.
  
## Features
  
-  **Interactive Selection**: Users can navigate file lists using arrow keys and select files using spacebar for staging.
-  **Visibility**: Increases the visibility of the current repository status by showing more files at once, adjustable to fit different terminal sizes.
-  **Git Status Output**: Automatically displays the current Git status after files are staged, providing immediate feedback on what has been staged.
-  **Easy to Use**: Simplifies the Git staging process, making it more accessible even for those less familiar with Git commands.
  
## Prerequisites
  
- Node.js (v14.0.0 or higher recommended)
- Git (v2.0 or higher recommended)
- npm (for package management)
  
## Installation
  
1. Clone the repo
2. install dependencies `npm install`
3. Make the script executable `chmod +x path/to/lazy-git-add.sh`
3. Add the alias to your `.bashrc` or `.zshrc` file:
```
# miller's lazy git add
alias lga='node /Users/bath/github/lazy-git-add/lazy-git-add.mjs'
```
  
## Usage
Navigate to a repo and run the alias `lga` in the terminal. The script will display a list of files in the repository, with checkboxes next to each file. Use the arrow keys to navigate the list and the spacebar to select files for staging. Press enter to stage the selected files. The script will then display the current Git status, showing which files have been staged.
  
Afterwards, you can run `git commit -m "Your message here..."` to commit the staged files.
  
## Customization
You can adjust the pageSize in the script to change how many files are displayed at once, based on your terminal size and preference.
  
## Support
Create Github issue / pr. If deactived account send an email to millerzbath@gmail.com
