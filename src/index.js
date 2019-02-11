#!/usr/bin/env node
import fs from 'fs'
import yaml from 'js-yaml'
import pipeSync from 'mojiscript/core/pipe/sync'
import { join } from 'path'
import main from './main'

const loadConfig = pipeSync([
  () => join(__dirname, '../config/default.yml'),
  fs.readFileSync,
  yaml.safeLoad
])

const options = loadConfig()

main({ options }).catch(err => (err && err.abort ? null : console.error(err)))
