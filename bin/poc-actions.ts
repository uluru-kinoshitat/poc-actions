#!/usr/bin/env node
import 'source-map-support/register';
import cdk = require('@aws-cdk/core');
import { PocActionsStack } from '../lib/poc-actions-stack';

const app = new cdk.App();
new PocActionsStack(app, 'PocActionsStack');
