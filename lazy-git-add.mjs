#!/usr/bin/env node
import inquirer from 'inquirer';
import { execSync } from 'child_process';

function getGitStatus() {
  const statusOutput = execSync('git status --porcelain').toString();
  console.log('Raw git status output:', statusOutput);
  return statusOutput.split('\n').filter(Boolean);
}

function printGitStatus() {
  console.log('\nCurrent Git Status:');
  const status = execSync('git status').toString();
  console.log(status);
}

async function run() {
  const statusLines = getGitStatus();
  const choices = statusLines.map(line => {
    const status = line.substring(0, 2).trim();
    const filename = line.substring(3).trim();
    const label = `${status === '??' ? 'Untracked' : 'Modified'}: ${filename}`;
    return {
      name: label,
      value: filename,
      short: filename,
      checked: false // set to default, bugs occuring when set otherwise on startup
    };
  });

  console.log('Choices for staging:', choices);

  const answers = await inquirer.prompt([
    {
      type: 'checkbox',
      message: 'Select files to stage (press Control + C to exit):',
      name: 'filesToStage',
      choices,
      pageSize: 15  // Adjust this number based on your preference
    }
  ]);

  if (answers.filesToStage.length) {
    console.log('Files selected for staging:', answers.filesToStage);
    try {
      const addCommand = `git add ${answers.filesToStage.join(' ')}`;
      console.log('Executing command:', addCommand);
      execSync(addCommand);
      console.log('Selected files have been staged.');
    } catch (error) {
      console.error('Error staging files:', error);
    }
  } else {
    console.log('No files were selected.');
  }

  // Display the current git status after staging files.
  printGitStatus();
}

run();
