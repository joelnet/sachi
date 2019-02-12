import inquirer from 'inquirer'
import getMessage from '../getMessage'

const createConfirm = message => ({
  name: 'confirmed',
  type: 'confirm',
  message
})

export const promptForConfirmation = () =>
  inquirer.prompt([createConfirm(getMessage('initialize-git'))])

export const isConfirmed = o => o && !!o.confirmed
