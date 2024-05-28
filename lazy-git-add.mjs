#!/usr/bin/env node
import inquirer from 'inquirer';
import { execSync } from 'child_process';

// Function to get the current git status in a concise format
function getGitStatus() {
  try {
    const statusOutput = execSync('git status --porcelain').toString();
    return statusOutput.split('\n').filter(Boolean); // Split by newlines and filter out empty lines
  } catch (error) {
    console.error('Error getting git status:', error);
    process.exit(1);
  }
}

// Function to get the list of currently staged files
function getStagedFiles() {
  try {
    const stagedOutput = execSync('git diff --cached --name-only').toString();
    return stagedOutput.split('\n').filter(Boolean); // Split by newlines and filter out empty lines
  } catch (error) {
    console.error('Error getting staged files:', error);
    process.exit(1);
  }
}

// Function to print the current git status in a readable format
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

// Main function to run the interactive prompt and handle staging/unstaging
async function run() {
  try {
    const statusLines = getGitStatus(); // Get the list of files with their status
    const stagedFiles = getStagedFiles(); // Get the list of currently staged files

    // Prepare choices for the inquirer prompt
    const choices = statusLines.map(line => {
      const status = line.substring(0, 2).trim(); // Extract the status code
      const filename = line.substring(3).trim(); // Extract the filename
      const label = `${status === '??' ? 'Untracked' : 'Modified'}: ${filename}`;
      return {
        name: label, // Display label for the prompt
        value: filename, // Value to return when selected
        short: filename, // Short name to display in the prompt
        checked: stagedFiles.includes(filename) // Check if the file is already staged
      };
    });

    // Prompt the user to select files to stage
    const answers = await inquirer.prompt([
      {
        type: 'checkbox',
        message: 'Select files to stage (press Control + C to exit):',
        name: 'filesToStage',
        choices,
        pageSize: 15  // Adjust the number of choices displayed at once
      }
    ]);

    const selectedFiles = answers.filesToStage; // Get the list of files selected for staging

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

    // Unstage files that were not selected
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

    // Display the current git status after staging/unstaging files
    printGitStatus();
  } catch (error) {
    console.error('Error running script:', error);
  }
}

run();
