#!/usr/bin/env node
import 'source-map-support/register';
import cdk = require('@aws-cdk/core');
import { CdkIamStack } from '../lib/poc-actions-stack';

const app = new cdk.App();
new CdkIamStack(app, 'CdkIamStack');
