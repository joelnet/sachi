#!/usr/bin/env node
import fs from 'fs'
import yaml from 'js-yaml'
import pipe from 'mojiscript/core/pipe'
import { join } from 'path'
import main from './main'

const loadConfig = pipe([
  () => join(__dirname, '../config/default.yml'),
  fs.readFileSync,
  yaml.safeLoad
])

const options = loadConfig()

main({ options })
