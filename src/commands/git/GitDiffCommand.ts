import { BaseCommand } from '#commands/BaseCommand.js'
import { exec } from 'child_process'
import { promisify } from 'util'
import * as fs from 'fs'
import * as path from 'path'
import * as os from 'os'

const execAsync = promisify(exec)

export class GitDiffCommand extends BaseCommand {
  constructor() {
    super()
  }

  /**
   * execute
   * @desc Git 명령어 실행 및 HTML 파일로 저장
   */
  public async execute() {
    try {
      // 사용자에게 diff 옵션 선택 받기
      const diffOption = await this.prompts.choice<string>({
        message: 'Select diff option:',
        options: [
          { label: 'Staged changes', value: '--staged' },
          { label: 'All changes', value: '' },
          { label: 'Specific file', value: 'file' },
        ],
      })

      let diffCommand = 'git diff'
      let specificFile = ''

      if (diffOption === 'file') {
        // 특정 파일 선택 시 파일 경로 입력 받기
        specificFile = await this.prompts.ask({
          message: 'Enter file path:',
          defaultValue: '',
        })
        diffCommand = `git diff ${specificFile}`
      } else if (diffOption) {
        diffCommand = `git diff ${diffOption}`
      }

      // Git diff 명령어 실행
      this.prompts.log.info(`Running: ${diffCommand}`)
      const { stdout } = await execAsync(diffCommand)

      if (!stdout.trim()) {
        this.prompts.log.info('No changes detected')
        return
      }

      // HTML 파일 저장 경로 설정
      const desktopPath = path.join(os.homedir(), 'Desktop')
      const timestamp = new Date().toISOString().replace(/[:]/g, '-').replace(/\..+/, '')
      const fileName = `git-diff-${timestamp}.html`
      const filePath = path.join(desktopPath, fileName)

      // diff 결과를 HTML로 변환
      const htmlContent = this.convertDiffToHtml(stdout)

      // HTML 파일로 저장
      await fs.promises.writeFile(filePath, htmlContent)
      this.prompts.log.success(`Diff saved to ${filePath}`)
    } catch (error) {
      if (error instanceof Error) {
        this.prompts.log.error(`Error executing git diff: ${error.message}`)
      }
      throw error
    }
  }

  /**
   * convertDiffToHtml
   * @desc Git diff 출력을 HTML로 변환
   */
  private convertDiffToHtml(diffOutput: string): string {
    // 기본 HTML 구조 생성
    let html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Git Diff</title>
  <style>
    body {
      font-family: monospace;
      line-height: 1.5;
      margin: 20px;
      background-color: #f5f5f5;
    }
    .diff-container {
      background-color: #fff;
      border-radius: 5px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.12);
      padding: 15px;
      margin-bottom: 20px;
    }
    .file-header {
      font-weight: bold;
      margin-bottom: 10px;
      padding-bottom: 5px;
      border-bottom: 1px solid #ddd;
      color: #333;
    }
    .hunk-header {
      color: #586069;
      background-color: #f1f8ff;
      padding: 2px 5px;
      margin: 5px 0;
    }
    .line {
      white-space: pre-wrap;
      padding: 0 5px;
    }
    .addition {
      background-color: #e6ffec;
      color: #22863a;
    }
    .deletion {
      background-color: #ffebe9;
      color: #cb2431;
    }
    .info {
      color: #586069;
    }
  </style>
</head>
<body>
  <h1>Git Diff Result</h1>
  <div class="diff-container">
    <pre>`

    // diff 출력 처리 및 HTML로 변환
    const lines = diffOutput.split('\n')
    for (const line of lines) {
      if (line.startsWith('diff --git')) {
        // 파일 헤더
        html += `</pre>\n<pre class="file-header">${this.escapeHtml(line)}</pre>\n<pre>`
      } else if (line.startsWith('@@')) {
        // 청크 헤더
        html += `<div class="hunk-header">${this.escapeHtml(line)}</div>`
      } else if (line.startsWith('+')) {
        // 추가된 라인
        html += `<div class="line addition">${this.escapeHtml(line)}</div>`
      } else if (line.startsWith('-')) {
        // 삭제된 라인
        html += `<div class="line deletion">${this.escapeHtml(line)}</div>`
      } else {
        // 일반 라인
        html += `<div class="line">${this.escapeHtml(line)}</div>`
      }
    }

    html += `</pre>
  </div>
  <p>Generated on: ${new Date().toLocaleString()}</p>
</body>
</html>`

    return html
  }

  /**
   * escapeHtml
   * @desc HTML 특수 문자 이스케이프 처리
   */
  private escapeHtml(text: string): string {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;')
  }

  /**
   * undo
   * @desc Git 명령어 실행 취소 (읽기 전용 작업이라 롤백 불필요)
   */
  public async undo() {
    return true
  }

  /**
   * isRollbackable
   * @desc Git 명령어 롤백 가능 여부 (읽기 전용 작업이라 항상 true)
   */
  public isRollbackable() {
    return true
  }
}
