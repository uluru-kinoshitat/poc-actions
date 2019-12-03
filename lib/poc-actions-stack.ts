import { Construct, Stack, StackProps }  from '@aws-cdk/core';
import { Group, Policy, PolicyStatement, ManagedPolicy, User } from '@aws-cdk/aws-iam';
// import * as AWS from 'aws-sdk';
// import IAM from 'aws-sdk/clients/iam';
// import { UpdateAccountPasswordPolicyRequest } from '@aws-sdk/client-iam-node';

const admins = 'testAdminGroup';
const adminUsers = [
  'demo01',
  // 'User02',
  // 'User03'
];

const developers = 'testDevGroup';
const devUsers = [
  'demo02',
  'demo03'
];

export class CdkIamStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // // import aws-sdk for JavaScript `npm install aws-sdk`
    // const accountPasswordPolicy = new AWS.IAM({});
    // accountPasswordPolicy.UpdateAccountPasswordPolicyRequest({
    //   "MinimumPasswordLength": 8,
    //   "RequireSymbols": false,
    //   "RequireNumbers": true,
    //   "RequireUppercaseCharacters": true,
    //   "RequireLowercaseCharacters": true,
    //   "AllowUsersToChangePassword": true,
    //   "ExpirePasswords": false
    // });
    
    //アカウントのパスワードポリシーを見に行く権限
    const getAccountPassword = new PolicyStatement({
        resources: ["*"],
        actions: [
          "iam:GetAccountPasswordPolicy"
        ]
    });

    //IAMユーザーのパスワード変更権限
    const changePassword = new PolicyStatement({
      resources: ["arn:aws:iam::account-id-without-hyphens:user/${aws:username}"],
      actions: [
        "iam:ChangePassword",
      ]
    });

    //IAMロールへのアクセス権限
    const iamPassRoleAccess = new PolicyStatement({
      resources: ["*"],
      actions: [
        "iam:Get*",
        "iam:List*",
        "iam:PassRole"
        ],
    });

    //AWS管理ポリシー
    const adminPolicy = ManagedPolicy.fromAwsManagedPolicyName('AdministratorAccess');
    const powerUserPolicy = ManagedPolicy.fromAwsManagedPolicyName('PowerUserAccess');

    //Devユーザー用のポリシー
    const devPolicy = new Policy(this, 'iamPassRoleAccess', { 
      policyName: "iamPassRoleAccess",
      statements: [iamPassRoleAccess],
    });

    //共通のポリシー
    const commonPolicy = new Policy(this, 'changePassword', { 
      policyName: "changePassword",
      statements: [changePassword, getAccountPassword],
    });

    //Adminユーザーグループ
    const adminGroup = new Group(this, admins, { groupName: admins });
    adminGroup.addManagedPolicy(adminPolicy);
    adminGroup.attachInlinePolicy(commonPolicy);

    //Devユーザーグループ
    const devGroup = new Group(this, developers, { groupName: developers });
    devGroup.addManagedPolicy(powerUserPolicy);
    devGroup.attachInlinePolicy(devPolicy);
    devGroup.attachInlinePolicy(commonPolicy);

    //ユーザーが作成されない…
    adminUsers.forEach(adminUser => {
      new User(this, adminUser, {
        userName: adminUser,
        groups: [adminGroup],
      });
    });

    devUsers.forEach(devUser => {
      new User(this, devUser, {
        userName: devUser,
        groups: [devGroup]
      });
    });
  }
}
