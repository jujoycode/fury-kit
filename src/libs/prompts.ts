import {
  group,
  intro,
  outro,
  isCancel,
  cancel,
  note,
  text,
  select,
  multiselect,
  confirm,
  spinner,
  log as clackLog,
  type TextOptions,
  type SelectOptions,
  type ConfirmOptions,
  type MultiSelectOptions,
  type PromptGroup,
} from "@clack/prompts"
import pc from "picocolors"
import { OperationCancelledError } from "#errors/index.js"

export class Prompts {
  /**
   * handleCancellation
   * @desc 취소 처리
   */
  private static handleCancellation() {
    cancel()

    const error = new OperationCancelledError()
    if (Error.captureStackTrace) {
      Error.captureStackTrace(error, this.handleCancellation)
    }

    throw error
  }

  public static cancel = cancel

  /**
   * log
   * @desc clackLog 인스턴스
   */
  public static log = clackLog

  /**
   * start
   * @desc 프로그램 시작 시 표시되는 인트로 메시지
   */
  public static start() {
    intro(`${pc.bgCyanBright(" Fury CLI ")}`)
  }

  /**
   * end
   * @desc 프로그램 종료 시 표시되는 아웃로 메시지
   */
  public static end(comment?: string) {
    outro(comment)
  }

  /**
   * tip
   * @desc 프로그램 실행 시 표시되는 팁 메시지
   */
  public static tip(message: string, title?: string) {
    note(message, title)
  }

  /**
   * ask
   * @desc 프롬프트 질문
   */
  public static async ask(options: TextOptions): Promise<string> {
    const value = await text(options)

    if (isCancel(value)) {
      this.handleCancellation()
    }

    return value as string
  }

  /**
   * choice
   * @desc 프롬프트 선택
   */
  public static async choice<T>(options: SelectOptions<T>): Promise<T> {
    const value = await select(options)

    if (isCancel(value)) {
      this.handleCancellation()
    }

    return value as T
  }

  /**
   * multiChoice
   * @desc 프롬프트 다중 선택
   */
  public static async multiChoice<T>(options: MultiSelectOptions<T>): Promise<T[]> {
    const value = await multiselect(options)

    if (isCancel(value)) {
      this.handleCancellation()
    }

    return value as T[]
  }

  /**
   * accept
   * @desc 프롬프트 확인
   */
  public static async accept(options: ConfirmOptions): Promise<boolean> {
    const value = await confirm(options)

    if (isCancel(value)) {
      this.handleCancellation()
    }

    return value as boolean
  }

  /**
   * group
   * @desc 프롬프트 그룹
   */
  public static group<T>(options: PromptGroup<T>) {
    return group(options)
  }

  /**
   * spinner
   * @desc 프롬프트 스피너
   */
  public static spinner() {
    return spinner()
  }
}
