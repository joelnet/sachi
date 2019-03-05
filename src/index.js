#!/usr/bin/env node
import 'source-map-support/register'
import when from 'mojiscript/logic/when'
import { join } from 'path'
import loadYaml from './lib/loadYaml'
import main from './main'

const configName = join(__dirname, '../config/default.yml')
const options = loadYaml(configName)

const hasError = err => err && !err.abort
const handleException = when(hasError)(console.error)

main({ options }).catch(handleException)
