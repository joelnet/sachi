#!/usr/bin/env node
import main from './main'
import loadYaml from './lib/loadYaml'
import { join } from 'path'

const configName = join(__dirname, '../config/default.yml')
const options = loadYaml(configName)

main({ options }).catch(err => (err && err.abort ? null : console.error(err)))
