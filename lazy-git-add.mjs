#!/usr/bin/env node
import inquirer from 'inquirer';
import { execSync } from 'child_process';

function getGitStatus() {
  try {
    const statusOutput = execSync('git status --porcelain').toString();
    return statusOutput.split('\n').filter(Boolean);
  } catch (error) {
    console.error('Error getting git status:', error);
    process.exit(1);
  }
}

function getStagedFiles() {
  try {
    const stagedOutput = execSync('git diff --cached --name-only').toString();
    return stagedOutput.split('\n').filter(Boolean);
  } catch (error) {
    console.error('Error getting staged files:', error);
    process.exit(1);
  }
}

function printGitStatus() {
  try {
    console.log('\nCurrent Git Status:');
    const status = execSync('git status').toString();
    console.log(status);
  } catch (error) {
    console.error('Error printing git status:', error);
    process.exit(1);
  }
}

async function run() {
  try {
    const statusLines = getGitStatus();
    const stagedFiles = getStagedFiles();

    const choices = statusLines.map(line => {
      const status = line.substring(0, 2).trim();
      const filename = line.substring(3).trim();
      const label = `${status === '??' ? 'Untracked' : 'Modified'}: ${filename}`;
      return {
        name: label,
        value: filename,
        short: filename,
        checked: stagedFiles.includes(filename) // Check if the file is already staged
      };
    });

    const answers = await inquirer.prompt([
      {
        type: 'checkbox',
        message: 'Select files to stage (press Control + C to exit):',
        name: 'filesToStage',
        choices,
        pageSize: 15  // Adjust this number based on your preference
      }
    ]);

    const selectedFiles = answers.filesToStage;

    if (selectedFiles.length) {
      // Stage the selected files
      try {
        const addCommand = `git add ${selectedFiles.join(' ')}`;
        execSync(addCommand);
        console.log('Selected files have been staged.');
      } catch (error) {
        console.error('Error staging files:', error);
      }
    } else {
      console.log('No files were selected.');
    }

    // Reset (unstage) files that were not selected
    const filesToUnstage = stagedFiles.filter(file => !selectedFiles.includes(file));
    if (filesToUnstage.length) {
      try {
        const resetCommand = `git reset ${filesToUnstage.join(' ')}`;
        execSync(resetCommand);
        console.log('Unselected files have been unstaged.');
      } catch (error) {
        console.error('Error unstaging files:', error);
      }
    }

    // Display the current git status after staging files.
    printGitStatus();
  } catch (error) {
    console.error('Error running script:', error);
  }
}

run();
