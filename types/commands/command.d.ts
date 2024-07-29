import type { Launcher, Prompter, Spinner } from '../lib';
import type { Logger, CommonUtil, FileUtil } from '../utils';
export declare abstract class Command {
    protected Prompter: Prompter;
    protected Logger: Logger;
    protected Spinner: Spinner;
    protected Launcher: Launcher;
    protected CommonUtil: typeof CommonUtil;
    protected FileUtil: typeof FileUtil;
    constructor({ Prompter, logger, spinner, launcher, utils }: {
        Prompter: Prompter;
        logger: Logger;
        spinner: Spinner;
        launcher: Launcher;
        utils: {
            CommonUtil: typeof CommonUtil;
            FileUtil: typeof FileUtil;
        };
    });
    protected abstract prepare(): Promise<void>;
    protected abstract execute(): Promise<void>;
    protected abstract finalize(): Promise<void>;
    protected abstract rollback(): Promise<void>;
    /**
     * @name invoke
     * @desc Invoke the command and handle the lifecycle methods.
     * @example
     * new BaseCommand.invoke();
     */
    invoke(): Promise<void>;
}
