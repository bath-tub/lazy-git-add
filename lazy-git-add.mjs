#!/usr/bin/env node
import inquirer from 'inquirer';
import { execSync } from 'child_process';

function getGitStatus() {
  return execSync('git status --porcelain').toString().split('\n').filter(Boolean);
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
      checked: status !== '??'
    };
  });

  const answers = await inquirer.prompt([
    {
      type: 'checkbox',
      message: 'Select files to stage:',
      name: 'filesToStage',
      choices,
      pageSize: 15  // Adjust this number based on your preference
    }
  ]);

  if (answers.filesToStage.length) {
    execSync(`git add ${answers.filesToStage.join(' ')}`);
    console.log('Selected files have been staged.');
  } else {
    console.log('No files were selected.');
  }

  // Display the current git status after staging files.
  printGitStatus();
}

run();
