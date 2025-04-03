<img width="100px" height="60px" align="right" alt="Fury Logo" src="https://github.com/jujoycode/fury-tool/blob/main/assets/fury_logo2.jpeg?raw=true" title="fury" />

# Fury

> fury is a tool that helps developers in a variety of tasks.

- It supports make it easier to create node projects that fit different frameworks
- Make it easier to use `git`
- Many other convenience features ⭐️

## Installation

```bash
# npm
npm install -g fury-tool

# yarn
yarn global add fury-tool

# pnpm
pnpm install -g fury-tool
```

## Usage

```bash
# When you want create new project with Fury
$ fury

# When you want Management git with Fury
$ fury -g # or fury --git

# When you want to see all commands
$ fury -h

# When you want to view version information
$ fury -v # or fury --version
```

## Update Notification

```bash
│                Update available! 9.12.3 → 10.7.1.                │
│   Changelog: https://github.com/jujoycode/fury-tool/README.md    │
│                Run "pnpm i -g fury-tool" to update.              │
```

## Project Structure

```

├─ .swcrc
├─ README.md
├─ dist
│  └─ src
│     └─ index.js
├─ package.json
├─ pnpm-lock.yaml
├─ src
│  ├─ commands
│  │  └─ BaseCommand.ts
│  ├─ errors
│  │  ├─ BaseError.ts
│  │  └─ NotFoundError.ts
│  ├─ factorys
│  │  └─ CommandFactory.ts
│  └─ index.ts
└─ tsconfig.json

```

## Error Codes

| Code  | Message                    | Description                                           |
| ----- | -------------------------- | ----------------------------------------------------- |
| 10001 | InvalidCommand             | 올바른 명령어 구문을 확인하세요                       |
| 10002 | ParameterNonExist          | 필요한 모든 인자를 제공하세요                         |
| 10003 | InvalidOption              | 지원되는 옵션 목록을 확인하세요                       |
| 20001 | OperationCancelled         | 작업을 취소하였습니다                                 |
| 20002 | CommandExecutionFailed     | 로그를 확인하고 필요한 권한이 있는지 확인하세요       |
| 20003 | RollbackFailed             | 수동으로 변경사항을 되돌리고 로그를 확인하세요        |
| 30001 | ConfigurationFileError     | 설정 파일 형식이 올바른지 확인하세요                  |
| 40001 | NetworkError               | 네트워크 연결을 확인하세요                            |
| 40002 | PermissionError            | 필요한 권한으로 명령을 실행하세요                     |
| 40003 | ResourceConflict           | 기존 리소스를 확인하고 충돌을 해결하세요              |
| 40004 | TimeoutError               | 네트워크 상태를 확인하거나 타임아웃 설정을 조정하세요 |
| 50001 | GitInitializationFailed    | Git이 설치되어 있는지 확인하세요                      |
| 50002 | GitCommandExecutionFailed  | Git 명령어 구문을 확인하세요                          |
| 60001 | NodeNotInstalled           | Node.js가 설치되어 있는지 확인하세요                  |
| 60002 | PackageManagerNotInstalled | 패키지 매니저가 설치되어 있는지 확인하세요            |
| 70001 | ProjectCreationFailed      | 디렉토리 권한을 확인하세요                            |
| 70002 | TemplateDownloadFailed     | 템플릿 URL이 올바른지 확인하세요                      |

## Version History

- ✨ 1.0.0 - `Initial release`
  - Supported Templates
    - javascript
    - typescript
    - typescript + swc

## License

[GPLv3] 라이선스에 따라 배포됩니다. 자세한 내용은 LICENSE 파일을 참조하세요.
